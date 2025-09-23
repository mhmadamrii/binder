import Link from "next/link";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/server";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import { Input } from "~/components/ui/input";

import {
  ArrowLeft,
  MessageCircle,
  Paperclip,
  PlusCircle,
  Send,
  Settings,
  Smile,
  Users,
} from "lucide-react";

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

async function GroupByIdWithData({ id }: { id: string }) {
  await new Promise((resolve) => setTimeout(resolve, 3000)); // Simulate a delay
  const data = await api.group.getGroupById({ id });
  console.log("DATA", data);

  return (
    <div>
      <h1>Group Details Page with Data: {id}</h1>
    </div>
  );
}

export default async function GroupById({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="flex h-[calc(100vh-1rem)] flex-col">
      <header className="border-border bg-card/50 border-b backdrop-blur-sm">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/groups">
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-secondary"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>

              <div className="flex items-center space-x-3">
                <div className="from-primary to-primary-glow flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br">
                  <MessageCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-foreground text-xl font-bold">
                    Binder Group
                  </h1>
                  <p className="text-muted-foreground text-sm">What the hell</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Badge
                variant="secondary"
                className="bg-primary/20 text-primary border-primary/30"
              >
                <Users className="mr-1 h-3 w-3" />5 members
              </Badge>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 gap-4 px-4 py-4">
        <div className="flex flex-1 flex-col">
          <Card className="card-gradient border-border flex flex-1 flex-col">
            <CardHeader className="border-border border-b">
              <CardTitle className="text-foreground flex items-center">
                <MessageCircle className="text-primary mr-2 h-5 w-5" />
                Messages
              </CardTitle>
            </CardHeader>

            <CardContent className="flex flex-1 flex-col p-0">
              {/* Messages */}
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
                        <p className="mt-1 text-xs opacity-60">
                          {msg.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <Separator className="bg-border" />

              {/* Message Input */}
              <form className="p-4">
                <div className="flex items-center space-x-2">
                  <Button type="button" variant="ghost" size="sm">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Input
                    placeholder="Type a message..."
                    value=""
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
          </Card>
        </div>

        <div className="w-80">
          <Card className="card-gradient border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center justify-between">
                <span>Group Notes</span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="hover:bg-secondary"
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="py-8 text-center">
                <div className="bg-secondary/50 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                  <MessageCircle className="text-muted-foreground h-8 w-8" />
                </div>
                <h3 className="text-foreground mb-2 font-semibold">
                  No notes yet
                </h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  Start adding important notes and information for this group
                </p>
                <Button size="sm" className="btn-hero">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add First Note
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
