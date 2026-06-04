import { cn } from '@/lib/utils';
import { CheckCircle2, Lock, BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ModuleNodeProps {
  moduleNumber: number;
  title: string;
  description: string;
  completedSkillsCount: number;
  totalSkillsCount: number;
  status: 'locked' | 'available' | 'completed';
  onClick: () => void;
}

export function ModuleNode({
  moduleNumber,
  title,
  description,
  completedSkillsCount,
  totalSkillsCount,
  status,
  onClick,
}: ModuleNodeProps) {
  const isLocked = status === 'locked';
  const isCompleted = status === 'completed';
  const isAvailable = status === 'available';

  const progressPercent = totalSkillsCount > 0 
    ? Math.round((completedSkillsCount / totalSkillsCount) * 100) 
    : 0;

  return (
    <div className="relative flex flex-col items-center group w-full max-w-md mx-auto">
      {/* Connector Line above node (except for module 1, handled in parent container) */}
      
      <Card
        onClick={() => !isLocked && onClick()}
        className={cn(
          "w-full border-2 transition-all duration-300 backdrop-blur-md relative overflow-hidden",
          isLocked && "opacity-45 bg-secondary/30 border-muted grayscale cursor-not-allowed",
          isCompleted && "bg-emerald-950/20 border-emerald-500/60 shadow-glow-emerald cursor-pointer hover:border-emerald-400 hover:shadow-glow-emerald-lg",
          isAvailable && "bg-primary/10 border-primary/60 shadow-glow cursor-pointer hover:border-primary hover:scale-[1.02] hover:shadow-glow-md animate-pulse-glow"
        )}
      >
        <CardContent className="p-5 flex items-start gap-4">
          {/* RPG Status Badge / Icon */}
          <div
            className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center border-2 shrink-0 transition-colors duration-300",
              isLocked && "bg-background/40 border-muted-foreground/30 text-muted-foreground",
              isCompleted && "bg-emerald-500/20 border-emerald-400 text-emerald-400",
              isAvailable && "bg-primary/20 border-primary text-primary"
            )}
          >
            {isLocked ? (
              <Lock className="w-5 h-5" />
            ) : isCompleted ? (
              <CheckCircle2 className="w-6 h-6" />
            ) : (
              <BookOpen className="w-5 h-5" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <span
              className={cn(
                "text-[10px] font-mono tracking-widest uppercase font-semibold",
                isLocked && "text-muted-foreground",
                isCompleted && "text-emerald-400",
                isAvailable && "text-primary"
              )}
            >
              Module {String(moduleNumber).padStart(2, '0')}
            </span>
            <h3 className="text-base font-bold text-foreground truncate mt-0.5">
              {title}
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
              {description}
            </p>

            {/* Progress bar */}
            {!isLocked && (
              <div className="mt-3 space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                  <span>Progress</span>
                  <span>{completedSkillsCount}/{totalSkillsCount} Skills ({progressPercent}%)</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      isCompleted ? "bg-emerald-500" : "bg-primary"
                    )}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
