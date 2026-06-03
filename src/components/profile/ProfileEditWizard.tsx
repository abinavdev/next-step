import { useEffect, useRef } from "react";
import { useUserStore } from "@/stores/userStore";
import { StepEducation } from "@/components/onboarding/StepEducation";
import { StepSyllabus } from "@/components/onboarding/StepSyllabus";
import { StepInterests } from "@/components/onboarding/StepInterests";
import { StepCareerGoal } from "@/components/onboarding/StepCareerGoal";

type StepIndex = 1 | 2 | 3 | 4;

interface ProfileEditWizardProps {
  open: boolean;
  initialStep: StepIndex;
  onClose: () => void;
}

export const ProfileEditWizard = ({ open, initialStep, onClose }: ProfileEditWizardProps) => {
  const { profile, onboarding, updateOnboarding, setProfile } = useUserStore();
  const step: StepIndex = initialStep;
  const hasInitialized = useRef(false);

  // Handle body overflow when modal opens/closes
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // When opening, seed onboarding data from current profile so UI is prefilled.
  // Initialize only once per open to avoid repeated updates causing re-renders.
  useEffect(() => {
    if (!open) {
      // Reset so next open will re-initialize
      hasInitialized.current = false;
      return;
    }

    if (hasInitialized.current) return;
    hasInitialized.current = true;

    if (profile) {
      updateOnboarding({
        step: initialStep,
        degree: profile.degree,
        branch: profile.branch,
        syllabusTopics: profile.syllabusTopics,
        interests: profile.interests,
        careerGoal: profile.careerGoal || "",
      });
    } else {
      updateOnboarding({ step: initialStep });
    }
  }, [open, initialStep, profile, updateOnboarding]);

  if (!open) return null;

  const applyOnboardingToProfile = () => {
    const updated = {
      id: profile?.id ?? crypto.randomUUID(),
      name: profile?.name || "Student",
      degree: onboarding.degree,
      branch: onboarding.branch,
      syllabusTopics: onboarding.syllabusTopics,
      interests: onboarding.interests,
      careerGoal: onboarding.careerGoal,
      level: profile?.level ?? 1,
      xp: profile?.xp ?? 0,
      completedSkills: profile?.completedSkills ?? [],
      badges: profile?.badges ?? [],
    };

    setProfile(updated);
  };

  const handleComplete = () => {
    applyOnboardingToProfile();
    onClose();
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <StepEducation onNext={handleComplete} />;
      case 2:
        return <StepSyllabus onNext={handleComplete} onBack={onClose} />;
      case 3:
        return <StepInterests onNext={handleComplete} onBack={onClose} />;
      case 4:
        return <StepCareerGoal onComplete={handleComplete} onBack={onClose} />;
      default:
        return null;
    }
  };

  return (
    <div className="modal-root" onClick={(e) => e.currentTarget === e.target && onClose()}>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal-container">
        {/* Header - Fixed */}
        <div className="modal-header">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {step === 1 && "Edit education"}
              {step === 2 && "Edit syllabus topics"}
              {step === 3 && "Edit interests"}
              {step === 4 && "Edit career goal"}
            </p>
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Close
            </button>
          </div>
        </div>

        {/* Content - Dedicated Scroll Container */}
        <div className="modal-content-scroll" onWheel={(e) => e.stopPropagation()}>
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

