"use client";

import { HatGlasses, Users } from "lucide-react";
import { CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { ScrollArea } from "~/components/ui/scroll-area";
import { useRouter } from "next/navigation";

interface CardGroupsProps {
  filteredGroups: Array<{
    id: string;
    name: string;
    lastMessage: string;
    timestamp: string;
    unread: number;
    members: number;
    isPrivate: boolean;
  }>;
}

export function CardGroups({ filteredGroups }: CardGroupsProps) {
  const router = useRouter();
  console.log("filteredGroups", filteredGroups);
  return (
    <CardContent className="flex flex-1 flex-col px-0">
      <ScrollArea className="h-[calc(100vh-310px)] pr-3" type="always">
        {filteredGroups.map((group) => (
          <div
            key={group.id}
            onClick={() => router.push(`/group/${group.id}`)}
            className="border-border hover:bg-secondary/50 mb-[10px] cursor-pointer rounded-lg border p-3 transition-colors"
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
                {group.isPrivate && (
                  <div className="text-muted-foreground flex items-center text-xs">
                    <HatGlasses className="mr-1 h-3 w-3" />
                  </div>
                )}
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
      </ScrollArea>
    </CardContent>
  );
}
