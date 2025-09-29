"use client";

import { Button } from "~/components/ui/button";
import { toast } from "sonner";
import { Loader, Users } from "lucide-react";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "~/components/ui/dialog";

type InvitationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  isValid: boolean;
  group?: {
    id: string;
    name: string;
    desc: string;
    membersCount: number;
  };
};

export function InvitationModal({
  isOpen,
  onClose,
  isValid,
  group,
}: InvitationModalProps) {
  const router = useRouter();
  const utils = api.useUtils();

  const { mutate, isPending } = api.group.addCurrentUserToGroup.useMutation({
    onSuccess: (res) => {
      router.push(`/group/${res.groupId}`);
      toast.success(`Successfully joined group ${group?.name}`);
      void utils.group.getPublicGroups.invalidate();
    },
  });
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {!isValid && (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invalid Invitation</DialogTitle>
            <DialogDescription>
              The invitation link or code you entered is not valid.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={onClose}>Close</Button>
          </DialogFooter>
        </DialogContent>
      )}

      {isValid && group && (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Join Group</DialogTitle>
            <DialogDescription>
              Please review the group details and rules before joining.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="rounded-md border p-3">
              <h2 className="text-lg font-semibold">{group.name}</h2>
              <p className="text-muted-foreground text-sm">{group.desc}</p>
              <div className="text-muted-foreground mt-2 flex items-center gap-1 text-sm">
                <Users className="h-4 w-4" />
                {group.membersCount} members
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

          <DialogFooter>
            <Button
              className="btn-hero"
              onClick={() => mutate({ groupId: group.id })}
            >
              {isPending ? <Loader className="animate-spin" /> : "Join Group"}
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
}
