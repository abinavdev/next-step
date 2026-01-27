import { useUserStore } from '@/stores/userStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { GraduationCap, ArrowRight } from 'lucide-react';

const degrees = [
  'B.Tech / B.E.',
  'B.Sc',
  'B.Com',
  'BBA',
  'B.A.',
  'M.Tech / M.E.',
  'M.Sc',
  'MBA',
  'Other',
];

const branches = [
  'Computer Science',
  'Information Technology',
  'Electronics',
  'Mechanical',
  'Civil',
  'Electrical',
  'Chemical',
  'Biotechnology',
  'Data Science',
  'Artificial Intelligence',
  'Other',
];

interface StepEducationProps {
  onNext: () => void;
}

export function StepEducation({ onNext }: StepEducationProps) {
  const { onboarding, updateOnboarding } = useUserStore();

  const isValid = onboarding.degree && onboarding.branch;

  return (
    <div className="animate-fade-in">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow">
          <GraduationCap className="h-8 w-8 text-primary-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">
          Let's start with your education
        </h2>
        <p className="mt-2 text-muted-foreground">
          Tell us about your current academic background
        </p>
      </div>

      <div className="mx-auto max-w-md space-y-6">
        <div className="space-y-2">
          <Label htmlFor="degree">Current Degree</Label>
          <Select
            value={onboarding.degree}
            onValueChange={(value) => updateOnboarding({ degree: value })}
          >
            <SelectTrigger id="degree">
              <SelectValue placeholder="Select your degree" />
            </SelectTrigger>
            <SelectContent>
              {degrees.map((degree) => (
                <SelectItem key={degree} value={degree}>
                  {degree}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="branch">Branch / Major</Label>
          <Select
            value={onboarding.branch}
            onValueChange={(value) => updateOnboarding({ branch: value })}
          >
            <SelectTrigger id="branch">
              <SelectValue placeholder="Select your branch" />
            </SelectTrigger>
            <SelectContent>
              {branches.map((branch) => (
                <SelectItem key={branch} value={branch}>
                  {branch}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="hero"
          className="w-full"
          onClick={onNext}
          disabled={!isValid}
        >
          Continue
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
