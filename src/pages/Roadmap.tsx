import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserStore } from '@/stores/userStore';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Map, ArrowLeft, Sparkles, Loader2 } from 'lucide-react';
import { GamifiedRoadmap } from '@/components/roadmap/GamifiedRoadmap';
import { generateRoadmap } from '@/services/roadmapGenerator';
import { mapRoadmap } from '@/services/roadmapMapper';

export default function Roadmap() {
  const { profile, completeOnboarding } = useUserStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (!profile) {
      navigate('/onboarding');
    }
  }, [profile, navigate]);

  if (!profile) return null;

  const handleGenerateRoadmap = async () => {
    setIsGenerating(true);
    try {
      const careerGoal = profile.careerGoal || 'Software Engineer';
      const raw = await generateRoadmap(careerGoal);
      const mapped = mapRoadmap(raw);
      completeOnboarding(mapped);
      toast({
        title: 'Roadmap Generated! 🎉',
        description: `Successfully created a roadmap for ${careerGoal}`,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Generation Failed',
        description: 'Could not generate roadmap. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const hasRoadmap = profile.roadmap && Array.isArray(profile.roadmap.modules) && profile.roadmap.modules.length > 0;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background grid */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,hsl(var(--primary)/0.08),transparent_55%)]" />
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
                  <span className="text-lg font-bold">Career Roadmap</span>
                </div>
                <p className="text-xs text-muted-foreground font-mono">
                  {profile.careerGoal
                    ? `Path to become a ${profile.careerGoal}`
                    : 'Interactive learning progression path'}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 container mx-auto px-4 py-8">
          {hasRoadmap ? (
            <GamifiedRoadmap roadmap={profile.roadmap!} />
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-20 max-w-md mx-auto space-y-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-glow">
                <Sparkles className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Generate Your Roadmap</h2>
                <p className="text-sm text-muted-foreground">
                  You don't have a roadmap active. Click the button below to generate a dynamic learning path based on your career goal.
                </p>
              </div>
              <Button
                onClick={handleGenerateRoadmap}
                disabled={isGenerating}
                className="w-full gradient-primary text-primary-foreground shadow-glow hover:shadow-glow-md"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Roadmap...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Generate Roadmap
                  </>
                )}
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
