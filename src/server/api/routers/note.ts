import { z } from "zod";
import { noteBlocks, notes, users } from "~/server/db/schema";
import { and, desc, eq, max } from "drizzle-orm";
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
        .where(eq(notes.groupId, input.groupId))
        .orderBy(notes.order);

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
      const [maxOrderNote] = await ctx.db
        .select({ maxOrder: max(notes.order) })
        .from(notes)
        .where(eq(notes.groupId, input.groupId));

      await ctx.db.insert(notes).values({
        groupId: input.groupId,
        authorId: ctx.session.user.id,
        title: input.title,
        desc: input.desc,
        order: (maxOrderNote?.maxOrder ?? 0) + 1,
      });
    }),

  createNoteBlock: protectedProcedure
    .input(
      z.object({
        groupId: z.string(),
        title: z.string().min(1),
        content: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(noteBlocks).values({
        groupId: input.groupId,
        title: input.title,
        content: input.content,
      });
    }),

  updateNoteOrder: protectedProcedure
    .input(
      z.object({
        groupId: z.string(),
        updatedOrder: z.array(
          z.object({
            id: z.number(),
            order: z.number(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      for (const { id, order } of input.updatedOrder) {
        await ctx.db
          .update(notes)
          .set({ order })
          .where(and(eq(notes.id, id), eq(notes.groupId, input.groupId)));
      }
    }),
});

export type NoteRouter = typeof noteRouter;

type NoteInput = inferRouterInputs<NoteRouter>;
type NoteOutput = inferRouterOutputs<NoteRouter>;

export type AllGroupNotesType = NoteOutput["getAllGroupNotes"];
