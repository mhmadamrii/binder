import bcrypt from "bcryptjs";

import { z } from "zod";
import { users } from "~/server/db/schema";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { db } from "~/server/db";

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

  getAllUsers: publicProcedure.query(async () => {
    const allUsers = await db.select().from(users);
    return allUsers;
  }),
});
