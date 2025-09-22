import { Button } from "~/components/ui/button";
import { useRouter } from "next/navigation";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Users, Hash, FileText } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

interface CreateGroupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateGroup({ open, onOpenChange }: CreateGroupModalProps) {
  const router = useRouter();
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!groupName.trim()) {
      toast.error("Group name is required!");
      return;
    }

    setIsLoading(true);

    // Simulate group creation
    setTimeout(() => {
      const groupId = Math.random().toString(36).substr(2, 9);
      toast.success(`Group "${groupName}" created successfully!`);
      setIsLoading(false);
      onOpenChange(false);

      // Reset form
      setGroupName("");
      setDescription("");

      // Redirect to the group message page
      router.push("/");
    }, 1000);
  };

  const handleClose = () => {
    setGroupName("");
    setDescription("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="card-gradient border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="from-primary to-primary-glow bg-gradient-to-r bg-clip-text text-center text-2xl font-bold text-transparent">
            Create New Group
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleCreateGroup} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="groupName" className="text-foreground">
              Group Name
            </Label>
            <div className="relative">
              <Hash className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
              <Input
                id="groupName"
                type="text"
                placeholder="Enter group name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="bg-input border-border focus:ring-ring pl-10"
                maxLength={50}
                required
              />
            </div>
            <p className="text-muted-foreground text-xs">
              {groupName.length}/50 characters
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground">
              Description (Optional)
            </Label>
            <div className="relative">
              <FileText className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
              <Textarea
                id="description"
                placeholder="What's this group about?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-input border-border focus:ring-ring resize-none pl-10"
                rows={3}
                maxLength={200}
              />
            </div>
            <p className="text-muted-foreground text-xs">
              {description.length}/200 characters
            </p>
          </div>

          <div className="bg-secondary/30 border-border flex items-center rounded-lg border p-3">
            <Users className="text-primary mr-2 h-4 w-4" />
            <div className="text-sm">
              <p className="text-foreground font-medium">Group Privacy</p>
              <p className="text-muted-foreground">
                Only invited members can join this group
              </p>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              className="border-border hover:bg-secondary flex-1"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="btn-hero flex-1 font-semibold"
              disabled={isLoading || !groupName.trim()}
            >
              {isLoading ? "Creating..." : "Create Group"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
