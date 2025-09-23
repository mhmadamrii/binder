import { MessageCircle, PlusCircle } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export function GroupNotes() {
  return (
    <Card className="card-gradient border-border">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center justify-between">
          <span>Group Notes</span>
          <Button size="sm" variant="ghost" className="hover:bg-secondary">
            <PlusCircle className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="py-8 text-center">
          <div className="bg-secondary/50 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            <MessageCircle className="text-muted-foreground h-8 w-8" />
          </div>
          <h3 className="text-foreground mb-2 font-semibold">No notes yet</h3>
          <p className="text-muted-foreground mb-4 text-sm">
            Start adding important notes and information for this group
          </p>
          <Button size="sm" className="btn-hero">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add First Note
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
