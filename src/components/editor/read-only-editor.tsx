"use client";

/* eslint-disable unicorn/no-null */
/* eslint-disable quotes */
import RichTextEditor, { BaseKit } from "reactjs-tiptap-editor";

import { useState } from "react";
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

export default function ReadOnlyEditor() {
  const [content, setContent] = useState(DEFAULT_BINDER_NOTE);
  return (
    <section className="h-full">
      <div className="editor-wrapper">
        <RichTextEditor
          contentClass="p-4"
          output="html"
          content={content as any}
          onChangeContent={() => {}}
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
    </section>
  );
}
