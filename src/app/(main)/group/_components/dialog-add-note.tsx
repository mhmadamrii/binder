import { Loader, Notebook, PlusCircle } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

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
import { EditorClient } from "~/components/editor/editor-client";

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
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-2 flex items-center">
            <Notebook className="mr-2 h-4 w-4" />
            Add New Note
          </DialogTitle>
        </DialogHeader>
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
            className="bg-input border-border max-h-[400px] min-h-[100px]"
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
      </DialogContent>
    </Dialog>
  );
}
