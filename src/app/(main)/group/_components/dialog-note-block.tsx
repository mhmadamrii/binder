import { EditorClient } from "~/components/editor/editor-client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

export function DialogNoteBlock({
  isOpenCreateNote,
  setIsOpenCreateNote,
}: {
  isOpenCreateNote: boolean;
  setIsOpenCreateNote: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <Dialog open={isOpenCreateNote} onOpenChange={setIsOpenCreateNote}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Note Block</DialogTitle>
        </DialogHeader>
        <div className="min-h-[300px] w-full">
          <EditorClient />
        </div>
      </DialogContent>
    </Dialog>
  );
}
