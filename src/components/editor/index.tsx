"use client";

/* eslint-disable unicorn/no-null */
/* eslint-disable quotes */
import { useCallback, useState } from "react";
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
  // History,
  // SearchAndReplace,
  // TableOfContents,
  FormatPainter.configure({ spacer: true }),
  Clear,
  // FontFamily,
  Heading.configure({ spacer: true }),
  FontSize,
  Bold,
  Italic,
  // TextUnderline,
  // Strike,
  // MoreMark,
  // Emoji,
  Color.configure({ spacer: true }),
  // Highlight,
  // BulletList,
  // OrderedList,
  TextAlign.configure({ types: ["heading", "paragraph"], spacer: true }),
  // Indent,
  // LineHeight,
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
  // Katex,
  // Excalidraw,
  // Mermaid.configure({
  //   upload: (file: any) => {
  //     // fake upload return base 64
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);

  //     return new Promise((resolve) => {
  //       setTimeout(() => {
  //         const blob = convertBase64ToBlob(reader.result as string);
  //         resolve(URL.createObjectURL(blob));
  //       }, 300);
  //     });
  //   },
  // }),
  // Drawer.configure({
  //   upload: (file: any) => {
  //     // fake upload return base 64
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);

  //     return new Promise((resolve) => {
  //       setTimeout(() => {
  //         const blob = convertBase64ToBlob(reader.result as string);
  //         resolve(URL.createObjectURL(blob));
  //       }, 300);
  //     });
  //   },
  // }),
  // Twitter,
];

function debounce(func: any, wait: number) {
  let timeout: NodeJS.Timeout;
  return function (...args: any[]) {
    clearTimeout(timeout);
    // @ts-ignore
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

export default function TipTapEditor() {
  const [content, setContent] = useState(DEFAULT_BINDER_NOTE);
  const [disable, setDisable] = useState(false);

  const onValueChange = useCallback(
    debounce((value: any) => {
      console.log("value", value);
      setContent(value);
    }, 300),
    [],
  );

  return (
    <section className="min-h-[600px] border border-red-500 p-4">
      <div className="w-full">
        <RichTextEditor
          output="html"
          content={content as any}
          onChangeContent={onValueChange}
          extensions={extensions}
          dark
          disabled={disable}
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
