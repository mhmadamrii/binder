import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { Mail, Lock, MessageSquare } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      toast.success("Welcome to Binder!");
      setIsLoading(false);
      onOpenChange(false);
      router.push("/groups");
    }, 1000);
  };

  const handleDiscordLogin = () => {
    setIsLoading(true);
    // Simulate Discord login
    setTimeout(() => {
      toast.success("Logged in with Discord!");
      setIsLoading(false);
      onOpenChange(false);
      router.push("/groups");
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="card-gradient border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="from-primary to-primary-glow bg-gradient-to-r bg-clip-text text-center text-2xl font-bold text-transparent">
            Welcome to Binder
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">
              Email
            </Label>
            <div className="relative">
              <Mail className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-input border-border focus:ring-ring pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground">
              Password
            </Label>
            <div className="relative">
              <Lock className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-input border-border focus:ring-ring pl-10"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="btn-hero w-full font-semibold"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="bg-border w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card text-muted-foreground px-2">
              or continue with
            </span>
          </div>
        </div>

        <Button
          onClick={handleDiscordLogin}
          variant="outline"
          className="border-border hover:bg-secondary hover:text-secondary-foreground w-full"
          disabled={isLoading}
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          Discord
        </Button>
      </DialogContent>
    </Dialog>
  );
}
