%% ===== generateReport_simple.m (no toolbox needed, fixed for numeric classes) =====

results = readtable('quality_report.csv');
numGradeable  = sum(results.Status == "gradeable");
numBorderline = sum(results.Status == "borderline");
numReject     = sum(results.Status == "reject");

classNames = unique(results.Class);   % works whether numeric or string

fig = figure('Visible','off', 'Position', [0 0 800 1000]);

annotation('textbox', [0.1 0.9 0.8 0.08], 'String', ...
    'Netrika: Image Quality Assessment Report', ...
    'FontSize', 16, 'FontWeight', 'bold', 'EdgeColor', 'none', 'HorizontalAlignment','center');

summaryText = sprintf(['Total images: %d\n' ...
    'Gradeable: %d\nBorderline: %d\nRejected: %d'], ...
    height(results), numGradeable, numBorderline, numReject);
annotation('textbox', [0.1 0.75 0.8 0.12], 'String', summaryText, ...
    'FontSize', 11, 'EdgeColor', 'none');

classText = "Per-Class Breakdown:" + newline;
for c = 1:numel(classNames)
    thisClass = classNames(c);   % NOTE: () not {} - works for numeric or string
    cr = results(results.Class == thisClass, :);
    classText = classText + sprintf('Class %s: %d gradeable, %d borderline, %d reject\n', ...
        string(thisClass), sum(cr.Status=="gradeable"), sum(cr.Status=="borderline"), sum(cr.Status=="reject"));
end
annotation('textbox', [0.1 0.55 0.8 0.18], 'String', classText, ...
    'FontSize', 10, 'EdgeColor', 'none');

exportgraphics(fig, 'QualityAssessmentReport.pdf', 'ContentType', 'vector');
close(fig);

if exist('borderline_comparison.png', 'file')
    fig2 = figure('Visible','off');
    imshow(imread('borderline_comparison.png'));
    title('Borderline: Before vs After');
    exportgraphics(fig2, 'QualityAssessmentReport.pdf', 'Append', true);
    close(fig2);
end

if exist('gradeable_comparison.png', 'file')
    fig3 = figure('Visible','off');
    imshow(imread('gradeable_comparison.png'));
    title('Gradeable: Before vs After');
    exportgraphics(fig3, 'QualityAssessmentReport.pdf', 'Append', true);
    close(fig3);
end

fprintf('Report generated: QualityAssessmentReport.pdf\n');