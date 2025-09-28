import { api } from "~/trpc/server";
import { Card, CardHeader, CardTitle } from "~/components/ui/card";
import { GroupNotes } from "../_components/group-notes";
import { GroupHeader } from "../_components/group-header";
import { MessageCircle } from "lucide-react";
import { GroupMessage } from "../_components/group-message";
import { GroupMember } from "../_components/group-member";
import { Suspense } from "react";
import { GroupByIdSkeleton } from "../_components/group-byid-skeleton";

async function GroupByIdWithData({ id }: { id: string }) {
  const [data] = await Promise.all([await api.group.getGroupById({ id })]);
  return (
    <>
      <GroupHeader
        groupName={data?.name}
        groupDescription={data?.desc}
        membersCount={data?.members.length}
      />
      <div className="flex flex-1 flex-col gap-4 px-4 py-4 sm:flex-row">
        <div className="flex flex-1 flex-col">
          <Card className="card-gradient border-border flex flex-1 flex-col justify-between gap-0">
            <CardHeader className="border-border border-b">
              <CardTitle className="text-foreground flex items-center">
                <MessageCircle className="text-primary mr-2 h-5 w-5" />
                Messages
              </CardTitle>
            </CardHeader>
            <div>
              <GroupMessage groupId={id} />
            </div>
          </Card>
        </div>
        <div className="flex w-full flex-col gap-4 sm:w-80">
          <GroupNotes groupId={id} />
          <GroupMember
            groupId={id}
            invitationCode={data?.inviteCode ?? "Invalid"}
          />
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
      <Suspense fallback={<GroupByIdSkeleton />}>
        <GroupByIdWithData id={id} />
      </Suspense>
    </div>
  );
}
