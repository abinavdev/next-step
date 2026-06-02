import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/stores/userStore';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, Target, Map, Trophy, Zap, LogOut } from 'lucide-react';
import { useEffect } from 'react';
import Footer from '@/components/Footer';

const features = [
  {
    icon: Target,
    title: 'Smart Career Analysis',
    description: 'AI analyzes your syllabus to show what\'s actually useful for your dream job.',
  },
  {
    icon: Map,
    title: 'Visual Skill Roadmap',
    description: 'Interactive skill tree showing your path from student to professional.',
  },
  {
    icon: Trophy,
    title: 'Gamified Progress',
    description: 'Earn XP, badges, and level up as you complete skills and certifications.',
  },
  {
    icon: Zap,
    title: 'Personalized Recommendations',
    description: 'Get career suggestions based on your unique interests and strengths.',
  },
];

export default function Index() {
  const navigate = useNavigate();
  const { isOnboardingComplete } = useUserStore();
  const { isAuthenticated, user, logout } = useAuthStore();

  useEffect(() => {
    console.log("Index page - isOnboardingComplete:", isOnboardingComplete, "isAuthenticated:", isAuthenticated);
    if (isOnboardingComplete && isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isOnboardingComplete, isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary shadow-glow">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-foreground">
              NextStep AI
            </span>
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated && user ? (
              <>
                <span className="text-sm text-muted-foreground">Welcome, {user.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate('/login')}>
                  Sign In
                </Button>
                <Button 
                  gradient-primary 
                  className="gradient-primary text-primary-foreground shadow-glow hover:shadow-glow-md"
                  onClick={() => navigate('/register')}
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-50" />
        <div className="container relative mx-auto px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-6">
            <Sparkles className="h-4 w-4" />
            AI-Powered Career Guidance
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Your Personalized Path to
            <br />
            <span className="text-gradient-primary">Career Success</span>
          </h1>
          
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            NextStep AI analyzes your syllabus, interests, and goals to create a
            customized roadmap for your dream career. No more confusion about
            what to learn next.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              variant="hero"
              size="xl"
              onClick={() => navigate('/login')}
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Start Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4">
            {[
              { value: '10K+', label: 'Students' },
              { value: '500+', label: 'Skills Mapped' },
              { value: '50+', label: 'Career Paths' },
              { value: '95%', label: 'Satisfaction' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-6 py-24">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground">
            How NextStep AI Works
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            We combine AI analysis with proven career frameworks to give you
            clarity and direction.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-medium"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary shadow-glow transition-transform group-hover:scale-110">
                <feature.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {feature.description}
              </p>
              <div className="absolute bottom-6 right-6 flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-muted-foreground">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      </section>

      
           

      <Footer />
    </div>
  );
}
