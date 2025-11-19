/* eslint-disable @typescript-eslint/no-explicit-any */
import { eq, sql, and, gte } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

import { db } from "@/db/drizzle";
import { members, users, organizations, sessions, invitations } from "@/db/schema";
import { getAuthenticatedUser } from "@/lib/server-auth";
import { APIResponse } from "@/types/api/api-response";

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const traceId = uuidv4();

  try {
    const searchParams = request.nextUrl.searchParams;
    const timeRange = searchParams.get("timeRange") || "30d";

    // Get authenticated user using Better Auth
    const authData = await getAuthenticatedUser(request);
    if (!authData?.user) {
      return NextResponse.json(
        {
          traceId,
          code: "02",
          message: "User not authenticated",
        },
        { status: 401 },
      );
    }

    const organizationId = (authData.session as any)?.activeOrganizationId;

    // Calculate date range based on timeRange
    const now = new Date();
    const startDate = new Date();

    switch (timeRange) {
      case "7d":
        startDate.setDate(now.getDate() - 7);
        break;
      case "30d":
        startDate.setDate(now.getDate() - 30);
        break;
      case "90d":
        startDate.setDate(now.getDate() - 90);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }

    // Get organization-specific counts if orgId is provided, otherwise get global counts
    const [totalUsers, totalOrganizations, activeSessions, pendingInvitations] = await Promise.all([
      // Organization members if orgId provided, otherwise all users
      organizationId
        ? db
            .select({ count: sql<number>`count(*)` })
            .from(members)
            .where(eq(members.organizationId, organizationId))
        : db.select({ count: sql<number>`count(*)` }).from(users),

      // Always 1 if orgId provided (current org), otherwise all organizations
      organizationId ? [{ count: 1 }] : db.select({ count: sql<number>`count(*)` }).from(organizations),

      // Sessions for org members if orgId provided, otherwise all sessions
      organizationId
        ? db
            .select({ count: sql<number>`count(*)` })
            .from(sessions)
            .innerJoin(members, eq(sessions.userId, members.userId))
            .where(and(eq(members.organizationId, organizationId), gte(sessions.expiresAt, now)))
        : db
            .select({ count: sql<number>`count(*)` })
            .from(sessions)
            .where(gte(sessions.expiresAt, now)),

      // Pending invitations for org if orgId provided, otherwise all pending invitations
      organizationId
        ? db
            .select({ count: sql<number>`count(*)` })
            .from(invitations)
            .where(
              and(
                eq(invitations.organizationId, organizationId),
                sql`status = 'pending'`,
                gte(invitations.expiresAt, now),
              ),
            )
        : db
            .select({ count: sql<number>`count(*)` })
            .from(invitations)
            .where(and(sql`status = 'pending'`, gte(invitations.expiresAt, now))),
    ]);

    // Get user registration trend data
    const userTrendData = await db
      .select({
        date: sql<string>`DATE(${users.createdAt})`,
        count: sql<number>`count(*)`,
      })
      .from(users)
      .where(gte(users.createdAt, startDate))
      .groupBy(sql`DATE(${users.createdAt})`)
      .orderBy(sql`DATE(${users.createdAt})`);

    // Get session activity trend data
    const sessionTrendData = await db
      .select({
        date: sql<string>`DATE(${sessions.createdAt})`,
        count: sql<number>`count(*)`,
      })
      .from(sessions)
      .where(gte(sessions.createdAt, startDate))
      .groupBy(sql`DATE(${sessions.createdAt})`)
      .orderBy(sql`DATE(${sessions.createdAt})`);

    // Get recent users
    const recentUsers = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        emailVerified: users.emailVerified,
        createdAt: users.createdAt,
        banned: users.banned,
      })
      .from(users)
      .orderBy(sql`${users.createdAt} DESC`)
      .limit(10);

    // Get user role distribution
    const userRoleDistribution = await db
      .select({
        role: users.role,
        count: sql<number>`count(*)`,
      })
      .from(users)
      .groupBy(users.role);

    // Get organization member counts
    const organizationStats = await db
      .select({
        id: organizations.id,
        name: organizations.name,
        memberCount: sql<number>`(SELECT count(*) FROM members WHERE members.organization_id = '${organizations.id}')`,
        createdAt: organizations.createdAt,
      })
      .from(organizations)
      .leftJoin(members, eq(members.organizationId, organizations.id))
      .groupBy(organizations.id)
      .orderBy(sql`${organizations.createdAt} DESC`)
      .limit(10);

    return NextResponse.json({
      traceId,
      code: "00",
      message: "Success",
      data: {
        totals: {
          users: Number(totalUsers[0]?.count || 0),
          organizations: Number(totalOrganizations[0]?.count || 0),
          activeSessions: Number(activeSessions[0]?.count || 0),
          pendingInvitations: Number(pendingInvitations[0]?.count || 0),
        },
        trends: {
          users: userTrendData.map((item) => ({
            date: item.date,
            value: Number(item.count),
          })),
          sessions: sessionTrendData.map((item) => ({
            date: item.date,
            value: Number(item.count),
          })),
        },
        recentData: {
          users: recentUsers.map((user) => ({
            ...user,
            createdAt: user.createdAt.toISOString(),
          })),
          organizations: organizationStats.map((org) => ({
            ...org,
            createdAt: org.createdAt.toISOString(),
            memberCount: Number(org.memberCount),
          })),
        },
        distributions: {
          userRoles: userRoleDistribution.map((item) => ({
            role: item.role || "unknown",
            count: Number(item.count),
          })),
        },
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      {
        traceId,
        code: "02",
        message: "Failed to fetch dashboard statistics",
        responseTime: Date.now() - startTime,
      } as APIResponse,
      { status: 500 },
    );
  }
}
