import { useState } from 'react';
import { Roadmap, RoadmapModule } from '@/types';
import { useUserStore } from '@/stores/userStore';
import { ModuleNode } from './ModuleNode';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CheckCircle2, Circle, Trophy, ArrowRight, Zap, Target, BookOpen, Star, ExternalLink } from 'lucide-react';

interface GamifiedRoadmapProps {
  roadmap: Roadmap;
}

export function GamifiedRoadmap({ roadmap }: GamifiedRoadmapProps) {
  const { profile, completeSkill, addXP } = useUserStore();
  const { toast } = useToast();
  const [selectedModule, setSelectedModule] = useState<RoadmapModule | null>(null);

  if (!profile) return null;

  // Helper to generate a stable unique skill ID
  const getSkillId = (moduleId: string, skill: string) => {
    const slug = skill.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
    return `${moduleId}-${slug}`;
  };

  // Helper to check if a single skill is completed
  const isSkillCompleted = (moduleId: string, skill: string) => {
    return profile.completedSkills.includes(getSkillId(moduleId, skill));
  };

  // Helper to count completed skills in a module
  const getCompletedSkillsCount = (module: RoadmapModule) => {
    return module.skills.filter((s) => isSkillCompleted(module.id, s)).length;
  };

  // Helper to check if a module is fully completed
  const isModuleCompleted = (module: RoadmapModule) => {
    if (module.skills.length === 0) return true;
    return module.skills.every((s) => isSkillCompleted(module.id, s));
  };

  // Get module status (locked, available, completed)
  const getModuleStatus = (index: number) => {
    const currentModule = roadmap.modules[index];
    if (isModuleCompleted(currentModule)) {
      return 'completed' as const;
    }
    
    // First module is always unlocked
    if (index === 0) {
      return 'available' as const;
    }

    // Unlocked if previous is completed
    const prevModule = roadmap.modules[index - 1];
    if (isModuleCompleted(prevModule)) {
      return 'available' as const;
    }

    return 'locked' as const;
  };

  const handleCompleteSkill = (moduleId: string, skill: string) => {
    const skillId = getSkillId(moduleId, skill);
    if (profile.completedSkills.includes(skillId)) return;

    completeSkill(skillId);
    addXP(100);

    toast({
      title: 'XP Earned! 🔥',
      description: `Completed "${skill}" (+100 XP)`,
    });
  };

  return (
    <div className="relative flex flex-col items-center py-12 px-4 space-y-16 max-w-4xl mx-auto">
      {/* SVG Connecting Lines for Roadmap Path */}
      <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1.5 pointer-events-none block z-0">
        <div className="w-full h-full bg-gradient-to-b from-primary/30 via-accent/30 to-muted/20 rounded-full" />
      </div>

      {roadmap.modules.map((module, index) => {
        const status = getModuleStatus(index);
        const completedSkills = getCompletedSkillsCount(module);
        const totalSkills = module.skills.length;

        return (
          <div key={module.id} className="relative z-10 w-full">
            <ModuleNode
              moduleNumber={index + 1}
              title={module.title}
              description={module.description}
              completedSkillsCount={completedSkills}
              totalSkillsCount={totalSkills}
              status={status}
              onClick={() => setSelectedModule(module)}
            />
          </div>
        );
      })}

      {/* Module Detail Dialog */}
      <Dialog open={!!selectedModule} onOpenChange={(open) => !open && setSelectedModule(null)}>
        {selectedModule && (
          <DialogContent className="w-full h-full md:h-auto max-w-none md:max-w-xl rounded-none md:rounded-2xl border-x-0 md:border border-border bg-card p-6 overflow-y-auto max-h-screen md:max-h-[90vh] flex flex-col">
            <DialogHeader className="gap-2">
              <span className="text-xs font-mono font-bold tracking-widest text-primary uppercase">
                Module Details
              </span>
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                {selectedModule.title}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground mt-1">
                {selectedModule.description}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 mt-4">
              {/* Skills Tree / List */}
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-muted-foreground uppercase tracking-wider">
                  <Star className="w-4 h-4 text-amber-500" />
                  <span>Skills To Master (+100 XP Each)</span>
                </div>
                <div className="grid gap-2">
                  {selectedModule.skills.map((skill) => {
                    const completed = isSkillCompleted(selectedModule.id, skill);
                    return (
                      <div
                        key={skill}
                        onClick={() => !completed && handleCompleteSkill(selectedModule.id, skill)}
                        className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
                          completed
                            ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400 cursor-default'
                            : 'bg-secondary/40 border-border hover:border-primary/50 cursor-pointer text-foreground'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {completed ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                          ) : (
                            <Circle className="w-5 h-5 text-muted-foreground hover:text-primary shrink-0" />
                          )}
                          <span className="text-sm font-medium">{skill}</span>
                        </div>
                        {!completed && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-xs text-primary font-mono hover:bg-primary/10"
                          >
                            <Zap className="w-3.5 h-3.5 mr-1" />
                            Claim XP
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Practical Projects Checklist */}
              {selectedModule.projects && selectedModule.projects.length > 0 && (
                <div className="space-y-3 pt-2 border-t border-border">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-muted-foreground uppercase tracking-wider">
                    <Trophy className="w-4 h-4 text-primary" />
                    <span>Recommended Projects</span>
                  </div>
                  <div className="space-y-2">
                    {selectedModule.projects.map((project, i) => (
                      <div key={i} className="flex gap-3 bg-secondary/20 p-3 rounded-lg border border-border/50 text-sm">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary font-mono text-xs shrink-0 mt-0.5">
                          {i + 1}
                        </div>
                        <div className="flex-1 text-muted-foreground">
                          {project}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Learning Resources */}
              <div className="space-y-3 pt-2 border-t border-border">
                <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-muted-foreground uppercase tracking-wider">
                  <BookOpen className="w-4 h-4 text-primary" />
                  <span>Learning Resources</span>
                </div>
                {selectedModule.resources && selectedModule.resources.length > 0 ? (
                  <div className="grid gap-2">
                    {selectedModule.resources.map((resource, i) => (
                      <a
                        key={i}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-secondary/10 hover:border-primary/50 hover:bg-secondary/20 transition-all duration-200 text-sm group"
                      >
                        <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                          {resource.title}
                        </span>
                        <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 ml-2" />
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic pl-1">Resources coming soon</p>
                )}
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
