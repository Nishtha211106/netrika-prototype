baseFolder = 'C:\Users\dharam dutt\Documents\netrika-prototype\preprocessing\processed_output';
outputFolder = 'C:\Users\dharam dutt\Documents\netrika-prototype\segmentation\segmented_output_full';

classes = ["0","1","2","3","4"];

for c = classes
    folderPath = fullfile(baseFolder, c);
    classOutputFolder = fullfile(outputFolder, c);
    if ~exist(classOutputFolder, 'dir')
        mkdir(classOutputFolder);
    end

    files = dir(fullfile(folderPath, '*.png'));
    fprintf('Class %s: %d images\n', c, numel(files));

    for i = 1:numel(files)
        fname = files(i).name;
        fprintf('  Processing %s (%d/%d)...\n', fname, i, numel(files));
        try
            img = imread(fullfile(folderPath, fname));

            discMask = optic_disc(img);
            vesselMask = vessel_segment(img);
            [exudateMask, hemMask] = lesion_detect(img, discMask);

            fig = figure('Visible', 'off');
            imshow(img); hold on;
            visboundaries(discMask, 'Color', 'c');
            visboundaries(vesselMask, 'Color', 'g');
            visboundaries(exudateMask, 'Color', 'y');
            visboundaries(hemMask, 'Color', 'r');
            title(strrep(fname, '_', '\_'), 'Interpreter', 'tex');

            [~, baseName, ~] = fileparts(fname);
            saveas(fig, fullfile(classOutputFolder, [baseName '_overlay.png']));
            close(fig);
        catch ME
            fprintf('    FAILED on %s: %s\n', fname, ME.message);
            continue;
        end
    end
end
fprintf('Done. Results saved to: %s\n', outputFolder);