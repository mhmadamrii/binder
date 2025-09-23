import { PlusCircle, Users } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";

export function GroupMember() {
  return (
    <Card className="card-gradient border-border">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center justify-between">
          <span>Add Member</span>
          <Users className="text-primary h-4 w-4" />
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <Button className="btn-hero w-full">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Member
        </Button>

        <Separator className="bg-border" />

        <div className="text-center">
          <p className="text-muted-foreground mb-2 text-xs">
            Or share invite link
          </p>
          <div className="flex items-center space-x-2">
            <Input
              value={`https://binder.app/join/3`}
              readOnly
              className="bg-secondary/50 border-border text-xs"
            />
            <Button variant="ghost" size="sm" className="hover:bg-secondary">
              Copy
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
