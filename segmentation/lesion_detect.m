function [exudateMask, hemorrhageMask] = lesion_detect(img, discMask)
    R = double(img(:,:,1));
    G = double(img(:,:,2));
    B = double(img(:,:,3));

    gray = rgb2gray(img);
    fov = gray > 10;
    fov = imerode(fov, strel('disk', 15));

    %% --- Exudates (unchanged) ---
    brightness = (R + G + B) / 3;
    yellowness = (R > 150) & (G > 120) & (B < 100);
    exudateMask = yellowness & (brightness > 140) & fov;
    exudateMask = bwareaopen(exudateMask, 20);
    exudateMask = imclose(exudateMask, strel('disk', 2));
    exudateMask = imclearborder(exudateMask);

    %% --- Hemorrhages/microaneurysms: bottom-hat isolates LOCAL dark spots ---
    % Bottom-hat = closing(img) - img → highlights small dark blobs
    % relative to their neighborhood, ignoring large smooth gradients
    % like the fovea's gradual shading or uneven illumination
    se = strel('disk', 8);  % roughly matches expected hemorrhage size — tune if needed
    bottomHat = imbothat(R, se);

    % Threshold the bottom-hat response itself (data-driven, per image)
    hemMask = bottomHat > prctile(bottomHat(fov), 97);
    hemMask = hemMask & fov;

    hemMask = imopen(hemMask, strel('disk', 1));
    hemMask = bwareaopen(hemMask, 15);   % bottom-hat is cleaner, so a lower floor is fine

    stats = regionprops(hemMask, 'Eccentricity', 'Area', 'Solidity', 'PixelIdxList');
    cleanHem = false(size(hemMask));

    maxHemorrhageArea = 600;  % secondary safety net, still worth keeping

    for k = 1:numel(stats)
        isRoundEnough = stats(k).Eccentricity < 0.85;
        isCompact = stats(k).Solidity > 0.7;   % real blobs are solid; noise/vessel bits are ragged
        isSmallEnough = stats(k).Area < maxHemorrhageArea;
        if isRoundEnough && isCompact && isSmallEnough
            cleanHem(stats(k).PixelIdxList) = true;
        end
    end
    hemorrhageMask = cleanHem;
    hemorrhageMask = imclearborder(hemorrhageMask);
end