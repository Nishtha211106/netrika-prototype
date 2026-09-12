% visualiseEnhancement.m - standalone check, reads existing results
imds = imageDatastore('../data/sample_images');
results = readtable('quality_report.csv');
borderlineIdx = find(results.Status == "borderline");

pairs = {};
for i = 1:numel(borderlineIdx)
    idx = borderlineIdx(i);
    img = readimage(imds, idx);
    enhanced = enhanceImage(img);
    pairs{end+1} = img;
    pairs{end+1} = enhanced;
end

figure;
montage(pairs, 'Size', [numel(borderlineIdx), 2]);
title('Left: Original | Right: Enhanced');