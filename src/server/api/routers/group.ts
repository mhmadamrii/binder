import { z } from "zod";
import { groups } from "~/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const groupRouter = createTRPCRouter({
  getAllGroups: protectedProcedure.query(async ({ ctx }) => {
    const allPosts = await ctx.db.select().from(groups);
    return allPosts;
  }),

  getAllMyGroups: protectedProcedure.query(async ({ ctx }) => {
    const allPosts = await ctx.db.select().from(groups);
    return allPosts;
  }),

  createGroup: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().min(1),
        isPrivate: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .insert(groups)
        .values({
          name: input.name,
          desc: input.description,
          isPrivate: input.isPrivate,
          ownerId: ctx.session.user.id,
        })
        .returning({ id: groups.id });
    }),
});
