"use client";

/* eslint-disable unicorn/no-null */
/* eslint-disable quotes */
import { useCallback, useEffect, useState } from "react";
import RichTextEditor, { BaseKit } from "reactjs-tiptap-editor";

import { toast } from "sonner";
import { DEFAULT_BINDER_NOTE, DEFAULT_RESET } from "~/lib/note-default";
import { Blockquote } from "reactjs-tiptap-editor/blockquote";
import { Bold } from "reactjs-tiptap-editor/bold";
import { Clear } from "reactjs-tiptap-editor/clear";
import { Code } from "reactjs-tiptap-editor/code";
import { CodeBlock } from "reactjs-tiptap-editor/codeblock";
import { Color } from "reactjs-tiptap-editor/color";
import { ColumnActionButton } from "reactjs-tiptap-editor/multicolumn";
import { ExportPdf } from "reactjs-tiptap-editor/exportpdf";
import { FontSize } from "reactjs-tiptap-editor/fontsize";
import { FormatPainter } from "reactjs-tiptap-editor/formatpainter";
import { Heading } from "reactjs-tiptap-editor/heading";
import { HorizontalRule } from "reactjs-tiptap-editor/horizontalrule";
import { Iframe } from "reactjs-tiptap-editor/iframe";
import { Italic } from "reactjs-tiptap-editor/italic";
import { Link } from "reactjs-tiptap-editor/link";
import { Mention } from "reactjs-tiptap-editor/mention";
import { SlashCommand } from "reactjs-tiptap-editor/slashcommand";
import { Table } from "reactjs-tiptap-editor/table";
import { TaskList } from "reactjs-tiptap-editor/tasklist";
import { TextAlign } from "reactjs-tiptap-editor/textalign";
import { TextDirection } from "reactjs-tiptap-editor/textdirection";
import { Button } from "../ui/button";
import { api } from "~/trpc/react";
import { Loader } from "lucide-react";

import "reactjs-tiptap-editor/style.css";
import "prism-code-editor-lightweight/layout.css";
import "prism-code-editor-lightweight/themes/github-dark.css";

import "katex/dist/katex.min.css";
import "easydrawer/styles.css";
import "react-image-crop/dist/ReactCrop.css";
import "@excalidraw/excalidraw/index.css";

const extensions = [
  BaseKit.configure({
    placeholder: {
      showOnlyCurrent: true,
    },
    characterCount: {
      limit: 50_000,
    },
  }),
  FormatPainter.configure({ spacer: true }),
  Clear,
  Heading.configure({ spacer: true }),
  FontSize,
  Bold,
  Italic,
  Color.configure({ spacer: true }),
  TextAlign.configure({ types: ["heading", "paragraph"], spacer: true }),
  TaskList.configure({
    spacer: true,
    taskItem: {
      nested: true,
    },
  }),
  Link,
  Blockquote,
  SlashCommand,
  HorizontalRule,
  Code.configure({
    toolbar: false,
  }),
  CodeBlock,
  ColumnActionButton,
  Table,
  Iframe,
  ExportPdf.configure({ spacer: true }),
  TextDirection,
  Mention,
];

function debounce(func: any, wait: number) {
  let timeout: NodeJS.Timeout;
  return function (...args: any[]) {
    clearTimeout(timeout);
    // @ts-ignore
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

export default function TipTapEditor({ groupId }: { groupId: string }) {
  const [content, setContent] = useState(DEFAULT_BINDER_NOTE);

  const { mutate: updateNote, isPending } =
    api.note.updateNoteBlock.useMutation({
      onSuccess: () => {
        toast.success("Note block updated successfully!");
      },
    });

  const onValueChange = useCallback(
    debounce((value: string) => {
      setContent(value); // keep local state in sync
      updateNote({
        groupId,
        title: "note block",
        content: value,
      });
    }, 1000),
    [updateNote, groupId],
  );

  const { data: initialNoteBlock } = api.note.getNoteBlockByGroupId.useQuery({
    groupId,
  });

  useEffect(() => {
    if (initialNoteBlock) {
      setContent(initialNoteBlock.content);
    }
  }, [initialNoteBlock]);

  return (
    <section className="container mx-auto flex min-h-[600px] flex-col gap-4 p-4">
      <RichTextEditor
        key={initialNoteBlock?.id} // stable between keystrokes
        output="html"
        content={content}
        onChangeContent={onValueChange}
        extensions={extensions}
        dark
        bubbleMenu={{
          render({}, bubbleDefaultDom) {
            return <>{bubbleDefaultDom}</>;
          },
        }}
      />

      <div className="flex w-full justify-end">
        <Button
          onClick={() =>
            updateNote({
              groupId,
              title: "note block",
              content,
            })
          }
          className="w-[300px]"
        >
          {isPending ? <Loader className="animate-spin" /> : "Save"}
        </Button>
      </div>
    </section>
  );
}
