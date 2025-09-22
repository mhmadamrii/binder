"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { toast } from "sonner";
import { CreateGroup } from "./_components/create-group";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";

import {
  MessageCircle,
  Plus,
  Search,
  Settings,
  LogOut,
  Users,
} from "lucide-react";

export default function Groups() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateGroup, setShowCreateGroup] = useState(false);

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

  const handleCreateGroup = () => {
    setShowCreateGroup(true);
  };

  const handleGroupClick = (groupId: number) => {
    router.push("/");
  };

  const handleLogout = () => {
    toast.success("Logged out successfully!");
    window.location.href = "/";
  };

  const filteredGroups = mockGroups.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="bg-background min-h-screen">
      <header className="border-border bg-card/50 sticky top-0 z-50 border-b backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="from-primary to-primary-glow bg-gradient-to-r bg-clip-text text-2xl font-bold text-transparent">
                Binder
              </h1>
              <Badge
                variant="secondary"
                className="bg-primary/20 text-primary border-primary/30"
              >
                Dashboard
              </Badge>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <Card className="card-gradient border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-foreground">Your Groups</CardTitle>
                  <Button
                    onClick={handleCreateGroup}
                    size="sm"
                    className="btn-hero"
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    New
                  </Button>
                </div>

                <div className="relative">
                  <Search className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                  <Input
                    placeholder="Search groups..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-input border-border pl-10"
                  />
                </div>
              </CardHeader>

              <CardContent className="space-y-2">
                {filteredGroups.map((group) => (
                  <div
                    key={group.id}
                    onClick={() => handleGroupClick(group.id)}
                    className="border-border hover:bg-secondary/50 cursor-pointer rounded-lg border p-3 transition-colors"
                  >
                    <div className="mb-1 flex items-center justify-between">
                      <h3 className="text-foreground font-semibold">
                        {group.name}
                      </h3>
                      <div className="flex items-center space-x-2">
                        {group.unread > 0 && (
                          <Badge className="bg-primary text-primary-foreground text-xs">
                            {group.unread}
                          </Badge>
                        )}
                        <div className="text-muted-foreground flex items-center text-xs">
                          <Users className="mr-1 h-3 w-3" />
                          {group.members}
                        </div>
                      </div>
                    </div>
                    <p className="text-muted-foreground truncate text-sm">
                      {group.lastMessage}
                    </p>
                    <p className="text-muted-foreground mt-1 text-xs">
                      {group.timestamp}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="card-gradient border-border h-full">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center">
                  <MessageCircle className="text-primary mr-2 h-5 w-5" />
                  Welcome to Your Dashboard
                </CardTitle>
              </CardHeader>

              <CardContent className="flex flex-1 items-center justify-center">
                <div className="space-y-6 text-center">
                  <div className="from-primary to-primary-glow glow mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br">
                    <MessageCircle className="h-12 w-12 text-white" />
                  </div>

                  <div>
                    <h2 className="text-foreground mb-2 text-2xl font-bold">
                      Select a group to start messaging
                    </h2>
                    <p className="text-muted-foreground">
                      Choose from your existing groups or create a new one to
                      begin conversations
                    </p>
                  </div>

                  <Button
                    onClick={handleCreateGroup}
                    className="btn-hero"
                    size="lg"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Group
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <CreateGroup open={showCreateGroup} onOpenChange={setShowCreateGroup} />
    </div>
  );
}
