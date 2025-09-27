import bcrypt from "bcryptjs";

import { z } from "zod";
import { groupMembers, users } from "~/server/db/schema";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { db } from "~/server/db";
import { and, eq, notInArray } from "drizzle-orm";

export const userRouter = createTRPCRouter({
  addNewUser: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const passHash = await bcrypt.hash(input.password, 10);
      return await db
        .insert(users)
        .values({
          name: input.name,
          email: input.email,
          password: passHash,
        })
        .returning({ id: users.id });
    }),

  getAllUsers: protectedProcedure
    .input(z.object({ groupId: z.string() }))
    .query(async () => {
      const allUsers = await db.select().from(users);
      return allUsers;
    }),

  getAllUsersNotInGroup: protectedProcedure
    .input(z.object({ groupId: z.string() }))
    .query(async ({ input }) => {
      const memberIds = db
        .select({ userId: groupMembers.userId })
        .from(groupMembers)
        .where(eq(groupMembers.groupId, input.groupId));

      const usersNotInGroup = await db
        .select()
        .from(users)
        .where(notInArray(users.id, memberIds));

      return usersNotInGroup;
    }),

  getCurrentUser: protectedProcedure.query(
    async ({ ctx }) => ctx?.session?.user,
  ),
});
