import { Card, CardHeader, CardTitle } from "~/components/ui/card";
import { MessageCircle } from "lucide-react";
import { CardGroups } from "./_components/card-groups";
import { CardGroupContent } from "./_components/card-group-content";
import { CardGroupHeader } from "./_components/card-group-header";

const mockGroups = [
  {
    id: 1,
    name: "Design Team",
    lastMessage: "New mockups are ready for review",
    timestamp: "2 mins ago",
    unread: 3,
    members: 8,
  },
  {
    id: 2,
    name: "Frontend Developers",
    lastMessage: "React component library updated",
    timestamp: "15 mins ago",
    unread: 1,
    members: 12,
  },
  {
    id: 3,
    name: "Project Alpha",
    lastMessage: "Meeting scheduled for tomorrow",
    timestamp: "1 hour ago",
    unread: 0,
    members: 6,
  },
  {
    id: 4,
    name: "Marketing Squad",
    lastMessage: "Campaign analytics are looking great!",
    timestamp: "3 hours ago",
    unread: 5,
    members: 15,
  },
];

export default function Groups() {
  const filteredGroups = mockGroups.filter((group) =>
    group.name.toLowerCase().includes("".toLowerCase()),
  );

  return (
    <div className="bg-background h-[calc(100vh-65px)] border border-red-500">
      <div className="container mx-auto h-full px-4 py-8">
        <div className="grid h-full gap-5 lg:grid-cols-3">
          <div className="h-full lg:col-span-1">
            <Card className="card-gradient border-border h-full">
              <CardGroupHeader />
              <CardGroups filteredGroups={filteredGroups} />
            </Card>
          </div>

          <div className="h-full lg:col-span-2">
            <Card className="card-gradient border-border h-full">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center">
                  <MessageCircle className="text-primary mr-2 h-5 w-5" />
                  Welcome to Binder
                </CardTitle>
              </CardHeader>
              <CardGroupContent />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
