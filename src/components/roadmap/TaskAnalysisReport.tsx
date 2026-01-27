import { Download, Save, RotateCcw, CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { StructuredAnalysisReport } from '@/utils/aiAnalysis';
import { exportAnalysisReportPDF } from '@/utils/pdfExport';

interface TaskAnalysisReportProps {
  report: StructuredAnalysisReport;
  taskName: string;
  onRerun?: () => void;
  onSave?: () => void;
}

const getScoreColor = (score: number): string => {
  if (score >= 80) return 'text-green-500';
  if (score >= 60) return 'text-yellow-500';
  return 'text-red-500';
};

const getScoreBgColor = (score: number): string => {
  if (score >= 80) return 'bg-green-500/10 border-green-500/30';
  if (score >= 60) return 'bg-yellow-500/10 border-yellow-500/30';
  return 'bg-red-500/10 border-red-500/30';
};

const getConfidenceBadgeColor = (confidence: string): string => {
  switch (confidence) {
    case 'High':
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'Medium':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'Low':
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    default:
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
};

export const TaskAnalysisReport = ({
  report,
  taskName,
  onRerun,
  onSave,
}: TaskAnalysisReportProps) => {
  const handleDownloadPDF = async () => {
    try {
      await exportAnalysisReportPDF(report, taskName);
    } catch (error) {
      console.error('Failed to export PDF:', error);
    }
  };

  const createdAtTime = new Date(report.createdAt).toLocaleString();

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="space-y-2 border-b border-gray-700/50 pb-4">
        <h3 className="text-lg font-semibold text-white">
          AI Analysis Report: {taskName}
        </h3>
        <p className="text-sm text-gray-400">Generated on {createdAtTime}</p>
      </div>

      {/* Score & Confidence Section */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gray-900/50 border-gray-700/30 p-4">
          <div className="flex flex-col items-center space-y-2">
            <p className="text-xs font-semibold text-gray-400 uppercase">Overall Score</p>
            <div className={`flex items-center justify-center w-20 h-20 rounded-full border-2 ${getScoreBgColor(report.score)}`}>
              <p className={`text-3xl font-bold ${getScoreColor(report.score)}`}>
                {report.score}
              </p>
            </div>
            <p className="text-xs text-gray-400">/100</p>
          </div>
        </Card>

        <Card className="bg-gray-900/50 border-gray-700/30 p-4">
          <div className="flex flex-col items-center space-y-2">
            <p className="text-xs font-semibold text-gray-400 uppercase">Confidence</p>
            <div className={`px-4 py-2 rounded-lg border ${getConfidenceBadgeColor(report.confidence)}`}>
              <p className="font-semibold text-sm">{report.confidence}</p>
            </div>
            <p className="text-xs text-gray-400">Assessment Confidence</p>
          </div>
        </Card>
      </div>

      {/* Summary Section */}
      <Card className="bg-gray-900/50 border-gray-700/30 p-4 space-y-2">
        <h4 className="font-semibold text-white text-sm">Executive Summary</h4>
        <p className="text-sm text-gray-300 leading-relaxed">{report.summary}</p>
      </Card>

      {/* Strengths Section */}
      <Card className="bg-gray-900/50 border-gray-700/30 p-4 space-y-3">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0" />
          <h4 className="font-semibold text-white text-sm">Strengths</h4>
        </div>
        <ul className="space-y-2">
          {report.strengths.map((strength, idx) => (
            <li key={idx} className="flex gap-2 text-sm text-gray-300">
              <span className="text-green-400 font-bold mt-0.5">+</span>
              <span>{strength}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Weaknesses Section */}
      <Card className="bg-gray-900/50 border-gray-700/30 p-4 space-y-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-yellow-400 flex-shrink-0" />
          <h4 className="font-semibold text-white text-sm">Areas for Improvement</h4>
        </div>
        <ul className="space-y-2">
          {report.weaknesses.map((weakness, idx) => (
            <li key={idx} className="flex gap-2 text-sm text-gray-300">
              <span className="text-yellow-400 font-bold mt-0.5">−</span>
              <span>{weakness}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Suggestions Section */}
      <Card className="bg-gray-900/50 border-gray-700/30 p-4 space-y-3">
        <h4 className="font-semibold text-white text-sm">Recommendations</h4>
        <ul className="space-y-2">
          {report.suggestions.map((suggestion, idx) => (
            <li key={idx} className="flex gap-2 text-sm text-gray-300">
              <span className="text-primary font-bold mt-0.5">→</span>
              <span>{suggestion}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Impact Assessment */}
      <Card className="bg-gradient-to-r from-primary/20 to-primary/10 border-primary/30 p-4 space-y-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary flex-shrink-0" />
          <h4 className="font-semibold text-white text-sm">Impact Assessment</h4>
        </div>
        <p className="text-sm text-gray-200">{report.impact}</p>
      </Card>

      {/* Next Steps */}
      <Card className="bg-gray-900/50 border-gray-700/30 p-4 space-y-3">
        <h4 className="font-semibold text-white text-sm">Suggested Next Steps</h4>
        <ol className="space-y-2">
          {report.nextSteps.map((step, idx) => (
            <li key={idx} className="flex gap-2 text-sm text-gray-300">
              <span className="text-primary font-semibold flex-shrink-0 mt-0.5">
                {idx + 1}.
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </Card>

      {/* Action Toolbar */}
      <div className="flex gap-2 pt-2 border-t border-gray-700/50">
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 text-gray-200 hover:text-white"
        >
          <Download className="h-4 w-4" />
          Download PDF
        </Button>
        {onSave && (
          <Button
            variant="outline"
            size="sm"
            onClick={onSave}
            className="flex items-center gap-2 text-gray-200 hover:text-white"
          >
            <Save className="h-4 w-4" />
            Save Report
          </Button>
        )}
        {onRerun && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRerun}
            className="flex items-center gap-2 text-gray-200 hover:text-white"
          >
            <RotateCcw className="h-4 w-4" />
            Re-run Analysis
          </Button>
        )}
      </div>
    </div>
  );
};
