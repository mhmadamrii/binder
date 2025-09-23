"use client";

import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { CreateGroup } from "./create-group";

export function CardGroupHeader() {
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  return (
    <>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground">Your Groups</CardTitle>
          <Button
            onClick={() => console.log("")}
            size="sm"
            className="btn-hero"
          >
            <Plus className="mr-1 h-4 w-4" />
            New
          </Button>
        </div>

        <div className="relative">
          <Search className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
          <Input
            placeholder="Search groups..."
            value={""}
            onChange={(e) => console.log(e.target.value)}
            className="bg-input border-border pl-10"
          />
        </div>
      </CardHeader>
      <CreateGroup open={showCreateGroup} onOpenChange={setShowCreateGroup} />
    </>
  );
}
