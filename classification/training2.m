imds = imageDatastore('../preprocessing/processed_output', 'IncludeSubfolders', true, 'LabelSource', 'foldernames');
[imdsTrain, imdsVal] = splitEachLabel(imds, 0.8, 'randomized');

net = efficientnetb0;
lgraph = layerGraph(net);

layers = lgraph.Layers;
classLayerIdx = find(arrayfun(@(l) isa(l, 'nnet.cnn.layer.ClassificationOutputLayer'), layers));
classLayer = layers(classLayerIdx);
fcIdx = find(arrayfun(@(l) isa(l, 'nnet.cnn.layer.FullyConnectedLayer'), layers), 1, 'last');
learnableLayer = layers(fcIdx);
numClasses = 5;

newLearnableLayer = fullyConnectedLayer(numClasses, ...
    'Name', 'new_fc', ...
    'WeightLearnRateFactor', 10, ...
    'BiasLearnRateFactor', 10);
lgraph = replaceLayer(lgraph, learnableLayer.Name, newLearnableLayer);

newClassLayer = classificationLayer('Name', 'new_classoutput');
lgraph = replaceLayer(lgraph, classLayer.Name, newClassLayer);

imageSize = net.Layers(1).InputSize;
augImdsTrain = augmentedImageDatastore(imageSize(1:2), imdsTrain);
augImdsVal = augmentedImageDatastore(imageSize(1:2), imdsVal);

options = trainingOptions('adam', ...
    'MiniBatchSize', 16, ...
    'MaxEpochs', 8, ...
    'InitialLearnRate', 1e-4, ...
    'ValidationData', augImdsVal, ...
    'ValidationFrequency', 5, ...
    'Verbose', true, ...
    'Plots', 'training-progress');

netTransfer = trainNetwork(augImdsTrain, lgraph, options);

if ~exist('models', 'dir')
    mkdir('models');
end
save('models/trainedDRModel_v2.mat', 'netTransfer');