import { cn } from '@/lib/utils';
import { Trophy, Zap, Star, Award } from 'lucide-react';

interface LevelBadgeProps {
  level: number;
  xp: number;
  className?: string;
}

export function LevelBadge({ level, xp, className }: LevelBadgeProps) {
  const xpPerLevel = 500;
  const currentLevelXP = xp % xpPerLevel;
  const progressPercent = (currentLevelXP / xpPerLevel) * 100;

  const getLevelIcon = () => {
    if (level >= 10) return Trophy;
    if (level >= 5) return Award;
    if (level >= 3) return Star;
    return Zap;
  };

  const LevelIcon = getLevelIcon();

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="relative">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary shadow-glow">
          <LevelIcon className="h-6 w-6 text-primary-foreground" />
        </div>
        <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground shadow-sm">
          {level}
        </div>
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">Level {level}</span>
          <span className="text-xs text-muted-foreground">
            {currentLevelXP}/{xpPerLevel} XP
          </span>
        </div>
        <div className="mt-1 h-2 overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full gradient-accent transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
