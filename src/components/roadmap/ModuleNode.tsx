import { cn } from '@/lib/utils';
import { CheckCircle2, Lock, Sparkles, Clock, Target } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

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

  // Calculate estimated duration: 2 hours per skill + 2 hours base
  const estimatedHours = totalSkillsCount * 2 + 2;

  // Variants for staggered entrance animation
  const cardVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.98 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: 'spring', stiffness: 100, damping: 18 }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      whileHover={!isLocked ? { scale: 1.015, y: -2 } : {}}
      transition={{ type: 'spring', stiffness: 350, damping: 20 }}
      className="w-full"
    >
      <Card
        onClick={() => !isLocked && onClick()}
        className={cn(
          "w-full border backdrop-blur-md transition-all duration-300 relative overflow-hidden cursor-pointer select-none",
          isLocked && "opacity-40 bg-zinc-950/20 border-zinc-900/50 grayscale cursor-not-allowed",
          isCompleted && "bg-emerald-950/5 border-emerald-500/20 hover:border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.03)]",
          isAvailable && "bg-card border-red-500/60 hover:border-red-500"
        )}
        style={{
          boxShadow: isAvailable 
            ? '0 0 20px rgba(239, 68, 68, 0.12), inset 0 0 10px rgba(239, 68, 68, 0.03)' 
            : undefined
        }}
      >
        {/* Glow pulsing effect for active module */}
        {isAvailable && (
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-red-900/5 to-transparent pointer-events-none"
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}

        <CardContent className="p-5 flex items-start gap-4 relative z-10">
          {/* Status Icon Badge */}
          <div
            className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center border shrink-0 transition-all duration-300 shadow-sm",
              isLocked && "bg-zinc-900/50 border-zinc-800 text-zinc-600",
              isCompleted && "bg-emerald-500/10 border-emerald-500/30 text-emerald-500",
              isAvailable && "bg-red-500/10 border-red-500/50 text-red-500 shadow-glow"
            )}
          >
            {isLocked ? (
              <Lock className="w-5 h-5" />
            ) : isCompleted ? (
              <CheckCircle2 className="w-6 h-6" />
            ) : (
              <Sparkles className="w-5 h-5 animate-pulse" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span
                className={cn(
                  "text-[10px] font-mono tracking-widest uppercase font-bold",
                  isLocked && "text-zinc-600",
                  isCompleted && "text-emerald-500",
                  isAvailable && "text-red-500"
                )}
              >
                Module {String(moduleNumber).padStart(2, '0')}
              </span>
              
              {!isLocked && (
                <div className="flex items-center gap-1 text-[10px] text-zinc-400 bg-zinc-900/50 px-2 py-0.5 rounded-full border border-zinc-800/80 font-mono">
                  <Clock className="w-3 h-3 text-red-500 shrink-0" />
                  <span>{estimatedHours}h</span>
                </div>
              )}
            </div>
            
            <h3 className="text-sm md:text-base font-bold text-zinc-100 truncate mt-1">
              {title}
            </h3>
            
            <p className="text-xs text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
              {description}
            </p>

            {/* Progress Bar */}
            {!isLocked && (
              <div className="mt-4 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
                  <span className="flex items-center gap-1">
                    <Target className="w-3 h-3 text-red-500" />
                    Skills Mastered
                  </span>
                  <span>{completedSkillsCount}/{totalSkillsCount} ({progressPercent}%)</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-zinc-950 overflow-hidden border border-zinc-800/50">
                  <motion.div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      isCompleted 
                        ? "bg-emerald-500" 
                        : "bg-red-500"
                    )}
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
