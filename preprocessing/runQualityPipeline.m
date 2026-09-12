%% ===== runQualityPipeline.m =====

imds = imageDatastore('../data/sample_images');
fprintf('Found %d images\n', numel(imds.Files));

outputFolder = 'processed_output';
if ~exist(outputFolder, 'dir')
    mkdir(outputFolder);
end

results = table('Size',[0 5], ...
    'VariableTypes',{'string','double','double','double','string'}, ...
    'VariableNames',{'Filename','FocusScore','MeanIntensity','FOVRatio','Status'});

borderlinePairs = {};  % collect original+enhanced pairs as we go

for i = 1:numel(imds.Files)
    img = readimage(imds, i);
    [~, name, ext] = fileparts(imds.Files{i});

    q = assessQuality(img);

    switch q.status
        case 'gradeable'
            outImg = img;
        case 'borderline'
            outImg = enhanceImage(img);
            borderlinePairs{end+1} = img;      % original
            borderlinePairs{end+1} = outImg;   % enhanced
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
fprintf('Done! %d borderline images enhanced.\n', numel(borderlinePairs)/2);

% ===== Visualization step (only runs if there ARE borderline images) =====
if ~isempty(borderlinePairs)
    numPairs = numel(borderlinePairs)/2;
    figure;
    montage(borderlinePairs, 'Size', [numPairs, 2]);
    title('Left: Original | Right: Enhanced (each row = one borderline image)');
else
    disp('No borderline images to visualize.');
end