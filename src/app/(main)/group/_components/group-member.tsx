"use client";

import { PlusCircle, Users } from "lucide-react";
import { MultiSelectUsers } from "~/components/multi-select-user";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
};

export function GroupMember() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  const handleSelectMultiUser = (user: User[]) => {
    setSelectedUsers(user);
  };

  return (
    <>
      <Card className="card-gradient border-border">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center justify-between">
            <span>Add Member</span>
            <Users className="text-primary h-4 w-4" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={() => setIsOpen(true)} className="btn-hero w-full">
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

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
          </DialogHeader>
          <MultiSelectUsers
            onSelectionChange={handleSelectMultiUser}
            selectedUsers={selectedUsers}
            users={[
              {
                id: "1",
                name: "Alice",
                email: "alice@example.com",
                avatar:
                  "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
              },
              {
                id: "2",
                name: "Bob",
                email: "bob@example.com",
                avatar:
                  "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
              },
              {
                id: "3",
                name: "Charlie",
                email: "charlie@example.com",
                avatar:
                  "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
              },
            ]}
            placeholder="Select users..."
          />
          <Button>Add</Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
