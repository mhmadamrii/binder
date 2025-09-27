"use client";

import { Search, Users } from "lucide-react";
import { useState } from "react";
import { CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { CreateGroup } from "./create-group";
import { useQueryState } from "nuqs";

export function CardGroupHeader() {
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [search, setSearch] = useQueryState("search", {
    defaultValue: "",
  });
  return (
    <>
      <CardHeader className="px-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground flex items-center gap-2">
            <Users className="text-primary h-4 w-4" />
            Groups
          </CardTitle>
        </div>

        <div className="relative">
          <Search className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
          <Input
            placeholder="Search groups..."
            value={search ?? ""}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-input border-border pl-10"
          />
        </div>
      </CardHeader>
      <CreateGroup open={showCreateGroup} onOpenChange={setShowCreateGroup} />
    </>
  );
}
