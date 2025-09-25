"use client";

import { useState } from "react";
import { SortableList } from "~/components/dnd/sortable";

export default function Note() {
  const [items, setItems] = useState([
    {
      id: "1",
    },
    {
      id: "2",
    },
    {
      id: "3",
    },
    {
      id: "4",
    },
    {
      id: "5",
    },
  ]);

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center">
      <SortableList
        items={items}
        onChange={setItems}
        renderItem={(item) => (
          <SortableList.Item id={item.id}>
            <div className="h-full w-full bg-blue-500">
              <SortableList.DragHandle />
            </div>
          </SortableList.Item>
        )}
      />
    </div>
  );
}
