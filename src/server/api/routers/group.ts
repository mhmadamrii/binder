import { z } from "zod";
import { groupMembers, groups, users } from "~/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { eq, sql } from "drizzle-orm";

export const groupRouter = createTRPCRouter({
  getAllGroups: protectedProcedure.query(async ({ ctx }) => {
    const allPosts = await ctx.db.select().from(groups);
    return allPosts;
  }),

  getAllMyGroups: protectedProcedure.query(async ({ ctx }) => {
    const myGroups = await ctx.db
      .select({
        id: groups.id,
        name: groups.name,
        desc: groups.desc,
        isPrivate: groups.isPrivate,
        ownerId: groups.ownerId,
        createdAt: groups.createdAt,
        membersCount: sql<number>`COUNT(${groupMembers.id})`.as(
          "members_count",
        ),
      })
      .from(groups)
      .innerJoin(groupMembers, eq(groups.id, groupMembers.groupId))
      .where(eq(groupMembers.userId, ctx.session.user.id))
      .groupBy(
        groups.id,
        groups.name,
        groups.desc,
        groups.isPrivate,
        groups.ownerId,
        groups.createdAt,
      );

    return myGroups;
  }),

  getGroupById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const [group] = await ctx.db
        .select()
        .from(groups)
        .where(eq(groups.id, input.id));

      if (!group) return null;

      const members = await ctx.db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
        })
        .from(groupMembers)
        .innerJoin(users, eq(groupMembers.userId, users.id))
        .where(eq(groupMembers.groupId, input.id));

      return {
        ...group,
        members,
      };
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
      const newGroup = await ctx.db
        .insert(groups)
        .values({
          name: input.name,
          desc: input.description,
          isPrivate: input.isPrivate,
          ownerId: ctx.session.user.id,
        })
        .returning({ id: groups.id });

      if (newGroup) {
        await ctx.db.insert(groupMembers).values({
          userId: ctx.session.user.id,
          groupId: newGroup[0]?.id ?? "",
        });
      }

      return newGroup;
    }),

  getPublicGroups: protectedProcedure.query(async ({ ctx }) => {
    const publicGroups = await ctx.db
      .select({
        id: groups.id,
        name: groups.name,
        desc: groups.desc,
        isPrivate: groups.isPrivate,
        ownerId: groups.ownerId,
        createdAt: groups.createdAt,
        membersCount: sql<number>`COUNT(${groupMembers.id})`.as(
          "members_count",
        ),
        isJoined: sql<boolean>`
      EXISTS (
        SELECT 1
        FROM ${groupMembers} gm
        WHERE gm.group_id = ${groups.id}
          AND gm.user_id = ${ctx.session.user.id}
      )
    `.as("is_joined"),
      })
      .from(groups)
      .leftJoin(groupMembers, eq(groups.id, groupMembers.groupId))
      .where(eq(groups.isPrivate, false))
      .groupBy(
        groups.id,
        groups.name,
        groups.desc,
        groups.isPrivate,
        groups.ownerId,
        groups.createdAt,
      );

    console.log("publicGroups", publicGroups);

    return publicGroups;
  }),

  addMembersToGroup: protectedProcedure
    .input(
      z.object({
        userIds: z.array(z.string()),
        groupId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.insert(groupMembers).values(
        input.userIds.map((userId) => ({
          userId,
          groupId: input.groupId,
        })),
      );
    }),

  addCurrentUserToGroup: protectedProcedure
    .input(
      z.object({
        groupId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(groupMembers).values({
        userId: ctx.session.user.id,
        groupId: input.groupId,
      });

      return { groupId: input.groupId };
    }),
});
