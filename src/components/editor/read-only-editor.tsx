"use client";

/* eslint-disable unicorn/no-null */
/* eslint-disable quotes */
import RichTextEditor, { BaseKit } from "reactjs-tiptap-editor";

import { useEffect, useRef, useState } from "react";
import { DEFAULT_BINDER_NOTE } from "~/lib/note-default";

import "reactjs-tiptap-editor/style.css";
import "prism-code-editor-lightweight/layout.css";
import "prism-code-editor-lightweight/themes/github-dark.css";

import "katex/dist/katex.min.css";
import "easydrawer/styles.css";
import "react-image-crop/dist/ReactCrop.css";
import "@excalidraw/excalidraw/index.css";
import { FormatPainter } from "reactjs-tiptap-editor/lib/FormatPainter.js";
import { Clear } from "reactjs-tiptap-editor/lib/Clear.js";
import { Heading } from "reactjs-tiptap-editor/lib/Heading.js";
import { FontSize } from "reactjs-tiptap-editor/lib/FontSize.js";
import { Bold } from "reactjs-tiptap-editor/lib/Bold.js";
import { Italic } from "reactjs-tiptap-editor/lib/Italic.js";
import { Color } from "reactjs-tiptap-editor/lib/Color.js";
import { TextAlign } from "reactjs-tiptap-editor/lib/TextAlign.js";
import { TaskList } from "reactjs-tiptap-editor/lib/TaskList.js";
import { api } from "~/trpc/react";
import { Loader } from "lucide-react";

const extensions = [
  BaseKit.configure({
    placeholder: {
      showOnlyCurrent: true,
    },
    characterCount: {
      limit: 50_000,
    },
  }),
  FormatPainter.configure({ spacer: true, toolbar: false }),
  Clear.configure({ toolbar: false }),
  Heading.configure({ spacer: true, toolbar: false }),
  FontSize.configure({ toolbar: false }),
  Bold.configure({ toolbar: false }),
  Italic.configure({ toolbar: false }),
  Color.configure({ spacer: true, toolbar: false }),
  TextAlign.configure({
    types: ["heading", "paragraph"],
    spacer: true,
    toolbar: false,
  }),
  TaskList.configure({
    spacer: true,
    toolbar: false,
    taskItem: {
      nested: true,
    },
  }),
];

export default function ReadOnlyEditor({ groupId }: { groupId: string }) {
  const { data: initialNoteBlock, isLoading } =
    api.note.getNoteBlockByGroupId.useQuery({
      groupId,
    });

  console.log("initialNoteBlock", initialNoteBlock);

  const editorRef = useRef<any>(null);

  useEffect(() => {
    if (initialNoteBlock?.content && editorRef.current) {
      editorRef.current.commands.setContent(initialNoteBlock.content);
    }
  }, [initialNoteBlock, editorRef]);

  return (
    <section className="h-full">
      {isLoading ? (
        <div className="flex h-[300px] w-full items-center justify-center">
          <Loader className="animate-spin" />
        </div>
      ) : (
        <div className="editor-wrapper">
          <RichTextEditor
            // @ts-expect-error
            editorRef={editorRef}
            output="html"
            content={initialNoteBlock?.content ?? DEFAULT_BINDER_NOTE}
            extensions={extensions}
            dark
            disabled
            toolbar={{
              render(props, toolbarItems, dom, containerDom) {
                return "";
              },
            }}
          />
        </div>
      )}
    </section>
  );
}
