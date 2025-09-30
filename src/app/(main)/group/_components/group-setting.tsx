"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import { Separator } from "~/components/ui/separator";
import { Button } from "~/components/ui/button";
import { LogOut, Settings, Trash2 } from "lucide-react";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "~/components/ui/popover";

export function GroupSettings() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const { data: isAdmin } = api.group.isCurrentUserGroupOwner.useQuery({
    groupId: params.id,
  });

  const { mutate: quitGroup } = api.group.quitGroup.useMutation({
    onSuccess: (res) => {
      toast.success("You have successfully quit the group");
      router.refresh();
      router.push("/groups");
    },
  });

  const { mutate: deleteGroup } = api.group.deleteGroup.useMutation({
    onSuccess: (res) => {
      toast.success("You have successfully delete the group");
      router.refresh();
      router.push("/groups");
    },
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-40 p-2">
        <div className="flex flex-col space-y-1">
          <Button
            variant="ghost"
            size="sm"
            className="justify-start"
            onClick={() => {
              quitGroup({ groupId: params.id });
              setOpen(false);
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Quit Group
          </Button>

          {isAdmin && (
            <>
              <Separator className="my-1 w-full" />
              <Button
                variant="ghost"
                size="sm"
                className="justify-start text-red-600 hover:text-red-700"
                onClick={() => {
                  deleteGroup({ groupId: params.id });
                  setOpen(false);
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Group
              </Button>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
