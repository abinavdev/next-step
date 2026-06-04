NextStep

NextStep is an AI-powered career roadmap and skill development platform designed to help students and aspiring professionals discover, plan, and achieve their career goals through personalized learning paths, project guidance, and progress tracking.

Overview

NextStep provides customized career roadmaps based on a user's educational background, interests, and career aspirations. By leveraging AI-driven recommendations and interactive learning experiences, the platform helps users develop industry-relevant skills and track their professional growth effectively.

---

Key Features

Personalized Career Roadmaps

- Generate customized career roadmaps based on:
  - Degree
  - Branch/Specialization
  - Interests
  - Career Goals
- Support for both predefined and custom career paths.
- Dynamic roadmap generation tailored to individual users.

AI-Powered Recommendations

- AI-generated skill recommendations.
- Technology and tool suggestions.
- Project recommendations aligned with career goals.
- Career guidance powered by Google Gemini.

Interactive Learning Experience

- Gamified skill progression system.
- Skill modules with XP rewards.
- Achievement badges.
- Daily learning missions.
- Persistent roadmap progress across sessions.

Progress Tracking

- Monitor completed skills and learning modules.
- XP-based progression and leveling system.
- Career growth analytics and insights.

Project Management

- Milestone-based project planning.
- Task management system.
- File upload support.
- AI-powered project submission analysis.
- Progress monitoring and tracking.

User Profile Management

- Update degree and branch information.
- Manage interests and learning preferences.
- Modify career goals.
- Maintain personalized learning profiles.

Authentication & Security

- Secure authentication using Supabase.
- Persistent user sessions.
- Protected application routes.
- Row Level Security (RLS) for data protection.

---

Technology Stack

Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Zustand

Backend & Database

Supabase

- Authentication
- PostgreSQL Database
- Row Level Security (RLS)

Artificial Intelligence

- Google Gemini API
- Dynamic Roadmap Generation
- AI-Powered Recommendations
- Career Guidance Engine

Deployment

- Vercel

---

Project Structure

src/
├── components/
│   ├── onboarding/
│   ├── profile/
│   ├── roadmap/
│   └── ui/
│
├── pages/
│   ├── Dashboard.tsx
│   ├── Roadmap.tsx
│   ├── Profile.tsx
│   ├── Projects.tsx
│   └── Pricing.tsx
│
├── stores/
│   ├── authStore.ts
│   └── userStore.ts
│
├── lib/
│   ├── gemini.ts
│   ├── roadmapGenerator.ts
│   ├── roadmapMapper.ts
│   ├── profile.ts
│   └── supabaseClient.ts
│
└── types/

---

Environment Variables

Create a ".env" file in the root directory and configure the following variables:

VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key

---

Installation

Clone the Repository

git clone <repository-url>
cd NextStep

Install Dependencies

npm install

Start Development Server

npm run dev

Build for Production

npm run build

Preview Production Build

npm run preview

---

Database Setup

Create a Supabase project and configure the following table:

create table profiles (
  id uuid primary key,
  name text,
  degree text,
  branch text,
  interests jsonb,
  syllabus_topics jsonb,
  career_goal text,
  roadmap jsonb,
  completed_skills jsonb default '[]',
  level int default 1,
  xp int default 0
);

Enable Row Level Security (RLS) and configure the required access policies.

---

Future Enhancements

- Interactive Skill Tree Visualization
- AI Mentor Chat Assistant
- Resume Builder
- Interview Preparation Module
- Company-Specific Career Roadmaps
- Certification Tracking
- Community Learning Features
- Leaderboards and Advanced Gamification

---

Author

Abinavdev A D

B.Tech Student | Full Stack Developer | AI Enthusiast

---

License

This project is intended for educational, learning, research, and portfolio purposes.