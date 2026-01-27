import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Plus, Edit2, Trash2, CheckCircle2, Clock, AlertCircle, Upload, FileIcon, ChevronDown, Loader2 } from 'lucide-react';
import { analyzeTaskSubmission } from '@/utils/aiAnalysis';
import type { UploadedFile, StructuredAnalysisReport } from '@/utils/aiAnalysis';
import { TaskAnalysisReport } from './TaskAnalysisReport';

type TaskStatus = 'not-started' | 'in-progress' | 'completed';

/**
 * Detect file type from file extension or MIME type
 */
const detectFileType = (fileName: string, mimeType?: string): 'pdf' | 'image' | 'document' | 'archive' | 'text' => {
  const ext = fileName.toLowerCase().split('.').pop() || '';
  
  // PDF
  if (ext === 'pdf' || mimeType?.includes('pdf')) return 'pdf';
  
  // Images
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext) || mimeType?.includes('image')) return 'image';
  
  // Documents
  if (['doc', 'docx', 'txt', 'rtf', 'xlsx', 'xls', 'ppt', 'pptx'].includes(ext) || mimeType?.includes('document') || mimeType?.includes('spreadsheet') || mimeType?.includes('presentation')) return 'document';
  
  // Archives
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext) || mimeType?.includes('zip') || mimeType?.includes('archive')) return 'archive';
  
  // Text/Code
  if (['js', 'ts', 'tsx', 'jsx', 'py', 'java', 'cpp', 'c', 'h', 'css', 'html', 'xml', 'json', 'yaml', 'yml', 'md'].includes(ext) || mimeType?.includes('text')) return 'text';
  
  // Default
  return 'document';
};

interface UploadedTaskFile {
  id: string;
  fileName: string;
  fileSize: number;
  uploadedAt: Date;
  file?: File;
}

interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  dueDate?: string;
  description?: string;
  uploads?: UploadedTaskFile[];
  aiAnalysis?: StructuredAnalysisReport | null;
  isAnalyzing?: boolean;
  showAnalysis?: boolean;
}

interface Milestone {
  id: string;
  title: string;
  tasks: Task[];
  completedTasks: number;
}

const mockMilestones: Milestone[] = [
  {
    id: '1',
    title: 'Project Setup',
    tasks: [
      { id: '1.1', title: 'Initialize project repository', status: 'completed', dueDate: '2024-01-15', uploads: [], aiAnalysis: null },
      { id: '1.2', title: 'Set up development environment', status: 'completed', dueDate: '2024-01-17', uploads: [], aiAnalysis: null },
      { id: '1.3', title: 'Create project documentation', status: 'in-progress', dueDate: '2024-01-25', uploads: [], aiAnalysis: null },
    ],
    completedTasks: 2,
  },
  {
    id: '2',
    title: 'Core Features Development',
    tasks: [
      { id: '2.1', title: 'Implement user authentication', status: 'in-progress', dueDate: '2024-02-05', uploads: [], aiAnalysis: null },
      { id: '2.2', title: 'Build API endpoints', status: 'not-started', dueDate: '2024-02-15', uploads: [], aiAnalysis: null },
      { id: '2.3', title: 'Create database schema', status: 'not-started', dueDate: '2024-02-10', uploads: [], aiAnalysis: null },
    ],
    completedTasks: 0,
  },
  {
    id: '3',
    title: 'Testing & Deployment',
    tasks: [
      { id: '3.1', title: 'Write unit tests', status: 'not-started', dueDate: '2024-02-25', uploads: [], aiAnalysis: null },
      { id: '3.2', title: 'Deploy to staging', status: 'not-started', dueDate: '2024-03-01', uploads: [], aiAnalysis: null },
      { id: '3.3', title: 'Production deployment', status: 'not-started', dueDate: '2024-03-05', uploads: [], aiAnalysis: null },
    ],
    completedTasks: 0,
  },
];

const getStatusIcon = (status: TaskStatus) => {
  switch (status) {
    case 'completed':
      return <CheckCircle2 className="h-5 w-5 text-accent" />;
    case 'in-progress':
      return <Clock className="h-5 w-5 text-primary" />;
    default:
      return <AlertCircle className="h-5 w-5 text-muted-foreground" />;
  }
};

const getStatusColor = (status: TaskStatus) => {
  switch (status) {
    case 'completed':
      return 'bg-accent/10 border-accent/20';
    case 'in-progress':
      return 'bg-primary/10 border-primary/20';
    default:
      return 'bg-secondary border-border';
  }
};

