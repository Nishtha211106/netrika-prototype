function enhanced = lightEnhance(img)
% Gentle enhancement for already-gradeable images
lab = rgb2lab(img);
L = lab(:,:,1) / 100;

% Milder CLAHE than the full enhancement
L_eq = adapthisteq(L, 'ClipLimit', 0.003, 'Distribution', 'uniform');
lab(:,:,1) = L_eq * 100;
enhanced = lab2rgb(lab);
enhanced = im2uint8(enhanced);
end