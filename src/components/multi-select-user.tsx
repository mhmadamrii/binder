"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "~/lib/utils";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

export interface User {
  id: string;
  name: string | null;
  email: string;
  avatar: string | null;
}

interface MultiSelectUsersProps {
  users: User[];
  selectedUsers: User[];
  onSelectionChange: (users: User[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function MultiSelectUsers({
  users,
  selectedUsers,
  onSelectionChange,
  placeholder = "Select users...",
  className,
  disabled = false,
}: MultiSelectUsersProps) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (user: User) => {
    const isSelected = selectedUsers.some(
      (selected) => selected.id === user.id,
    );

    if (isSelected) {
      onSelectionChange(
        selectedUsers.filter((selected) => selected.id !== user.id),
      );
    } else {
      onSelectionChange([...selectedUsers, user]);
    }
  };

  const handleRemove = (userId: string) => {
    onSelectionChange(selectedUsers.filter((user) => user.id !== userId));
  };

  const handleClear = () => {
    onSelectionChange([]);
  };

  return (
    <section className={cn("w-full", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="h-auto min-h-10 w-full justify-between bg-transparent p-2"
            disabled={disabled}
          >
            <div className="flex flex-1 flex-wrap gap-1">
              {selectedUsers.length === 0 ? (
                <span className="text-muted-foreground">{placeholder}</span>
              ) : (
                selectedUsers.map((user) => (
                  <Badge
                    key={user.id}
                    variant="secondary"
                    className="h-6 pr-1 text-xs"
                  >
                    <span className="max-w-[120px] truncate">{user.name}</span>
                    <span
                      className="hover:bg-muted ml-1 rounded-sm p-0.5"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleRemove(user.id);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </span>
                  </Badge>
                ))
              )}
            </div>
            <div className="ml-2 flex items-center gap-1">
              {selectedUsers.length > 0 && (
                <span
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleClear();
                  }}
                  className="hover:bg-muted rounded-sm p-1"
                >
                  <X className="h-4 w-4" />
                </span>
              )}
              <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Search users..." />
            <CommandList>
              <CommandEmpty>No users found.</CommandEmpty>
              <CommandGroup>
                {users.map((user) => {
                  const isSelected = selectedUsers.some(
                    (selected) => selected.id === user.id,
                  );
                  return (
                    <CommandItem
                      key={user.id}
                      value={`${user.name} ${user.email}`}
                      onSelect={() => handleSelect(user)}
                      className="cursor-pointer"
                    >
                      <div className="flex flex-1 items-center gap-2">
                        {user.avatar ? (
                          <img
                            src={user.avatar || "/placeholder.svg"}
                            alt={user.name ?? "some user"}
                            className="h-6 w-6 rounded-full object-cover"
                          />
                        ) : (
                          <div className="bg-muted flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium">
                            {user?.name?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">
                            {user.name}
                          </span>
                          <span className="text-muted-foreground text-xs">
                            {user.email}
                          </span>
                        </div>
                      </div>
                      <Check
                        className={cn(
                          "h-4 w-4",
                          isSelected ? "opacity-100" : "opacity-0",
                        )}
                      />
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </section>
  );
}
