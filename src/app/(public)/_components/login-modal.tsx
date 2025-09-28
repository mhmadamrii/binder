"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { Mail, Lock, User, Loader } from "lucide-react";
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
  const [isLoadingDc, setIsLoadingDc] = useState(false);

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
    setIsLoading(true);
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (!res?.error) {
        router.push("/groups");
      }
      if (res?.error) {
        toast.error("Invalid email or password");
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsLoading(false);
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
                      disabled={isLoading}
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
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <Button
                  onClick={handleLogin}
                  type="button"
                  className="btn-hero w-full cursor-pointer font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader className="animate-spin" /> : "Sign In"}
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
                      disabled={isLoading}
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
                      disabled={isLoading}
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
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="btn-hero w-full cursor-pointer font-semibold"
                  disabled={isLoading}
                >
                  {isPending ? <Loader className="animate-spin" /> : "Sign Up"}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </form>

        <div className="relative h-[20px]">
          <div className="absolute inset-0 flex items-center">
            <Separator className="bg-border w-full" />
          </div>
          <div className="relative top-[3px] flex justify-center text-xs uppercase">
            <span className="text-muted-foreground bg-background px-3">
              or continue with
            </span>
          </div>
        </div>

        <Button
          onClick={() => {
            setIsLoadingDc(true);
            signIn("discord", {
              redirectTo: "/groups",
            });
          }}
          variant="outline"
          className="border-border hover:bg-secondary hover:text-secondary-foreground w-full cursor-pointer"
          disabled={isLoading}
        >
          {isLoadingDc ? (
            <Loader className="animate-spin" />
          ) : (
            <>
              <svg viewBox="0 0 256 199" preserveAspectRatio="xMidYMid">
                <path
                  d="M216.856 16.597A208.502 208.502 0 0 0 164.042 0c-2.275 4.113-4.933 9.645-6.766 14.046-19.692-2.961-39.203-2.961-58.533 0-1.832-4.4-4.55-9.933-6.846-14.046a207.809 207.809 0 0 0-52.855 16.638C5.618 67.147-3.443 116.4 1.087 164.956c22.169 16.555 43.653 26.612 64.775 33.193A161.094 161.094 0 0 0 79.735 175.3a136.413 136.413 0 0 1-21.846-10.632 108.636 108.636 0 0 0 5.356-4.237c42.122 19.702 87.89 19.702 129.51 0a131.66 131.66 0 0 0 5.355 4.237 136.07 136.07 0 0 1-21.886 10.653c4.006 8.02 8.638 15.67 13.873 22.848 21.142-6.58 42.646-16.637 64.815-33.213 5.316-56.288-9.08-105.09-38.056-148.36ZM85.474 135.095c-12.645 0-23.015-11.805-23.015-26.18s10.149-26.2 23.015-26.2c12.867 0 23.236 11.804 23.015 26.2.02 14.375-10.148 26.18-23.015 26.18Zm85.051 0c-12.645 0-23.014-11.805-23.014-26.18s10.148-26.2 23.014-26.2c12.867 0 23.236 11.804 23.015 26.2 0 14.375-10.148 26.18-23.015 26.18Z"
                  fill="#5865F2"
                />
              </svg>
              Discord
            </>
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
