import { z } from "zod";
import { messages, users } from "~/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { eq, and } from "drizzle-orm";
import { format } from "date-fns";

export const messageRouter = createTRPCRouter({
  getAllMessagesByGroupId: protectedProcedure
    .input(z.object({ groupId: z.string() }))
    .query(async ({ ctx, input }) => {
      const prevMessages = await ctx.db
        .select()
        .from(messages)
        .innerJoin(users, eq(messages.senderId, users.id))
        .where(and(eq(messages.groupId, input.groupId)))
        .orderBy(messages.createdAt);

      return prevMessages.map((m) => ({
        id: m.messages.id,
        content: m.messages.content,
        sender: m.user.name ?? "Anonymous",
        timestamp: format(new Date(m.messages.createdAt), "HH:mm"),
        isOwn: m.user.id === ctx.session.user.id,
      }));
    }),

  createMessage: protectedProcedure
    .input(
      z.object({
        groupId: z.string().min(1),
        content: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { groupId, content } = input;
      return await ctx.db
        .insert(messages)
        .values({
          groupId,
          content,
          senderId: ctx.session.user.id,
        })
        .returning({ id: messages.id });
    }),
});
