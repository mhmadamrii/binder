"use client";

import { api } from "~/trpc/react";
import { anon, type DraggableItem } from "../../_components/group-notes";
import { useParams } from "next/navigation";
import { SortableList } from "~/components/dnd/sortable";
import { Card, CardContent } from "~/components/ui/card";
import { useEffect, useState } from "react";
import { cn } from "~/lib/utils";
import { format } from "date-fns";
import { GroupNoteBreadcrumbs } from "../../_components/group-note-breadcrumbs";

export default function Note() {
  const params = useParams<{ id: string }>();

  const [draggableItems, setDraggableItems] = useState<DraggableItem[]>([]);

  const { data: groupNotes } = api.note.getAllGroupNotes.useQuery({
    groupId: params.id,
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
    <div className="container mx-auto flex h-screen flex-col items-center justify-center border border-red-500">
      <GroupNoteBreadcrumbs />
      {draggableItems?.length! > 0 && (
        <SortableList
          items={draggableItems}
          onChange={setDraggableItems}
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
      )}
    </div>
  );
}
