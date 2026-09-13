%% Setup — works from anywhere, using relative paths from project root
% Assumes this script is run from inside the 'classification' folder
projectRoot = fileparts(pwd);  % goes up one level from 'classification' to project root

modelPath = fullfile(projectRoot, 'models', 'trainedDRModel_v2.mat');
dataPath = fullfile(projectRoot, 'preprocessing', 'processed_output');
segPath = fullfile(projectRoot, 'segmentation');

loaded = load(modelPath);
net = loaded.netTransfer;

imds = imageDatastore(dataPath, 'IncludeSubfolders', true, 'LabelSource', 'foldernames');
[~, imdsVal] = splitEachLabel(imds, 0.8, 'randomized');

addpath(segPath);

%% Pick images to compare — one per class where available
classesToCheck = ["0","1","2","3","4"];

for c = classesToCheck
    idx = find(imdsVal.Labels == c, 1);
    if isempty(idx)
        continue;
    end

    img = readimage(imdsVal, idx);
    label = imdsVal.Labels(idx);

    % --- Grad-CAM side ---
    imgResized = imresize(img, net.Layers(1).InputSize(1:2));
    [classfn, score] = classify(net, imgResized);
    map = gradCAM(net, imgResized, classfn);

    % --- Segmentation side ---
    discMask = optic_disc(img);
    vesselMask = vessel_segment(img);
    [exudateMask, hemMask] = lesion_detect(img, discMask);

    % --- Plot side by side ---
    figure('Name', ['Class ' char(c) ' comparison'], 'Position', [100 100 1000 500]);

    subplot(1,2,1);
    imshow(imgResized);
    hold on;
    imagesc(map, 'AlphaData', 0.5);
    colormap(gca, 'jet');
    title(sprintf('Grad-CAM | True: %s Pred: %s (%.1f%%)', ...
        string(label), string(classfn), max(score)*100));

    subplot(1,2,2);
    imshow(img);
    hold on;
    visboundaries(discMask, 'Color', 'c');
    visboundaries(vesselMask, 'Color', 'g');
    visboundaries(exudateMask, 'Color', 'y');
    visboundaries(hemMask, 'Color', 'r');
    title('Segmentation: disc(cyan) vessels(green) exudates(yellow) hem(red)');

    saveas(gcf, fullfile(pwd, sprintf('comparison_class%s.png', c)));
end

disp('Done — comparison images saved.');