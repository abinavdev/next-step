import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader, CheckCircle2, AlertCircle, Lightbulb, Zap } from 'lucide-react';
import type { UploadedFile, AnalysisResult } from '@/utils/aiAnalysis';

export type { AnalysisResult };

interface AIAnalysisProps {
  tasks: Array<{ id: string; title: string; status: 'not-started' | 'in-progress' | 'completed' }>;
  subscriptionLevel: 'free' | 'project' | 'mentor';
  isAnalyzing: boolean;
  analysisResult?: AnalysisResult;
}

export function AIAnalysisSection({
  tasks,
  subscriptionLevel,
  isAnalyzing,
  analysisResult,
}: AIAnalysisProps) {
  if (!analysisResult) return null;

  const getCompletenessColor = (completeness: number) => {
    if (completeness >= 80) return 'bg-accent';
    if (completeness >= 60) return 'bg-primary';
    return 'bg-yellow-500';
  };

  return (
    <Card className="border-border bg-gradient-to-br from-primary/5 to-accent/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          {isAnalyzing ? (
            <>
              <Loader className="h-5 w-5 animate-spin text-primary" />
              Analyzing Your Work...
            </>
          ) : (
            <>
              <Zap className="h-5 w-5 text-primary" />
              AI Progress Analysis
            </>
          )}
        </CardTitle>
        <CardDescription>Based on your uploaded files and project tasks</CardDescription>
      </CardHeader>

      {isAnalyzing ? (
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12">
            <Loader className="mb-4 h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Analyzing your work with AI...</p>
          </div>
        </CardContent>
      ) : (
        <CardContent className="space-y-6">
          {/* Overall Completeness */}
          <div>
            <div className="mb-3 flex items-end justify-between">
              <h3 className="text-lg font-semibold text-foreground">Overall Completeness</h3>
              <span className={`text-3xl font-bold gradient-primary bg-clip-text text-transparent`}>
                {analysisResult.completeness}%
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-secondary">
              <div
                className={`h-full rounded-full ${getCompletenessColor(analysisResult.completeness)} shadow-glow transition-all duration-500`}
                style={{ width: `${analysisResult.completeness}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {analysisResult.completeness >= 80
                ? '✨ Great progress! You\'re on track.'
                : analysisResult.completeness >= 60
                ? '📈 Good start! Keep pushing forward.'
                : '🚀 Just getting started. Keep working!'}
            </p>
          </div>

          {/* Missing Components */}
          {analysisResult.missing.length > 0 && (
            <div>
              <h3 className="mb-3 flex items-center gap-2 font-semibold text-foreground">
                <AlertCircle className="h-5 w-5 text-yellow-500" />
                Missing Components
              </h3>
              <ul className="space-y-2">
                {analysisResult.missing.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 rounded-lg border border-yellow-200/30 bg-yellow-50/30 p-3"
                  >
                    <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-yellow-500/20 text-xs font-bold text-yellow-600">
                      •
                    </span>
                    <span className="text-sm text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendations */}
          {analysisResult.recommendations.length > 0 && (
            <div>
              <h3 className="mb-3 flex items-center gap-2 font-semibold text-foreground">
                <Lightbulb className="h-5 w-5 text-primary" />
                Improvement Suggestions
              </h3>
              <ul className="space-y-2">
                {analysisResult.recommendations.map((rec, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 p-3"
                  >
                    <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                      ✓
                    </span>
                    <span className="text-sm text-foreground">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Next Steps */}
          {analysisResult.nextSteps.length > 0 && (
            <div>
              <h3 className="mb-3 flex items-center gap-2 font-semibold text-foreground">
                <CheckCircle2 className="h-5 w-5 text-accent" />
                Recommended Next Steps
              </h3>
              <div className="space-y-2">
                {analysisResult.nextSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 rounded-lg border border-accent/20 bg-accent/5 p-3"
                  >
                    <span className="inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent/20 text-xs font-bold text-accent">
                      {idx + 1}
                    </span>
                    <span className="text-sm text-foreground">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mentor Review CTA */}
          {subscriptionLevel === 'mentor' && (
            <Button className="w-full gradient-primary text-primary-foreground shadow-glow hover:shadow-glow-md">
              Send to Mentor for Review 👥
            </Button>
          )}

          {subscriptionLevel === 'project' && (
            <div className="rounded-lg border border-primary/30 bg-primary/10 p-4 text-center">
              <p className="text-sm font-medium text-primary mb-2">Get Personalized Mentor Feedback</p>
              <p className="text-xs text-primary/80 mb-3">
                Upgrade to Mentor + Assistance plan to send your work for review and get personalized guidance from experts.
              </p>
              <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
                Upgrade to Mentor Plan
              </Button>
            </div>
          )}

          <p className="text-xs text-muted-foreground text-center">
            Analysis completed on {new Date(analysisResult.timestamp).toLocaleDateString()} at{' '}
            {new Date(analysisResult.timestamp).toLocaleTimeString()}
          </p>
        </CardContent>
      )}
    </Card>
  );
}
