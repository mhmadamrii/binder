"use client";

import { MessageCircle, Plus, Search } from "lucide-react";
import { Button } from "~/components/ui/button";
import { CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { CreateGroup } from "./create-group";
import { useState } from "react";

export function CardGroupContent() {
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  return (
    <>
      <CardContent className="flex flex-1 items-center justify-center">
        <div className="space-y-6 text-center">
          <div className="from-primary to-primary-glow glow mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br">
            <MessageCircle className="h-12 w-12 text-white" />
          </div>

          <div>
            <h2 className="text-foreground mb-2 text-2xl font-bold">
              Select a group to start messaging
            </h2>
            <p className="text-muted-foreground">
              Choose from your existing groups or create a new one to begin
              conversations
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Input placeholder="Invitation links" />
            <Button className="cursor-pointer" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </div>

          <Button
            onClick={() => setShowCreateGroup(true)}
            className="btn-hero cursor-pointer"
            size="lg"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create New Group
          </Button>
        </div>
      </CardContent>
      <CreateGroup open={showCreateGroup} onOpenChange={setShowCreateGroup} />
    </>
  );
}
