import type { AllGroupNotesType } from "~/server/api/routers/note";

export function NoteCard({ note }: { note: AllGroupNotesType[number] }) {
  return (
    <div className="h-[20px] border border-red-500">
      <h1>Note card</h1>
    </div>
  );
}
