import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Upload, File, FileText, Trash2, Calendar, Lock } from 'lucide-react';
import { FeatureGate } from '@/components/FeatureGate';
import type { UploadedFile } from '@/utils/aiAnalysis';

export type { UploadedFile };

interface WorkUploadProps {
  onAnalyze?: (files: UploadedFile[]) => void;
  canUpload: boolean;
  subscriptionLevel: 'free' | 'project' | 'mentor';
}

const FILE_TYPES = {
  pdf: { extensions: ['.pdf'], icon: '📄', label: 'PDF' },
  image: { extensions: ['.jpg', '.jpeg', '.png'], icon: '🖼️', label: 'Image' },
  document: { extensions: ['.docx', '.doc'], icon: '📝', label: 'Document' },
  archive: { extensions: ['.zip', '.rar'], icon: '📦', label: 'Archive' },
  text: { extensions: ['.txt'], icon: '📋', label: 'Text' },
};

export function WorkUploadSection({ onAnalyze, canUpload, subscriptionLevel }: WorkUploadProps) {
  const [uploads, setUploads] = useState<UploadedFile[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileType = (fileName: string): UploadedFile['type'] => {
    const ext = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
    if (FILE_TYPES.pdf.extensions.includes(ext)) return 'pdf';
    if (FILE_TYPES.image.extensions.includes(ext)) return 'image';
    if (FILE_TYPES.document.extensions.includes(ext)) return 'document';
    if (FILE_TYPES.archive.extensions.includes(ext)) return 'archive';
    if (FILE_TYPES.text.extensions.includes(ext)) return 'text';
    return 'text';
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (!files) return;

    const newUploads: UploadedFile[] = [];
    Array.from(files).forEach((file) => {
      const newUpload: UploadedFile = {
        id: Date.now().toString() + Math.random(),
        name: file.name,
        type: getFileType(file.name),
        size: file.size,
        uploadedDate: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
        file,
      };
      newUploads.push(newUpload);
    });

    setUploads((prev) => {
      const updated = [...prev, ...newUploads];
      // Auto-trigger analysis when files are uploaded
      if (onAnalyze && updated.length > 0) {
        setTimeout(() => onAnalyze(updated), 300);
      }
      return updated;
    });

    // Reset input
    e.currentTarget.value = '';
  };

  const deleteUpload = (id: string) => {
    setUploads((prev) => prev.filter((u) => u.id !== id));
    setDeleteId(null);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (type: UploadedFile['type']) => {
    const icons: Record<UploadedFile['type'], React.ReactNode> = {
      pdf: <File className="h-5 w-5 text-red-500" />,
      image: <File className="h-5 w-5 text-blue-500" />,
      document: <FileText className="h-5 w-5 text-blue-600" />,
      archive: <File className="h-5 w-5 text-yellow-600" />,
      text: <FileText className="h-5 w-5 text-gray-500" />,
    };
    return icons[type];
  };

  if (!canUpload) {
    return (
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Work Submission / Progress Evidence</CardTitle>
          <CardDescription>Upload your work for AI analysis and progress tracking</CardDescription>
        </CardHeader>
        <CardContent>
          <FeatureGate
            feature="project-chart"
            required="project"
            fallbackMessage="Work upload and AI analysis are available in the Project Assistance plan and above."
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-foreground">Work Submission / Progress Evidence</CardTitle>
            <CardDescription>Upload your work for AI analysis and progress tracking</CardDescription>
          </div>
          <div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.docx,.doc,.zip,.rar,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="gradient-primary text-primary-foreground shadow-glow hover:shadow-glow-md"
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Work
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {uploads.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-secondary/30 py-8 text-center">
            <Upload className="mb-3 h-10 w-10 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
              No files uploaded yet. Upload your work to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {uploads.map((upload) => (
              <div
                key={upload.id}
                className="flex items-center justify-between rounded-lg border border-border bg-background p-4 hover:bg-background/80 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                    {getFileIcon(upload.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-medium text-foreground text-sm">{upload.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {FILE_TYPES[upload.type]?.label || 'File'}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{formatFileSize(upload.size)}</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {upload.uploadedDate}
                      </span>
                    </div>
                  </div>
                </div>
                <AlertDialog>
                  <button
                    onClick={() => setDeleteId(upload.id)}
                    className="ml-2 p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4 text-destructive hover:text-destructive/80" />
                  </button>
                  {deleteId === upload.id && (
                    <AlertDialogContent>
                      <AlertDialogTitle>Delete Upload?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to remove {upload.name}? This cannot be undone.
                      </AlertDialogDescription>
                      <div className="flex gap-2">
                        <AlertDialogCancel onClick={() => setDeleteId(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteUpload(upload.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </div>
                    </AlertDialogContent>
                  )}
                </AlertDialog>
              </div>
            ))}
          </div>
        )}

        {subscriptionLevel === 'project' && uploads.length > 0 && (
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
            <p className="text-xs text-primary/80 flex items-center gap-2">
              <Lock className="h-3 w-3" />
              Mentor review available only in Mentor + Assistance plan. Upgrade to get personalized feedback.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
