"use client";

import { api } from "~/trpc/react";
import { anon, type DraggableItem } from "../../_components/group-notes";
import { useParams, useSearchParams } from "next/navigation";
import { SortableList } from "~/components/dnd/sortable";
import { Card, CardContent } from "~/components/ui/card";
import { useEffect, useState } from "react";
import { cn } from "~/lib/utils";
import { DialogAddNote } from "~/app/(main)/group/_components/dialog-add-note";
import { format } from "date-fns";
import { GroupNoteBreadcrumbs } from "../../_components/group-note-breadcrumbs";
import { Button } from "~/components/ui/button";
import { PlusCircle } from "lucide-react";
import { EditorClient } from "~/components/editor/editor-client";

export default function Note() {
  const searchParams = useSearchParams();
  const utils = api.useUtils();
  const params = useParams<{ id: string }>();

  const [draggableItems, setDraggableItems] = useState<DraggableItem[]>([]);
  const [isOpenCreateNote, setIsOpenCreateNote] = useState(false);

  const { data: groupNotes } = api.note.getAllGroupNotes.useQuery({
    groupId: params.id,
  });

  const { mutate: updateNoteOrder } = api.note.updateNoteOrder.useMutation({
    onSuccess: () => {
      void utils.note.getAllGroupNotes.invalidate();
    },
  });

  const handleDragEnd = (newItems: DraggableItem[]) => {
    setDraggableItems(newItems);
    const updatedOrder = newItems.map((item, index) => ({
      id: item.id,
      order: index + 1,
    }));

    updateNoteOrder({ groupId: params.id, updatedOrder });
  };

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
  console.log("search params", searchParams.get("type"));

  useEffect(() => {
    if (groupNotes) {
      handleSetDefaultGroupNotes();
    }
  }, [groupNotes]);
  return (
    <div className="h-screen w-full items-center justify-center">
      <GroupNoteBreadcrumbs groupId={params.id} />
      {searchParams.get("type") == "block" && (
        <EditorClient groupId={params.id} />
      )}

      {searchParams.get("type") == "simple" && (
        <section
          className={cn(
            `container mx-auto flex w-full flex-col gap-2 ${anon.className}`,
            {},
          )}
        >
          <div className="flex w-full justify-between">
            <div>
              <h1 className="text-2xl font-bold">Notes</h1>
              <p className="text-muted-foreground">
                Create and manage your notes for this group.
              </p>
            </div>
            <Button
              onClick={() => setIsOpenCreateNote(true)}
              className="flex cursor-pointer items-center gap-1"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Note
            </Button>
          </div>
          <div className="w-full">
            {draggableItems?.length! > 0 && (
              <SortableList
                items={draggableItems}
                onChange={handleDragEnd}
                renderItem={(item) => {
                  return (
                    <SortableList.Item id={item.id}>
                      <div className="flex h-full w-full justify-between">
                        <Card className="relative w-full pt-2 pb-2 pl-2">
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
                    </SortableList.Item>
                  );
                }}
              />
            )}
          </div>
        </section>
      )}
      <DialogAddNote
        isOpenCreateNote={isOpenCreateNote}
        setIsOpenCreateNote={setIsOpenCreateNote}
      />
    </div>
  );
}
