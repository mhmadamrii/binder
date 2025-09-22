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
    .query(({ input }) => {
      return db.insert(users).values({
        name: input.name,
        email: input.email,
        password: input.password,
      });
    }),
});
