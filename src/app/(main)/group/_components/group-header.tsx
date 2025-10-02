import Link from "next/link";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { ChevronLeft, Users } from "lucide-react";
import { GroupSettings } from "./group-setting";

export function GroupHeader({
  groupName,
  groupDescription,
  membersCount,
}: {
  groupName?: string;
  groupDescription?: string;
  membersCount?: number;
}) {
  return (
    <header className="bg-card/50 flex h-[60px] items-center border-b backdrop-blur-sm">
      <div className="w-full px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link prefetch={true} href="/groups">
              <Button
                variant="secondary"
                size="icon"
                className="hover:bg-secondary/50 cursor-pointer rounded-full"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </Link>

            <div className="flex items-center space-x-3">
              <div className="flex flex-col gap-0">
                <span className="text-foreground text-xl font-bold">
                  {groupName || "-"}
                </span>
                <span className="text-muted-foreground text-[12px]">
                  {groupDescription}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Badge
              variant="secondary"
              className="bg-primary/20 text-primary border-primary/30"
            >
              <Users className="mr-1 h-3 w-3" />
              {membersCount} members
            </Badge>
            <GroupSettings />
          </div>
        </div>
      </div>
    </header>
  );
}
