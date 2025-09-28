import { useMessages } from "@ably/chat/react";
import { Paperclip, Send, Smile, Check, CheckCheck } from "lucide-react";
import { useParams } from "next/navigation";
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";
import { useEffect, useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import { CardContent, CardFooter } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import { api } from "~/trpc/react";

export function CardMessageContent() {
  const params = useParams<{ id: string }>();
  const utils = api.useUtils();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<
    Array<{
      id: number;
      content: string;
      sender: string;
      timestamp: string;
      isOwn: boolean;
    }>
  >([]);

  const { mutate: createMessage } = api.message.createMessage.useMutation({
    onSuccess: (res) => {
      utils.invalidate();
    },
  });

  const { data: previousMessages } = api.message.getAllMessagesByGroupId.useQuery({ groupId: params.id }); // prettier-ignore
  const { data: user } = api.user.getCurrentUser.useQuery();

  const { sendMessage: send } = useMessages({
    listener: (event) => {
      console.log("event", event.message);
      setMessages((prev) => [
        ...prev,
        {
          id: -Math.round(Math.random() * 1000000),
          content: event.message.text,
          sender: user?.name ?? "Anonymous",
          timestamp: "saving...",
          isOwn: event.message.metadata.senderId == user?.id,
        },
      ]);
    },
  });

  const handleSendMessage = async (
    e:
      | React.KeyboardEvent<HTMLInputElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    try {
      await send({
        text: newMessage,
        metadata: {
          type: "text",
          senderId: user?.id,
        },
      });
      createMessage({
        groupId: params.id,
        content: newMessage,
      });
      setNewMessage("");
    } catch (error) {
      console.error("error sending message", error);
    }
  };
  console.log("previousMessages", previousMessages);

  const handleSetDefaultMessages = () => {
    if (!previousMessages) return [];
    setMessages(previousMessages);
  };

  useEffect(() => {
    if (params.id) {
      handleSetDefaultMessages();
    }
  }, [previousMessages, params.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <CardContent className="flex flex-1 flex-col p-0">
      <ScrollArea className="h-[calc(100vh-290px)] overflow-y-auto px-4 pb-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} msg={msg} user={user} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      <Separator className="bg-border" />
      <CardFooter>
        <form className="w-full p-4">
          <div className="flex items-center space-x-2">
            <Button type="button" variant="ghost" size="sm">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage(e)}
              className="bg-input border-border focus:ring-ring flex-1"
            />
            <Button type="button" variant="ghost" size="sm">
              <Smile className="h-4 w-4" />
            </Button>
            <Button
              onClick={(e) => handleSendMessage(e)}
              type="button"
              className="btn-hero"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardFooter>
    </CardContent>
  );
}

const AvatarBubble = ({ name, src }: { name?: string; src?: string }) => (
  <Avatar className="h-6 w-6">
    <AvatarImage src={src ?? ""} alt={name ?? ""} />
    <AvatarFallback>{name?.[0]?.toUpperCase() ?? "?"}</AvatarFallback>
  </Avatar>
);

const MessageMeta = ({
  isOwn,
  timestamp,
}: {
  isOwn: boolean;
  timestamp: string;
}) => {
  const displayTime = timestamp === "saving..." ? "00:00" : timestamp;
  const Icon = isOwn && timestamp === "saving..." ? Check : CheckCheck;

  return (
    <p className="mt-1 flex gap-1 text-xs opacity-60">
      {displayTime}
      <Icon className="h-4 w-4" />
    </p>
  );
};

const ChatMessage = ({ msg, user }: { msg: any; user: any }) => {
  const isOwn = msg.isOwn;

  const wrapperClasses = `flex items-end gap-2 ${
    isOwn ? "justify-end" : "justify-start"
  }`;

  const bubbleClasses = `max-w-xs rounded-lg px-4 py-2 lg:max-w-lg ${
    isOwn
      ? "bg-primary text-primary-foreground rounded-br-none"
      : "bg-secondary text-secondary-foreground rounded-bl-none"
  }`;

  return (
    <div key={msg.id} className={wrapperClasses}>
      {!isOwn && <AvatarBubble name={msg.sender} src={msg.sender} />}

      <div className={bubbleClasses}>
        {!isOwn && (
          <p className="mb-1 text-xs font-semibold opacity-70">{msg.sender}</p>
        )}
        <div className="flex items-end gap-2">
          <p className="text-sm">{msg.content}</p>
          <MessageMeta isOwn={isOwn} timestamp={msg.timestamp} />
        </div>
      </div>

      {isOwn && <AvatarBubble name={user?.name} src={msg.sender} />}
    </div>
  );
};
