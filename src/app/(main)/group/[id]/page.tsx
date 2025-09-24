import { api } from "~/trpc/server";
import { Card, CardHeader, CardTitle } from "~/components/ui/card";
import { GroupNotes } from "../_components/group-notes";
import { GroupHeader } from "../_components/group-header";
import { MessageCircle } from "lucide-react";
import { GroupMessage } from "../_components/group-message";
import { GroupMember } from "../_components/group-member";
import { Suspense } from "react";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Skeleton } from "~/components/ui/skeleton";

function GroupByIdSkeleton() {
  return (
    <>
      <div className="flex items-center justify-between border-b border-border px-4 py-3.5">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex flex-col">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="mt-1 h-4 w-48" />
          </div>
        </div>
        <Skeleton className="h-8 w-24" />
      </div>
      <div className="flex flex-1 gap-4 px-4 py-4">
        <div className="flex flex-1 flex-col">
          <Card className="card-gradient border-border flex flex-1 flex-col">
            <CardHeader className="border-border border-b">
              <CardTitle className="text-foreground flex items-center">
                <MessageCircle className="text-primary mr-2 h-5 w-5" />
                Messages
              </CardTitle>
            </CardHeader>
            <div className="flex-1 p-4">
              <Skeleton className="h-full w-full" />
            </div>
          </Card>
        </div>
        <div className="flex w-80 flex-col gap-4">
          <div className="space-y-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    </>
  );
}

async function GroupByIdWithData({ id }: { id: string }) {
  const data = await api.group.getGroupById({ id });
  console.log("DATA", data);

  return (
    <>
      <GroupHeader
        groupName={data?.name}
        groupDescription={data?.desc}
        membersCount={data?.members.length}
      />
      <div className="flex flex-1 gap-4 px-4 py-4">
        <div className="flex flex-1 flex-col">
          <Card className="card-gradient border-border flex flex-1 flex-col">
            <CardHeader className="border-border border-b">
              <CardTitle className="text-foreground flex items-center">
                <MessageCircle className="text-primary mr-2 h-5 w-5" />
                Messages
              </CardTitle>
            </CardHeader>
            <GroupMessage />
          </Card>
        </div>
        <div className="flex w-80 flex-col gap-4">
          <ScrollArea className="h-[calc(100vh-8rem)] space-y-4">
            <GroupNotes groupId={id} />
            <GroupMember groupId={id} />
          </ScrollArea>
        </div>
      </div>
    </>
  );
}

export default async function GroupById({
  params,
}: {
  params: Promise<{ id:string }>;
}) {
  const { id } = await params;

  return (
    <div className="flex h-[calc(100vh-1rem)] flex-col">
      <Suspense fallback={<GroupByIdSkeleton />}>
        <GroupByIdWithData id={id} />
      </Suspense>
    </div>
  );
}
