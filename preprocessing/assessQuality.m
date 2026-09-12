function quality = assessQuality(img)
    gray = im2gray(img);
    gray = im2double(gray);

    % Focus
    lap = fspecial('laplacian', 0.2);
    lapResponse = imfilter(gray, lap, 'replicate');
    focusScore = var(lapResponse(:)) * 10000;

    % Illumination
    meanInt = mean(gray(:)) * 255;
    illumOK = meanInt > 35 && meanInt < 220;   % loosened lower bound slightly

    % FOV - FIXED: simple threshold, not adaptive
    bw = gray > 0.05;
    fovRatio = sum(bw(:)) / numel(bw);
    fovOK = fovRatio > 0.45;   % typical circular retina crop fills 50-80%

    quality.focusScore = focusScore;
    quality.meanIntensity = meanInt;
    quality.fovRatio = fovRatio;

    if focusScore > 3 && illumOK && fovOK
        quality.status = 'gradeable';
    elseif focusScore > 0.45   % lowered from 1 → catches more as borderline instead of reject
        quality.status = 'borderline';
    else
        quality.status = 'reject';
    end
end