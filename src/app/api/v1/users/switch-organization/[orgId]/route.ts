import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

import { db } from "@/db/drizzle";
import { members, organizations } from "@/db/schema";
import { getAuthenticatedUser } from "@/lib/server-auth";
import { APIResponse } from "@/types/api/api-response";

export async function POST(request: NextRequest, { params }: { params: Promise<{ orgId: string }> }) {
  const startTime = Date.now();
  const traceId = uuidv4();

  try {
    const { orgId } = await params;

    // Get authenticated user using Better Auth
    const authData = await getAuthenticatedUser(request);
    if (!authData?.user) {
      return NextResponse.json({ code: "02", message: "User not authenticated" }, { status: 401 });
    }

    const userId = authData.user.id;

    // Verify user is a member of the organization
    const membership = await db
      .select({
        id: members.id,
        organizationId: members.organizationId,
        role: members.role,
        organization: {
          id: organizations.id,
          name: organizations.name,
          slug: organizations.slug,
          logo: organizations.logo,
        },
      })
      .from(members)
      .innerJoin(organizations, eq(members.organizationId, organizations.id))
      .where(and(eq(members.userId, userId), eq(members.organizationId, orgId)))
      .limit(1);

    if (membership.length === 0) {
      return NextResponse.json({ code: "02", message: "Not a member of this organization" }, { status: 403 });
    }

    // Update the Better Auth session with the new active organization
    // This would typically be handled by Better Auth's organization plugin
    // For now, we'll return the organization info and let the client handle the session update

    const responseTime = Date.now() - startTime;
    return NextResponse.json({
      code: "00",
      message: "Success",
      traceId,
      data: {
        currentOrganization: membership[0].organization,
        role: membership[0].role,
      },
      responseAt: new Date().toISOString(),
      timeConsume: responseTime,
    } as APIResponse);
  } catch (error) {
    console.error("Switch organization error:", error);
    return NextResponse.json({ code: "02", message: "Failed to switch organization" }, { status: 500 });
  }
}
