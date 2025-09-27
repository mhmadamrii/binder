import { Loader, Notebook, PlusCircle } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

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

export function DialogAddNote({
  isOpenCreateNote,
  setIsOpenCreateNote,
}: {
  isOpenCreateNote: boolean;
  setIsOpenCreateNote: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const params = useParams<{ id: string }>();
  const pathname = usePathname();
  const utils = api.useUtils();

  const [note, setNote] = useState({
    title: "",
    desc: "",
  });

  const { mutate: createNote, isPending } = api.note.createNote.useMutation({
    onSuccess: () => {
      setNote({ title: "", desc: "" });
      utils.invalidate();
      setIsOpenCreateNote(false);
      toast.success("Note created successfully");
    },
  });

  return (
    <Dialog open={isOpenCreateNote} onOpenChange={setIsOpenCreateNote}>
      {!pathname.includes("notes") && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => setIsOpenCreateNote(true)}
              size="sm"
              variant="ghost"
              className="hover:bg-secondary cursor-pointer"
            >
              <PlusCircle className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Add New Note</p>
          </TooltipContent>
        </Tooltip>
      )}

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-2 flex items-center">
            <Notebook className="mr-2 h-4 w-4" />
            Add New Note
          </DialogTitle>
          <form className={cn("space-y-3 rounded-lg", {})}>
            <Input
              placeholder="Note title..."
              disabled={isPending}
              value={note.title}
              onChange={(e) =>
                setNote((prev) => ({ ...prev, title: e.target.value }))
              }
              className="bg-input border-border"
            />
            <Textarea
              placeholder="Note content..."
              disabled={isPending}
              value={note.desc}
              onChange={(e) =>
                setNote((prev) => ({ ...prev, desc: e.target.value }))
              }
              className="bg-input border-border min-h-[100px]"
            />
            <div className="flex space-x-2">
              <Button
                onClick={() =>
                  createNote({
                    groupId: params.id,
                    title: note.title,
                    desc: note.desc,
                  })
                }
                type="button"
                size="sm"
                className="w-[100px]"
              >
                {isPending ? (
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Save Note"
                )}
              </Button>
              <Button
                onClick={() => setIsOpenCreateNote(false)}
                type="button"
                variant="ghost"
                size="sm"
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
