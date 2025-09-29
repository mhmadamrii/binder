"use client";

import Link from "next/link";

import { CardGroupEmpty } from "./card-group-empty";
import { CircleCheckBig, HatGlasses, Loader, Users } from "lucide-react";
import { useQueryState } from "nuqs";
import { CardContent } from "~/components/ui/card";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import { Badge } from "~/components/ui/badge";
import { ScrollArea } from "~/components/ui/scroll-area";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";

interface CardGroupsProps {
  isPublic?: boolean;
  availableGroups: Array<{
    id: string;
    name: string;
    lastMessage: string;
    timestamp: string;
    unread: number;
    members: number;
    isPrivate: boolean;
    isJoined?: boolean;
    desc: string;
  }>;
}

export function CardGroups({ availableGroups, isPublic }: CardGroupsProps) {
  const [search] = useQueryState("search");
  const [selectedGroup, setSelectedGroup] = useState({
    name: "",
    desc: "",
    membersCount: 0,
    id: "",
  });
  const [isOpenRequestJoin, setIsOpenRequestJoin] = useState(false);

  const filteredGroups = availableGroups.filter((c) =>
    c.name.toLowerCase().includes(search?.toLowerCase() ?? ""),
  );

  return (
    <CardContent className="flex flex-1 flex-col px-0">
      <ScrollArea className="h-[calc(100vh-310px)]" type="always">
        {filteredGroups.length === 0 && (
          <CardGroupEmpty name={search ?? "Groups"} onCreate={() => {}} />
        )}
        {filteredGroups.map((group, idx) => (
          <Link
            prefetch={true}
            className="hover:bg-secondary/50 mb-[10px] block w-full cursor-pointer rounded-lg border p-3 transition-colors"
            href={`/group/${group.id}`}
            key={idx}
            onClick={(e) => {
              if (isPublic && !group.isJoined) {
                e.preventDefault();
                setSelectedGroup({
                  name: group.name,
                  desc: group.desc,
                  membersCount: group.members,
                  id: group.id,
                });
                setIsOpenRequestJoin(true);
              }
            }}
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
            <p className="text-muted-foreground max-w-[300px] truncate text-sm text-ellipsis">
              {group.lastMessage}
            </p>
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground mt-1 text-xs">
                {group.timestamp}
              </p>
              {group.isJoined && (
                <div className="text-muted-foreground flex items-center gap-1 text-xs">
                  <CircleCheckBig className="mr-1 h-3 w-3 text-green-500" />
                  Joined
                </div>
              )}
            </div>
          </Link>
        ))}
      </ScrollArea>
      <RequestJoinModal
        selectedGroupId={selectedGroup.id}
        open={isOpenRequestJoin}
        onOpenChange={setIsOpenRequestJoin}
        groupName={selectedGroup.name}
        groupMembersCount={selectedGroup.membersCount}
        groupDesc={selectedGroup.desc}
      />
    </CardContent>
  );
}

function RequestJoinModal({
  selectedGroupId,
  open,
  groupName,
  groupDesc,
  groupMembersCount,
  onOpenChange,
}: {
  selectedGroupId: string;
  open: boolean;
  groupName: string;
  groupDesc: string;
  groupMembersCount: number;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const utils = api.useUtils();

  const { mutate, isPending } = api.group.addCurrentUserToGroup.useMutation({
    onSuccess: (res) => {
      router.push(`/group/${res.groupId}`);
      toast.success(`Successfully joined ${groupName}`);
      void utils.group.getPublicGroups.invalidate();
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Join Group</AlertDialogTitle>
          <AlertDialogDescription>
            Please review the group details and rules before joining.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-4 py-2">
          <div className="rounded-md border p-3">
            <h2 className="text-lg font-semibold">{groupName}</h2>
            <p className="text-muted-foreground text-sm">{groupDesc}</p>
            <div className="text-muted-foreground mt-2 flex items-center gap-1 text-sm">
              <Users className="h-4 w-4" />
              {groupMembersCount} members
            </div>
          </div>

          <div className="bg-muted/30 rounded-md border p-3 text-sm">
            <p className="mb-2 font-semibold">Group Rules</p>
            <ul className="text-muted-foreground list-disc space-y-1 pl-4">
              <li>No racist content</li>
              <li>No pornographic material</li>
              <li>Respect other members</li>
              <li>No spam or self-promotion</li>
            </ul>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => mutate({ groupId: selectedGroupId })}
          >
            {isPending ? <Loader className="animate-spin" /> : "Join"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
