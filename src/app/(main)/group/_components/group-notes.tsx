"use client";

import Link from "next/link";

import { MessageCircle, PlusCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import { NoteCard } from "./note-card";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { DialogAddNote } from "./dialog-add-note";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export function GroupNotes({ groupId }: { groupId: string }) {
  const [isOpenCreateNote, setIsOpenCreateNote] = useState(false);

  const { data: groupNotes } = api.note.getAllGroupNotes.useQuery({
    groupId,
  });

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    console.log("Dragged:", result.source.index, "→", result.destination.index);
  };

  console.log("groupNotes", groupNotes);

  return (
    <Card className="card-gradient border-border min-h-[400px]">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center justify-between">
          <span>Group Notes</span>
          <DialogAddNote
            isOpenCreateNote={isOpenCreateNote}
            setIsOpenCreateNote={setIsOpenCreateNote}
          />
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
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable
            ignoreContainerClipping
            isDropDisabled={false}
            isCombineEnabled
            droppableId="note-list"
          >
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="space-y-2"
              >
                <ScrollArea
                  className={cn("h-[calc(100vh-550px)]", {
                    "h-0": groupNotes?.length == 0,
                  })}
                >
                  {groupNotes?.map((note, index) => (
                    <Draggable
                      key={note.notes.id}
                      draggableId={note.notes.id.toString()}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps} // required
                          {...provided.dragHandleProps} // if you want whole card draggable
                          style={provided.draggableProps.style} // required for movement
                          className={`transition ${
                            snapshot.isDragging ? "scale-105 shadow-lg" : ""
                          }`}
                        >
                          <NoteCard
                            note={note}
                            dragHandleProps={provided.dragHandleProps}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                </ScrollArea>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        {groupNotes?.length! > 0 && (
          <CardFooter className="flex items-center justify-center">
            <Link href="/groups">see all notes</Link>
          </CardFooter>
        )}
      </CardContent>
    </Card>
  );
}
