import { cn } from '@/lib/utils';
import {
  ArrowRight,
  Clock,
  Star,
  Code,
  BarChart3,
  Target,
  Settings,
  Palette,
  Brain,
  Shield,
  Cloud,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CareerPath } from '@/types';

interface CareerCardProps {
  career: CareerPath;
  className?: string;
  onSelect?: () => void;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Code,
  BarChart3,
  Target,
  Settings,
  Palette,
  Brain,
  Shield,
  Cloud,
};

export function CareerCard({ career, className, onSelect }: CareerCardProps) {
  const getMatchColor = (percentage: number) => {
    if (percentage >= 80) return 'text-accent';
    if (percentage >= 60) return 'text-primary';
    return 'text-muted-foreground';
  };

  const IconComponent = iconMap[career.icon];

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-medium',
        className
      )}
    >
      {/* Match Badge */}
      <div className="absolute right-4 top-4">
        <div
          className={cn(
            'flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-sm font-semibold',
            getMatchColor(career.matchPercentage)
          )}
        >
          <Star className="h-3.5 w-3.5" />
          {career.matchPercentage}% Match
        </div>
      </div>

      {/* Icon - No Container */}
      {IconComponent ? (
        <IconComponent className="h-7 w-7 text-primary" />
      ) : (
        <span className="text-2xl">{career.icon}</span>
      )}

      {/* Content */}
      <h3 className="mt-4 text-xl font-semibold text-foreground">{career.title}</h3>
      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
        {career.description}
      </p>

      {/* Stats */}
      <div className="mt-4 flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <span className="font-medium text-foreground">{career.averageSalary}</span>
          <span>avg salary</span>
        </div>
        <div className="flex items-center gap-1.5 text-accent">
          <span className="font-medium">{career.growthRate}</span>
          <span>growth</span>
        </div>
      </div>

      {/* Skills Preview */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {career.requiredSkills.slice(0, 3).map((skill) => (
          <span
            key={skill}
            className="rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground"
          >
            {skill}
          </span>
        ))}
        {career.requiredSkills.length > 3 && (
          <span className="rounded-md bg-secondary px-2 py-1 text-xs font-medium text-muted-foreground">
            +{career.requiredSkills.length - 3} more
          </span>
        )}
      </div>

      {/* CTA */}
      <Button
        variant="ghost"
        className="mt-4 w-full justify-between group-hover:bg-primary/5"
        onClick={onSelect}
      >
        View Roadmap
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Button>
    </div>
  );
}
