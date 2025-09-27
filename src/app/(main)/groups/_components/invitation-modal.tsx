"use client";

import { Button } from "~/components/ui/button";
import { Users } from "lucide-react";
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
  isValid: boolean; // from your API check
  group?: {
    id: string;
    name: string;
    desc: string;
    membersCount: number;
  };
  onJoin: (groupId: string) => void;
};

export function InvitationModal({
  isOpen,
  onClose,
  isValid,
  group,
  onJoin,
}: InvitationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* Invalid Invitation Modal */}
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

      {/* Valid Invitation Modal */}
      {isValid && group && (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Join Group</DialogTitle>
            <DialogDescription>
              You’ve been invited to join this group. Please review the group
              details and rules before joining.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Group Info */}
            <div className="rounded-md border p-3">
              <h2 className="text-lg font-semibold">{group.name}</h2>
              <p className="text-muted-foreground text-sm">{group.desc}</p>
              <div className="text-muted-foreground mt-2 flex items-center gap-1 text-sm">
                <Users className="h-4 w-4" />
                {group.membersCount} members
              </div>
            </div>

            {/* Rules (hardcoded for now) */}
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
            <Button className="btn-hero" onClick={() => onJoin(group.id)}>
              Join Group
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
}
