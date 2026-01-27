import { useState } from 'react';
import { useUserStore } from '@/stores/userStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { BookOpen, ArrowRight, ArrowLeft, X, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

const suggestedTopics = [
  'Data Structures',
  'Algorithms',
  'Database Management',
  'Operating Systems',
  'Computer Networks',
  'Machine Learning',
  'Web Development',
  'Cloud Computing',
  'Cybersecurity',
  'Software Engineering',
  'Object-Oriented Programming',
  'Statistics',
];

interface StepSyllabusProps {
  onNext: () => void;
  onBack: () => void;
}

export function StepSyllabus({ onNext, onBack }: StepSyllabusProps) {
  const { onboarding, updateOnboarding } = useUserStore();
  const [inputValue, setInputValue] = useState('');

  const addTopic = (topic: string) => {
    if (topic && !onboarding.syllabusTopics.includes(topic)) {
      updateOnboarding({
        syllabusTopics: [...onboarding.syllabusTopics, topic],
      });
    }
    setInputValue('');
  };

  const removeTopic = (topic: string) => {
    updateOnboarding({
      syllabusTopics: onboarding.syllabusTopics.filter((t) => t !== topic),
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      addTopic(inputValue.trim());
    }
  };

  const isValid = onboarding.syllabusTopics.length >= 3;

  return (
    <div className="animate-fade-in">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow">
          <BookOpen className="h-8 w-8 text-primary-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">
          What are you studying?
        </h2>
        <p className="mt-2 text-muted-foreground">
          Add at least 3 topics from your current syllabus
        </p>
      </div>

      <div className="mx-auto max-w-lg space-y-6">
        {/* Input */}
        <div className="flex gap-2">
          <Input
            placeholder="Type a topic and press Enter"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button
            variant="secondary"
            size="icon"
            onClick={() => addTopic(inputValue.trim())}
            disabled={!inputValue.trim()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Selected Topics */}
        {onboarding.syllabusTopics.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Selected Topics ({onboarding.syllabusTopics.length})
            </label>
            <div className="flex flex-wrap gap-2">
              {onboarding.syllabusTopics.map((topic) => (
                <Badge
                  key={topic}
                  variant="default"
                  className="flex items-center gap-1 bg-primary/10 text-primary hover:bg-primary/20"
                >
                  {topic}
                  <button
                    onClick={() => removeTopic(topic)}
                    className="ml-1 rounded-full p-0.5 hover:bg-primary/20"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Suggestions */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Suggested topics (click to add)
          </label>
          <div className="flex flex-wrap gap-2">
            {suggestedTopics
              .filter((topic) => !onboarding.syllabusTopics.includes(topic))
              .map((topic) => (
                <Badge
                  key={topic}
                  variant="outline"
                  className="cursor-pointer transition-all hover:border-primary hover:bg-primary/5"
                  onClick={() => addTopic(topic)}
                >
                  {topic}
                </Badge>
              ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-3 pt-4">
          <Button variant="outline" onClick={onBack} className="flex-1">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button
            variant="hero"
            onClick={onNext}
            disabled={!isValid}
            className="flex-1"
          >
            Continue
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {!isValid && (
          <p className="text-center text-sm text-muted-foreground">
            Add {3 - onboarding.syllabusTopics.length} more topic
            {3 - onboarding.syllabusTopics.length !== 1 && 's'} to continue
          </p>
        )}
      </div>
    </div>
  );
}
