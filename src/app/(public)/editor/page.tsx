"use client";

import { EditorClient } from "~/components/editor/editor-client";

export default function Editor() {
  return (
    <div className="container mx-auto flex min-h-screen flex-col items-center justify-center">
      <EditorClient />
      {/* <AnotherEditor /> */}
    </div>
  );
}