interface TaskCardProps {
  task: Task;
  milestoneId: string;
  onStatusChange: (status: TaskStatus) => void;
  onEdit: () => void;
  onDelete: () => void;
  onUpload: (files: File[]) => void;
  onAnalyze: (milestoneId: string, taskId: string) => void;
  onTaskUpdate: (task: Task) => void;
}

function TaskCard({
  task,
  milestoneId,
  onStatusChange,
  onEdit,
  onDelete,
  onUpload,
  onAnalyze,
  onTaskUpdate,
}: TaskCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragOverRef = useRef(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    dragOverRef.current = true;
  };

  const handleDragLeave = () => {
    dragOverRef.current = false;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    dragOverRef.current = false;
    const files = Array.from(e.dataTransfer.files);
    onUpload(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      onUpload(files);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteFile = (fileId: string) => {
    const updatedTask = {
      ...task,
      uploads: task.uploads?.filter((f) => f.id !== fileId) || [],
    };
    onTaskUpdate(updatedTask);
  };

  const toggleAnalysis = () => {
    onTaskUpdate({
      ...task,
      showAnalysis: !task.showAnalysis,
    });
  };

  return (
    <div
      className={`rounded-lg border border-border p-5 ${getStatusColor(task.status)} space-y-4`}
    >
      {/* Task Header */}
      <div className="flex items-start gap-4">
        <div className="pt-1">{getStatusIcon(task.status)}</div>
        <div className="flex-1">
          <p className="font-semibold text-foreground">{task.title}</p>
          {task.description && (
            <p className="mt-1 text-sm text-muted-foreground">{task.description}</p>
          )}
          {task.dueDate && (
            <p className="mt-1 text-xs text-muted-foreground">Due: {task.dueDate}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Select
            defaultValue={task.status}
            onValueChange={(newStatus) => onStatusChange(newStatus as TaskStatus)}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="not-started">Not Started</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" onClick={onEdit}>
                <Edit2 className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Task</DialogTitle>
                <DialogDescription>Update task details</DialogDescription>
              </DialogHeader>
              <EditTaskDialog
                task={task}
                onSave={(updatedTask) => {
                  onTaskUpdate(updatedTask);
                }}
              />
            </DialogContent>
          </Dialog>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Work Submission Section */}
      <div className="space-y-3 border-t border-border pt-4">
        <h4 className="text-sm font-medium text-foreground">Work Submission</h4>

        {/* Drag & Drop Upload Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`rounded-lg border-2 border-dashed p-4 text-center transition-colors ${
            dragOverRef.current
              ? 'border-primary/70 bg-primary/10'
              : 'border-primary/30 bg-primary/5 hover:border-primary/50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-5 w-5 text-primary/70" />
            <div className="text-xs text-muted-foreground">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-primary font-medium hover:underline"
              >
                Click to upload
              </button>
              {' or drag and drop'}
            </div>
            <p className="text-xs text-muted-foreground">
              PDF, Images, Documents, Code files (max 10MB each)
            </p>
          </div>
        </div>

        {/* Uploaded Files List */}
        {task.uploads && task.uploads.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">
              {task.uploads.length} file{task.uploads.length !== 1 ? 's' : ''} uploaded
            </p>
            <div className="space-y-2">
              {task.uploads.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between rounded-md bg-secondary/50 p-2 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <FileIcon className="h-4 w-4 text-primary/70" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-foreground font-medium">{file.fileName}</p>
                      <p className="text-muted-foreground">
                        {(file.fileSize / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteFile(file.id)}
                    className="text-destructive/70 hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analyze with AI Button */}
        {task.uploads && task.uploads.length > 0 && (
          <Button
            onClick={() => onAnalyze(milestoneId, task.id)}
            disabled={task.isAnalyzing}
            className="w-full gradient-primary text-primary-foreground shadow-glow hover:shadow-glow-md disabled:opacity-50"
          >
            {task.isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing with AI...
              </>
            ) : (
              'Analyze with AI'
            )}
          </Button>
        )}

        {/* AI Analysis Results */}
        {task.aiAnalysis && (
          <Collapsible open={task.showAnalysis} onOpenChange={toggleAnalysis}>
            <CollapsibleTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between border-primary/30 bg-primary/5 hover:bg-primary/10"
              >
                <span className="text-sm font-medium">AI Analysis Report</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    task.showAnalysis ? 'rotate-180' : ''
                  }`}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3 rounded-md border border-primary/20 bg-secondary/50 p-4">
              <TaskAnalysisReport
                report={task.aiAnalysis}
                taskName={task.title}
                onRerun={() => onAnalyze(milestoneId, task.id)}
              />
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>
    </div>
  );
}

interface EditTaskDialogProps {
  task: Task;
  onSave: (task: Task) => void;
}

function EditTaskDialog({ task, onSave }: EditTaskDialogProps) {
  const [editingTask, setEditingTask] = useState(task);

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Task Title</label>
        <Input
          value={editingTask.title}
          onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
          placeholder="Enter task title"
          className="mt-1"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Description</label>
        <Input
          value={editingTask.description || ''}
          onChange={(e) =>
            setEditingTask({ ...editingTask, description: e.target.value })
          }
          placeholder="Enter task description"
          className="mt-1"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Due Date</label>
        <Input
          type="date"
          value={editingTask.dueDate || ''}
          onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })}
          className="mt-1"
        />
      </div>
      <Button
        onClick={() => onSave(editingTask)}
        className="w-full gradient-primary text-primary-foreground shadow-glow hover:shadow-glow-md"
      >
        Save Task
      </Button>
    </div>
  );
}

export function ProjectChart() {
  const [milestones, setMilestones] = useState<Milestone[]>(mockMilestones);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string | null>(null);
  const [isAddingTask, setIsAddingTask] = useState(false);

  const updateTaskStatus = (milestoneId: string, taskId: string, newStatus: TaskStatus) => {
    setMilestones(
      milestones.map((m) => {
        if (m.id === milestoneId) {
          return {
            ...m,
            tasks: m.tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)),
            completedTasks: m.tasks.filter(
              (t) => (t.id === taskId ? newStatus === 'completed' : t.status === 'completed')
            ).length,
          };
        }
        return m;
      })
    );
  };

  const deleteTask = (milestoneId: string, taskId: string) => {
    setMilestones(
      milestones.map((m) => {
        if (m.id === milestoneId) {
          return {
            ...m,
            tasks: m.tasks.filter((t) => t.id !== taskId),
          };
        }
        return m;
      })
    );
  };

  const addTask = (milestoneId: string) => {
    setSelectedMilestoneId(milestoneId);
    setEditingTask({ id: Date.now().toString(), title: '', status: 'not-started', uploads: [], aiAnalysis: null });
    setIsAddingTask(true);
    setIsDialogOpen(true);
  };

  const saveTask = (milestoneId: string, task: Task) => {
    if (!task.title.trim()) return;

    setMilestones(
      milestones.map((m) => {
        if (m.id === milestoneId) {
          const existingIndex = m.tasks.findIndex((t) => t.id === task.id);
          if (existingIndex >= 0) {
            const updatedTasks = [...m.tasks];
            updatedTasks[existingIndex] = task;
            const completedCount = updatedTasks.filter((t) => t.status === 'completed').length;
            return { ...m, tasks: updatedTasks, completedTasks: completedCount };
          } else {
            const completedCount = [...m.tasks, task].filter((t) => t.status === 'completed').length;
            return { ...m, tasks: [...m.tasks, task], completedTasks: completedCount };
          }
        }
        return m;
      })
    );
    setEditingTask(null);
    setIsDialogOpen(false);
    setIsAddingTask(false);
    setSelectedMilestoneId(null);
  };

  const handleTaskUpload = (milestoneId: string, taskId: string, files: File[]) => {
    setMilestones(
      milestones.map((m) => {
        if (m.id === milestoneId) {
          return {
            ...m,
            tasks: m.tasks.map((t) => {
              if (t.id === taskId) {
                const newUploads = files.map((file) => ({
                  id: Date.now() + Math.random().toString(),
                  fileName: file.name,
                  fileSize: file.size,
                  uploadedAt: new Date(),
                  file,
                }));
                return {
                  ...t,
                  uploads: [...(t.uploads || []), ...newUploads],
                };
              }
              return t;
            }),
          };
        }
        return m;
      })
    );
  };

  const handleTaskAnalyze = async (milestoneId: string, taskId: string) => {
    // Find the task
    const milestone = milestones.find((m) => m.id === milestoneId);
    const task = milestone?.tasks.find((t) => t.id === taskId);
    
    if (!task || !task.uploads?.length) return;

    // Set analyzing state
    setMilestones(
      milestones.map((m) => {
        if (m.id === milestoneId) {
          return {
            ...m,
            tasks: m.tasks.map((t) => 
              t.id === taskId ? { ...t, isAnalyzing: true } : t
            ),
          };
        }
        return m;
      })
    );

    try {
      // Convert task uploads to UploadedFile format for analysis
      const uploadedFiles: UploadedFile[] = task.uploads.map((u) => ({
        id: u.id,
        name: u.fileName,
        type: detectFileType(u.fileName, u.file?.type),
        size: u.fileSize,
        uploadedDate: u.uploadedAt.toISOString(),
        file: u.file as File,
      }));

      // Call structured analysis
      const report = await analyzeTaskSubmission(uploadedFiles, task.title, task.description);
      
      // Update task with analysis report
      setMilestones(
        milestones.map((m) => {
          if (m.id === milestoneId) {
            return {
              ...m,
              tasks: m.tasks.map((t) =>
                t.id === taskId
                  ? {
                      ...t,
                      aiAnalysis: report,
                      isAnalyzing: false,
                      showAnalysis: true,
                    }
                  : t
              ),
            };
          }
          return m;
        })
      );
    } catch (error) {
      console.error('Analysis failed:', error);
      setMilestones(
        milestones.map((m) => {
          if (m.id === milestoneId) {
            return {
              ...m,
              tasks: m.tasks.map((t) =>
                t.id === taskId ? { ...t, isAnalyzing: false } : t
              ),
            };
          }
          return m;
        })
      );
    }
  };

  const handleTaskUpdate = (milestoneId: string, taskId: string, updatedTask: Task) => {
    setMilestones(
      milestones.map((m) => {
        if (m.id === milestoneId) {
          return {
            ...m,
            tasks: m.tasks.map((t) => (t.id === taskId ? updatedTask : t)),
          };
        }
        return m;
      })
    );
  };

  const projectProgress = Math.round(
    (milestones.reduce((acc, m) => acc + m.completedTasks, 0) /
      milestones.reduce((acc, m) => acc + m.tasks.length, 0)) *
      100
  );

  return (
    <div className="space-y-8">
      {/* Overall Progress */}
      <Card className="border-border bg-gradient-to-br from-primary/5 to-accent/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-foreground">Project Progress</CardTitle>
              <CardDescription>Overall milestone completion</CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
                {projectProgress}%
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-3 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full gradient-primary shadow-glow transition-all duration-500"
              style={{ width: `${projectProgress}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Milestones */}
      <div className="space-y-6">
        {milestones.map((milestone) => {
          const progress = milestone.tasks.length > 0 
            ? Math.round((milestone.completedTasks / milestone.tasks.length) * 100)
            : 0;

          return (
            <Card key={milestone.id} className="border-border bg-card hover:shadow-soft transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-foreground">{milestone.title}</CardTitle>
                    <CardDescription>
                      {milestone.completedTasks} of {milestone.tasks.length} tasks completed
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    {progress}%
                  </Badge>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full gradient-primary shadow-glow transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {milestone.tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    milestoneId={milestone.id}
                    onStatusChange={() => updateTaskStatus(milestone.id, task.id, task.status)}
                    onEdit={() => {
                      setSelectedMilestoneId(milestone.id);
                      setEditingTask(task);
                      setIsAddingTask(false);
                      setIsDialogOpen(true);
                    }}
                    onDelete={() => deleteTask(milestone.id, task.id)}
                    onUpload={(files) => handleTaskUpload(milestone.id, task.id, files)}
                    onAnalyze={(milestoneId, taskId) => handleTaskAnalyze(milestoneId, taskId)}
                    onTaskUpdate={(updatedTask) => handleTaskUpdate(milestone.id, task.id, updatedTask)}
                  />
                ))}

                <Button
                  variant="outline"
                  className="w-full border-dashed border-primary/30 hover:bg-primary/5 hover:border-primary/50 text-primary"
                  onClick={() => addTask(milestone.id)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Task
                </Button>
              </CardContent>
            </Card>
          );
        })}

        {/* Add Task Dialog */}
        <Dialog open={isAddingTask && isDialogOpen} onOpenChange={(open) => {
          if (!open) {
            setIsAddingTask(false);
            setIsDialogOpen(false);
            setEditingTask(null);
            setSelectedMilestoneId(null);
          } else {
            setIsAddingTask(true);
            setIsDialogOpen(true);
          }
        }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
              <DialogDescription>Create a new task for your milestone</DialogDescription>
            </DialogHeader>
            {editingTask && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Task Title</label>
                  <Input
                    value={editingTask.title}
                    onChange={(e) =>
                      setEditingTask({ ...editingTask, title: e.target.value })
                    }
                    placeholder="Enter task title"
                    className="mt-1"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Input
                    value={editingTask.description || ''}
                    onChange={(e) =>
                      setEditingTask({ ...editingTask, description: e.target.value })
                    }
                    placeholder="Enter task description"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Due Date</label>
                  <Input
                    type="date"
                    value={editingTask.dueDate || ''}
                    onChange={(e) =>
                      setEditingTask({ ...editingTask, dueDate: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>
                <Button
                  onClick={() => selectedMilestoneId && saveTask(selectedMilestoneId, editingTask)}
                  disabled={!editingTask.title.trim()}
                  className="w-full gradient-primary text-primary-foreground shadow-glow hover:shadow-glow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Task
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
