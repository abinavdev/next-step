import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
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
import { 
  CheckCircle2, 
  Circle, 
  Trophy, 
  Zap, 
  Target, 
  BookOpen, 
  Star, 
  ExternalLink,
  Award,
  Sparkles,
  Play,
  Lock,
  Flame,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface GamifiedRoadmapProps {
  roadmap: Roadmap;
}

export function GamifiedRoadmap({ roadmap }: GamifiedRoadmapProps) {
  const { profile, completeSkill, addXP } = useUserStore();
  const { toast } = useToast();
  const [selectedModule, setSelectedModule] = useState<RoadmapModule | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Monitor viewport size for mobile/desktop layout switches
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!profile) return null;

  // Helper to generate unique skill ID
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

  // Get index of active module (1-indexed for positioning)
  const getActiveModuleIndex = () => {
    for (let i = 0; i < roadmap.modules.length; i++) {
      if (getModuleStatus(i) === 'available') {
        return i + 1;
      }
    }
    const allCompleted = roadmap.modules.every((m) => isModuleCompleted(m));
    if (allCompleted) {
      return roadmap.modules.length + 1; // Finish card
    }
    return 1;
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

  // Calculations for overall completion
  const totalSkills = roadmap.modules.reduce((sum, m) => sum + m.skills.length, 0);
  const completedSkillsTotal = roadmap.modules.reduce((sum, m) => sum + getCompletedSkillsCount(m), 0);
  const completionPercentage = totalSkills > 0 ? Math.round((completedSkillsTotal / totalSkills) * 100) : 0;

  // Geometry configuration for Desktop S-curve road (flowing TOP-TO-BOTTOM)
  const N = roadmap.modules.length;
  const dy = 280; // Vertical step distance
  const H = (N + 1) * dy + 220; // Total height of the road map container

  const getCoordinates = (index: number) => {
    // index runs from 0 (Start at top) to N+1 (Finish at bottom)
    const y = 110 + index * dy;
    let x = 400; // Center coordinate in an 800-wide viewBox
    if (index === 0 || index === N + 1) {
      x = 400;
    } else {
      // Alternate left and right bends
      x = index % 2 === 1 ? 220 : 580;
    }
    return { x, y };
  };

  // Generate S-curve path flowing top-to-bottom
  const generatePath = () => {
    const start = getCoordinates(0);
    let path = `M ${start.x} ${start.y}`;
    for (let i = 0; i <= N; i++) {
      const pCurrent = getCoordinates(i);
      const pNext = getCoordinates(i + 1);
      
      // Control points extend downwards vertically
      const cp1x = pCurrent.x;
      const cp1y = pCurrent.y + dy * 0.45;
      const cp2x = pNext.x;
      const cp2y = pNext.y - dy * 0.45;
      
      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${pNext.x} ${pNext.y}`;
    }
    return path;
  };

  const roadPathD = generatePath();
  const activeModuleIndex = getActiveModuleIndex();
  // Progress fraction of the road lit up
  const progressFraction = activeModuleIndex / (N + 1);
  const activeCoord = getCoordinates(activeModuleIndex - 1);

  // Stagger variants for module cards entry animation
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  // Static achievement badges descriptions
  const getBadgeDetails = (j: number) => {
    const badges = [
      { name: "Initiate 🎯", desc: "Started the journey" },
      { name: "Explorer 🌟", desc: "Making progress" },
      { name: "Technician 💻", desc: "Midway mastery" },
      { name: "Innovator 🛠️", desc: "Building projects" },
      { name: "Polymath 🎓", desc: "Near the peak" },
      { name: "Career Ready 🏆", desc: "Destination reached" }
    ];
    return badges[Math.min(j - 1, badges.length - 1)];
  };

  return (
    <div className="w-full flex flex-col space-y-8 bg-[#0a0a0a] min-h-screen text-slate-100">
      
      {/* 3-Column Stats Header matching Dashboard styling */}
      <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto w-full px-4">
        {/* Card 1: Career Readiness */}
        <div className="rounded-2xl border border-zinc-800 bg-card p-6 shadow-sm hover:shadow-glow transition-all duration-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Career Readiness</p>
              <p className="mt-2 text-3xl font-bold text-slate-100">{completionPercentage}%</p>
              <p className="mt-1 text-xs text-zinc-500">Path completed</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 shadow-glow">
              <Target className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4 h-1.5 w-full rounded-full bg-zinc-900 border border-zinc-800 overflow-hidden">
            <div className="h-full rounded-full bg-red-500" style={{ width: `${completionPercentage}%` }} />
          </div>
        </div>

        {/* Card 2: Skills Mastered */}
        <div className="rounded-2xl border border-zinc-800 bg-card p-6 shadow-sm hover:shadow-glow transition-all duration-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Skills Completed</p>
              <p className="mt-2 text-3xl font-bold text-slate-100">{completedSkillsTotal}/{totalSkills}</p>
              <p className="mt-1 text-xs text-zinc-500">{totalSkills - completedSkillsTotal} remaining</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-500 border border-red-500/20">
              <BookOpen className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Card 3: Current Streak */}
        <div className="rounded-2xl border border-zinc-800 bg-card p-6 shadow-sm hover:shadow-glow transition-all duration-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Current Streak</p>
              <p className="mt-2 text-3xl font-bold text-slate-100">7 days</p>
              <p className="mt-1 text-xs text-zinc-500">Best streak: 14 days</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-500 border border-red-500/20">
              <Flame className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Roadmap Wrapper */}
      {isMobile ? (
        /* Mobile Viewport: Linear timeline flowing top-to-bottom */
        <div className="relative w-full max-w-lg mx-auto pl-12 pr-4 py-6 flex flex-col gap-10">
          {/* Vertical road lines in the background */}
          <div className="absolute left-[30px] top-0 bottom-0 w-3 bg-zinc-900 border-x border-zinc-800 pointer-events-none" />
          <div className="absolute left-[35px] top-0 bottom-0 w-[2px] bg-zinc-700/40 border-dashed border-spacing-2 pointer-events-none" />
          
          {/* Animated active path line on mobile */}
          <div className="absolute left-[34px] top-0 bottom-0 w-[4px] pointer-events-none origin-top">
            <motion.div 
              className="w-full bg-red-500 rounded-full"
              initial={{ height: 0 }}
              animate={{ height: `${completionPercentage}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              style={{ height: `${completionPercentage}%` }}
            />
          </div>

          {/* Start Badge (Mobile at the top) */}
          <div className="relative z-10 flex items-center">
            <div className="absolute -left-[14px] w-6 h-6 rounded-full bg-emerald-500 border-4 border-[#0a0a0a] flex items-center justify-center text-[8px] font-bold text-[#0a0a0a] shadow-glow-emerald">
              ✓
            </div>
            <div className="bg-card border border-emerald-500/20 px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-500 uppercase tracking-widest">
              Start Here 🏁
            </div>
          </div>

          {/* Module Nodes (Mobile top-to-bottom) */}
          {roadmap.modules.map((module, index) => {
            const status = getModuleStatus(index);
            const completedSkills = getCompletedSkillsCount(module);
            const totalSkillsCount = module.skills.length;
            const isLocked = status === 'locked';
            const isCompleted = status === 'completed';

            return (
              <div key={module.id} className="relative z-10 w-full flex items-start gap-4">
                {/* Node dot on the line */}
                <div 
                  onClick={() => !isLocked && setSelectedModule(module)}
                  className={`absolute -left-[18px] w-8 h-8 rounded-full border-4 border-[#0a0a0a] flex items-center justify-center shrink-0 cursor-pointer transition-all duration-300 ${
                    isLocked 
                      ? 'bg-zinc-800 border-[#0a0a0a] text-zinc-500' 
                      : isCompleted 
                      ? 'bg-emerald-500 text-[#0a0a0a] shadow-[0_0_10px_rgba(16,185,129,0.4)]' 
                      : 'bg-red-500 text-[#0a0a0a] shadow-[0_0_12px_rgba(239,68,68,0.5)] animate-pulse'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : isLocked ? (
                    <Lock className="w-3.5 h-3.5" />
                  ) : (
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  )}
                </div>

                {/* Module detail card */}
                <div className="w-full">
                  <ModuleNode
                    moduleNumber={index + 1}
                    title={module.title}
                    description={module.description}
                    completedSkillsCount={completedSkills}
                    totalSkillsCount={totalSkillsCount}
                    status={status}
                    onClick={() => setSelectedModule(module)}
                  />
                </div>
              </div>
            );
          })}

          {/* Finish Destination Card (Mobile at the bottom) */}
          <div className="relative z-10 w-full">
            <div className="absolute -left-[14px] w-6 h-6 rounded-full bg-zinc-900 border-4 border-zinc-800 flex items-center justify-center text-xs text-zinc-500">
              🚀
            </div>
            <div className={cn(
              "w-full rounded-xl border p-4 bg-card",
              completionPercentage === 100 
                ? "border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]" 
                : "border-zinc-800 opacity-60"
            )}>
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
                Career Ready 🚀
              </h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Complete all modules to unlock the job board matching engine, portfolio builders, and fast-track mentorship.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Desktop Viewport: Interactive serpentine journey map flowing top-to-bottom */
        <motion.div 
          className="relative w-full max-w-4xl mx-auto" 
          style={{ height: `${H}px` }}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Background SVG timeline and roads */}
          <svg 
            className="absolute inset-0 w-full h-full pointer-events-none z-0" 
            viewBox={`0 0 800 ${H}`}
            preserveAspectRatio="xMidYMin slice"
          >
            <defs>
              <linearGradient id="roadRedGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#7f1d1d" />
              </linearGradient>
              <filter id="roadRedGlow" x="-10%" y="-10%" width="120%" height="120%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Dotted lines from nodes to flanking cards */}
            {roadmap.modules.map((_, i) => {
              const idx = i + 1;
              const coord = getCoordinates(idx);
              const isLeft = idx % 2 === 1;
              const xCard = isLeft ? coord.x + 160 : coord.x - 160;
              return (
                <line
                  key={`line-${idx}`}
                  x1={coord.x}
                  y1={coord.y}
                  x2={xCard}
                  y2={coord.y}
                  stroke="rgba(239, 68, 68, 0.2)"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                />
              );
            })}

            {/* Outer road boundary / pavement outline */}
            <path
              d={roadPathD}
              stroke="rgba(24, 24, 27, 0.6)"
              strokeWidth={30}
              fill="none"
              strokeLinecap="round"
            />
            
            {/* Main Road pavement (charcoal surface) */}
            <path
              d={roadPathD}
              stroke="#18181b"
              strokeWidth={20}
              fill="none"
              strokeLinecap="round"
            />

            {/* Road divider dashed lanes */}
            <path
              d={roadPathD}
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth={1.5}
              strokeDasharray="8 10"
              fill="none"
              strokeLinecap="round"
            />

            {/* Glowing active progression path (red glow trail) */}
            <motion.path
              d={roadPathD}
              stroke="url(#roadRedGradient)"
              strokeWidth={5}
              fill="none"
              strokeLinecap="round"
              filter="url(#roadRedGlow)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: progressFraction }}
              transition={{ duration: 1.8, ease: "easeInOut", delay: 0.4 }}
            />
          </svg>

          {/* User Progress Rocket Marker */}
          <motion.div
            className="absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-default pointer-events-none"
            initial={{ 
              left: `${(getCoordinates(0).x / 800) * 100}%`, 
              top: `${(getCoordinates(0).y / H) * 100}%` 
            }}
            animate={{ 
              left: `${(activeCoord.x / 800) * 100}%`, 
              top: `${(activeCoord.y / H) * 100}%` 
            }}
            transition={{ type: "spring", stiffness: 45, damping: 12, delay: 1.0 }}
          >
            <div className="relative">
              {/* Pulsing ring indicator */}
              <span className="absolute -inset-3 rounded-full bg-red-500/25 animate-ping duration-1000" />
              <span className="absolute -inset-1.5 rounded-full bg-red-800/30 animate-pulse duration-700" />
              
              {/* Marker Avatar */}
              <div className="w-10 h-10 rounded-full bg-red-600 border-2 border-white shadow-[0_0_15px_rgba(239,68,68,0.5)] flex items-center justify-center text-white text-base">
                🚀
              </div>
            </div>
          </motion.div>

          {/* Start Checkpoint Node (At the top) */}
          <div 
            className="absolute -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center gap-1.5"
            style={{
              left: `${(getCoordinates(0).x / 800) * 100}%`,
              top: `${(getCoordinates(0).y / H) * 100}%`
            }}
          >
            <div className="w-6 h-6 rounded-full bg-emerald-500 border-4 border-[#0a0a0a] shadow-glow-emerald flex items-center justify-center text-[10px] font-bold text-[#0a0a0a]">
              ✓
            </div>
            <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-500 bg-zinc-950/80 px-2 py-0.5 border border-emerald-500/20 rounded-full">
              START HERE
            </span>
          </div>

          {/* Module Nodes and flanking cards (Top-to-Bottom) */}
          {roadmap.modules.map((module, index) => {
            const idx = index + 1;
            const coord = getCoordinates(idx);
            const status = getModuleStatus(index);
            const isLeft = idx % 2 === 1;

            // Node coordinates (checkpoint buttons)
            const nodeLeft = `${(coord.x / 800) * 100}%`;
            const nodeTop = `${(coord.y / H) * 100}%`;

            // Flanking Card coordinates
            const cardLeft = isLeft ? '46%' : '14%';
            const cardTop = `${(coord.y / H) * 100}%`;

            const completedSkillsCount = getCompletedSkillsCount(module);
            const totalSkillsCount = module.skills.length;
            const isLocked = status === 'locked';
            const isCompleted = status === 'completed';

            return (
              <div key={module.id}>
                {/* Checkpoint Node */}
                <button
                  onClick={() => !isLocked && setSelectedModule(module)}
                  className={`absolute z-15 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-4 border-[#0a0a0a] flex items-center justify-center transition-all duration-300 ${
                    isLocked 
                      ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed hover:scale-100' 
                      : isCompleted 
                      ? 'bg-emerald-500 text-[#0a0a0a] shadow-[0_0_10px_rgba(16,185,129,0.4)] hover:scale-110 cursor-pointer' 
                      : 'bg-red-500 text-slate-100 shadow-[0_0_15px_rgba(239,68,68,0.5)] hover:scale-110 cursor-pointer animate-pulse'
                  }`}
                  style={{ left: nodeLeft, top: nodeTop }}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 font-bold" />
                  ) : isLocked ? (
                    <Lock className="w-3.5 h-3.5" />
                  ) : (
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  )}
                </button>

                {/* Flanking Card */}
                <div
                  className="absolute z-10 w-[40%] -translate-y-1/2"
                  style={{ left: cardLeft, top: cardTop }}
                >
                  <ModuleNode
                    moduleNumber={idx}
                    title={module.title}
                    description={module.description}
                    completedSkillsCount={completedSkillsCount}
                    totalSkillsCount={totalSkillsCount}
                    status={status}
                    onClick={() => setSelectedModule(module)}
                  />
                </div>
              </div>
            );
          })}

          {/* Floating Achievement Badges at the midpoints */}
          {roadmap.modules.map((_, i) => {
            if (i === 0) return null; // No badge before first segment
            const yMid = getCoordinates(i).y + 140; // Midpoint goes downwards
            const unlocked = getModuleStatus(i - 1) === 'completed';
            const badge = getBadgeDetails(i);

            return (
              <motion.div
                key={`badge-${i}`}
                className="absolute z-10 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                style={{
                  left: '50%',
                  top: `${(yMid / H) * 100}%`
                }}
                animate={{
                  y: [0, -4, 0],
                }}
                transition={{
                  duration: 2.5 + (i * 0.2),
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border shadow-sm backdrop-blur-md transition-all duration-300 font-mono text-[9px] font-bold ${
                  unlocked 
                    ? 'bg-red-950/20 border-red-500/20 text-red-400' 
                    : 'bg-zinc-950/20 border-zinc-900/50 text-zinc-600 grayscale'
                }`}>
                  <Award className={`w-3.5 h-3.5 ${unlocked ? 'text-red-500' : 'text-zinc-600'}`} />
                  <span>{badge?.name}</span>
                </div>
              </motion.div>
            );
          })}

          {/* Finish Node & Destination Card (At the bottom) */}
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 z-10 w-[44%] text-center"
            style={{
              left: `${(getCoordinates(N + 1).x / 800) * 100}%`,
              top: `${(getCoordinates(N + 1).y / H) * 100}%`
            }}
          >
            <div className={cn(
              "w-full rounded-2xl border p-5 backdrop-blur-md transition-all duration-500 bg-card",
              completionPercentage === 100 
                ? "border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]" 
                : "border-zinc-800 opacity-60"
            )}>
              <span className="text-[10px] font-mono font-bold tracking-widest text-red-500 bg-red-950/20 border border-red-500/20 px-2.5 py-1 rounded-full uppercase">
                Destination Goal
              </span>
              <h3 className="text-lg font-black text-slate-100 mt-3 flex items-center justify-center gap-2">
                Career Ready 🚀
              </h3>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                Complete all modules to unlock the job board matching engine, portfolio builders, and fast-track mentorship.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Module Detail Dialog */}
      <Dialog open={!!selectedModule} onOpenChange={(open) => !open && setSelectedModule(null)}>
        {selectedModule && (
          <DialogContent className="w-full h-full md:h-auto max-w-none md:max-w-xl rounded-none md:rounded-2xl border-x-0 md:border border-border bg-[#0e0e0e] p-6 overflow-y-auto max-h-screen md:max-h-[90vh] flex flex-col text-slate-100">
            <DialogHeader className="gap-2">
              <span className="text-xs font-mono font-bold tracking-widest text-red-500 uppercase">
                Module Details
              </span>
              <DialogTitle className="text-xl font-bold flex items-center gap-2 text-slate-100">
                <Target className="w-5 h-5 text-red-500" />
                {selectedModule.title}
              </DialogTitle>
              <DialogDescription className="text-sm text-zinc-400 mt-1 leading-relaxed">
                {selectedModule.description}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 mt-4">
              {/* Skills Tree / List */}
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider">
                  <Star className="w-4 h-4 text-red-500" />
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
                            ? 'bg-emerald-950/10 border-emerald-500/20 text-emerald-500 cursor-default'
                            : 'bg-zinc-900/20 border-zinc-800 hover:border-red-500/50 hover:bg-zinc-900/40 cursor-pointer text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {completed ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                          ) : (
                            <Circle className="w-5 h-5 text-zinc-700 hover:text-red-500 shrink-0" />
                          )}
                          <span className="text-sm font-medium">{skill}</span>
                        </div>
                        {!completed && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-xs text-red-500 font-mono hover:bg-red-500/10 cursor-pointer"
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
                <div className="space-y-3 pt-2 border-t border-zinc-800">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider">
                    <Trophy className="w-4 h-4 text-red-500" />
                    <span>Recommended Projects</span>
                  </div>
                  <div className="space-y-2">
                    {selectedModule.projects.map((project, i) => (
                      <div key={i} className="flex gap-3 bg-zinc-900/10 p-3 rounded-lg border border-zinc-850 text-sm">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500/10 text-red-550 font-mono text-xs shrink-0 mt-0.5">
                          {i + 1}
                        </div>
                        <div className="flex-1 text-zinc-400">
                          {project}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Learning Resources */}
              <div className="space-y-3 pt-2 border-t border-zinc-800">
                <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider">
                  <BookOpen className="w-4 h-4 text-red-500" />
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
                        className="flex items-center justify-between p-3 rounded-lg border border-zinc-800 bg-zinc-900/10 hover:border-red-500/50 hover:bg-zinc-900/30 transition-all duration-200 text-sm group"
                      >
                        <span className="font-medium text-slate-200 group-hover:text-red-500 transition-colors">
                          {resource.title}
                        </span>
                        <ExternalLink className="w-4 h-4 text-zinc-555 group-hover:text-red-500 transition-colors shrink-0 ml-2" />
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-500 italic pl-1">Resources coming soon</p>
                )}
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
