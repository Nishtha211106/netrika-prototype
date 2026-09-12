%% ===== generateReport.m =====
% Run this AFTER runQualityPipeline.m has completed
% Requires: quality_report.csv, borderline_comparison.png, gradeable_comparison.png

import mlreportgen.report.*
import mlreportgen.dom.*

% Load results from CSV (so this script works independently)
results = readtable('quality_report.csv');

numGradeable  = sum(results.Status == "gradeable");
numBorderline = sum(results.Status == "borderline");
numReject     = sum(results.Status == "reject");
classNames = unique(results.Class);

rpt = Report('QualityAssessmentReport', 'pdf');

% Title page
tp = TitlePage('Title', 'Netrika: Image Quality Assessment Report', ...
    'Subtitle', 'Preprocessing Stage Summary');
add(rpt, tp);
add(rpt, TableOfContents);

% Chapter 1: Overview
ch1 = Chapter('Title', 'Overview');
add(ch1, Paragraph(sprintf('Total images processed: %d', height(results))));
add(ch1, Paragraph(sprintf('Gradeable (light enhancement): %d', numGradeable)));
add(ch1, Paragraph(sprintf('Borderline (full enhancement): %d', numBorderline)));
add(ch1, Paragraph(sprintf('Rejected (recapture needed): %d', numReject)));
add(rpt, ch1);

% Chapter 2: Per-Class Breakdown Table
ch2 = Chapter('Title', 'Per-Class Quality Breakdown');
classTableData = {'Class', 'Gradeable', 'Borderline', 'Reject'};
for c = 1:numel(classNames)
    classResults = results(results.Class == classNames{c}, :);
    classTableData = [classTableData; {
        char(classNames{c}), ...
        num2str(sum(classResults.Status == "gradeable")), ...
        num2str(sum(classResults.Status == "borderline")), ...
        num2str(sum(classResults.Status == "reject"))
    }];
end
tbl = Table(classTableData);
tbl.Style = {Border('solid'), ColSep('solid'), RowSep('solid')};
add(ch2, tbl);
add(rpt, ch2);

% Chapter 3: Enhancement Visual Evidence
ch3 = Chapter('Title', 'Enhancement Results');
if numBorderline > 0 && exist('borderline_comparison.png', 'file')
    add(ch3, Heading2('Borderline Images: Before vs After'));
    add(ch3, Image('borderline_comparison.png'));
end
if numGradeable > 0 && exist('gradeable_comparison.png', 'file')
    add(ch3, Heading2('Gradeable Images: Before vs After (Light Enhancement)'));
    add(ch3, Image('gradeable_comparison.png'));
end
add(rpt, ch3);

close(rpt);
fprintf('Report generated: QualityAssessmentReport.pdf\n');