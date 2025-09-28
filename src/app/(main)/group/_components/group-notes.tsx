"use client";

import Link from "next/link";

import { ReadOnlyEditorClient } from "~/components/editor/editor-client";
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
  MessageCircle,
  MoreHorizontal,
  PlusCircle,
  SquareArrowOutUpRight,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";

export type DraggableItem = {
  id: number;
  title: string;
  desc: string;
  author: string;
  createdAt: Date;
};

export const anon = Anonymous_Pro({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export function GroupNotes({ groupId }: { groupId: string }) {
  const utils = api.useUtils();
  const [noteMode, setNoteMode] = useState<"block" | "simple">("block");
  const [isOpenCreateNote, setIsOpenCreateNote] = useState(false);
  const [draggableItems, setDraggableItems] = useState<DraggableItem[]>([]);

  const { data: groupNotes } = api.note.getAllGroupNotes.useQuery({
    groupId,
  });

  const { mutate: updateNoteOrder } = api.note.updateNoteOrder.useMutation({
    onSuccess: () => {
      void utils.note.getAllGroupNotes.invalidate();
    },
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

  const handleDragEnd = (newItems: DraggableItem[]) => {
    console.log("updating");
    setDraggableItems(newItems);
    const updatedOrder = newItems.map((item, index) => ({
      id: item.id,
      order: index + 1,
    }));

    updateNoteOrder({ groupId, updatedOrder });
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Menu</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setNoteMode("block")}>
                  Block Note
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setNoteMode("simple")}>
                  Simple Note
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  className="hover:bg-secondary block"
                  href={`/group/${groupId}/notes?type=${noteMode}`}
                >
                  <SquareArrowOutUpRight className="h-4 w-4" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Show Details</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardTitle>
      </CardHeader>

      <DialogAddNote
        isOpenCreateNote={isOpenCreateNote}
        setIsOpenCreateNote={setIsOpenCreateNote}
      />

      <CardContent className="px-2">
        {groupNotes?.length == 0 && (
          <div
            className={cn("py-8 text-center", {
              hidden: noteMode === "block",
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
              className="btn-hero cursor-pointer"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add First Note
            </Button>
          </div>
        )}
        {noteMode === "block" && (
          <ScrollArea className="h-[300px] pr-3" type="always">
            <ReadOnlyEditorClient groupId={groupId} />
          </ScrollArea>
        )}

        {noteMode === "simple" && draggableItems?.length! > 0 && (
          <ScrollArea className="h-[300px] pr-3" type="always">
            <SortableList
              items={draggableItems}
              onChange={handleDragEnd}
              renderItem={(item) => {
                return (
                  <SortableList.Item id={item.id}>
                    <div className="flex h-full w-full justify-between">
                      <div className="w-full">
                        <Card className="relative pt-2 pb-2 pl-2">
                          <CardContent className="p-1">
                            <div className="flex justify-between">
                              <div className="flex w-[90%] flex-col gap-2">
                                <h1 className={cn("text-md", anon.className)}>
                                  {item.title}
                                </h1>
                                <p
                                  className={cn(
                                    "truncate text-sm text-ellipsis",
                                    anon.className,
                                  )}
                                >
                                  {item.desc}
                                </p>
                                <p
                                  className={cn(
                                    "text-muted-foreground text-sm",
                                    anon.className,
                                  )}
                                >
                                  {format(item.createdAt, "dd/MM/yyyy")} — by{" "}
                                  {item.author}
                                </p>
                              </div>
                              <div className="absolute top-0 right-0 p-0">
                                <SortableList.DragHandle />
                              </div>
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
