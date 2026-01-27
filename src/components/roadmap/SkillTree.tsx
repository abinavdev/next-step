import { useState } from 'react';
import { cn } from '@/lib/utils';
import { SkillNode } from './SkillNode';
import type { Skill } from '@/types';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface SkillTreeProps {
  skills: Skill[];
  onSkillClick?: (skill: Skill) => void;
  className?: string;
}

export function SkillTree({ skills, onSkillClick, className }: SkillTreeProps) {
  const [scale, setScale] = useState(1);

  const handleZoomIn = () => setScale((s) => Math.min(s + 0.2, 1.5));
  const handleZoomOut = () => setScale((s) => Math.max(s - 0.2, 0.5));
  const handleReset = () => setScale(1);

  // Group skills by tier/level
  const tiers = skills.reduce((acc, skill) => {
    const tier = Math.floor(skill.position.y / 150);
    if (!acc[tier]) acc[tier] = [];
    acc[tier].push(skill);
    return acc;
  }, {} as Record<number, Skill[]>);

  return (
    <div className={cn('relative rounded-2xl border border-border bg-card', className)}>
      {/* Controls */}
      <div className="absolute right-4 top-4 z-10 flex items-center gap-1 rounded-lg border border-border bg-background/80 p-1 backdrop-blur-sm">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleZoomOut}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleReset}>
          <Maximize2 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleZoomIn}>
          <ZoomIn className="h-4 w-4" />
        </Button>
      </div>

      {/* Tree Container */}
      <div className="h-[500px] overflow-auto p-8">
        <div
          className="relative min-h-full transition-transform duration-300"
          style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}
        >
          {/* Connection Lines */}
          <svg className="absolute inset-0 h-full w-full pointer-events-none">
            {skills.map((skill) =>
              skill.prerequisites.map((prereqId) => {
                const prereq = skills.find((s) => s.id === prereqId);
                if (!prereq) return null;
                
                const startX = prereq.position.x + 80;
                const startY = prereq.position.y + 60;
                const endX = skill.position.x + 80;
                const endY = skill.position.y;
                
                const midY = (startY + endY) / 2;
                
                return (
                  <path
                    key={`${prereqId}-${skill.id}`}
                    d={`M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`}
                    stroke={skill.isUnlocked ? 'hsl(var(--primary))' : 'hsl(var(--border))'}
                    strokeWidth="2"
                    strokeDasharray={skill.isUnlocked ? 'none' : '4 4'}
                    fill="none"
                    className="transition-all duration-300"
                  />
                );
              })
            )}
          </svg>

          {/* Skill Nodes */}
          {Object.entries(tiers).map(([tier, tierSkills]) => (
            <div
              key={tier}
              className="flex items-center justify-center gap-8 py-6"
              style={{ marginTop: Number(tier) * 150 }}
            >
              {tierSkills.map((skill) => (
                <SkillNode
                  key={skill.id}
                  skill={skill}
                  onClick={() => onSkillClick?.(skill)}
                  className="w-44"
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="border-t border-border px-6 py-4">
        <div className="flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-accent" />
            <span className="text-muted-foreground">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full gradient-primary shadow-glow" />
            <span className="text-muted-foreground">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-muted" />
            <span className="text-muted-foreground">Locked</span>
          </div>
        </div>
      </div>
    </div>
  );
}
