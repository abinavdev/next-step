import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserStore } from '@/stores/userStore';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Compass,
  Map,
  Trophy,
  ArrowLeft,
  Lock,
  CheckCircle2,
  Play,
  BookOpen,
  Award,
  Zap,
  X,
  ExternalLink,
} from 'lucide-react';

interface SkillNode {
  id: string;
  title: string;
  description: string;
  type: 'skill' | 'course' | 'certification';
  xp: number;
  status: 'locked' | 'available' | 'in_progress' | 'completed';
  position: { x: number; y: number };
  prerequisites: string[];
  resources: { name: string; url: string }[];
}

const MOCK_NODES: SkillNode[] = [
  {
    id: 'programming-basics',
    title: 'Programming Basics',
    description: 'Learn fundamental programming concepts: variables, loops, conditionals, and functions.',
    type: 'skill',
    xp: 100,
    status: 'available',
    position: { x: 50, y: 22 },
    prerequisites: [],
    resources: [
      { name: 'freeCodeCamp', url: 'https://freecodecamp.org' },
      { name: 'Codecademy', url: 'https://codecademy.com' },
    ],
  },
  {
    id: 'html-css',
    title: 'HTML & CSS',
    description: 'Master the building blocks of web pages: structure and styling.',
    type: 'skill',
    xp: 80,
    status: 'locked',
    position: { x: 28, y: 38 },
    prerequisites: ['programming-basics'],
    resources: [{ name: 'MDN Web Docs', url: 'https://developer.mozilla.org' }],
  },
  {
    id: 'javascript',
    title: 'JavaScript',
    description: 'Add interactivity to web pages with the language of the web.',
    type: 'course',
    xp: 150,
    status: 'locked',
    position: { x: 72, y: 38 },
    prerequisites: ['programming-basics'],
    resources: [{ name: 'JavaScript.info', url: 'https://javascript.info' }],
  },
  {
    id: 'react',
    title: 'React Framework',
    description: 'Build modern user interfaces with component-based architecture.',
    type: 'course',
    xp: 200,
    status: 'locked',
    position: { x: 50, y: 54 },
    prerequisites: ['html-css', 'javascript'],
    resources: [{ name: 'React Docs', url: 'https://react.dev' }],
  },
  {
    id: 'git',
    title: 'Git & GitHub',
    description: 'Version control and collaboration for developers.',
    type: 'skill',
    xp: 75,
    status: 'locked',
    position: { x: 16, y: 60 },
    prerequisites: ['programming-basics'],
    resources: [{ name: 'GitHub Skills', url: 'https://skills.github.com' }],
  },
  {
    id: 'api-integration',
    title: 'API Integration',
    description: 'Connect applications with external services and data.',
    type: 'skill',
    xp: 120,
    status: 'locked',
    position: { x: 84, y: 60 },
    prerequisites: ['javascript'],
    resources: [],
  },
  {
    id: 'full-stack',
    title: 'Full Stack Development',
    description: 'Combine frontend and backend skills to build complete applications.',
    type: 'course',
    xp: 250,
    status: 'locked',
    position: { x: 50, y: 76 },
    prerequisites: ['react', 'api-integration'],
    resources: [],
  },
  {
    id: 'aws-cert',
    title: 'AWS Certification',
    description: 'Demonstrate cloud computing expertise with official certification.',
    type: 'certification',
    xp: 300,
    status: 'locked',
    position: { x: 50, y: 88 },
    prerequisites: ['full-stack'],
    resources: [{ name: 'AWS Training', url: 'https://aws.amazon.com/training' }],
  },
];

