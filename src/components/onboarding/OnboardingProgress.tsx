import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
}

const steps = [
  { number: 1, title: 'Education' },
  { number: 2, title: 'Syllabus' },
  { number: 3, title: 'Interests' },
  { number: 4, title: 'Career Goal' },
];

export function OnboardingProgress({ currentStep, totalSteps }: OnboardingProgressProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all duration-300',
                  currentStep > step.number
                    ? 'border-accent bg-accent text-accent-foreground'
                    : currentStep === step.number
                    ? 'border-primary bg-primary text-primary-foreground shadow-glow'
                    : 'border-border bg-background text-muted-foreground'
                )}
              >
                {currentStep > step.number ? (
                  <Check className="h-5 w-5" />
                ) : (
                  step.number
                )}
              </div>
              <span
                className={cn(
                  'mt-2 text-xs font-medium transition-colors duration-200',
                  currentStep >= step.number
                    ? 'text-foreground'
                    : 'text-muted-foreground'
                )}
              >
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'mx-4 h-0.5 w-16 transition-all duration-500 sm:w-24 md:w-32',
                  currentStep > step.number
                    ? 'bg-accent'
                    : 'bg-border'
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
