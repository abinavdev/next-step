import { useNavigate, useParams } from "react-router-dom";
import { allCareers } from "@/data/careers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Target,
  TrendingUp,
  PlayCircle,
  Code,
  BarChart3,
  Settings,
  Palette,
  Brain,
  Shield,
  Cloud,
} from "lucide-react";
import { useUserStore } from "@/stores/userStore";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Code,
  BarChart3,
  Target,
  Settings,
  Palette,
  Brain,
  Shield,
  Cloud,
};

export default function CareerDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profile, setProfile } = useUserStore();

  const career = allCareers.find((c) => c.id === id);

  if (!career) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <p className="text-muted-foreground">Career not found.</p>
      </div>
    );
  }

  const handleTrackCareer = () => {
    if (!profile) return;
    setProfile({
      ...profile,
      careerGoal: career.title,
    });
    navigate("/roadmap");
  };

  const IconComponent = iconMap[career.icon];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Back + match */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to careers
        </Button>
        <Badge variant="outline" className="border-accent/40 text-accent">
          {career.matchPercentage}% match
        </Badge>
      </div>

      {/* Header */}
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          {/* Icon - No Container */}
          {IconComponent ? (
            <IconComponent className="h-8 w-8 text-primary flex-shrink-0" />
          ) : (
            <span className="text-3xl flex-shrink-0">{career.icon}</span>
          )}
          <div>
            <h1 className="text-3xl font-bold text-foreground">{career.title}</h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              {career.description}
            </p>
          </div>
        </div>
        <div className="space-y-1 text-right text-sm text-muted-foreground">
          <p>
            <span className="font-semibold text-foreground">Average salary:</span>{" "}
            {career.averageSalary}
          </p>
          <p className="flex items-center justify-end gap-1">
            <TrendingUp className="h-4 w-4 text-accent" />
            <span className="font-semibold text-foreground">Growth:</span>{" "}
            {career.growthRate}
          </p>
        </div>
      </header>

      {/* Required skills */}
      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-red-500">
          Required Skills
        </h2>
        <div className="flex flex-wrap gap-2">
          {career.requiredSkills.map((skill) => (
            <Badge key={skill} variant="secondary">
              {skill}
            </Badge>
          ))}
        </div>
      </section>

      {/* Roadmap */}
      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-red-500">
          Roadmap
        </h2>
        <div className="space-y-3 rounded-2xl border border-border bg-card p-4">
          {[
            "Master core computer science fundamentals and problem solving.",
            "Build 3–4 solid projects to showcase your skills.",
            "Learn system design and architecture basics.",
            "Prepare for technical interviews and refine your portfolio.",
          ].map((step, index) => (
            <div key={index} className="flex gap-3 text-sm text-muted-foreground">
              <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                {index + 1}
              </span>
              <p>{step}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Resources */}
      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-red-500">
          Videos & Resources
        </h2>
        <div className="space-y-3">
          {[
            "Day in the life of a " + career.title,
            "Top skills needed to become a " + career.title,
            "Free roadmap & resources for " + career.title,
          ].map((title, index) => (
            <button
              key={index}
              className="flex w-full items-center justify-between rounded-xl border border-border bg-card p-4 text-left transition-all hover:border-accent/40 hover:shadow-soft"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                  <PlayCircle className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{title}</p>
                  <p className="text-xs text-muted-foreground uppercase">Video</p>
                </div>
              </div>
              <span className="text-xs text-accent">View</span>
            </button>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-accent/40 bg-accent/5 p-5">
        <div className="flex items-center gap-3">
          <Target className="h-5 w-5 text-accent" />
          <div>
            <p className="text-sm font-semibold text-foreground">
              Track this career as your goal
            </p>
            <p className="text-xs text-muted-foreground">
              Add it to your profile to see it reflected in your roadmap and XP.
            </p>
          </div>
        </div>
        <Button variant="hero" onClick={handleTrackCareer}>
          Add to My Goal
        </Button>
      </section>
    </div>
  );
}

