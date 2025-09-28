"use client";

/* eslint-disable unicorn/no-null */
/* eslint-disable quotes */
import { useCallback, useEffect, useRef, useState } from "react";
import RichTextEditor, { BaseKit } from "reactjs-tiptap-editor";

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
import { api } from "~/trpc/react";
import { CheckCheck, Loader, Loader2 } from "lucide-react";

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

function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return function (...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export default function TipTapEditor({ groupId }: { groupId: string }) {
  const utils = api.useUtils();
  const { mutate: updateNote, isPending } =
    api.note.updateNoteBlock.useMutation({
      onSuccess: () => {
        utils.invalidate();
      },
    });

  const { data: initialNoteBlock, isLoading } =
    api.note.getNoteBlockByGroupId.useQuery({
      groupId,
    });

  const editorRef = useRef<any>(null);

  const debouncedUpdate = useCallback(
    debounce((value: string) => {
      updateNote({ groupId, title: "note block", content: value });
    }, 1000),
    [updateNote, groupId],
  );

  useEffect(() => {
    if (initialNoteBlock?.content && editorRef.current) {
      editorRef.current.commands.setContent(initialNoteBlock.content);
    }
  }, [initialNoteBlock, editorRef]);

  return (
    <>
      {isLoading ? (
        <div className="flex h-screen w-full items-center justify-center">
          <Loader className="animate-spin" />
        </div>
      ) : (
        <section className="flex min-h-[600px] flex-col gap-4 p-4">
          <div className="flex h-[60px] w-full items-center justify-end">
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <div className="flex items-center gap-2">
                <CheckCheck className="h-4 w-4 text-green-500" />
                <span className="text-muted-foreground text-[12px]">Saved</span>
              </div>
            )}
          </div>
          <RichTextEditor
            // @ts-expect-error
            editorRef={editorRef}
            output="html"
            extensions={extensions}
            dark
            content={initialNoteBlock?.content ?? DEFAULT_BINDER_NOTE}
            onChangeContent={debouncedUpdate}
          />
        </section>
      )}
    </>
  );
}
