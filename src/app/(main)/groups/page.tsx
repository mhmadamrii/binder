import { Card, CardHeader, CardTitle } from "~/components/ui/card";
import { MessageCircle } from "lucide-react";
import { CardGroups } from "./_components/card-groups";
import { CardGroupContent } from "./_components/card-group-content";
import { CardGroupHeader } from "./_components/card-group-header";
import { Suspense } from "react";
import { api } from "~/trpc/server";
import { Skeleton } from "~/components/ui/skeleton";

function GroupListSkeleton() {
  return (
    <div className="p-4">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="border-border mb-[10px] cursor-pointer rounded-lg border p-3 transition-colors"
        >
          <div className="mb-1 flex items-center justify-between">
            <Skeleton className="h-5 w-2/4" />
            <div className="flex items-center space-x-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-3 w-6" />
            </div>
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="mt-1 h-3 w-1/2" />
        </div>
      ))}
    </div>
  );
}

async function GroupListData() {
  const data = await api.group.getAllMyGroups();
  return (
    <CardGroups
      filteredGroups={data.map((item) => {
        return {
          id: item.id,
          name: item.name,
          lastMessage: "No messages yet",
          timestamp: item.createdAt.toISOString(),
          unread: 0,
          members: 1,
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
              <Suspense fallback={<GroupListSkeleton />}>
                <GroupListData />
              </Suspense>
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
