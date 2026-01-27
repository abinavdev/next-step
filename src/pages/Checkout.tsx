import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Check, AlertCircle, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import type { Plan, PlanType } from '@/types';

const PLANS: Record<PlanType, Plan> = {
  'free': {
    id: 'free',
    name: 'Free',
    price: 0,
    features: ['Access to basic content'],
  },
  'project-assistance': {
    id: 'project-assistance',
    name: 'Project Assistance',
    price: 299,
    features: [
      'Project chart with guidance',
      'Milestone-based assistance',
      'Premium resources library',
      'Progress tracking dashboard',
    ],
  },
  'mentor-assistance': {
    id: 'mentor-assistance',
    name: 'Mentor + Assistance',
    price: 799,
    features: [
      'All features from Project Assistance',
      'One-on-one personal mentor',
      'Live mentoring sessions (2x/month)',
      'Dedicated project guidance',
    ],
  },
};

export default function Checkout() {
  const navigate = useNavigate();
  const { planId } = useParams<{ planId: PlanType }>();
  const { user, setSubscription } = useAuthStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentData, setPaymentData] = useState({
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  if (!user) {
    navigate('/login');
    return null;
  }

  if (!planId || !PLANS[planId]) {
    navigate('/pricing');
    return null;
  }

  const plan = PLANS[planId];

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCompletePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!paymentData.cardName || !paymentData.cardNumber || !paymentData.expiryDate || !paymentData.cvv) {
      alert('Please fill in all payment details');
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment processing
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Set subscription
      setSubscription({
        planId: planId,
        planName: plan.name,
        price: plan.price,
        features: plan.features,
        startDate: new Date(),
      });

      // Show success and redirect
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } catch (error) {
      console.error('Payment error:', error);
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/30">
      <div className="container mx-auto max-w-4xl px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            className="mb-4 -ml-2"
            onClick={() => navigate('/pricing')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Pricing
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Complete Your Purchase</h1>
          <p className="mt-2 text-muted-foreground">
            You're just a few steps away from unlocking premium features
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
                <CardDescription>Enter your payment information</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCompletePurchase} className="space-y-6">
                  {/* Cardholder Name */}
                  <div className="space-y-2">
                    <label htmlFor="cardName" className="text-sm font-medium text-foreground">
                      Cardholder Name
                    </label>
                    <Input
                      id="cardName"
                      name="cardName"
                      placeholder="John Doe"
                      value={paymentData.cardName}
                      onChange={handlePaymentChange}
                      disabled={isProcessing}
                      required
                    />
                  </div>

                  {/* Card Number */}
                  <div className="space-y-2">
                    <label htmlFor="cardNumber" className="text-sm font-medium text-foreground">
                      Card Number
                    </label>
                    <Input
                      id="cardNumber"
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={paymentData.cardNumber}
                      onChange={handlePaymentChange}
                      disabled={isProcessing}
                      required
                    />
                  </div>

                  {/* Expiry and CVV */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="expiryDate" className="text-sm font-medium text-foreground">
                        Expiry Date
                      </label>
                      <Input
                        id="expiryDate"
                        name="expiryDate"
                        placeholder="MM/YY"
                        value={paymentData.expiryDate}
                        onChange={handlePaymentChange}
                        disabled={isProcessing}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="cvv" className="text-sm font-medium text-foreground">
                        CVV
                      </label>
                      <Input
                        id="cvv"
                        name="cvv"
                        placeholder="123"
                        value={paymentData.cvv}
                        onChange={handlePaymentChange}
                        disabled={isProcessing}
                        type="password"
                        required
                      />
                    </div>
                  </div>

                  {/* Info Alert */}
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      This is a mock checkout. No actual payment will be processed.
                    </AlertDescription>
                  </Alert>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full gradient-primary text-primary-foreground shadow-glow hover:shadow-glow-md"
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing...' : 'Complete Purchase'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="border-border sticky top-6">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Plan Details */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-foreground">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground">Monthly subscription</p>
                  </div>

                  {/* Features */}
                  <div className="space-y-2 border-t border-border pt-4">
                    {plan.features.slice(0, 3).map((feature, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pricing Breakdown */}
                <div className="space-y-3 border-t border-border pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">₹{plan.price}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax (18% GST)</span>
                    <span className="text-foreground">₹{Math.round(plan.price * 0.18)}</span>
                  </div>
                  <div className="flex justify-between border-t border-border pt-3 text-base font-semibold">
                    <span className="text-foreground">Total</span>
                    <span className="text-primary">₹{Math.round(plan.price * 1.18)}</span>
                  </div>
                </div>

                {/* User Info */}
                <div className="space-y-2 border-t border-border pt-4">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">BILLING TO</p>
                    <p className="mt-1 text-sm font-medium text-foreground">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>

                {/* Guarantee */}
                <div className="rounded-lg bg-primary/10 p-3">
                  <p className="text-xs font-medium text-primary">✓ 14-day money-back guarantee</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Not satisfied? Get a full refund, no questions asked.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
