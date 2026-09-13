function [doctorPdfPath, patientPdfPath] = runFullPipeline(imagePath)
    % Find project root (this file's location, go up one level)
    projectRoot = fileparts(fileparts(mfilename('fullpath')));
    
    modelPath = fullfile(projectRoot, 'models', 'trainedDRModel_v2.mat');
    segPath = fullfile(projectRoot, 'segmentation');
    preprocessingPath = fullfile(projectRoot, 'preprocessing');
    addpath(segPath);
    addpath(preprocessingPath);
    
    loaded = load(modelPath);
    net = loaded.netTransfer;
    
    img = imread(imagePath);
    
    %% Quality check + enhancement
    q = assessQuality(img);
    switch q.status
        case 'gradeable'
            processedImg = lightEnhance(img);
        case 'borderline'
            processedImg = enhanceImage(img);
        otherwise
            error('Image rejected: quality too low to grade.');
    end
    
    %% Classification
    imgResized = imresize(processedImg, net.Layers(1).InputSize(1:2));
    [classfn, score] = classify(net, imgResized);
    confidence = max(score) * 100;
    predictedLevel = double(string(classfn)) + 1;
    
    %% Segmentation
    discMask = optic_disc(processedImg);
    vesselMask = vessel_segment(processedImg);
    [exudateMask, hemMask] = lesion_detect(processedImg, discMask);
    numExudates = numel(regionprops(exudateMask, 'Area'));
    numHemorrhages = numel(regionprops(hemMask, 'Area'));
    
    %% Grad-CAM
    map = gradCAM(net, imgResized, classfn);
    
    %% Severity info
    severityClinical = ["No DR", "Mild NPDR", "Moderate NPDR", "Severe NPDR", "Proliferative DR"];
    isReferable = [false, false, true, true, true];
    thisColor = [0.2 0.7 0.3; 0.6 0.8 0.2; 0.95 0.7 0.1; 0.9 0.4 0.1; 0.8 0.1 0.1];
    thisColor = thisColor(predictedLevel, :);
    
    [~, fname, ~] = fileparts(imagePath);
    outputFolder = fullfile(projectRoot, 'integration', 'reports');
    if ~exist(outputFolder, 'dir')
        mkdir(outputFolder);
    end
    
    %% ===== DOCTOR REPORT =====
    fig = figure('Visible','off', 'Units','normalized', 'Position', [0 0 1 1], 'Color', 'w');
    
    annotation('rectangle', [0 0.93 1 0.07], 'FaceColor', [0.1 0.2 0.45], 'Color', 'none');
    annotation('textbox', [0.03 0.93 0.94 0.07], 'String', 'NETRIKA — Diabetic Retinopathy Screening Report', ...
        'FontSize', 15, 'FontWeight', 'bold', 'Color', 'w', 'EdgeColor', 'none', 'VerticalAlignment', 'middle');
    
    annotation('rectangle', [0.03 0.83 0.3 0.07], 'FaceColor', thisColor, 'Color', 'none');
    annotation('textbox', [0.03 0.83 0.3 0.07], 'String', sprintf('Level %s: %s', string(classfn), severityClinical(predictedLevel)), ...
        'FontSize', 13, 'FontWeight', 'bold', 'Color', 'w', 'EdgeColor', 'none', 'HorizontalAlignment', 'center', 'VerticalAlignment', 'middle');
    
    infoText = sprintf('Image ID: %s\nModel Confidence: %.1f%%\nReferable (Level 2+): %s', fname, confidence, string(isReferable(predictedLevel)));
    annotation('textbox', [0.38 0.83 0.59 0.07], 'String', infoText, 'FontSize', 10, 'EdgeColor', [0.7 0.7 0.7], 'BackgroundColor', [0.97 0.97 0.97], 'VerticalAlignment', 'middle');
    
    annotation('textbox', [0.03 0.76 0.94 0.04], 'String', 'SEGMENTATION FINDINGS', 'FontSize', 11, 'FontWeight', 'bold', 'EdgeColor', 'none', 'Color', [0.1 0.2 0.45]);
    findingsText = sprintf('Exudates detected: %d region(s)        Hemorrhages/Microaneurysms detected: %d region(s)', numExudates, numHemorrhages);
    annotation('textbox', [0.03 0.71 0.94 0.04], 'String', findingsText, 'FontSize', 10, 'EdgeColor', 'none');
    
    annotation('textbox', [0.03 0.65 0.94 0.04], 'String', 'VISUAL EVIDENCE', 'FontSize', 11, 'FontWeight', 'bold', 'EdgeColor', 'none', 'Color', [0.1 0.2 0.45]);
    
    subplot('Position', [0.03 0.15 0.29 0.48]);
    imshow(img);
    title('Original Fundus Image', 'FontSize', 10);
    
    subplot('Position', [0.35 0.15 0.29 0.48]);
    imshow(img); hold on;
    visboundaries(discMask, 'Color', 'c');
    visboundaries(vesselMask, 'Color', 'g');
    visboundaries(exudateMask, 'Color', 'y');
    visboundaries(hemMask, 'Color', 'r');
    title('Segmentation', 'FontSize', 10);
    
    subplot('Position', [0.67 0.15 0.29 0.48]);
    imshow(imgResized); hold on;
    imagesc(map, 'AlphaData', 0.5);
    colormap(gca, 'jet');
    title('Grad-CAM Attention', 'FontSize', 10);
    
    annotation('textbox', [0.03 0.02 0.94 0.06], 'String', ...
        'Prototype AI screening tool. Ophthalmologist review required before diagnosis or treatment.', ...
        'FontSize', 8, 'Color', [0.4 0.4 0.4], 'EdgeColor', [0.85 0.85 0.85], 'BackgroundColor', [0.98 0.98 0.98]);
    
    doctorPdfPath = fullfile(outputFolder, [fname '_doctor_report.pdf']);
    exportgraphics(fig, doctorPdfPath, 'ContentType', 'vector');
    close(fig);
    
    %% ===== PATIENT REPORT =====
    fig2 = figure('Visible','off', 'Units','normalized', 'Position', [0 0 0.75 1], 'Color', 'w');
    
    annotation('rectangle', [0 0.93 1 0.07], 'FaceColor', [0.15 0.5 0.35], 'Color', 'none');
    annotation('textbox', [0.03 0.93 0.94 0.07], 'String', 'Your Eye Screening Result', ...
        'FontSize', 17, 'FontWeight', 'bold', 'Color', 'w', 'EdgeColor', 'none', 'HorizontalAlignment', 'center', 'VerticalAlignment', 'middle');
    
    annotation('rectangle', [0.15 0.78 0.7 0.1], 'FaceColor', thisColor, 'Color', 'none');
    annotation('textbox', [0.15 0.78 0.7 0.1], 'String', severityClinical(predictedLevel), ...
        'FontSize', 16, 'FontWeight', 'bold', 'Color', 'w', 'EdgeColor', 'none', 'HorizontalAlignment', 'center', 'VerticalAlignment', 'middle');
    
    explanation = sprintf(['When you have diabetes, high blood sugar over time can slowly damage\n' ...
        'the tiny blood vessels at the back of your eye (the retina). This is\n' ...
        'called Diabetic Retinopathy. In early stages you usually wont notice\n' ...
        'any change in vision — which is exactly why regular screening matters.']);
    annotation('textbox', [0.1 0.58 0.8 0.16], 'String', explanation, 'FontSize', 11, 'EdgeColor', 'none');
    
    if numExudates > 0 || numHemorrhages > 0
        whatWeFound = sprintf(['We noticed %d small spot(s) or fluid marks in your eye that\n' ...
            'can happen with diabetes. This is common and often treatable.'], numExudates + numHemorrhages);
    else
        whatWeFound = 'We did not notice significant diabetes-related changes in your eye today.';
    end
    annotation('textbox', [0.1 0.4 0.8 0.14], 'String', whatWeFound, 'FontSize', 11, 'EdgeColor', [0.85 0.85 0.85], 'BackgroundColor', [0.96 0.98 0.96]);
    
    recommendation = 'Continue your regular diabetes care and annual eye check-ups.';
    boxColor = [0.9 0.97 0.9];
    if isReferable(predictedLevel)
        recommendation = 'Please visit an eye specialist (ophthalmologist) soon for a full check-up.';
        boxColor = [1 0.93 0.85];
    end
    annotation('textbox', [0.1 0.2 0.8 0.16], 'String', sprintf('WHAT TO DO NEXT:\n%s', recommendation), ...
        'FontSize', 11, 'FontWeight', 'bold', 'EdgeColor', [0.85 0.85 0.85], 'BackgroundColor', boxColor);
    
    annotation('textbox', [0.1 0.03 0.8 0.1], 'String', ...
        'This is an automated screening result, not a final diagnosis.', ...
        'FontSize', 9, 'Color', [0.4 0.4 0.4], 'EdgeColor', 'none', 'HorizontalAlignment', 'center');
    
    patientPdfPath = fullfile(outputFolder, [fname '_patient_report.pdf']);
    exportgraphics(fig2, patientPdfPath, 'ContentType', 'vector');
    close(fig2);
end