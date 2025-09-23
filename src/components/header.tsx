"use client";

import { LogOut, Settings } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { signOut } from "next-auth/react";

export function Header() {
  return (
    <header className="border-border bg-card/50 sticky top-0 z-50 border-b backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="from-primary to-primary-glow bg-gradient-to-r bg-clip-text text-2xl font-bold text-transparent">
              Binder
            </h1>
            <Badge
              variant="secondary"
              className="bg-primary/20 text-primary border-primary/30"
            >
              Dashboard
            </Badge>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => signOut()}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
