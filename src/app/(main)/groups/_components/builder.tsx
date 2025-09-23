"use client";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Switch } from "~/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";

const formSchema = z.object({
  name: z.string().min(1),
  desc: z.string(),
  is_private: z.boolean(),
});

export default function MyForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log(values);
      toast(
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>,
      );
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto max-w-3xl space-y-8 py-10"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Group Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter group name" type="" {...field} />
              </FormControl>
              <FormDescription>0/50 characters</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="desc"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="What's your group about?"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>0/100 characters</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="is_private"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Private Group</FormLabel>
                <FormDescription>
                  Make your group private and only accept invited members
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled
                  aria-readonly
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
