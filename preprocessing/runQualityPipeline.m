%% ===== runQualityPipeline.m (FINAL) =====

imds = imageDatastore('../data/sample_images');
fprintf('Found %d images\n', numel(imds.Files));

outputFolder = 'processed_output';
if ~exist(outputFolder, 'dir')
    mkdir(outputFolder);
end

results = table('Size',[0 5], ...
    'VariableTypes',{'string','double','double','double','string'}, ...
    'VariableNames',{'Filename','FocusScore','MeanIntensity','FOVRatio','Status'});

borderlinePairs = {};   % original + enhanced pairs for borderline images
gradeablePairs = {};    % original + lightly-enhanced pairs for gradeable images

for i = 1:numel(imds.Files)
    img = readimage(imds, i);
    [~, name, ext] = fileparts(imds.Files{i});

    q = assessQuality(img);

    switch q.status
        case 'gradeable'
            outImg = lightEnhance(img);
            gradeablePairs{end+1} = img;
            gradeablePairs{end+1} = outImg;
        case 'borderline'
            outImg = enhanceImage(img);
            borderlinePairs{end+1} = img;
            borderlinePairs{end+1} = outImg;
        case 'reject'
            outImg = [];
    end

    if ~isempty(outImg)
        imwrite(outImg, fullfile(outputFolder, [char(name) char(ext)]));
    end

    results = [results; {string(name)+string(ext), q.focusScore, q.meanIntensity, q.fovRatio, string(q.status)}];
    fprintf('%d/%d: %s -> %s\n', i, numel(imds.Files), name, q.status);
end

writetable(results, 'quality_report.csv');

% ===== Summary counts =====
numGradeable  = numel(gradeablePairs)/2;
numBorderline = numel(borderlinePairs)/2;
numReject     = sum(results.Status == "reject");

fprintf('\n--- Summary ---\n');
fprintf('Gradeable images (light enhanced): %d\n', numGradeable);
fprintf('Borderline images (full enhanced): %d\n', numBorderline);
fprintf('Rejected images: %d\n', numReject);
fprintf('Total sent to processed_output: %d\n', numGradeable + numBorderline);

% ===== Visualization: Borderline (original vs full enhancement) =====
if numBorderline > 0
    figure;
    montage(borderlinePairs, 'Size', [numBorderline, 2]);
    title('BORDERLINE: Left = Original | Right = Enhanced');
else
    disp('No borderline images to visualize.');
end

% ===== Visualization: Gradeable (original vs light enhancement) =====
if numGradeable > 0
    figure;
    montage(gradeablePairs, 'Size', [numGradeable, 2]);
    title('GRADEABLE: Left = Original | Right = Lightly Enhanced');
else
    disp('No gradeable images to visualize.');
end

disp('Done!');