import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  variant?: 'default' | 'primary' | 'accent';
  className?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  variant = 'default',
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-border bg-card p-6 transition-all duration-200 hover:shadow-medium',
        variant === 'primary' && 'border-primary/20 bg-primary/5',
        variant === 'accent' && 'border-accent/20 bg-accent/5',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
          {subtitle && (
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          )}
          {trend && trendValue && (
            <div
              className={cn(
                'mt-2 inline-flex items-center gap-1 text-xs font-medium',
                trend === 'up' && 'text-accent',
                trend === 'down' && 'text-destructive',
                trend === 'neutral' && 'text-muted-foreground'
              )}
            >
              {trend === 'up' && '↑'}
              {trend === 'down' && '↓'}
              {trendValue}
            </div>
          )}
        </div>
        <div
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-xl',
            variant === 'default' && 'bg-secondary',
            variant === 'primary' && 'gradient-primary shadow-glow',
            variant === 'accent' && 'gradient-accent shadow-accent-glow'
          )}
        >
          <Icon
            className={cn(
              'h-6 w-6',
              variant === 'default' && 'text-foreground',
              (variant === 'primary' || variant === 'accent') && 'text-primary-foreground'
            )}
          />
        </div>
      </div>
    </div>
  );
}
