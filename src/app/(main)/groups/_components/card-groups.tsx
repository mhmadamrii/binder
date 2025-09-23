"use client";

import { Users } from "lucide-react";
import { CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";

interface CardGroupsProps {
  filteredGroups: Array<{
    id: number;
    name: string;
    lastMessage: string;
    timestamp: string;
    unread: number;
    members: number;
  }>;
}

export function CardGroups({ filteredGroups }: CardGroupsProps) {
  return (
    <CardContent className="space-y-2">
      {filteredGroups.map((group) => (
        <div
          key={group.id}
          onClick={() => console.log("")}
          className="border-border hover:bg-secondary/50 cursor-pointer rounded-lg border p-3 transition-colors"
        >
          <div className="mb-1 flex items-center justify-between">
            <h3 className="text-foreground font-semibold">{group.name}</h3>
            <div className="flex items-center space-x-2">
              {group.unread > 0 && (
                <Badge className="bg-primary text-primary-foreground text-xs">
                  {group.unread}
                </Badge>
              )}
              <div className="text-muted-foreground flex items-center text-xs">
                <Users className="mr-1 h-3 w-3" />
                {group.members}
              </div>
            </div>
          </div>
          <p className="text-muted-foreground truncate text-sm">
            {group.lastMessage}
          </p>
          <p className="text-muted-foreground mt-1 text-xs">
            {group.timestamp}
          </p>
        </div>
      ))}
    </CardContent>
  );
}
