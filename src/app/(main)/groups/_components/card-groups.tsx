"use client";

import Link from "next/link";

import { CircleCheckBig, HatGlasses, Loader, Users } from "lucide-react";
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
  filteredGroups: Array<{
    id: string;
    name: string;
    lastMessage: string;
    timestamp: string;
    unread: number;
    members: number;
    isPrivate: boolean;
    isJoined?: boolean;
  }>;
}

export function CardGroups({ filteredGroups, isPublic }: CardGroupsProps) {
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [isOpenRequestJoin, setIsOpenRequestJoin] = useState(false);

  return (
    <CardContent className="flex flex-1 flex-col px-0">
      <ScrollArea className="h-[calc(100vh-310px)]" type="always">
        {filteredGroups.map((group, idx) => (
          <Link
            prefetch={true}
            className="hover:bg-secondary/50 mb-[10px] block w-full cursor-pointer rounded-lg border p-3 transition-colors"
            href={`/group/${group.id}`}
            key={idx}
            onClick={(e) => {
              if (isPublic && !group.isJoined) {
                e.preventDefault();
                setSelectedGroupId(group.id);
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
        selectedGroupId={selectedGroupId}
        open={isOpenRequestJoin}
        onOpenChange={setIsOpenRequestJoin}
      />
    </CardContent>
  );
}

function RequestJoinModal({
  selectedGroupId,
  open,
  onOpenChange,
}: {
  selectedGroupId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();

  const { mutate, isPending } = api.group.addCurrentUserToGroup.useMutation({
    onSuccess: (res) => {
      router.push(`/group/${res.groupId}`);
      toast.success("User added to group successfully!");
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => mutate({ groupId: selectedGroupId })}
          >
            {isPending ? <Loader className="animate-spin" /> : "Proceed"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
