import { StructuredAnalysisReport } from '@/utils/aiAnalysis';

/**
 * Export analysis report to PDF
 * Uses browser's canvas to generate PDF client-side
 */
export const exportAnalysisReportPDF = async (
  report: StructuredAnalysisReport,
  taskName: string
): Promise<void> => {
  try {
    // Dynamically import html2canvas and jsPDF
    const html2canvas = (await import('html2canvas')).default;
    const jsPDF = (await import('jspdf')).default;

    // Create a temporary container for rendering
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.width = '210mm';
    container.style.backgroundColor = 'white';
    container.style.color = '#1a1a1a';
    container.style.padding = '20mm';
    container.style.fontFamily = 'Arial, sans-serif';

    // Build HTML content
    const createdAtTime = new Date(report.createdAt).toLocaleDateString();
    const scoreColor = report.score >= 80 ? '#10b981' : report.score >= 60 ? '#eab308' : '#ef4444';

    container.innerHTML = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1a1a1a;">
        <!-- Header -->
        <div style="border-bottom: 2px solid #e5e7eb; padding-bottom: 15px; margin-bottom: 20px;">
          <h1 style="margin: 0; font-size: 24px; color: #1a1a1a;">AI Analysis Report</h1>
          <h2 style="margin: 5px 0 0 0; font-size: 18px; color: #666;">Task: ${escapeHtml(taskName)}</h2>
          <p style="margin: 10px 0 0 0; font-size: 12px; color: #999;">Generated on ${createdAtTime}</p>
        </div>

        <!-- Score & Confidence -->
        <div style="display: flex; gap: 20px; margin-bottom: 20px;">
          <div style="flex: 1; padding: 15px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px;">
            <p style="margin: 0 0 10px 0; font-size: 12px; font-weight: bold; color: #666; text-transform: uppercase;">Overall Score</p>
            <div style="font-size: 36px; font-weight: bold; color: ${scoreColor};">${report.score}/100</div>
            <p style="margin: 5px 0 0 0; font-size: 12px; color: #999;">Assessment Score</p>
          </div>
          <div style="flex: 1; padding: 15px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px;">
            <p style="margin: 0 0 10px 0; font-size: 12px; font-weight: bold; color: #666; text-transform: uppercase;">Confidence Level</p>
            <div style="font-size: 18px; font-weight: bold; color: ${scoreColor};">${report.confidence}</div>
            <p style="margin: 5px 0 0 0; font-size: 12px; color: #999;">Evaluation Confidence</p>
          </div>
        </div>

        <!-- Executive Summary -->
        <div style="padding: 15px; background: #f0fdf4; border-left: 4px solid #10b981; margin-bottom: 20px;">
          <h3 style="margin: 0 0 10px 0; font-size: 14px; font-weight: bold; color: #1a1a1a;">Executive Summary</h3>
          <p style="margin: 0; font-size: 12px; line-height: 1.6; color: #374151;">${escapeHtml(report.summary)}</p>
        </div>

        <!-- Strengths -->
        <div style="margin-bottom: 20px;">
          <h3 style="margin: 0 0 10px 0; font-size: 14px; font-weight: bold; color: #1a1a1a;">✓ Strengths</h3>
          <ul style="margin: 0; padding-left: 20px;">
            ${report.strengths.map((s) => `<li style="margin-bottom: 5px; font-size: 12px; color: #374151;">${escapeHtml(s)}</li>`).join('')}
          </ul>
        </div>

        <!-- Areas for Improvement -->
        <div style="margin-bottom: 20px;">
          <h3 style="margin: 0 0 10px 0; font-size: 14px; font-weight: bold; color: #1a1a1a;">⚠ Areas for Improvement</h3>
          <ul style="margin: 0; padding-left: 20px;">
            ${report.weaknesses.map((w) => `<li style="margin-bottom: 5px; font-size: 12px; color: #374151;">${escapeHtml(w)}</li>`).join('')}
          </ul>
        </div>

        <!-- Recommendations -->
        <div style="margin-bottom: 20px;">
          <h3 style="margin: 0 0 10px 0; font-size: 14px; font-weight: bold; color: #1a1a1a;">→ Recommendations</h3>
          <ul style="margin: 0; padding-left: 20px;">
            ${report.suggestions.map((s) => `<li style="margin-bottom: 5px; font-size: 12px; color: #374151;">${escapeHtml(s)}</li>`).join('')}
          </ul>
        </div>

        <!-- Impact Assessment -->
        <div style="padding: 15px; background: #fef3c7; border-left: 4px solid #f59e0b; margin-bottom: 20px;">
          <h3 style="margin: 0 0 10px 0; font-size: 14px; font-weight: bold; color: #1a1a1a;">Impact Assessment</h3>
          <p style="margin: 0; font-size: 12px; line-height: 1.6; color: #374151;">${escapeHtml(report.impact)}</p>
        </div>

        <!-- Next Steps -->
        <div style="margin-bottom: 20px;">
          <h3 style="margin: 0 0 10px 0; font-size: 14px; font-weight: bold; color: #1a1a1a;">Next Steps</h3>
          <ol style="margin: 0; padding-left: 20px;">
            ${report.nextSteps.map((step) => `<li style="margin-bottom: 5px; font-size: 12px; color: #374151;">${escapeHtml(step)}</li>`).join('')}
          </ol>
        </div>

        <!-- Footer -->
        <div style="border-top: 1px solid #e5e7eb; padding-top: 15px; margin-top: 20px; font-size: 10px; color: #999;">
          <p style="margin: 0;">This report was automatically generated by NextStep AI Analysis system.</p>
          <p style="margin: 5px 0 0 0;">© 2024 NextStep. All rights reserved.</p>
        </div>
      </div>
    `;

    document.body.appendChild(container);

    // Convert to canvas
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

    // Add new page if content is longer
    let heightLeft = imgHeight - 297;
    let position = 0;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= 297;
    }

    // Save the PDF
    const filename = `AI-Analysis-${taskName.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(filename);

    // Clean up
    document.body.removeChild(container);
  } catch (error) {
    console.error('Error exporting PDF:', error);
    // Fallback: create a simple text-based download
    const textContent = generatePlainTextReport(report, taskName);
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AI-Analysis-${taskName.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }
};

/**
 * Generate plain text representation of the report
 * Used as fallback if PDF generation fails
 */
const generatePlainTextReport = (report: StructuredAnalysisReport, taskName: string): string => {
  const createdAt = new Date(report.createdAt).toLocaleString();

  return `
================================================================================
                         AI ANALYSIS REPORT
================================================================================

Task: ${taskName}
Generated: ${createdAt}

================================================================================
SCORE & ASSESSMENT
================================================================================

Overall Score: ${report.score}/100
Confidence Level: ${report.confidence}

================================================================================
EXECUTIVE SUMMARY
================================================================================

${report.summary}

================================================================================
STRENGTHS
================================================================================

${report.strengths.map((s, i) => `${i + 1}. ${s}`).join('\n')}

================================================================================
AREAS FOR IMPROVEMENT
================================================================================

${report.weaknesses.map((w, i) => `${i + 1}. ${w}`).join('\n')}

================================================================================
RECOMMENDATIONS
================================================================================

${report.suggestions.map((s, i) => `${i + 1}. ${s}`).join('\n')}

================================================================================
IMPACT ASSESSMENT
================================================================================

${report.impact}

================================================================================
NEXT STEPS
================================================================================

${report.nextSteps.map((s, i) => `${i + 1}. ${s}`).join('\n')}

================================================================================
© 2024 NextStep. All rights reserved.
================================================================================
  `;
};

/**
 * Escape HTML special characters for safe display in PDF
 */
const escapeHtml = (text: string): string => {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
};
