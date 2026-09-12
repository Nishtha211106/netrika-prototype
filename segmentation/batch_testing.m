%% Batch test across all classes
folderPath = '/Users/nishthamittal/Documents/netrika-prototype/preprocessing/processed_output';  % <-- set this once
outputFolder = fullfile(folderPath, 'results');
if ~exist(outputFolder, 'dir')
    mkdir(outputFolder);
end

% Get all PNG files in the folder
files = dir(fullfile(folderPath, '*.png'));

for i = 1:numel(files)
    fname = files(i).name;
    fprintf('Processing %s (%d/%d)...\n', fname, i, numel(files));

    try
        img = imread(fullfile(folderPath, fname));

        % Run your three pipeline stages
        discMask = optic_disc(img);
        vesselMask = vessel_segment(img);
        [exudateMask, hemMask] = lesion_detect(img, discMask);

        % Build the overlay visualization
        fig = figure('Visible', 'off');  % 'off' so it doesn't pop up 15 windows
        imshow(img); hold on;
        visboundaries(discMask, 'Color', 'c');
        visboundaries(vesselMask, 'Color', 'g');
        visboundaries(exudateMask, 'Color', 'y');
        visboundaries(hemMask, 'Color', 'r');
        title(strrep(fname, '_', '\_'), 'Interpreter', 'tex');  % underscores don't render raw in titles

        % Save result, keeping the original filename (minus extension) for easy matching
        [~, baseName, ~] = fileparts(fname);
        saveas(fig, fullfile(outputFolder, [baseName '_overlay.png']));
        close(fig);

    catch ME
        fprintf('  FAILED on %s: %s\n', fname, ME.message);
        continue;  % don't let one bad image kill the whole batch
    end
end

fprintf('Done. Results saved to: %s\n', outputFolder);