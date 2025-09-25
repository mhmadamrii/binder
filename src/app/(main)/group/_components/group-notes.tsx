"use client";

import { MessageCircle, PlusCircle, SquareArrowOutUpRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Anonymous_Pro } from "next/font/google";
import { useEffect, useState } from "react";
import { SortableList } from "~/components/dnd/sortable";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import { DialogAddNote } from "./dialog-add-note";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";

type DraggableItem = {
  id: number;
  title: string;
  desc: string;
  author: string;
  createdAt: Date;
};

const anon = Anonymous_Pro({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export function GroupNotes({ groupId }: { groupId: string }) {
  const router = useRouter();
  const [isOpenCreateNote, setIsOpenCreateNote] = useState(false);
  const [draggableItems, setDraggableItems] = useState<DraggableItem[]>([]);

  const { data: groupNotes } = api.note.getAllGroupNotes.useQuery({
    groupId,
  });

  const handleSetDefaultGroupNotes = () => {
    if (!groupNotes) return [];

    setDraggableItems(
      groupNotes?.map((item) => ({
        id: item.notes.id,
        title: item.notes.title,
        desc: item.notes.desc,
        author: item.user.name ?? "Anonymous",
        createdAt: item.notes.createdAt,
      })),
    );
  };

  useEffect(() => {
    if (groupNotes) {
      handleSetDefaultGroupNotes();
    }
  }, [groupNotes]);

  return (
    <Card className="card-gradient min-h-[400px] pt-3 pb-2">
      <CardHeader className="mb-0 py-0">
        <CardTitle className="text-foreground flex items-center justify-between">
          <span>Group Notes</span>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="hover:bg-secondary"
                  onClick={() => router.push(`/group/${groupId}/notes`)}
                >
                  <SquareArrowOutUpRight className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Show All Notes</p>
              </TooltipContent>
            </Tooltip>
            <DialogAddNote
              isOpenCreateNote={isOpenCreateNote}
              setIsOpenCreateNote={setIsOpenCreateNote}
            />
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="px-2">
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
        {draggableItems?.length! > 0 && (
          <ScrollArea className="h-[300px] pr-3">
            <SortableList
              items={draggableItems}
              onChange={setDraggableItems}
              renderItem={(item) => {
                return (
                  <SortableList.Item id={item.id}>
                    <div className="flex h-full w-full justify-between">
                      <div className="w-full">
                        <Card>
                          <CardContent>
                            <div className="flex justify-between">
                              <div className="w-[90%]">
                                <h1 className={cn(anon.className)}>
                                  {item.title}
                                </h1>
                                <p
                                  className={cn(
                                    "truncate text-ellipsis",
                                    anon.className,
                                  )}
                                >
                                  {item.desc}
                                </p>
                                <span className={cn("text-sm", anon.className)}>
                                  {format(item.createdAt, "dd/MM/yyyy")} - by{" "}
                                  {item.author}
                                </span>
                              </div>
                              <SortableList.DragHandle />
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </SortableList.Item>
                );
              }}
            />
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
