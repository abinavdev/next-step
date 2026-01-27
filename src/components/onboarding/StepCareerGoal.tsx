import { useState } from 'react';
import { useUserStore } from '@/stores/userStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ArrowRight, ArrowLeft, Sparkles, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

const suggestedCareers = [
  'Software Engineer',
  'Data Scientist',
  'Product Manager',
  'UX Designer',
  'DevOps Engineer',
  'Machine Learning Engineer',
  'Full Stack Developer',
  'Business Analyst',
  'Cloud Architect',
  'Cybersecurity Analyst',
];

interface StepCareerGoalProps {
  onComplete: () => void;
  onBack: () => void;
}

export function StepCareerGoal({ onComplete, onBack }: StepCareerGoalProps) {
  const { onboarding, updateOnboarding } = useUserStore();
  const [customGoal, setCustomGoal] = useState('');

  const handleCareerSelect = (career: string) => {
    updateOnboarding({ careerGoal: career });
  };

  const handleCustomGoal = () => {
    if (customGoal.trim()) {
      updateOnboarding({ careerGoal: customGoal.trim() });
    }
  };

  const isValid = !onboarding.knowsCareerGoal || onboarding.careerGoal;

  return (
    <div className="animate-fade-in">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow">
          <Target className="h-8 w-8 text-primary-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">
          What's your dream career?
        </h2>
        <p className="mt-2 text-muted-foreground">
          We'll create a personalized roadmap just for you
        </p>
      </div>

      <div className="mx-auto max-w-lg space-y-6">
        {/* Toggle for knowing career goal */}
        <div className="flex items-center justify-between rounded-xl bg-secondary/50 p-4">
          <div>
            <Label htmlFor="knows-goal" className="text-foreground">
              I know what I want to become
            </Label>
            <p className="text-sm text-muted-foreground">
              {onboarding.knowsCareerGoal
                ? 'Great! Select your career goal below'
                : "No worries! We'll suggest careers for you"}
            </p>
          </div>
          <Switch
            id="knows-goal"
            checked={onboarding.knowsCareerGoal}
            onCheckedChange={(checked) =>
              updateOnboarding({ knowsCareerGoal: checked, careerGoal: '' })
            }
          />
        </div>

        {onboarding.knowsCareerGoal ? (
          <>
            {/* Career Grid */}
            <div className="space-y-3">
              <Label>Select a career path</Label>
              <div className="grid grid-cols-2 gap-2">
                {suggestedCareers.map((career) => (
                  <button
                    key={career}
                    onClick={() => handleCareerSelect(career)}
                    className={cn(
                      'rounded-lg border px-4 py-3 text-sm font-medium transition-all duration-200',
                      onboarding.careerGoal === career
                        ? 'border-primary bg-primary/10 text-primary shadow-glow'
                        : 'border-border bg-card text-foreground hover:border-primary/50'
                    )}
                  >
                    {career}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Input */}
            <div className="space-y-2">
              <Label>Or enter your own</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., Blockchain Developer"
                  value={customGoal}
                  onChange={(e) => setCustomGoal(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleCustomGoal()}
                />
                <Button
                  variant="secondary"
                  onClick={handleCustomGoal}
                  disabled={!customGoal.trim()}
                >
                  Add
                </Button>
              </div>
            </div>

            {onboarding.careerGoal && (
              <div className="rounded-xl bg-accent/10 p-4">
                <p className="text-sm text-muted-foreground">Selected goal:</p>
                <p className="font-semibold text-accent">
                  {onboarding.careerGoal}
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="rounded-xl border border-dashed border-primary/30 bg-primary/5 p-6 text-center">
            <Sparkles className="mx-auto h-10 w-10 text-primary" />
            <p className="mt-3 font-medium text-foreground">
              AI-Powered Career Discovery
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Based on your interests and syllabus, we'll suggest the best
              career paths for you.
            </p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 pt-4">
          <Button variant="outline" onClick={onBack} className="flex-1">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button
            variant="hero"
            onClick={onComplete}
            disabled={!isValid}
            className="flex-1"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Get My Roadmap
          </Button>
        </div>
      </div>
    </div>
  );
}
