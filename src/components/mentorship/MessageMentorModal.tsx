import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2, Send } from 'lucide-react';

interface MessageMentorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mentorName: string;
}

// Stub function to simulate sending a mentor message
async function sendMentorMessage(message: string): Promise<{ status: string }> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return { status: 'ok' };
}

export function MessageMentorModal({
  open,
  onOpenChange,
  mentorName,
}: MessageMentorModalProps) {
  const { toast } = useToast();
  const [message, setMessage] = useState('');
  const [sessionContext, setSessionContext] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a message before sending.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await sendMentorMessage(message);
      if (result.status === 'ok') {
        toast({
          title: 'Success',
          description: 'Your message has been sent to your mentor!',
        });
        setMessage('');
        setSessionContext('');
        onOpenChange(false);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to send message. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred while sending your message.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Reset form when closing
      setMessage('');
      setSessionContext('');
      setIsLoading(false);
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Message Your Mentor</DialogTitle>
          <DialogDescription>
            Send a message to {mentorName} for guidance and support
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Mentor Info */}
          <div className="rounded-lg border border-border bg-secondary/50 p-4">
            <div>
              <Label className="text-xs text-muted-foreground">Mentor</Label>
              <p className="font-medium text-foreground">{mentorName}</p>
            </div>
          </div>

          {/* Message Textarea */}
          <div className="space-y-2">
            <Label htmlFor="message">Your Message</Label>
            <Textarea
              id="message"
              placeholder="Ask your mentor a question or request guidance..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[120px] resize-none border border-border bg-card text-foreground placeholder:text-muted-foreground"
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              {message.length} / 500 characters
            </p>
          </div>

          {/* Session Context Note */}
          <div className="space-y-2">
            <Label htmlFor="context">Session Context (Optional)</Label>
            <Textarea
              id="context"
              placeholder="Add context about your question, session topic, or any relevant details..."
              value={sessionContext}
              onChange={(e) => setSessionContext(e.target.value)}
              className="min-h-[80px] resize-none border border-border bg-card text-foreground placeholder:text-muted-foreground"
              disabled={isLoading}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSend}
              disabled={isLoading || !message.trim()}
              className="gradient-primary flex-1 text-primary-foreground shadow-glow hover:shadow-glow-md"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
