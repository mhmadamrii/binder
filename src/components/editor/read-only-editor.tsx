"use client";

/* eslint-disable unicorn/no-null */
/* eslint-disable quotes */
import { useState } from "react";
import RichTextEditor, { BaseKit } from "reactjs-tiptap-editor";

import { DEFAULT_BINDER_NOTE, DEFAULT_RESET } from "~/lib/note-default";

import "reactjs-tiptap-editor/style.css";
import "prism-code-editor-lightweight/layout.css";
import "prism-code-editor-lightweight/themes/github-dark.css";

import "katex/dist/katex.min.css";
import "easydrawer/styles.css";
import "react-image-crop/dist/ReactCrop.css";
import "@excalidraw/excalidraw/index.css";

export default function ReadOnlyEditor() {
  const [content, setContent] = useState(DEFAULT_BINDER_NOTE);
  return (
    <section className="min-h-[600px] border border-red-500 p-4">
      <div className="w-full">
        <RichTextEditor
          output="html"
          content={content as any}
          onChangeContent={() => {}}
          extensions={[]}
          dark
          disabled
          bubbleMenu={{
            render({ extensionsNames, editor, disabled }, bubbleDefaultDom) {
              return <>{bubbleDefaultDom}</>;
            },
          }}
        />
      </div>
    </section>
  );
}
