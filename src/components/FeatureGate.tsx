import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

interface FeatureGateProps {
  feature: string;
  required: 'project' | 'mentor';
  children: React.ReactNode;
  fallbackMessage?: string;
}

export function FeatureGate({
  feature,
  required,
  children,
  fallbackMessage,
}: FeatureGateProps) {
  const navigate = useNavigate();

  const defaultMessages = {
    project:
      'This feature is available in the Project Assistance plan and above. Upgrade to unlock it.',
    mentor:
      'This feature is available only in the Mentor + Assistance plan. Upgrade to unlock it.',
  };

  const message = fallbackMessage || defaultMessages[required];
  const buttonText = required === 'mentor' ? 'Upgrade to Mentor Plan' : 'Upgrade Plan';

  return (
    <Card className="border-border bg-gradient-to-br from-secondary/30 to-secondary/10">
      <CardHeader className="text-center">
        <CardTitle className="text-lg">🔒 Feature Locked</CardTitle>
        <CardDescription className="mt-2">{message}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          onClick={() => navigate('/pricing')}
          className="w-full gradient-primary text-primary-foreground shadow-glow hover:shadow-glow-md"
        >
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
}
