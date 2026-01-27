import { useState } from 'react';
import { useFeatureGate } from '@/hooks/useFeatureGate';
import { FeatureGate } from '@/components/FeatureGate';
import { MessageMentorModal } from '@/components/mentorship/MessageMentorModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar, Clock, MessageSquare, Plus, CheckCircle2, AlertCircle } from 'lucide-react';

interface MentorSession {
  id: string;
  date: string;
  time: string;
  topic: string;
  status: 'scheduled' | 'completed';
}

const mockMentor = {
  id: '1',
  name: 'Dr. Sarah Johnson',
  expertise: 'Full Stack Development & System Design',
  bio: 'Senior Software Engineer with 10+ years of experience',
  avatar: '👩‍💼',
};

const mockSessions: MentorSession[] = [
  {
    id: '1',
    date: '2024-02-01',
    time: '14:00',
    topic: 'System Design Fundamentals',
    status: 'completed',
  },
  {
    id: '2',
    date: '2024-02-08',
    time: '15:00',
    topic: 'Project Architecture Review',
    status: 'scheduled',
  },
];

export default function Mentorship() {
  const { hasFeature, isMentorPlan } = useFeatureGate();
  const [sessions, setSessions] = useState<MentorSession[]>(mockSessions);
  const [isBooking, setIsBooking] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    topic: '',
  });

  if (!hasFeature('mentorship')) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mentorship</h1>
          <p className="mt-1 text-muted-foreground">
            Get personalized guidance from an experienced mentor
          </p>
        </div>
        <FeatureGate
          feature="mentorship"
          required="mentor"
          fallbackMessage="Mentorship is available only in the Mentor + Assistance plan. Unlock 1:1 sessions, priority support, and personalized guidance."
        />
      </div>
    );
  }

  const handleBookSession = () => {
    if (!bookingData.date || !bookingData.time || !bookingData.topic.trim()) {
      alert('Please fill in all fields');
      return;
    }

    const newSession: MentorSession = {
      id: Date.now().toString(),
      date: bookingData.date,
      time: bookingData.time,
      topic: bookingData.topic,
      status: 'scheduled',
    };

    setSessions([...sessions, newSession]);
    setBookingData({ date: '', time: '', topic: '' });
    setIsBooking(false);
  };

  const upcomingSessions = sessions.filter((s) => s.status === 'scheduled');
  const completedSessions = sessions.filter((s) => s.status === 'completed');

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mentorship</h1>
          <p className="mt-1 text-muted-foreground">
            Get personalized guidance from an experienced mentor
          </p>
        </div>
      </div>

      {/* Mentor Profile */}
      <Card className="border-border bg-gradient-to-br from-primary/5 to-primary/10">
        <CardHeader>
          <CardTitle>Your Mentor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/20 text-4xl">
              {mockMentor.avatar}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-foreground">{mockMentor.name}</h3>
              <p className="mt-1 text-sm font-medium text-primary">{mockMentor.expertise}</p>
              <p className="mt-2 text-sm text-muted-foreground">{mockMentor.bio}</p>
            </div>
            <Button
              onClick={() => setIsMessageModalOpen(true)}
              className="gradient-primary text-primary-foreground shadow-glow hover:shadow-glow-md cursor-pointer"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Message
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Book a Session */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Book a Session</CardTitle>
          <CardDescription>Schedule a 1:1 mentoring session</CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog open={isBooking} onOpenChange={setIsBooking}>
            <DialogTrigger asChild>
              <Button className="gradient-primary text-primary-foreground shadow-glow hover:shadow-glow-md">
                <Plus className="mr-2 h-4 w-4" />
                Schedule Session
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Schedule a Mentoring Session</DialogTitle>
                <DialogDescription>
                  Choose a date, time, and topic for your session with {mockMentor.name}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Date</label>
                  <Input
                    type="date"
                    value={bookingData.date}
                    onChange={(e) =>
                      setBookingData({ ...bookingData, date: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Time</label>
                  <Input
                    type="time"
                    value={bookingData.time}
                    onChange={(e) =>
                      setBookingData({ ...bookingData, time: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Topic</label>
                  <Input
                    value={bookingData.topic}
                    onChange={(e) =>
                      setBookingData({ ...bookingData, topic: e.target.value })
                    }
                    placeholder="What would you like to discuss?"
                    className="mt-1"
                  />
                </div>
                <Button
                  onClick={handleBookSession}
                  className="w-full gradient-primary text-primary-foreground"
                >
                  Confirm Booking
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Upcoming Sessions */}
      {upcomingSessions.length > 0 && (
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Upcoming Sessions</CardTitle>
            <CardDescription>Your scheduled mentoring sessions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center gap-4 rounded-lg border border-primary/30 bg-primary/10 p-4 hover:bg-primary/15 transition-colors"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{session.topic}</p>
                  <div className="mt-1 flex gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {session.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {session.time}
                    </span>
                  </div>
                </div>
                <Badge className="bg-primary/20 text-primary hover:bg-primary/30">
                  Scheduled
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Completed Sessions */}
      {completedSessions.length > 0 && (
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Completed Sessions</CardTitle>
            <CardDescription>Your mentoring history</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {completedSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center gap-4 rounded-lg border border-accent/30 bg-accent/10 p-4 hover:bg-accent/15 transition-colors"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20">
                  <CheckCircle2 className="h-5 w-5 text-accent" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{session.topic}</p>
                  <div className="mt-1 flex gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {session.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {session.time}
                    </span>
                  </div>
                </div>
                <Badge className="bg-accent/20 text-accent hover:bg-accent/30">
                  Completed
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Quick Messaging */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Quick Message
          </CardTitle>
          <CardDescription>Send a message to your mentor</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input placeholder="Ask your mentor a question..." className="flex-1" />
            <Button className="gradient-primary text-primary-foreground shadow-glow">
              Send
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Message Mentor Modal */}
      <MessageMentorModal
        open={isMessageModalOpen}
        onOpenChange={setIsMessageModalOpen}
        mentorName={mockMentor.name}
      />
    </div>
  );
}
