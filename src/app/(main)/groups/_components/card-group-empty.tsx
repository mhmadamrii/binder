import { Users, PlusCircle } from "lucide-react";

export function CardGroupEmpty({
  onCreate,
  name,
}: {
  onCreate?: () => void;
  name: string;
}) {
  console.log("name", name);
  return (
    <div className="flex h-[calc(100vh-310px)] flex-col items-center justify-center gap-4 p-6 text-center">
      <div className="bg-secondary/50 flex h-16 w-16 items-center justify-center rounded-full">
        <Users className="text-muted-foreground h-8 w-8" />
      </div>

      <div>
        <h3 className="text-foreground text-lg font-semibold">
          No Groups Matches {name == "Groups" ? "" : name}
        </h3>
        <p className="text-muted-foreground text-sm">
          Create your desired group and start collaborating with your team.
        </p>
      </div>
    </div>
  );
}
