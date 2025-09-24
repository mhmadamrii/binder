import { api } from "~/trpc/server";
import { Card, CardHeader, CardTitle } from "~/components/ui/card";
import { GroupNotes } from "../_components/group-notes";
import { GroupHeader } from "../_components/group-header";
import { MessageCircle } from "lucide-react";
import { GroupMessage } from "../_components/group-message";
import { GroupMember } from "../_components/group-member";
import { Suspense } from "react";
import { ScrollArea } from "~/components/ui/scroll-area";

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
            <GroupNotes />
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
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="flex h-[calc(100vh-1rem)] flex-col">
      <Suspense fallback={<div>Loading...</div>}>
        <GroupByIdWithData id={id} />
      </Suspense>
    </div>
  );
}
