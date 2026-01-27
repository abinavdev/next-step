export interface StructuredAnalysisReport {
  score: number;
  confidence: 'High' | 'Medium' | 'Low';
  summary: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  impact: string;
  nextSteps: string[];
  createdAt: Date;
}

export interface AnalysisResult {
  completeness: number;
  missing: string[];
  recommendations: string[];
  nextSteps: string[];
  timestamp: string;
}

export interface UploadedFile {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'document' | 'archive' | 'text';
  size: number;
  uploadedDate: string;
  file: File;
}

interface Task {
  id: string;
  title: string;
  status: 'not-started' | 'in-progress' | 'completed';
}

/**
 * Generate a structured AI analysis report for task submissions
 */
export const analyzeTaskSubmission = async (
  files: UploadedFile[],
  taskTitle: string,
  taskDescription?: string
): Promise<StructuredAnalysisReport> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Calculate score based on file quality and count
  const fileScore = Math.min(files.length * 15, 50);
  const diversityScore = files.some((f) => f.type === 'document' || f.type === 'pdf') ? 15 : 0;
  const baseScore = fileScore + diversityScore;
  const score = Math.min(Math.max(baseScore + 20, 0), 100);

  // Determine confidence based on score
  let confidence: 'High' | 'Medium' | 'Low' = 'Medium';
  if (score >= 75) confidence = 'High';
  else if (score < 50) confidence = 'Low';

  // Generate summary based on submission quality
  const summary = 
    files.length >= 3
      ? `Your submission demonstrates solid understanding of "${taskTitle}". The provided documentation and files show good progress, with clear organization and multiple supporting materials.`
      : files.length >= 1
      ? `Your submission for "${taskTitle}" shows foundational understanding. Consider adding more supporting documentation to strengthen the evaluation.`
      : `Your submission for "${taskTitle}" needs more supporting materials. Please provide documentation, code, or evidence files to validate your work.`;

  // Determine strengths based on submission
  const strengths: string[] = [];
  if (files.length >= 2) {
    strengths.push('Multiple supporting documents provided');
  }
  if (files.some((f) => f.type === 'image')) {
    strengths.push('Includes visual evidence (screenshots/diagrams)');
  }
  if (files.some((f) => f.type === 'document' || f.type === 'pdf')) {
    strengths.push('Formal documentation included');
  }
  if (files.length > 0) {
    strengths.push('Well-organized file structure');
  }
  if (strengths.length === 0) {
    strengths.push('Attempted task submission');
  }

  // Determine weaknesses
  const weaknesses: string[] = [];
  if (files.length < 2) {
    weaknesses.push('Limited supporting documentation');
  }
  if (!files.some((f) => f.type === 'document' || f.type === 'pdf')) {
    weaknesses.push('Missing formal write-up or report');
  }
  if (!files.some((f) => f.type === 'image')) {
    weaknesses.push('No visual evidence or diagrams provided');
  }
  if (files.length === 0) {
    weaknesses.push('No supporting files uploaded');
  }

  // Action suggestions
  const suggestions: string[] = [
    'Add comprehensive documentation explaining your approach and implementation',
    'Include diagrams or architecture visuals to illustrate your solution',
    'Provide code snippets or links to your repository',
    'Document challenges encountered and your solutions',
    'Create a summary of key achievements and metrics',
  ];

  // Impact assessment
  const impactPercentage = Math.round((score / 100) * 15);
  const impact = `Completing and documenting this task ("${taskTitle}") increases your project progress by approximately ${impactPercentage}% when fully validated. This work demonstrates your ability to deliver quality work with proper documentation.`;

  // Next steps
  const nextSteps: string[] = [
    'Review mentor feedback for this task submission',
    'Refine documentation based on identified gaps',
    'Prepare case study or blog post about this work',
    'Share this achievement on your professional profile',
  ];

  return {
    score,
    confidence,
    summary,
    strengths: strengths.slice(0, 4),
    weaknesses: weaknesses.slice(0, 3),
    suggestions: suggestions.slice(0, 3),
    impact,
    nextSteps: nextSteps.slice(0, 3),
    createdAt: new Date(),
  };
};

export const analyzeWork = async (
  files: UploadedFile[],
  tasks: Task[]
): Promise<AnalysisResult> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Mock analysis based on file count and task completion
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const totalTasks = tasks.length;
  const taskCompletion = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Calculate completeness based on files uploaded and tasks done
  const fileBonus = Math.min(files.length * 15, 40);
  const baseCompleteness = Math.round(taskCompletion * 0.6 + fileBonus);
  const completeness = Math.min(Math.max(baseCompleteness, 0), 100);

  // Determine missing components
  const missing: string[] = [];
  if (completedTasks < totalTasks * 0.5) {
    missing.push('Core functionality documentation');
  }
  if (files.length < 3) {
    missing.push('Comprehensive project evidence files');
  }
  if (!files.some((f) => f.type === 'document' || f.type === 'pdf')) {
    missing.push('Formal documentation or report');
  }
  if (completedTasks === 0) {
    missing.push('Completed task evidence');
  }

  // Recommendations based on analysis
  const recommendations: string[] = [
    'Add more detailed documentation of your implementation approach',
    'Include screenshots or diagrams showing progress',
    'Document challenges faced and how you overcame them',
    'Provide code snippets or architecture diagrams',
  ];

  // Next steps
  const nextSteps: string[] = [];
  if (completedTasks < totalTasks) {
    nextSteps.push(`Complete remaining ${totalTasks - completedTasks} task(s) from your milestone`);
  }
  nextSteps.push('Review and refine your uploaded documentation');
  if (files.length < 5) {
    nextSteps.push('Upload additional evidence of your work progress');
  }
  nextSteps.push('Prepare for mentor review with clear explanations');

  return {
    completeness,
    missing: missing.slice(0, 3),
    recommendations: recommendations.slice(0, 3),
    nextSteps: nextSteps.slice(0, 4),
    timestamp: new Date().toISOString(),
  };
};
