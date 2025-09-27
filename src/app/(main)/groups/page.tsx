import { Card, CardHeader, CardTitle } from "~/components/ui/card";
import { MessageCircle } from "lucide-react";
import { CardGroups } from "./_components/card-groups";
import { CardGroupContent } from "./_components/card-group-content";
import { CardGroupHeader } from "./_components/card-group-header";
import { Suspense } from "react";
import { api } from "~/trpc/server";
import { CardGroupSkeleton } from "./_components/card-group-skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { format } from "date-fns";

async function GroupListData() {
  const data = await api.group.getAllMyGroups();

  return (
    <CardGroups
      availableGroups={data.map((item, idx) => {
        return {
          id: item.id,
          name: item.name,
          lastMessage: item.desc,
          timestamp: `created at ${format(item.createdAt, "dd/MM/yyyy")}`,
          isPrivate: item.isPrivate,
          unread: 0,
          members: item.membersCount,
        };
      })}
    />
  );
}

async function PublicGroupListData() {
  const data = await api.group.getPublicGroups();

  return (
    <CardGroups
      isPublic
      availableGroups={data.map((item, idx) => {
        return {
          id: item.id,
          name: item.name,
          lastMessage: item.desc,
          timestamp: `created at ${format(item.createdAt, "dd/MM/yyyy")}`,
          isPrivate: item.isPrivate,
          unread: 0,
          members: item.membersCount,
          isJoined: item.isJoined,
        };
      })}
    />
  );
}

export default function Groups() {
  return (
    <div className="bg-background h-[calc(100vh-65px)]">
      <div className="h-full px-4 py-8">
        <div className="grid h-full gap-5 lg:grid-cols-3">
          <div className="h-full lg:col-span-1">
            <Card className="card-gradient border-border h-full">
              <CardGroupHeader />
              <Tabs defaultValue="public" className="w-full px-3">
                <TabsList className="w-full">
                  <TabsTrigger value="public">Public</TabsTrigger>
                  <TabsTrigger value="mine">My Groups</TabsTrigger>
                </TabsList>
                <TabsContent value="public">
                  <Suspense fallback={<CardGroupSkeleton />}>
                    <PublicGroupListData />
                  </Suspense>
                </TabsContent>
                <TabsContent value="mine" className="px-0">
                  <Suspense fallback={<CardGroupSkeleton />}>
                    <GroupListData />
                  </Suspense>
                </TabsContent>
              </Tabs>
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
