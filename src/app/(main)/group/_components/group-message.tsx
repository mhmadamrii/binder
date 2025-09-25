"use client";

import * as Ably from "ably";

import { ChatClient } from "@ably/chat";
import { ChatClientProvider, ChatRoomProvider } from "@ably/chat/react";
import { CardMessageContent } from "./card-message-content";

const ablyClient = new Ably.Realtime({
  clientId: "ably-chat",
  key: process.env.NEXT_PUBLIC_ABLYKEY,
});

export function GroupMessage({ groupId }: { groupId: string }) {
  const chatClient = new ChatClient(ablyClient);

  return (
    <ChatClientProvider client={chatClient}>
      <ChatRoomProvider name={groupId ?? "Lobby"}>
        <CardMessageContent />
      </ChatRoomProvider>
    </ChatClientProvider>
  );
}
