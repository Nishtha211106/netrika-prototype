function vesselMask = vessel_segment(img)
    if size(img,3) == 3
        green = img(:,:,2);
    else
        green = img;
    end

    fov = green > 10;
    fov = imerode(fov, strel('disk', 20));
    fov = imfill(fov, 'holes');

    enhanced = adapthisteq(green, 'ClipLimit', 0.01);
    vesselResponse = fibermetric(enhanced, [2 4 6 8], 'ObjectPolarity', 'dark');

    % Percentile threshold — robust to outlier pixels, unlike max-based
    vesselMask = vesselResponse > prctile(vesselResponse(fov), 92);
    vesselMask = vesselMask & fov;

    vesselMask = bwareaopen(vesselMask, 20);
    vesselMask = imclose(vesselMask, strel('disk', 1));
    vesselMask = imclearborder(vesselMask);
end