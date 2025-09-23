"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { LoginModal } from "./login-modal";

export function CTAButton({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [showLogin, setShowLogin] = useState(false);
  return (
    <>
      <Button
        onClick={() => setShowLogin(true)}
        size="lg"
        className={cn("btn-hero", className)}
      >
        {children}
      </Button>
      <LoginModal open={showLogin} onOpenChange={setShowLogin} />
    </>
  );
}
