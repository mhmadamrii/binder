import { z } from "zod";
import { groupMembers, groups, noteBlocks, users } from "~/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { and, eq, sql } from "drizzle-orm";
import { generateInviteCode } from "~/lib/utils";
import { DEFAULT_BINDER_CREATION } from "~/lib/note-default";

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
      .leftJoin(groupMembers, eq(groups.id, groupMembers.groupId))
      .where(
        sql`EXISTS (
            SELECT 1
            FROM ${groupMembers} gm
            WHERE gm.group_id = ${groups.id}
            AND gm.user_id = ${ctx.session.user.id}
    )`,
      )
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
      return await ctx.db.transaction(async (tx) => {
        const [newGroup] = await tx
          .insert(groups)
          .values({
            name: input.name,
            desc: input.description,
            isPrivate: input.isPrivate,
            ownerId: ctx.session.user.id,
            inviteCode: generateInviteCode(12),
          })
          .returning({ id: groups.id });

        if (!newGroup?.id) throw new Error("Failed to create group");

        await tx.insert(groupMembers).values({
          userId: ctx.session.user.id,
          groupId: newGroup.id,
        });

        await tx.insert(noteBlocks).values({
          groupId: newGroup.id,
          title: "new note",
          content: DEFAULT_BINDER_CREATION,
        });

        return newGroup;
      });
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

  checkInvite: protectedProcedure
    .input(z.object({ inviteCode: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db
        .select({
          id: groups.id,
          name: groups.name,
          desc: groups.desc,
          isPrivate: groups.isPrivate,
          ownerId: groups.ownerId,
          inviteCode: groups.inviteCode,
          createdAt: groups.createdAt,
          membersCount: sql<number>`COUNT(${groupMembers.id})`.as(
            "members_count",
          ),
        })
        .from(groups)
        .leftJoin(groupMembers, eq(groups.id, groupMembers.groupId))
        .where(eq(groups.inviteCode, input.inviteCode))
        .groupBy(
          groups.id,
          groups.name,
          groups.desc,
          groups.isPrivate,
          groups.ownerId,
          groups.inviteCode,
          groups.createdAt,
        );

      if (!result[0]) return null;

      const group = result[0];

      const existingMember = await ctx.db.query.groupMembers.findFirst({
        where: (gm, { eq, and }) =>
          and(eq(gm.groupId, group.id), eq(gm.userId, ctx.session.user.id)),
      });

      return {
        ...group,
        isJoined: !!existingMember,
      };
    }),

  deleteGroup: protectedProcedure
    .input(z.object({ groupId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(groups).where(eq(groups.id, input.groupId));
      return { id: input.groupId };
    }),

  isCurrentUserGroupOwner: protectedProcedure
    .input(z.object({ groupId: z.string() }))
    .query(async ({ ctx, input }) => {
      const [group] = await ctx.db
        .select({
          id: groups.id,
          ownerId: groups.ownerId,
        })
        .from(groups)
        .where(eq(groups.id, input.groupId));

      return group?.ownerId === ctx.session.user.id;
    }),

  quitGroup: protectedProcedure
    .input(z.object({ groupId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .delete(groupMembers)
        .where(
          and(
            eq(groupMembers.userId, ctx.session.user.id),
            eq(groupMembers.groupId, input.groupId),
          ),
        );
    }),

  checkIsMember: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const member = await ctx.db
        .select()
        .from(groupMembers)
        .where(
          and(
            eq(groupMembers.groupId, input.id),
            eq(groupMembers.userId, ctx.session.user.id),
          ),
        )
        .limit(1);

      return { isMember: member.length > 0 };
    }),
});
