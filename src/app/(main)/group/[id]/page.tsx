import Link from "next/link";

import { ArrowLeft, MessageCircle, Settings, Users } from "lucide-react";
import { Suspense } from "react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/server";

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
    <div>
      <header className="border-border bg-card/50 border-b backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
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
      <Suspense fallback={<div>Loading group data...</div>}>
        <GroupByIdWithData id={id} />
      </Suspense>
    </div>
  );
}
