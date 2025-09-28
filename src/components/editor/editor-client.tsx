"use client";

import dynamic from "next/dynamic";
import React from "react";

const TipTapEditor = dynamic(
  () => import("./index").then((mod) => mod.default),
  {
    ssr: false,
  },
);

const ReadOnlyEditor = dynamic(
  () => import("./read-only-editor").then((mod) => mod.default),
  {
    ssr: false,
  },
);

export const EditorClient = ({ groupId }: { groupId: string }) => {
  return <TipTapEditor groupId={groupId} />;
};

export const ReadOnlyEditorClient = () => {
  return <ReadOnlyEditor />;
};
