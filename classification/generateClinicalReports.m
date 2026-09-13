%% ===== generateClinicalReports.m (styled version) =====
projectRoot = fileparts(pwd);
modelPath = fullfile(projectRoot, 'models', 'trainedDRModel_v2.mat');
dataPath = fullfile(projectRoot, 'preprocessing', 'processed_output');
segPath = fullfile(projectRoot, 'segmentation');

loaded = load(modelPath);
net = loaded.netTransfer;

imds = imageDatastore(dataPath, 'IncludeSubfolders', true, 'LabelSource', 'foldernames');
[~, imdsVal] = splitEachLabel(imds, 0.8, 'randomized');
addpath(segPath);

severityClinical = ["No DR", "Mild NPDR", "Moderate NPDR", "Severe NPDR", "Proliferative DR"];
isReferable = [false, false, true, true, true];
severityColor = [0.2 0.7 0.3; 0.6 0.8 0.2; 0.95 0.7 0.1; 0.9 0.4 0.1; 0.8 0.1 0.1]; % green to red

%% Pick image
idx = 1;
img = readimage(imdsVal, idx);
[~, fname, ~] = fileparts(imdsVal.Files{idx});

imgResized = imresize(img, net.Layers(1).InputSize(1:2));
[classfn, score] = classify(net, imgResized);
confidence = max(score) * 100;
predictedLevel = double(string(classfn)) + 1;

discMask = optic_disc(img);
vesselMask = vessel_segment(img);
[exudateMask, hemMask] = lesion_detect(img, discMask);
numExudates = numel(regionprops(exudateMask, 'Area'));
numHemorrhages = numel(regionprops(hemMask, 'Area'));

map = gradCAM(net, imgResized, classfn);

thisColor = severityColor(predictedLevel, :);

%% ===================== DOCTOR REPORT =====================
fig = figure('Visible','off', 'Units','normalized', 'Position', [0 0 1 1], 'Color', 'w');

% Header banner
annotation('rectangle', [0 0.93 1 0.07], 'FaceColor', [0.1 0.2 0.45], 'Color', 'none');
annotation('textbox', [0.03 0.93 0.7 0.07], 'String', 'NETRIKA — Diabetic Retinopathy Screening Report', ...
    'FontSize', 15, 'FontWeight', 'bold', 'Color', 'w', 'EdgeColor', 'none', ...
    'VerticalAlignment', 'middle');
annotation('textbox', [0.75 0.93 0.22 0.07], 'String', 'CLINICAL COPY', ...
    'FontSize', 10, 'Color', 'w', 'EdgeColor', 'none', ...
    'HorizontalAlignment', 'right', 'VerticalAlignment', 'middle');

% Severity badge
annotation('rectangle', [0.03 0.83 0.3 0.07], 'FaceColor', thisColor, 'Color', 'none');
annotation('textbox', [0.03 0.83 0.3 0.07], 'String', sprintf('Level %s: %s', string(classfn), severityClinical(predictedLevel)), ...
    'FontSize', 13, 'FontWeight', 'bold', 'Color', 'w', 'EdgeColor', 'none', ...
    'HorizontalAlignment', 'center', 'VerticalAlignment', 'middle');

% Patient/image info block
infoText = sprintf('Image ID: %s\nModel Confidence: %.1f%%\nReferable (Level 2+): %s', ...
    fname, confidence, string(isReferable(predictedLevel)));
annotation('textbox', [0.38 0.83 0.59 0.07], 'String', infoText, ...
    'FontSize', 10, 'EdgeColor', [0.7 0.7 0.7], 'BackgroundColor', [0.97 0.97 0.97], ...
    'VerticalAlignment', 'middle');

% Findings table (as text block styled like a section)
annotation('textbox', [0.03 0.76 0.94 0.04], 'String', 'SEGMENTATION FINDINGS', ...
    'FontSize', 11, 'FontWeight', 'bold', 'EdgeColor', 'none', 'Color', [0.1 0.2 0.45]);
findingsText = sprintf('Exudates detected: %d region(s)        Hemorrhages/Microaneurysms detected: %d region(s)', ...
    numExudates, numHemorrhages);
annotation('textbox', [0.03 0.71 0.94 0.04], 'String', findingsText, ...
    'FontSize', 10, 'EdgeColor', 'none');

% Section label for images
annotation('textbox', [0.03 0.65 0.94 0.04], 'String', 'VISUAL EVIDENCE', ...
    'FontSize', 11, 'FontWeight', 'bold', 'EdgeColor', 'none', 'Color', [0.1 0.2 0.45]);

% Three images side by side: original, segmentation, Grad-CAM
subplot('Position', [0.03 0.15 0.29 0.48]);
imshow(img);
title('Original Fundus Image', 'FontSize', 10);

