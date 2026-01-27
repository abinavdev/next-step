export interface UserProfile {
  id: string;
  name: string;
  degree: string;
  branch: string;
  syllabusTopics: string[];
  interests: string[];
  careerGoal?: string;
  level: number;
  xp: number;
  completedSkills: string[];
  badges: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: Date;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  category: 'technical' | 'soft' | 'certification' | 'course';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  prerequisites: string[];
  estimatedHours: number;
  resources: Resource[];
  isCompleted: boolean;
  isUnlocked: boolean;
  position: { x: number; y: number };
}

export interface Resource {
  id: string;
  title: string;
  type: 'video' | 'article' | 'course' | 'book';
  url: string;
  platform: string;
}

export interface CareerPath {
  id: string;
  title: string;
  description: string;
  matchPercentage: number;
  requiredSkills: string[];
  averageSalary: string;
  growthRate: string;
  icon: string;
}

export interface SyllabusAnalysis {
  topic: string;
  relevance: 'high' | 'medium' | 'low';
  careerConnection: string;
}

export interface OnboardingData {
  step: number;
  degree: string;
  branch: string;
  syllabusTopics: string[];
  interests: string[];
  careerGoal: string;
  knowsCareerGoal: boolean;
}

export type PlanType = 'free' | 'project-assistance' | 'mentor-assistance';

export interface Plan {
  id: PlanType;
  name: string;
  price: number;
  description?: string;
  features: string[];
  monthlyPrice?: number;
}

export interface Subscription {
  planId: PlanType;
  planName: string;
  price: number;
  features: string[];
  startDate: Date;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  subscription?: Subscription;
}
