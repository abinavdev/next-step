import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Upload,
  FileText,
  Zap,
  CheckCircle2,
  AlertCircle,
  Loader,
} from 'lucide-react';

interface WorkSubmission {
  id: string;
  title: string;
  description: string;
  submittedDate: string;
  aiAnalysis?: {
    score: number;
    feedback: string;
    suggestions: string[];
  };
  status: 'submitted' | 'analyzing' | 'analyzed';
}

export function WorkUpload() {
  const [submissions, setSubmissions] = useState<WorkSubmission[]>([
    {
      id: '1',
      title: 'Authentication Module Implementation',
      description: 'Implemented secure JWT-based authentication system with refresh tokens and password hashing using bcrypt.',
      submittedDate: '2024-02-01',
      status: 'analyzed',
      aiAnalysis: {
        score: 92,
        feedback: 'Excellent implementation with strong security practices. Code is well-structured and follows industry standards.',
        suggestions: [
          'Consider implementing rate limiting on login endpoints',
          'Add email verification for account recovery',
          'Implement 2FA for enhanced security',
        ],
      },
    },
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitWork = async () => {
    if (!newTitle.trim() || !newDescription.trim()) return;

    const submission: WorkSubmission = {
      id: Date.now().toString(),
      title: newTitle,
      description: newDescription,
      submittedDate: new Date().toISOString().split('T')[0],
      status: 'analyzing',
    };

    setSubmissions([...submissions, submission]);
    setNewTitle('');
    setNewDescription('');
    setIsSubmitting(true);

    // Simulate AI analysis
    setTimeout(() => {
      setSubmissions((prev) =>
        prev.map((sub) =>
          sub.id === submission.id
            ? {
                ...sub,
                status: 'analyzed',
                aiAnalysis: {
                  score: Math.floor(Math.random() * 30 + 70),
                  feedback: generateFeedback(newDescription),
                  suggestions: generateSuggestions(newDescription),
                },
              }
            : sub
        )
      );
      setIsSubmitting(false);
      setIsOpen(false);
    }, 2000);
  };

  const generateFeedback = (description: string) => {
    const feedbackOptions = [
      'Great work! Your implementation shows a solid understanding of the concepts.',
      'Excellent approach with well-organized code and clear documentation.',
      'Strong foundation with room for optimization and best practices.',
      'Well-executed with attention to detail and clean code principles.',
    ];
    return feedbackOptions[Math.floor(Math.random() * feedbackOptions.length)];
  };

  const generateSuggestions = (description: string) => {
    const suggestions = [
      'Consider adding comprehensive error handling',
      'Implement proper logging for debugging',
      'Add unit tests for better code coverage',
      'Review for potential performance optimizations',
      'Document edge cases and assumptions',
      'Consider code reusability improvements',
    ];
    return suggestions.slice(0, 3).sort(() => Math.random() - 0.5);
  };

  return (
    <div className="space-y-6">
      {/* Work Upload Card */}
      <Card className="border-border bg-gradient-to-br from-primary/5 to-accent/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-foreground">Share Your Work</CardTitle>
              <CardDescription>Submit your completed work for AI-powered analysis and feedback</CardDescription>
            </div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button className="gradient-primary text-primary-foreground shadow-glow hover:shadow-glow-md">
                  <Upload className="mr-2 h-4 w-4" />
                  Submit Work
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Submit Your Work</DialogTitle>
                  <DialogDescription>
                    Share your completed project or task for AI analysis and constructive feedback
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">Work Title</label>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g., User Authentication Module"
                      className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Description & Code/Details</label>
                    <Textarea
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      placeholder="Describe what you built, your approach, technologies used, challenges faced, and any relevant code snippets..."
                      className="mt-2 min-h-[200px] rounded-lg border border-border bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
                    />
                  </div>
                  <Button
                    onClick={handleSubmitWork}
                    disabled={!newTitle.trim() || !newDescription.trim() || isSubmitting}
                    className="w-full gradient-primary text-primary-foreground shadow-glow hover:shadow-glow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Zap className="mr-2 h-4 w-4" />
                        Submit for AI Analysis
                      </>
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      {/* Work Submissions */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Your Submissions</h3>
        {submissions.length === 0 ? (
          <Card className="border-dashed border-border">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <p className="text-muted-foreground">No submissions yet. Share your work to get AI feedback!</p>
            </CardContent>
          </Card>
        ) : (
          submissions.map((submission) => (
            <Card key={submission.id} className="border-border hover:shadow-soft transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-foreground">{submission.title}</CardTitle>
                      <Badge
                        className={
                          submission.status === 'analyzed'
                            ? 'bg-accent/20 text-accent border-accent/30'
                            : submission.status === 'analyzing'
                            ? 'bg-primary/20 text-primary border-primary/30'
                            : 'bg-secondary text-muted-foreground'
                        }
                      >
                        {submission.status === 'analyzed' ? (
                          <>
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                            Analyzed
                          </>
                        ) : submission.status === 'analyzing' ? (
                          <>
                            <Loader className="mr-1 h-3 w-3 animate-spin" />
                            Analyzing
                          </>
                        ) : (
                          'Submitted'
                        )}
                      </Badge>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Submitted on {new Date(submission.submittedDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  {submission.aiAnalysis && (
                    <div className="flex flex-col items-center rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 px-6 py-4">
                      <p className="text-sm text-muted-foreground">AI Score</p>
                      <p className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
                        {submission.aiAnalysis.score}%
                      </p>
                    </div>
                  )}
                </div>
              </CardHeader>

              {submission.aiAnalysis && (
                <CardContent className="space-y-4 border-t border-border pt-4">
                  <div>
                    <p className="text-sm font-semibold text-foreground">AI Feedback</p>
                    <p className="mt-2 text-sm text-muted-foreground">{submission.aiAnalysis.feedback}</p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-foreground">Improvement Suggestions</p>
                    <ul className="mt-2 space-y-2">
                      {submission.aiAnalysis.suggestions.map((suggestion, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                          <span className="text-sm text-muted-foreground">{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
