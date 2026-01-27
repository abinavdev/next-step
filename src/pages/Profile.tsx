import { useState } from 'react';
import { useUserStore } from '@/stores/userStore';
import { useAuthStore } from '@/stores/authStore';
import { LevelBadge } from '@/components/dashboard/LevelBadge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  GraduationCap,
  Target,
  Heart,
  BookOpen,
  Edit2,
  LogOut,
  Award,
  Zap,
  CheckCircle2,
  Flame,
  User as UserIcon,
  Mail,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProfileEditWizard } from '@/components/profile/ProfileEditWizard';

interface BadgeItem {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const mockBadges: BadgeItem[] = [
  { id: '1', name: 'Early Adopter', icon: Zap, description: 'Joined NextStep AI' },
  { id: '2', name: 'First Steps', icon: CheckCircle2, description: 'Completed onboarding' },
  { id: '3', name: 'Skill Seeker', icon: Flame, description: 'Completed 3 skills' },
];

export default function Profile() {
  const { profile, resetOnboarding } = useUserStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const [editOpen, setEditOpen] = useState(false);
  const [editStep, setEditStep] = useState<1 | 2 | 3 | 4>(1);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Your Profile</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your account and view your progress
          </p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Log Out
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full gradient-primary shadow-glow text-3xl">
                {(user?.name || profile?.name)?.[0]?.toUpperCase() || '👤'}
              </div>
              <h2 className="mt-4 text-xl font-semibold text-foreground">
                {user?.name || profile?.name || 'Student'}
              </h2>
              <p className="text-sm text-muted-foreground">{profile?.branch}</p>
            </div>

            <div className="mt-6">
              <LevelBadge level={profile?.level || 1} xp={profile?.xp || 150} />
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4 border-t border-border pt-6 text-center">
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {profile?.completedSkills.length || 3}
                </p>
                <p className="text-xs text-muted-foreground">Skills</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">1</p>
                <p className="text-xs text-muted-foreground">Certifications</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {mockBadges.length}
                </p>
                <p className="text-xs text-muted-foreground">Badges</p>
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="mt-6 rounded-2xl border border-border bg-card p-6">
            <h3 className="flex items-center gap-2 font-semibold text-foreground">
              <Award className="h-5 w-5 text-primary" />
              Badges Earned
            </h3>
            <div className="mt-4 space-y-3">
              {mockBadges.map((badge) => (
                <div
                  key={badge.id}
                  className="flex items-center gap-3 rounded-lg bg-secondary/50 p-3"
                >
                  <badge.icon className="h-6 w-6 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">{badge.name}</p>
                    <p className="text-xs text-muted-foreground">{badge.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-6 lg:col-span-2">
          {/* Account Information */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <UserIcon className="h-5 w-5 text-primary" />
              Account Information
            </h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <Label className="text-muted-foreground">Username</Label>
                <p className="mt-1 font-medium text-foreground">
                  {user?.name || 'Not set'}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Email</Label>
                <p className="mt-1 font-medium text-foreground">
                  {user?.email || 'Not set'}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Current Plan</Label>
                <p className="mt-1 font-medium text-foreground">
                  {user?.subscription?.planName || 'Free'}
                </p>
              </div>
            </div>
          </div>

          {/* Education */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <GraduationCap className="h-5 w-5 text-primary" />
                Education
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setEditStep(1);
                  setEditOpen(true);
                }}
              >
                <Edit2 className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <Label className="text-muted-foreground">Degree</Label>
                <p className="mt-1 font-medium text-foreground">
                  {profile?.degree || 'B.Tech / B.E.'}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Branch</Label>
                <p className="mt-1 font-medium text-foreground">
                  {profile?.branch || 'Computer Science'}
                </p>
              </div>
            </div>
          </div>

          {/* Syllabus Topics */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <BookOpen className="h-5 w-5 text-primary" />
                Syllabus Topics
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setEditStep(2);
                  setEditOpen(true);
                }}
              >
                <Edit2 className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {(profile?.syllabusTopics || [
                'Data Structures',
                'Algorithms',
                'DBMS',
              ]).map((topic) => (
                <Badge key={topic} variant="secondary">
                  {topic}
                </Badge>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <Heart className="h-5 w-5 text-primary" />
                Interests
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setEditStep(3);
                  setEditOpen(true);
                }}
              >
                <Edit2 className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {(profile?.interests || ['technology', 'data']).map((interest) => (
                <Badge key={interest} variant="outline" className="capitalize">
                  {interest}
                </Badge>
              ))}
            </div>
          </div>

          {/* Career Goal */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <Target className="h-5 w-5 text-primary" />
                Career Goal
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setEditStep(4);
                  setEditOpen(true);
                }}
              >
                <Edit2 className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </div>
            <div className="mt-4">
              <div className="rounded-xl bg-gradient-hero p-4">
                <p className="text-lg font-semibold text-foreground">
                  {profile?.careerGoal || 'Software Engineer'}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  You're on track! Keep learning to achieve your goal.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full-screen wizard that reuses onboarding UI for editing */}
      <ProfileEditWizard
        open={editOpen}
        initialStep={editStep}
        onClose={() => setEditOpen(false)}
      />
    </div>
  );
}
