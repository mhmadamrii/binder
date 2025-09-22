"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { MessageCircle, Shield, Users, Zap } from "lucide-react";
import { LoginModal } from "./_components/login-modal";

export default function Public() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="bg-background min-h-screen">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/hero-image.jpg"
            alt="Binder Hero"
            className="h-full w-full object-cover opacity-20"
          />
          <div className="from-background/90 to-background/60 absolute inset-0 bg-gradient-to-br" />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-24 text-center">
          <h1 className="from-primary via-primary-glow to-accent mb-6 bg-gradient-to-r bg-clip-text text-6xl font-bold text-transparent md:text-8xl">
            Binder
          </h1>
          <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-xl md:text-2xl">
            Connect, communicate, and collaborate seamlessly with your team in
            one powerful messaging platform
          </p>

          <Button
            onClick={() => setShowLogin(true)}
            size="lg"
            className="btn-hero glow px-8 py-6 text-lg"
          >
            Get Started
          </Button>
        </div>
      </section>

      <section className="bg-card/30 py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-foreground mb-16 text-center text-4xl font-bold">
            Why Choose Binder?
          </h2>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="card-gradient border-border hover:border-primary/50 rounded-xl border p-6 text-center transition-colors">
              <MessageCircle className="text-primary mx-auto mb-4 h-12 w-12" />
              <h3 className="text-foreground mb-2 text-xl font-semibold">
                Real-time Messaging
              </h3>
              <p className="text-muted-foreground">
                Instant messaging with your team members anywhere, anytime
              </p>
            </div>

            <div className="card-gradient border-border hover:border-primary/50 rounded-xl border p-6 text-center transition-colors">
              <Users className="text-primary mx-auto mb-4 h-12 w-12" />
              <h3 className="text-foreground mb-2 text-xl font-semibold">
                Group Management
              </h3>
              <p className="text-muted-foreground">
                Create and organize groups for different projects and teams
              </p>
            </div>

            <div className="card-gradient border-border hover:border-primary/50 rounded-xl border p-6 text-center transition-colors">
              <Zap className="text-primary mx-auto mb-4 h-12 w-12" />
              <h3 className="text-foreground mb-2 text-xl font-semibold">
                Lightning Fast
              </h3>
              <p className="text-muted-foreground">
                Optimized for speed and performance across all devices
              </p>
            </div>

            <div className="card-gradient border-border hover:border-primary/50 rounded-xl border p-6 text-center transition-colors">
              <Shield className="text-primary mx-auto mb-4 h-12 w-12" />
              <h3 className="text-foreground mb-2 text-xl font-semibold">
                Secure & Private
              </h3>
              <p className="text-muted-foreground">
                Your conversations are protected with end-to-end encryption
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="from-primary/10 to-accent/10 bg-gradient-to-r py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-foreground mb-6 text-4xl font-bold">
            Ready to Transform Your Communication?
          </h2>
          <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-xl">
            Join thousands of teams already using Binder to streamline their
            workflow and boost productivity
          </p>

          <Button
            onClick={() => setShowLogin(true)}
            size="lg"
            className="btn-hero glow px-12 py-6 text-lg"
          >
            Start Messaging Now
          </Button>
        </div>
      </section>

      <LoginModal open={showLogin} onOpenChange={setShowLogin} />
    </div>
  );
}
