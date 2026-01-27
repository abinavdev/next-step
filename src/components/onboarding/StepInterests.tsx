import { useUserStore } from '@/stores/userStore';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const interests = [
  { id: 'technology', label: 'Technology', icon: '💻', description: 'Software, AI, and innovation' },
  { id: 'design', label: 'Design', icon: '🎨', description: 'UI/UX, graphics, and creativity' },
  { id: 'data', label: 'Data', icon: '📊', description: 'Analytics, ML, and insights' },
  { id: 'business', label: 'Business', icon: '📈', description: 'Strategy, management, and growth' },
  { id: 'finance', label: 'Finance', icon: '💰', description: 'Banking, investments, and economics' },
  { id: 'marketing', label: 'Marketing', icon: '📣', description: 'Branding, content, and growth' },
  { id: 'research', label: 'Research', icon: '🔬', description: 'Academia, R&D, and innovation' },
  { id: 'healthcare', label: 'Healthcare', icon: '🏥', description: 'Medicine, wellness, and biotech' },
  { id: 'education', label: 'Education', icon: '📚', description: 'Teaching and knowledge sharing' },
];

interface StepInterestsProps {
  onNext: () => void;
  onBack: () => void;
}

export function StepInterests({ onNext, onBack }: StepInterestsProps) {
  const { onboarding, updateOnboarding } = useUserStore();

  const toggleInterest = (interestId: string) => {
    const current = onboarding.interests;
    if (current.includes(interestId)) {
      updateOnboarding({
        interests: current.filter((i) => i !== interestId),
      });
    } else {
      updateOnboarding({
        interests: [...current, interestId],
      });
    }
  };

  const isValid = onboarding.interests.length >= 1;

  return (
    <div className="animate-fade-in">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow text-3xl">
          ✨
        </div>
        <h2 className="text-2xl font-bold text-foreground">
          What interests you most?
        </h2>
        <p className="mt-2 text-muted-foreground">
          Select all areas that excite you
        </p>
      </div>

      <div className="mx-auto max-w-2xl">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {interests.map((interest) => {
            const isSelected = onboarding.interests.includes(interest.id);
            return (
              <button
                key={interest.id}
                onClick={() => toggleInterest(interest.id)}
                className={cn(
                  'relative flex flex-col items-start rounded-xl border-2 p-4 text-left transition-all duration-200',
                  isSelected
                    ? 'border-primary bg-primary/5 shadow-glow'
                    : 'border-border bg-card hover:border-primary/50 hover:shadow-soft'
                )}
              >
                {isSelected && (
                  <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                    <Check className="h-3 w-3 text-primary-foreground" />
                  </div>
                )}
                <span className="text-2xl">{interest.icon}</span>
                <span className="mt-2 font-semibold text-foreground">
                  {interest.label}
                </span>
                <span className="text-xs text-muted-foreground">
                  {interest.description}
                </span>
              </button>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="mt-8 flex gap-3">
          <Button variant="outline" onClick={onBack} className="flex-1">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button
            variant="hero"
            onClick={onNext}
            disabled={!isValid}
            className="flex-1"
          >
            Continue
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
