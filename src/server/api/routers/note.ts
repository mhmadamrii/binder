import { z } from "zod";
import { notes, users } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

export const noteRouter = createTRPCRouter({
  getAllGroupNotes: protectedProcedure
    .input(z.object({ groupId: z.string() }))
    .query(async ({ ctx, input }) => {
      const allNotes = await ctx.db
        .select()
        .from(notes)
        .innerJoin(users, eq(notes.authorId, users.id))
        .where(eq(notes.groupId, input.groupId));

      return allNotes;
    }),

  createNote: protectedProcedure
    .input(
      z.object({
        groupId: z.string(),
        title: z.string().min(1),
        desc: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(notes).values({
        groupId: input.groupId,
        authorId: ctx.session.user.id,
        title: input.title,
        desc: input.desc,
      });
    }),
});

export type NoteRouter = typeof noteRouter;

type NoteInput = inferRouterInputs<NoteRouter>;
type NoteOutput = inferRouterOutputs<NoteRouter>;

export type AllGroupNotesType = NoteOutput["getAllGroupNotes"];
