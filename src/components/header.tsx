"use client";

import { Loader, LogOut } from "lucide-react";
import { Button } from "~/components/ui/button";
import { signOut } from "next-auth/react";
import { useState } from "react";

export function Header() {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <header className="border-border bg-card/50 sticky top-0 z-50 border-b backdrop-blur-sm">
      <div className="px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="from-primary to-primary-glow bg-gradient-to-r bg-clip-text text-2xl font-bold text-transparent">
              Binder
            </h1>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              className="cursor-pointer"
              variant="secondary"
              size="icon"
              onClick={() => {
                setIsLoading(true);
                signOut();
              }}
            >
              {isLoading ? (
                <Loader className="animate-spin" />
              ) : (
                <LogOut className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
