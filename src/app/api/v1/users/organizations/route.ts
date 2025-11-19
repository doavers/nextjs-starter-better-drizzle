import { eq, sql, desc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

import { UserRole } from "@/config/role-config";
import { db } from "@/db/drizzle";
import { members, organizations } from "@/db/schema";
import { getValueFromCookie } from "@/lib/cookie";
import { getAuthenticatedUser } from "@/lib/server-auth";
import { APIResponse } from "@/types/api/api-response";
import { ExtendedSession } from "@/types/auth";

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const traceId = uuidv4();

  try {
    // Get authenticated user using Better Auth
    const authData = await getAuthenticatedUser(request);
    if (!authData?.user) {
      const responseTime = Date.now() - startTime;
      return NextResponse.json(
        {
          code: "02",
          message: "User not authenticated",
          traceId,
          responseAt: new Date().toISOString(),
          timeConsume: responseTime,
        } as APIResponse,
        { status: 401 },
      );
    }

    const userId = authData.user.id;
    const userRole = authData.user.role;

    let userOrganizations;

    // SUPERADMIN and ADMIN can see all organizations
    if (userRole === UserRole.SUPERADMIN || userRole === UserRole.ADMIN) {
      userOrganizations = await db
        .select({
          id: organizations.id,
          name: organizations.name,
          slug: organizations.slug,
          logo: organizations.logo,
          role: sql<string>`'owner'`.as("role"), // SUPERADMINs and ADMINs are effectively owners of all orgs
          memberCount: sql<number>`(
            SELECT COUNT(*)
            FROM members m2
            WHERE m2.organization_id = ${organizations.id}
          )`.as("memberCount"),
          createdAt: organizations.createdAt,
        })
        .from(organizations)
        .leftJoin(members, eq(members.organizationId, organizations.id))
        .groupBy(organizations.id)
        .orderBy(desc(organizations.createdAt));
    } else {
      // Regular users only see organizations they are members of
      userOrganizations = await db
        .select({
          id: organizations.id,
          name: organizations.name,
          slug: organizations.slug,
          logo: organizations.logo,
          role: members.role,
          memberCount: sql<number>`(
            SELECT COUNT(*)
            FROM members m2
            WHERE m2.organization_id = ${organizations.id}
          )`.as("memberCount"),
          createdAt: organizations.createdAt,
        })
        .from(members)
        .innerJoin(organizations, eq(members.organizationId, organizations.id))
        .where(eq(members.userId, userId));
    }

    // Try to get active organization ID from client cookie first
    const clientActiveOrgId = await getValueFromCookie("active_organization_id");

    // Get current active organization from session, client cookie, or default to first
    let activeOrgId = (authData.session as ExtendedSession)?.activeOrganizationId;

    // If no session active org, try client cookie
    if (!activeOrgId && clientActiveOrgId) {
      activeOrgId = clientActiveOrgId;
    }

    // If still no active org, default to first organization
    if (!activeOrgId) {
      activeOrgId = userOrganizations[0]?.id;
    }

    // Check if user has any organizations
    if (userOrganizations.length === 0) {
      const responseTime = Date.now() - startTime;
      return NextResponse.json({
        code: "00",
        message: "Success",
        traceId,
        data: {
          organizations: [],
          currentOrganization: null,
        },
        responseAt: new Date().toISOString(),
        timeConsume: responseTime,
      } as APIResponse);
    }

    const currentOrganization = userOrganizations.find((org) => org.id === activeOrgId) || userOrganizations[0];

    const responseTime = Date.now() - startTime;
    return NextResponse.json({
      code: "00",
      message: "Success",
      traceId,
      data: {
        organizations: userOrganizations,
        currentOrganization,
      },
      responseAt: new Date().toISOString(),
      timeConsume: responseTime,
    } as APIResponse);
  } catch (error) {
    console.error("Organizations API error:", error);
    const responseTime = Date.now() - startTime;
    return NextResponse.json(
      {
        code: "10",
        message: "Failed to fetch organizations",
        traceId,
        responseAt: new Date().toISOString(),
        timeConsume: responseTime,
      } as APIResponse,
      { status: 500 },
    );
  }
}
