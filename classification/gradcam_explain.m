%% Load the trained model (portable — works on any machine)
projectRoot = fileparts(pwd);  % goes up one level from 'classification' to project root
modelPath = fullfile(projectRoot, 'models', 'trainedDRModel_v2.mat');
dataPath = fullfile(projectRoot, 'preprocessing', 'processed_output');

loaded = load(modelPath);
net = loaded.netTransfer;

%% Load validation data (same way as training)
imds = imageDatastore(dataPath, 'IncludeSubfolders', true, 'LabelSource', 'foldernames');
[~, imdsVal] = splitEachLabel(imds, 0.8, 'randomized');

%% Pick an image to explain
idx = 32;  % change this to look at different images
img = readimage(imdsVal, idx);
label = imdsVal.Labels(idx);

%% Resize to match network input size
imgResized = imresize(img, net.Layers(1).InputSize(1:2));

%% Predict and generate Grad-CAM
[classfn, score] = classify(net, imgResized);
map = gradCAM(net, imgResized, classfn);

%% Visualize
figure;
imshow(imgResized);
hold on;
imagesc(map, 'AlphaData', 0.5);
colormap jet;
colorbar;
title(sprintf('True: %s | Predicted: %s (%.1f%% confidence)', ...
    string(label), string(classfn), max(score)*100));