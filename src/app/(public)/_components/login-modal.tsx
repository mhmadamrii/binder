"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { Mail, Lock, MessageSquare, User } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

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

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { mutate, isPending } = api.user.addNewUser.useMutation({
    onSuccess: () => {
      toast.success("User created successfully!");
      signIn("credentials", {
        email,
        password,
      });
    },
    onError: (err) => {
      toast.error(`Error: ${err.message}`);
    },
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    mutate({
      name,
      email,
      password,
    });
  };

  const handleLogin = async () => {
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (res?.error) {
        toast.error("Invalid email or password");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="card-gradient border-border h-full sm:max-h-[500px] sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="from-primary to-primary-glow bg-gradient-to-r bg-clip-text text-center text-2xl font-bold text-transparent">
            Welcome to Binder
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleRegister} className="w-full space-y-4">
          <Tabs defaultValue="account" className="max-h-[300px] w-full">
            <TabsList className="w-full">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <div className="mt-2 flex h-full w-full flex-col gap-4">
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
                  onClick={handleLogin}
                  type="button"
                  className="btn-hero w-full font-semibold"
                  disabled={isLoading}
                >
                  {isPending ? "Signing in..." : "Sign In"}
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="signup">
              <div className="mt-2 flex h-full w-full flex-col gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-foreground">
                    Username
                  </Label>
                  <div className="relative">
                    <User className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                    <Input
                      id="username"
                      placeholder="Enter your username"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-input border-border focus:ring-ring pl-10"
                      required
                    />
                  </div>
                </div>
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
                  {isPending ? "Signing in..." : "Sign Up"}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
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
          onClick={() => signIn("discord")}
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
