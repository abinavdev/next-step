import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Sparkles } from 'lucide-react';
import type { Plan, PlanType } from '@/types';

const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    description: 'Get started with the basics',
    features: [
      'Access to basic content',
      'Career exploration tools',
      'Skill assessment',
      'Community access',
    ],
  },
  {
    id: 'project-assistance',
    name: 'Project Assistance',
    price: 299,
    monthlyPrice: 299,
    description: 'Guided project experience',
    features: [
      'Project chart with guidance',
      'Milestone-based assistance',
      'Premium resources library',
      'Progress tracking dashboard',
      'Expert tips and tricks',
      'Priority community support',
    ],
  },
  {
    id: 'mentor-assistance',
    name: 'Mentor + Assistance',
    price: 799,
    monthlyPrice: 799,
    description: 'Full mentorship and support',
    features: [
      'All features from Project Assistance',
      'One-on-one personal mentor',
      'Live mentoring sessions (2x/month)',
      'Doubt clearing assistance',
      'Dedicated project guidance',
      'Career path consultation',
      'Resume review & optimization',
      '24/7 priority support',
    ],
  },
];

export default function Pricing() {
  const navigate = useNavigate();
  const { user, setSubscription } = useAuthStore();

  const handleSubscribe = (planId: PlanType) => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (planId === 'free') {
      // Set free plan subscription
      setSubscription({
        planId: 'free',
        planName: 'Free',
        price: 0,
        features: PLANS[0].features,
        startDate: new Date(),
      });
      navigate('/dashboard');
    } else {
      // Redirect to checkout for paid plans
      navigate(`/checkout/${planId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/30">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto max-w-7xl px-6 py-12">
          <div className="space-y-4 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
              Simple, Transparent Pricing
            </h1>
            <p className="text-lg text-muted-foreground">
              Choose the perfect plan to accelerate your learning journey
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="container mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-8 md:grid-cols-3">
          {PLANS.map((plan, index) => (
            <Card
              key={plan.id}
              className={`relative flex flex-col transition-all duration-300 hover:shadow-lg ${
                index === 2
                  ? 'border-primary/50 shadow-lg md:scale-105 md:transform'
                  : 'border-border'
              }`}
            >
              {/* Popular Badge */}
              {index === 2 && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="gradient-primary text-primary-foreground shadow-glow">
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="space-y-4 pb-4">
                <div className="space-y-2">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </div>

                <div className="space-y-1">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-foreground">
                      ₹{plan.price}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-muted-foreground">/ month</span>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex flex-1 flex-col space-y-6">
                {/* Features List */}
                <ul className="flex-1 space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button
                  onClick={() => handleSubscribe(plan.id as PlanType)}
                  className={`w-full ${
                    index === 2
                      ? 'gradient-primary text-primary-foreground shadow-glow hover:shadow-glow-md'
                      : index === 0
                      ? 'bg-secondary text-foreground hover:bg-secondary/80'
                      : 'border border-border text-foreground hover:bg-secondary'
                  }`}
                  variant={index === 0 ? 'outline' : 'default'}
                >
                  {plan.id === 'free'
                    ? 'Get Started Free'
                    : user
                    ? 'Subscribe Now'
                    : 'Sign In to Subscribe'}
                </Button>

                {/* Current Plan Indicator */}
                {user?.subscription?.planId === plan.id && (
                  <div className="rounded-lg bg-primary/10 py-2 text-center">
                    <p className="text-sm font-medium text-primary">Your Current Plan</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-16 space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground">Frequently Asked Questions</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-lg">Can I switch plans anytime?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-lg">What if I'm not satisfied?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  We offer a 14-day money-back guarantee. No questions asked if you're not happy with your plan.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-lg">Is there a free trial?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Absolutely! Start with our Free plan to explore features. Upgrade anytime to unlock premium benefits.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-lg">Do you offer discounts for annual plans?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Yes! Pay annually and save 20% on your monthly subscription cost.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
