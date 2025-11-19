import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

import { UserRole } from "@/config/role-config";
import { db } from "@/db/drizzle";
import { members } from "@/db/schema";
import { getAuthenticatedUser } from "@/lib/server-auth";
import { APIResponse } from "@/types/api/api-response";

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const traceId = uuidv4();

  try {
    // Get authenticated user
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

    const body = await request.json();
    const { organizationId } = body;

    if (!organizationId) {
      const responseTime = Date.now() - startTime;
      return NextResponse.json(
        {
          code: "01",
          message: "Organization ID is required",
          traceId,
          responseAt: new Date().toISOString(),
          timeConsume: responseTime,
        } as APIResponse,
        { status: 400 },
      );
    }

    const userId = authData.user.id;
    const userRole = authData.user.role;

    let hasAccess = false;
    let userOrgRole = null;

    // Admins can access any organization
    if (userRole === UserRole.SUPERADMIN || userRole === UserRole.ADMIN) {
      hasAccess = true;
      userOrgRole = "admin";
    } else {
      // Regular users can only access organizations they're members of
      const membership = await db
        .select()
        .from(members)
        .where(and(eq(members.userId, userId), eq(members.organizationId, organizationId)))
        .limit(1);

      hasAccess = membership.length > 0;
      userOrgRole = membership.length > 0 ? membership[0].role : null;
    }

    const responseTime = Date.now() - startTime;
    return NextResponse.json({
      code: "00",
      message: "Access check completed",
      traceId,
      data: {
        hasAccess,
        role: userOrgRole,
        organizationId,
        userId,
      },
      responseAt: new Date().toISOString(),
      timeConsume: responseTime,
    });
  } catch (error) {
    console.error("Member access check error:", error);
    const responseTime = Date.now() - startTime;

    return NextResponse.json(
      {
        code: "10",
        message: "Internal server error",
        traceId,
        responseAt: new Date().toISOString(),
        timeConsume: responseTime,
      } as APIResponse,
      { status: 500 },
    );
  }
}
