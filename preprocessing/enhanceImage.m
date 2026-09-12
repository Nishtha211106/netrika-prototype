function enhanced = enhanceImage(img)
    lab = rgb2lab(img);
    L = lab(:,:,1) / 100;

    % Stronger CLAHE - higher clip limit, more tiles
    L_eq = adapthisteq(L, 'ClipLimit', 0.02, 'Distribution', 'rayleigh', ...
        'NumTiles', [8 8]);
    lab(:,:,1) = L_eq * 100;
    illumCorrected = lab2rgb(lab);
    illumCorrected = im2uint8(illumCorrected);

    % Sharpen slightly after enhancement (brings out vessel edges)
    sharpened = imsharpen(illumCorrected, 'Radius', 1.5, 'Amount', 0.8);

    % Denoise last, to clean up any noise sharpening introduced
    enhanced = imbilatfilt(sharpened, 0.08, 4);
end