export default function Roadmap() {
  const { profile, addXP } = useUserStore();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [nodes, setNodes] = useState<SkillNode[]>(MOCK_NODES);
  const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    if (!profile) {
      navigate('/onboarding');
    }
  }, [profile, navigate]);

  const handleNodeClick = (node: SkillNode) => {
    if (node.status !== 'locked') {
      setSelectedNode(node);
    }
  };

  const handleCompleteNode = async () => {
    if (!selectedNode || selectedNode.status === 'completed') return;

    setCompleting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    setNodes((prev) =>
      prev.map((n) => {
        if (n.id === selectedNode.id) {
          return { ...n, status: 'completed' as const };
        }
        if (n.prerequisites.includes(selectedNode.id)) {
          const allPrereqsMet = n.prerequisites.every((pid) => {
            const prereqNode = prev.find((p) => p.id === pid);
            return prereqNode?.status === 'completed' || pid === selectedNode.id;
          });
          if (allPrereqsMet && n.status === 'locked') {
            return { ...n, status: 'available' as const };
          }
        }
        return n;
      }),
    );

    addXP(selectedNode.xp);

    toast({
      title: `+${selectedNode.xp} XP`,
      description: `You completed "${selectedNode.title}".`,
    });

    setSelectedNode((prev) => (prev ? { ...prev, status: 'completed' } : prev));
    setCompleting(false);
  };

  const getNodeIcon = (type: SkillNode['type']) => {
    switch (type) {
      case 'skill':
        return <Zap className="w-5 h-5" />;
      case 'course':
        return <BookOpen className="w-5 h-5" />;
      case 'certification':
        return <Award className="w-5 h-5" />;
      default:
        return <Zap className="w-5 h-5" />;
    }
  };

  const getNodeStyle = (node: SkillNode) => {
    const base =
      'absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300';

    switch (node.status) {
      case 'locked':
        return `${base} opacity-30 grayscale cursor-not-allowed`;
      case 'available':
        return `${base} cursor-pointer`;
      case 'in_progress':
        return `${base} cursor-pointer ring-2 ring-warning`;
      case 'completed':
        return `${base} cursor-pointer`;
      default:
        return base;
    }
  };

  const completedCount = nodes.filter((n) => n.status === 'completed').length;
  const totalXP = nodes.reduce((sum, n) => sum + n.xp, 0);
  const earnedXP = nodes.reduce(
    (sum, n) => sum + (n.status === 'completed' ? n.xp : 0),
    0,
  );
  const progress = Math.round((earnedXP / totalXP) * 100);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background grid */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,hsl(38_56%_78%/0.12),transparent_55%),radial-gradient(circle_at_bottom,hsl(145_13%_18%/0.85),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(hsl(var(--muted)/0.05)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--muted)/0.05)_1px,transparent_1px)] bg-[size:80px_80px]" />

      <div className="relative min-h-screen flex flex-col">
        {/* Header */}
        <header className="border-b border-border bg-card/60 backdrop-blur-md sticky top-0 z-40">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Map className="w-5 h-5 text-primary" />
                  <span className="text-lg font-mono font-bold">Skill Map</span>
                </div>
                <p className="text-xs text-muted-foreground font-mono">
                  {profile?.careerGoal
                    ? `Path to become a ${profile.careerGoal}`
                    : 'Interactive roadmap of your engineering journey'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm font-mono">
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Roadmap XP</p>
                <p className="text-base text-foreground">
                  {earnedXP} / {totalXP}
                </p>
              </div>
              <div className="hidden sm:flex flex-col items-end gap-1">
                <p className="text-xs text-muted-foreground">Completion</p>
                <div className="h-1.5 w-32 overflow-hidden rounded-full bg-secondary/40">
                  <div
                    className="h-full rounded-full bg-primary/80 transition-all duration-700"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Map */}
        <main className="flex-1 relative overflow-hidden">
          <div className="absolute inset-0 p-8">
            {/* Connection lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {nodes.map((node) =>
                node.prerequisites.map((pid) => {
                  const prereq = nodes.find((n) => n.id === pid);
                  if (!prereq) return null;

                  const isActive = node.status !== 'locked';

                  return (
                    <line
                      key={`${pid}-${node.id}`}
                      x1={`${prereq.position.x}%`}
                      y1={`${prereq.position.y}%`}
                      x2={`${node.position.x}%`}
                      y2={`${node.position.y}%`}
                      stroke={isActive ? 'hsl(var(--primary))' : 'hsl(var(--muted))'}
                      strokeWidth={isActive ? 2 : 1.5}
                      strokeDasharray={isActive ? '0' : '5,6'}
                      className="transition-all duration-300 opacity-60"
                    />
                  );
                }),
              )}
            </svg>

            {/* Nodes */}
            {nodes.map((node) => (
              <div
                key={node.id}
                onClick={() => handleNodeClick(node)}
                className={getNodeStyle(node)}
                style={{
                  left: `${node.position.x}%`,
                  top: `${node.position.y}%`,
                }}
              >
                <div
                  className={`
                    w-20 h-20 rounded-xl flex items-center justify-center
                    border transition-all duration-300 backdrop-blur-md
                    ${
                      node.status === 'completed'
                        ? 'bg-success/20 border-success text-success-foreground shadow-soft'
                        : node.status === 'available'
                        ? 'bg-primary/10 border-primary/60 text-primary shadow-glow animate-pulse-glow'
                        : node.status === 'in_progress'
                        ? 'bg-warning/20 border-warning text-warning shadow-soft'
                        : 'bg-background/20 border-border/50 text-muted-foreground'
                    }
                  `}
                >
                  {node.status === 'locked' ? (
                    <Lock className="w-5 h-5" />
                  ) : node.status === 'completed' ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    getNodeIcon(node.type)
                  )}
                </div>
                <p
                  className={`
                    text-xs font-mono text-center mt-2 max-w-28 truncate
                    ${node.status === 'locked' ? 'text-muted-foreground' : 'text-foreground'}
                  `}
                >
                  {node.title}
                </p>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm border border-border rounded-md p-4 shadow-soft">
            <p className="text-xs font-mono text-muted-foreground mb-2">LEGEND</p>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-success" />
                <span>Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded border border-primary bg-primary/20" />
                <span>Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-muted/40 border border-muted-foreground/30" />
                <span>Locked</span>
              </div>
            </div>
          </div>
        </main>

        {/* Node detail panel */}
        {selectedNode && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card/95 shadow-large p-6">
              <button
                onClick={() => setSelectedNode(null)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-start gap-4 mb-4">
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center border
                    ${
                      selectedNode.status === 'completed'
                        ? 'bg-success/20 border-success text-success-foreground'
                        : 'bg-primary/15 border-primary/60 text-primary'
                    }
                  `}
                >
                  {selectedNode.status === 'completed' ? (
                    <CheckCircle2 className="w-7 h-7" />
                  ) : (
                    getNodeIcon(selectedNode.type)
                  )}
                </div>
                <div>
                  <span className="text-[10px] font-mono text-primary uppercase tracking-[0.18em]">
                    {selectedNode.type}
                  </span>
                  <h3 className="text-xl font-mono font-bold text-foreground">
                    {selectedNode.title}
                  </h3>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-4">{selectedNode.description}</p>

              <div className="flex items-center gap-4 mb-6 text-sm font-mono">
                <div className="flex items-center gap-1.5 text-primary">
                  <Zap className="w-4 h-4" />
                  <span>+{selectedNode.xp} XP</span>
                </div>
                {selectedNode.status === 'completed' && (
                  <span className="flex items-center gap-1 text-success">
                    <CheckCircle2 className="w-4 h-4" />
                    Completed
                  </span>
                )}
              </div>

              {selectedNode.resources.length > 0 && (
                <div className="mb-6">
                  <p className="text-xs font-mono text-muted-foreground mb-2">RESOURCES</p>
                  <div className="space-y-2">
                    {selectedNode.resources.map((resource, i) => (
                      <a
                        key={i}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between rounded-lg border border-border bg-background/70 p-3 text-sm text-primary hover:border-primary/60 hover:bg-background/90"
                      >
                        <div className="flex items-center gap-2">
                          <ExternalLink className="w-3 h-3" />
                          <span>{resource.name}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">Open</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {selectedNode.status !== 'completed' && (
                <Button
                  onClick={handleCompleteNode}
                  disabled={completing || selectedNode.status === 'locked'}
                  className="w-full mt-2 font-mono bg-primary/20 text-primary-foreground border border-primary/60 backdrop-blur-md hover:bg-primary/30"
                >
                  {completing ? (
                    <Compass className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Mark as Complete (+{selectedNode.xp} XP)
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
