import { cn } from '@/lib/utils';
import { Check, Lock, Play, Clock } from 'lucide-react';
import type { Skill } from '@/types';

interface SkillNodeProps {
  skill: Skill;
  onClick?: () => void;
  className?: string;
}

export function SkillNode({ skill, onClick, className }: SkillNodeProps) {
  const getStatusStyles = () => {
    if (skill.isCompleted) {
      return 'border-accent bg-accent/10 shadow-accent-glow';
    }
    if (skill.isUnlocked) {
      return 'border-primary bg-primary/5 shadow-glow cursor-pointer hover:scale-105 hover:shadow-lg';
    }
    return 'border-border bg-muted/50 opacity-60';
  };

  const getStatusIcon = () => {
    if (skill.isCompleted) {
      return (
        <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-accent shadow-sm">
          <Check className="h-3.5 w-3.5 text-accent-foreground" />
        </div>
      );
    }
    if (!skill.isUnlocked) {
      return (
        <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-muted shadow-sm">
          <Lock className="h-3 w-3 text-muted-foreground" />
        </div>
      );
    }
    return (
      <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full gradient-primary shadow-glow animate-node-pulse">
        <Play className="h-3 w-3 text-primary-foreground" />
      </div>
    );
  };

  const getCategoryColor = () => {
    switch (skill.category) {
      case 'technical':
        return 'bg-primary/10 text-primary';
      case 'soft':
        return 'bg-accent/10 text-accent';
      case 'certification':
        return 'bg-warning/10 text-warning';
      case 'course':
        return 'bg-secondary text-secondary-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div
      className={cn(
        'relative rounded-2xl border-2 p-4 transition-all duration-300',
        getStatusStyles(),
        className
      )}
      onClick={skill.isUnlocked && !skill.isCompleted ? onClick : undefined}
      style={{
        left: skill.position.x,
        top: skill.position.y,
      }}
    >
      {getStatusIcon()}

      <div className={cn('mb-2 inline-block rounded-md px-2 py-0.5 text-xs font-medium', getCategoryColor())}>
        {skill.category}
      </div>

      <h4 className="font-semibold text-foreground">{skill.name}</h4>
      <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
        {skill.description}
      </p>

      <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
        <Clock className="h-3 w-3" />
        <span>{skill.estimatedHours}h</span>
        <span className="ml-auto capitalize text-foreground/70">{skill.difficulty}</span>
      </div>
    </div>
  );
}
