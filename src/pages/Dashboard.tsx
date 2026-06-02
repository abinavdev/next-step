import { useState } from 'react';
import { useUserStore } from '@/stores/userStore';
import { useAuthStore } from '@/stores/authStore';
import { useFeatureGate } from '@/hooks/useFeatureGate';
import { ProgressRing } from '@/components/dashboard/ProgressRing';
import { StatCard } from '@/components/dashboard/StatCard';
import { LevelBadge } from '@/components/dashboard/LevelBadge';
import { CareerCard } from '@/components/dashboard/CareerCard';
import { ContactMentorModal } from '@/components/dashboard/ContactMentorModal';
import { FeatureGate } from '@/components/FeatureGate';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdBanner from '@/components/ads/AdBanner';
import {
  Target,
  BookOpen,
  Trophy,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Award,
  Rocket,
  Crown,
  MessageCircle,
  Lock,
  Briefcase,
  Users,
  Code,
  BarChart3,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { CareerPath } from '@/types';

const mockCareerPaths: CareerPath[] = [
  {
    id: '1',
    title: 'Software Engineer',
    description: 'Build scalable applications and solve complex problems with code.',
    matchPercentage: 92,
    requiredSkills: ['JavaScript', 'React', 'Node.js', 'System Design', 'DSA'],
    averageSalary: '$120k',
    growthRate: '+22%',
    icon: 'Code',
  },
  {
    id: '2',
    title: 'Data Scientist',
    description: 'Extract insights from data and build predictive models.',
    matchPercentage: 78,
    requiredSkills: ['Python', 'Machine Learning', 'Statistics', 'SQL'],
    averageSalary: '$130k',
    growthRate: '+36%',
    icon: 'BarChart3',
  },
  {
    id: '3',
    title: 'Product Manager',
    description: 'Lead product strategy and bridge business with technology.',
    matchPercentage: 65,
    requiredSkills: ['Strategy', 'Analytics', 'Communication', 'Agile'],
    averageSalary: '$140k',
    growthRate: '+18%',
    icon: 'Target',
  },
];

export default function Dashboard() {
  const { profile } = useUserStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { hasFeature, isFreePlan } = useFeatureGate();
  const [activeTab, setActiveTab] = useState('overview');
  const [mentorModalOpen, setMentorModalOpen] = useState(false);

  const careerReadiness = 45;
  const skillsCompleted = profile?.completedSkills.length || 3;
  const totalSkills = 15;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Ads are enabled only for Free plan */}
      {isFreePlan() && <AdBanner placement="dashboard-top" />}

      {/* Subscription Banner */}
      {user?.subscription && (
        <Card
          className={`border-0 ${
            user.subscription.planId === 'free'
              ? 'bg-gradient-to-r from-secondary/50 to-secondary/30'
              : 'gradient-primary'
          }`}
        >
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {user.subscription.planId !== 'free' && (
                  <Crown
                    className={`h-6 w-6 ${
                      user.subscription.planId === 'free'
                        ? 'text-muted-foreground'
                        : 'text-primary-foreground'
                    }`}
                  />
                )}
                <div>
                  <p
                    className={`font-semibold ${
                      user.subscription.planId === 'free'
                        ? 'text-foreground'
                        : 'text-primary-foreground'
                    }`}
                  >
                    {user.subscription.planId === 'free'
                      ? ' Free Plan'
                      : ` ${user.subscription.planName} Plan`}
                  </p>
                  <p
                    className={`text-sm ${
                      user.subscription.planId === 'free'
                        ? 'text-muted-foreground'
                        : 'text-primary-foreground/80'
                    }`}
                  >
                    {user.subscription.planId === 'mentor-assistance'
                      ? 'Full access with personal mentor'
                      : user.subscription.planId === 'project-assistance'
                      ? 'Access to project guidance & resources'
                      : 'Access to basic content'}
                  </p>
                </div>
              </div>
              {user.subscription.planId === 'free' && (
                <Button
                  onClick={() => navigate('/pricing')}
                  className="gradient-primary text-primary-foreground shadow-glow hover:shadow-glow-md"
                >
                  Upgrade Now
                </Button>
              )}
              {user.subscription.planId === 'project-assistance' && (
                <Button
                  onClick={() => navigate('/pricing')}
                  className="gradient-primary text-primary-foreground shadow-glow hover:shadow-glow-md"
                >
                  Upgrade to Mentor
                </Button>
              )}
              {user.subscription.planId === 'mentor-assistance' && (
                <Button
                  onClick={() => setMentorModalOpen(true)}
                  variant="ghost"
                  className="text-primary-foreground hover:bg-primary-foreground/10 cursor-pointer"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Contact Mentor
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back{user?.name ? `, ${user.name}` : ''}! 
          </h1>
          <p className="mt-1 text-muted-foreground">
            {profile?.careerGoal
              ? `Your journey to becoming a ${profile.careerGoal} continues`
              : 'Discover your perfect career path'}
          </p>
        </div>
        <LevelBadge level={profile?.level || 1} xp={profile?.xp || 150} />
      </div>

      {/* Main Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Career Readiness"
          value={`${careerReadiness}%`}
          subtitle="Keep going!"
          icon={Target}
          trend="up"
          trendValue="+5% this week"
          variant="primary"
        />
        <StatCard
          title="Skills Completed"
          value={`${skillsCompleted}/${totalSkills}`}
          subtitle={`${totalSkills - skillsCompleted} remaining`}
          icon={BookOpen}
          trend="up"
          trendValue="+2 this month"
        />
        <StatCard
          title="Certifications"
          value="1"
          subtitle="AWS Cloud Practitioner"
          icon={Award}
        />
        <StatCard
          title="Current Streak"
          value="7 days"
          subtitle="Personal best: 14 days"
          icon={TrendingUp}
          trend="up"
          trendValue="🔥"
          variant="accent"
        />
      </div>

      {/* Tabbed Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects" disabled={!hasFeature('project-chart')}>
            <Briefcase className="mr-2 h-4 w-4" />
            Projects
            {!hasFeature('project-chart') && <Lock className="ml-1 h-3 w-3" />}
          </TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="mentorship" disabled={!hasFeature('mentorship')}>
            <Users className="mr-2 h-4 w-4" />
            Mentorship
            {!hasFeature('mentorship') && <Lock className="ml-1 h-3 w-3" />}
          </TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-8">
          {/* Progress Section */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Career Progress */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="text-lg font-semibold text-foreground">Career Progress</h3>
              <p className="text-sm text-muted-foreground">
                {profile?.careerGoal || 'Software Engineer'}
              </p>

              <div className="mt-6 flex justify-center">
                <ProgressRing progress={careerReadiness} size={160} strokeWidth={12}>
                  <div className="text-center">
                    <span className="text-3xl font-bold text-foreground">
                      {careerReadiness}%
                    </span>
                    <p className="text-xs text-muted-foreground">Ready</p>
                  </div>
                </ProgressRing>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Technical Skills</span>
                  <span className="font-medium text-foreground">60%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-secondary">
                  <div className="h-full w-[60%] rounded-full gradient-primary" />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Soft Skills</span>
                  <span className="font-medium text-foreground">40%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-secondary">
                  <div className="h-full w-[40%] rounded-full gradient-accent" />
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="rounded-2xl border border-border bg-card p-6 lg:col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Your Next Step</h3>
                  <p className="text-sm text-muted-foreground">
                    Recommended action to level up
                  </p>
                </div>
                <Button variant="ghost" onClick={() => navigate('/roadmap')}>
                  View Roadmap
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              <div className="mt-6 rounded-xl bg-gradient-hero p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary shadow-glow">
                    <Rocket className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-foreground">
                      Learn React Fundamentals
                    </h4>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Master component-based architecture and modern React patterns
                    </p>
                    <div className="mt-4 flex items-center gap-4">
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <BookOpen className="h-4 w-4" />
                        8 hours
                      </span>
                      <span className="flex items-center gap-1 text-sm text-accent">
                        <Trophy className="h-4 w-4" />
                        +100 XP
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="hero"
                    className="shrink-0"
                    onClick={() => navigate('/roadmap')}
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Start Now
                  </Button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <button className="flex items-center gap-3 rounded-xl border border-border bg-background p-4 text-left transition-all hover:border-primary/30 hover:shadow-soft">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Continue Learning</p>
                    <p className="text-xs text-muted-foreground">Data Structures</p>
                  </div>
                </button>
                <button className="flex items-center gap-3 rounded-xl border border-border bg-background p-4 text-left transition-all hover:border-accent/30 hover:shadow-soft">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                    <Award className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Get Certified</p>
                    <p className="text-xs text-muted-foreground">AWS Solutions Architect</p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Career Suggestions */}
          <div>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-foreground">
                  Recommended Careers
                </h3>
                <p className="text-sm text-muted-foreground">
                  Based on your skills and interests
                </p>
              </div>
              <Button variant="ghost" onClick={() => navigate('/careers')}>
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {mockCareerPaths.map((career) => (
                <CareerCard
                  key={career.id}
                  career={career}
                  onSelect={() => navigate('/roadmap')}
                />
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Projects Tab */}
        <TabsContent value="projects">
          {!hasFeature('project-chart') ? (
            <FeatureGate
              feature="project-chart"
              required="project"
              fallbackMessage="Project Tools are available in the Project Assistance plan and above. Unlock interactive charts, milestone tracking, and task management."
            />
          ) : (
            <div>
              <p className="mb-4 text-muted-foreground">
                Manage your projects with structured milestones and task tracking.
              </p>
              <Button
                onClick={() => navigate('/project-tools')}
                className="gradient-primary text-primary-foreground shadow-glow hover:shadow-glow-md"
              >
                <Briefcase className="mr-2 h-4 w-4" />
                Open Project Tools
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources" className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Premium Resources</CardTitle>
              <CardDescription>
                {isFreePlan()
                  ? 'Upgrade to access premium learning resources'
                  : 'Your personalized learning resources'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isFreePlan() ? (
                <FeatureGate
                  feature="premium-resources"
                  required="project"
                  fallbackMessage="Upgrade to access premium resources, including exclusive tutorials, guides, and code examples."
                />
              ) : (
                <div className="space-y-4">
                  <div className="rounded-lg border border-border p-4">
                    <Badge className="mb-2 gradient-primary text-primary-foreground">
                      New
                    </Badge>
                    <h4 className="font-semibold text-foreground">
                      System Design Masterclass
                    </h4>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Learn to design scalable systems with real-world examples
                    </p>
                  </div>
                  <div className="rounded-lg border border-border p-4">
                    <Badge className="mb-2" variant="outline">
                      In Progress
                    </Badge>
                    <h4 className="font-semibold text-foreground">
                      Advanced React Patterns
                    </h4>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Master advanced patterns and performance optimization
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Mentorship Tab */}
        <TabsContent value="mentorship">
          {!hasFeature('mentorship') ? (
            <FeatureGate
              feature="mentorship"
              required="mentor"
              fallbackMessage="Mentorship is available only in the Mentor + Assistance plan. Get access to 1:1 sessions, priority support, and personalized guidance."
            />
          ) : (
            <div>
              <p className="mb-4 text-muted-foreground">
                Connect with your personal mentor for guidance and support.
              </p>
              <Button
                onClick={() => navigate('/mentorship')}
                className="gradient-primary text-primary-foreground shadow-glow hover:shadow-glow-md"
              >
                <Users className="mr-2 h-4 w-4" />
                Open Mentorship
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Account Tab */}
        <TabsContent value="account" className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account and subscription</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <p className="font-medium text-foreground">Email</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <p className="font-medium text-foreground">Current Plan</p>
                  <p className="text-sm text-muted-foreground">
                    {user?.subscription?.planName || 'Free'}
                  </p>
                </div>
                <Button variant="outline" onClick={() => navigate('/pricing')}>
                  Manage Plan
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Contact Mentor Modal */}
      <ContactMentorModal 
        open={mentorModalOpen} 
        onOpenChange={setMentorModalOpen} 
      />
    </div>
  );
}
