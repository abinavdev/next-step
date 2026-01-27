import { useFeatureGate } from '@/hooks/useFeatureGate';
import { FeatureGate } from '@/components/FeatureGate';
import { ProjectChart } from '@/components/roadmap/ProjectChart';
import { Briefcase } from 'lucide-react';

export default function ProjectTools() {
  const { hasFeature } = useFeatureGate();

  if (!hasFeature('project-chart')) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Project Tools</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your projects with guided milestones and task tracking
          </p>
        </div>
        <FeatureGate
          feature="project-chart"
          required="project"
          fallbackMessage="Project Tools are available in the Project Assistance plan and above. Unlock interactive charts, milestone tracking, and task management."
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header with Icon */}
      <div className="flex items-start justify-between">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl gradient-primary shadow-glow">
              <Briefcase className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Project Tools</h1>
              <p className="mt-1 text-muted-foreground">
                Manage your projects with guided milestones and task tracking. Submit work and get AI analysis on each task.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Project Chart with Integrated Work Submission */}
      <ProjectChart />
    </div>
  );
}
