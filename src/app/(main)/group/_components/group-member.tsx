"use client";

import { Copy, Loader, PlusCircle, UserPlus, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { MultiSelectUsers } from "~/components/multi-select-user";
import { useState } from "react";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";

type User = {
  id: string;
  name: string | null;
  email: string;
  avatar: string | null;
};

export function GroupMember({
  groupId,
  invitationCode,
}: {
  groupId: string;
  invitationCode: string;
}) {
  const router = useRouter();
  const utils = api.useUtils();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  const { data: allMembers, isLoading } =
    api.user.getAllUsersNotInGroup.useQuery(
      {
        groupId,
      },
      {
        enabled: isOpen,
      },
    );

  const { mutate, isPending } = api.group.addMembersToGroup.useMutation({
    onSuccess: () => {
      toast.success("Members added successfully!");
      setIsOpen(false);
      setSelectedUsers([]);
      router.refresh();
      utils.invalidate();
    },
  });

  const handleAddMembers = () => {
    mutate({
      userIds: selectedUsers.map((u) => u.id),
      groupId,
    });
  };

  const handleSelectMultiUser = (user: User[]) => {
    setSelectedUsers(user);
  };

  return (
    <>
      <Card className="card-gradient border-border">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center justify-between">
            <span>Add Member</span>
            <Users className="text-primary h-4 w-4" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={() => setIsOpen(true)} className="btn-hero w-full">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Member
          </Button>
          <Separator className="bg-border" />
          <div className="text-center">
            <p className="text-muted-foreground mb-2 text-xs">
              or share invite link
            </p>
            <div className="flex items-center space-x-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="w-1/2"
                    onClick={async () => {
                      await navigator.clipboard.writeText(
                        `https://binder-goakal.vercel.app/join?invitationId=${groupId}`,
                      );
                      toast.success("Copied to clipboard!");
                    }}
                    variant="secondary"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Binder Invite Link</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="w-1/2"
                    onClick={async () => {
                      await navigator.clipboard.writeText(`${invitationCode}`);
                      toast.success("Copied to clipboard!");
                    }}
                    variant="secondary"
                  >
                    <UserPlus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Group Invite Code</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Members to Group</DialogTitle>
          </DialogHeader>
          <MultiSelectUsers
            disabled={isPending || isLoading}
            onSelectionChange={handleSelectMultiUser}
            selectedUsers={selectedUsers}
            users={
              allMembers?.map((user) => ({
                id: user.id,
                name: user.name,
                email: user.email,
                avatar: user.image,
              })) ?? []
            }
            placeholder="Select users..."
          />
          <Button
            className="cursor-pointer"
            disabled={isPending || selectedUsers.length === 0}
            onClick={() => handleAddMembers()}
          >
            {isPending ? (
              <Loader className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Add Member"
            )}
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
