import { useState } from 'react';
import { CareerCard } from '@/components/dashboard/CareerCard';
import { useUserStore } from '@/stores/userStore';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { allCareers } from '@/data/careers';

const categories = ['All', 'Engineering', 'Data', 'Design', 'Management', 'Security'];

export default function Careers() {
  const navigate = useNavigate();
  const { profile } = useUserStore();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredCareers = allCareers
    .filter((career) => {
      const matchesSearch =
        career.title.toLowerCase().includes(search.toLowerCase()) ||
        career.description.toLowerCase().includes(search.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => b.matchPercentage - a.matchPercentage);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Explore Careers</h1>
        <p className="mt-1 text-muted-foreground">
          Discover career paths that match your skills and interests
        </p>
      </div>

      {/* Insights */}
      <div className="rounded-2xl border border-border bg-gradient-hero p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary shadow-glow">
            <TrendingUp className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">AI Career Insights</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Based on your {profile?.interests.length || 3} interests and{' '}
              {profile?.syllabusTopics.length || 5} syllabus topics, we've found{' '}
              <span className="font-medium text-accent">{filteredCareers.length} matching careers</span>{' '}
              for you. Software Engineer has the highest match at 92%!
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search careers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>

      {/* Career Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredCareers.map((career) => (
          <CareerCard
            key={career.id}
            career={career}
            onSelect={() => navigate(`/career/${career.id}`)}
          />
        ))}
      </div>

      {filteredCareers.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">No careers found matching your search.</p>
        </div>
      )}
    </div>
  );
}
