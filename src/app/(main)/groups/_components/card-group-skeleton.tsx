import { Skeleton } from "~/components/ui/skeleton";

export function CardGroupSkeleton() {
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
