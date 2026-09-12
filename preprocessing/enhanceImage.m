function enhanced = enhanceImage(img)
lab = rgb2lab(img);
L = lab(:,:,1) / 100;
L_eq = adapthisteq(L, 'ClipLimit', 0.01, 'Distribution', 'rayleigh');
lab(:,:,1) = L_eq * 100;
illumCorrected = lab2rgb(lab);
illumCorrected = im2uint8(illumCorrected);
enhanced = imbilatfilt(illumCorrected, 0.05, 3);
end