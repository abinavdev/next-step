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
        'rounded-2xl border border-border bg-card p-3 lg:p-6 h-[100px] lg:h-auto flex flex-col justify-center transition-all duration-200 hover:shadow-medium overflow-hidden',
        variant === 'primary' && 'border-red-500/20 bg-red-500/5',
        variant === 'accent' && 'border-red-500/20 bg-red-500/5',
        className
      )}
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex-1 min-w-0 pr-1">
          <p className="text-[9px] lg:text-xs font-semibold text-zinc-500 truncate uppercase tracking-wider">{title}</p>
          <p className="mt-0.5 lg:mt-2 text-base lg:text-3xl font-bold text-foreground truncate">{value}</p>
          {subtitle && (
            <p className="hidden lg:block mt-1 text-xs text-muted-foreground truncate">{subtitle}</p>
          )}
          {trend && trendValue && (
            <div
              className={cn(
                'hidden lg:inline-flex mt-2 items-center gap-1 text-xs font-medium',
                trend === 'up' && 'text-red-500',
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
            'flex h-8 w-8 lg:h-12 lg:w-12 items-center justify-center rounded-lg lg:rounded-xl shrink-0 transition-all border',
            variant === 'default' && 'bg-secondary border-zinc-800',
            (variant === 'primary' || variant === 'accent') && 'bg-red-500/10 text-red-500 border-red-500/20 shadow-glow'
          )}
        >
          <Icon
            className={cn(
              'h-4 w-4 lg:h-6 lg:w-6 text-slate-350',
              (variant === 'primary' || variant === 'accent') && 'text-red-500'
            )}
          />
        </div>
      </div>
    </div>
  );
}