subplot('Position', [0.35 0.15 0.29 0.48]);
imshow(img); hold on;
visboundaries(discMask, 'Color', 'c');
visboundaries(vesselMask, 'Color', 'g');
visboundaries(exudateMask, 'Color', 'y');
visboundaries(hemMask, 'Color', 'r');
title('Segmentation (disc/vessels/exudates/hem)', 'FontSize', 10);

subplot('Position', [0.67 0.15 0.29 0.48]);
imshow(imgResized); hold on;
imagesc(map, 'AlphaData', 0.5);
colormap(gca, 'jet');
title('Grad-CAM Attention (explainability)', 'FontSize', 10);

% Footer disclaimer
annotation('textbox', [0.03 0.02 0.94 0.06], 'String', ...
    sprintf('Prototype AI screening tool — trained on ~260 image subset of APTOS 2019. Sensitivity/specificity not yet clinically validated at scale. Ophthalmologist review required before diagnosis or treatment. Generated for review in under 30 seconds as part of human-in-the-loop workflow.'), ...
    'FontSize', 8, 'Color', [0.4 0.4 0.4], 'EdgeColor', [0.85 0.85 0.85], 'BackgroundColor', [0.98 0.98 0.98]);

exportgraphics(fig, fullfile(pwd, [fname '_doctor_report.pdf']), 'ContentType', 'vector');
close(fig);

%% ===================== PATIENT REPORT =====================
fig2 = figure('Visible','off', 'Units','normalized', 'Position', [0 0 0.75 1], 'Color', 'w');

annotation('rectangle', [0 0.93 1 0.07], 'FaceColor', [0.15 0.5 0.35], 'Color', 'none');
annotation('textbox', [0.03 0.93 0.94 0.07], 'String', 'Your Eye Screening Result', ...
    'FontSize', 17, 'FontWeight', 'bold', 'Color', 'w', 'EdgeColor', 'none', ...
    'HorizontalAlignment', 'center', 'VerticalAlignment', 'middle');

% Big friendly result badge
annotation('rectangle', [0.15 0.78 0.7 0.1], 'FaceColor', thisColor, 'Color', 'none');
annotation('textbox', [0.15 0.78 0.7 0.1], 'String', severityClinical(predictedLevel), ...
    'FontSize', 16, 'FontWeight', 'bold', 'Color', 'w', 'EdgeColor', 'none', ...
    'HorizontalAlignment', 'center', 'VerticalAlignment', 'middle');

explanation = sprintf([...
    'When you have diabetes, high blood sugar over time can slowly damage\n' ...
    'the tiny blood vessels at the back of your eye (the retina). This is\n' ...
    'called Diabetic Retinopathy. In early stages you usually wont notice\n' ...
    'any change in vision — which is exactly why regular screening matters,\n' ...
    'even when your eyes feel completely fine.']);

annotation('textbox', [0.1 0.58 0.8 0.16], 'String', explanation, ...
    'FontSize', 11, 'EdgeColor', 'none', 'HorizontalAlignment', 'left');

if numExudates > 0 || numHemorrhages > 0
    whatWeFound = sprintf(['We noticed %d small spot(s) or fluid marks in your eye that\n' ...
        'can happen with diabetes. This is common and often treatable,\n' ...
        'especially when caught early like this.'], numExudates + numHemorrhages);
else
    whatWeFound = 'We did not notice significant diabetes-related changes in your eye today.';
end

annotation('textbox', [0.1 0.4 0.8 0.14], 'String', whatWeFound, ...
    'FontSize', 11, 'EdgeColor', [0.85 0.85 0.85], 'BackgroundColor', [0.96 0.98 0.96]);

recommendation = 'Continue your regular diabetes care and annual eye check-ups.';
urgencyNote = 'This is a routine result — keep managing your diabetes as advised.';
boxColor = [0.9 0.97 0.9];
if isReferable(predictedLevel)
    recommendation = 'Please visit an eye specialist (ophthalmologist) soon for a full check-up.';
    urgencyNote = 'Please dont delay — early treatment works best and can protect your vision.';
    boxColor = [1 0.93 0.85];
end

annotation('textbox', [0.1 0.2 0.8 0.16], 'String', ...
    sprintf('WHAT TO DO NEXT:\n%s\n\n%s', recommendation, urgencyNote), ...
    'FontSize', 11, 'FontWeight', 'bold', 'EdgeColor', [0.85 0.85 0.85], 'BackgroundColor', boxColor);

annotation('textbox', [0.1 0.03 0.8 0.1], 'String', ...
    'This is an automated screening result, not a final diagnosis. Your doctor will confirm this with a full examination.', ...
    'FontSize', 9, 'Color', [0.4 0.4 0.4], 'EdgeColor', 'none', 'HorizontalAlignment', 'center');

exportgraphics(fig2, fullfile(pwd, [fname '_patient_report.pdf']), 'ContentType', 'vector');
close(fig2);

fprintf('Reports generated:\n  %s_doctor_report.pdf\n  %s_patient_report.pdf\n', fname, fname);