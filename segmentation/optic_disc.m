function discMask = optic_disc(img)
    % Red channel usually gives best disc contrast
    if size(img,3) == 3
        gray = double(img(:,:,1));
    else
        gray = double(img);
    end

    % Mask out black border
    fov = gray > 10;
    gray(~fov) = 0;

    % Heavy smoothing merges the disc (broken up by vessels) into one blob,
    % and washes out small artifacts/reflections
    smoothed = imgaussfilt(gray, 15);

    % Take the top ~1% brightest pixels instead of pixel-level local maxima
    thresh = prctile(smoothed(fov), 99);
    brightMask = smoothed >= thresh;

    % Close small gaps, remove tiny leftover specks
    brightMask = imclose(brightMask, strel('disk', 5));
    brightMask = bwareaopen(brightMask, 100);

    stats = regionprops(brightMask, 'Area', 'PixelIdxList');
    if isempty(stats)
        discMask = false(size(gray));
        return;
    end

    % Disc should be the largest surviving bright blob
    [~, idx] = max([stats.Area]);
    discMask = false(size(gray));
    discMask(stats(idx).PixelIdxList) = true;
end