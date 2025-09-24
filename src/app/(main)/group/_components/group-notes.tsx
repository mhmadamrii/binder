"use client";

import { Loader, MessageCircle, PlusCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import { NoteCard } from "./note-card";

export function GroupNotes({ groupId }: { groupId: string }) {
  const utils = api.useUtils();

  const [isOpenCreateNote, setIsOpenCreateNote] = useState(false);
  const [note, setNote] = useState({
    title: "",
    desc: "",
  });

  const { data: groupNotes } = api.note.getAllGroupNotes.useQuery({
    groupId,
  });

  const { mutate: createNote, isPending } = api.note.createNote.useMutation({
    onSuccess: () => {
      setNote({ title: "", desc: "" });
      utils.invalidate();
      setIsOpenCreateNote(false);
      toast.success("Note created successfully");
    },
  });

  console.log("groupNotes", groupNotes);

  return (
    <Card className="card-gradient border-border mb-4 min-h-[400px]">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center justify-between">
          <span>Group Notes</span>
          <Button
            onClick={() => setIsOpenCreateNote(true)}
            size="sm"
            variant="ghost"
            className="hover:bg-secondary"
          >
            <PlusCircle className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent>
        {groupNotes?.length == 0 && (
          <div
            className={cn("py-8 text-center", {
              hidden: isOpenCreateNote,
            })}
          >
            <div className="bg-secondary/50 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <MessageCircle className="text-muted-foreground h-8 w-8" />
            </div>
            <h3 className="text-foreground mb-2 font-semibold">No notes yet</h3>
            <p className="text-muted-foreground mb-4 text-sm">
              Start adding important notes and information for this group
            </p>
            <Button
              onClick={() => setIsOpenCreateNote(true)}
              size="sm"
              className="btn-hero"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add First Note
            </Button>
          </div>
        )}
        {groupNotes?.map((item) => (
          <NoteCard key={item.notes.id} note={item} />
        ))}
        <form
          className={cn("space-y-3 rounded-lg", {
            hidden: !isOpenCreateNote,
          })}
        >
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
                  groupId: groupId,
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
      </CardContent>
    </Card>
  );
}
