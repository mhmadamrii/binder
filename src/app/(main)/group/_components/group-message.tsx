"use client";

import { Paperclip, Send, Smile } from "lucide-react";
import { Button } from "~/components/ui/button";
import { CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";

const messages = [
  {
    id: "1",
    content: "Hey everyone! How's the project going?",
    sender: "Alice",
    timestamp: "10:30 AM",
    isOwn: false,
  },
  {
    id: "2",
    content: "Making great progress! The new features are almost ready.",
    sender: "You",
    timestamp: "10:32 AM",
    isOwn: true,
  },
  {
    id: "3",
    content: "Awesome! Can't wait to see them in action 🚀",
    sender: "Bob",
    timestamp: "10:35 AM",
    isOwn: false,
  },
];

export function GroupMessage() {
  return (
    <CardContent className="flex flex-1 flex-col p-0">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs rounded-lg px-4 py-2 lg:max-w-md ${
                  msg.isOwn
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                {!msg.isOwn && (
                  <p className="mb-1 text-xs font-semibold opacity-70">
                    {msg.sender}
                  </p>
                )}
                <p className="text-sm">{msg.content}</p>
                <p className="mt-1 text-xs opacity-60">{msg.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <Separator className="bg-border" />
      <form className="p-4">
        <div className="flex items-center space-x-2">
          <Button type="button" variant="ghost" size="sm">
            <Paperclip className="h-4 w-4" />
          </Button>
          <Input
            placeholder="Type a message..."
            value=""
            onChange={() => {}}
            className="bg-input border-border focus:ring-ring flex-1"
          />
          <Button type="button" variant="ghost" size="sm">
            <Smile className="h-4 w-4" />
          </Button>
          <Button type="submit" className="btn-hero">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </CardContent>
  );
}
