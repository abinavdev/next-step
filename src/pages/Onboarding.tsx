import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/stores/userStore';
import { OnboardingProgress } from '@/components/onboarding/OnboardingProgress';
import { StepEducation } from '@/components/onboarding/StepEducation';
import { StepSyllabus } from '@/components/onboarding/StepSyllabus';
import { StepInterests } from '@/components/onboarding/StepInterests';
import { StepCareerGoal } from '@/components/onboarding/StepCareerGoal';
import { Sparkles } from 'lucide-react';

export default function Onboarding() {
  const navigate = useNavigate();
  const { onboarding, updateOnboarding, completeOnboarding } = useUserStore();

  const handleNext = () => {
    updateOnboarding({ step: onboarding.step + 1 });
  };

  const handleBack = () => {
    updateOnboarding({ step: onboarding.step - 1 });
  };

  const handleComplete = () => {
    completeOnboarding();
    navigate('/dashboard');
  };

  const renderStep = () => {
    switch (onboarding.step) {
      case 1:
        return <StepEducation onNext={handleNext} />;
      case 2:
        return <StepSyllabus onNext={handleNext} onBack={handleBack} />;
      case 3:
        return <StepInterests onNext={handleNext} onBack={handleBack} />;
      case 4:
        return <StepCareerGoal onComplete={handleComplete} onBack={handleBack} />;
      default:
        return <StepEducation onNext={handleNext} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary shadow-glow">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-foreground">
              NextStep AI
            </span>
          </div>
          <span className="text-sm text-muted-foreground">
            Step {onboarding.step} of 4
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto max-w-4xl px-6 py-12">
        <OnboardingProgress currentStep={onboarding.step} totalSteps={4} />
        {renderStep()}
      </main>
    </div>
  );
}
