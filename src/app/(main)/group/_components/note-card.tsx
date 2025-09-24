import type { AllGroupNotesType } from "~/server/api/routers/note";
import { GripVertical } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export function NoteCard({
  note,
  dragHandleProps,
}: {
  note: AllGroupNotesType[number];
  dragHandleProps?: any;
}) {
  return (
    <Card className="mb-2 border shadow-sm transition hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-lg font-semibold">
            {note.notes.title}
          </CardTitle>
          <CardDescription className="text-muted-foreground text-sm">
            by {note.user.name ?? note.user.email}
          </CardDescription>
        </div>
        <div
          {...dragHandleProps}
          className="text-muted-foreground hover:text-foreground cursor-grab"
        >
          <GripVertical size={18} />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-foreground text-sm">{note.notes.desc}</p>
      </CardContent>
    </Card>
  );
}
