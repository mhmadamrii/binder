import { MessageCircle } from "lucide-react";
import { Card, CardHeader, CardTitle } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";

export function GroupByIdSkeleton() {
  return (
    <>
      <div className="border-border flex items-center justify-between border-b px-4 py-3.5">
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
