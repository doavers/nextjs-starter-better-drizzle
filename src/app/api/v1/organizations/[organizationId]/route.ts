import { eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

import { UserRole } from "@/config/role-config";
import { db } from "@/db/drizzle";
import { members, organizations } from "@/db/schema";
import { auth } from "@/lib/auth";
import { getAuthenticatedUser } from "@/lib/server-auth";
import { APIResponse } from "@/types/api/api-response";

async function getAuthenticatedUserFromRequest(request: NextRequest) {
  // First try to get user from session (standard Better Auth approach)
  const sessionUser = await getAuthenticatedUser(request);
  if (sessionUser?.user) {
    return sessionUser;
  }

  // If no session, try Bearer token authentication
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    try {
      const token = authHeader.substring(7); // Remove "Bearer " prefix

      // Create a mock request with the token in headers for Better Auth
      const mockRequest = new Request(request.url, {
        method: request.method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Try to get session using the token
      const session = await auth.api.getSession({
        headers: mockRequest.headers,
      });

      if (session?.user) {
        return {
          user: session.user,
          session: session,
        };
      }
    } catch (error) {
      console.error("Token valorganizationIdation failed:", error);
    }
  }

  return null;
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ organizationId: string }> }) {
  const startTime = Date.now();
  const traceId = uuidv4();

  try {
    // Get authenticated user (supports both session and Bearer token)
    const authData = await getAuthenticatedUserFromRequest(request);
    if (!authData?.user) {
      return NextResponse.json(
        {
          code: "02",
          message: "User not authenticated",
          traceId,
          responseAt: new Date().toISOString(),
          timeConsume: Date.now() - startTime,
        } as APIResponse,
        { status: 401 },
      );
    }

    const userRole = authData.user.role;
    const { organizationId } = await params;

    // Check if user is SUPERADMIN or ADMIN
    if (userRole !== UserRole.SUPERADMIN && userRole !== UserRole.ADMIN && userRole !== UserRole.USER) {
      return NextResponse.json(
        {
          code: "03",
          message: "Access denied. Only SUPERADMIN and ADMIN can view organization details.",
          traceId,
          responseAt: new Date().toISOString(),
          timeConsume: Date.now() - startTime,
        } as APIResponse,
        { status: 403 },
      );
    }

    // Get organization with member count
    const orgData = await db
      .select({
        organizationId: organizations.id,
        name: organizations.name,
        slug: organizations.slug,
        logo: organizations.logo,
        metadata: organizations.metadata,
        createdAt: organizations.createdAt,
        memberCount: sql<number>`(
          SELECT COUNT(*)
          FROM members m2
          WHERE m2.organization_id = ${organizations.id}
        )`.as("memberCount"),
      })
      .from(organizations)
      .leftJoin(members, eq(members.organizationId, organizations.id))
      .groupBy(organizations.id)
      .where(eq(organizations.id, organizationId))
      .limit(1);

    if (orgData.length === 0) {
      return NextResponse.json(
        {
          code: "08",
          message: "Organization not found",
          traceId,
          responseAt: new Date().toISOString(),
          timeConsume: Date.now() - startTime,
        } as APIResponse,
        { status: 404 },
      );
    }

    const responseTime = Date.now() - startTime;
    return NextResponse.json({
      traceId,
      code: "00",
      message: "Success",
      data: orgData[0],
      responseAt: new Date().toISOString(),
      timeConsume: responseTime,
    } as APIResponse);
  } catch (error) {
    console.error("Error fetching organization:", error);
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

export async function PUT(request: NextRequest, { params }: { params: Promise<{ organizationId: string }> }) {
  const startTime = Date.now();
  const traceId = uuidv4();

  try {
    // Get authenticated user (supports both session and Bearer token)
    const authData = await getAuthenticatedUserFromRequest(request);
    if (!authData?.user) {
      return NextResponse.json(
        {
          code: "02",
          message: "User not authenticated",
          traceId,
          responseAt: new Date().toISOString(),
          timeConsume: Date.now() - startTime,
        } as APIResponse,
        { status: 401 },
      );
    }

    const userRole = authData.user.role;
    const { organizationId } = await params;

    // Check if user is SUPERADMIN or ADMIN
    if (userRole !== UserRole.SUPERADMIN && userRole !== UserRole.ADMIN) {
      return NextResponse.json(
        {
          code: "03",
          message: "Access denied. Only SUPERADMIN and ADMIN can update organizations.",
          traceId,
          responseAt: new Date().toISOString(),
          timeConsume: Date.now() - startTime,
        } as APIResponse,
        { status: 403 },
      );
    }

    // Check if organization exists
    const existingOrg = await db.select().from(organizations).where(eq(organizations.id, organizationId)).limit(1);

    if (existingOrg.length === 0) {
      return NextResponse.json(
        {
          code: "08",
          message: "Organization not found",
          traceId,
          responseAt: new Date().toISOString(),
          timeConsume: Date.now() - startTime,
        } as APIResponse,
        { status: 404 },
      );
    }

    const body = await request.json();
    const { name, slug, logo, metadata } = body;

    // ValorganizationIdate required fields
    if (!name || !slug) {
      return NextResponse.json(
        {
          code: "01",
          message: "Name and slug are required",
          traceId,
          responseAt: new Date().toISOString(),
          timeConsume: Date.now() - startTime,
        } as APIResponse,
        { status: 400 },
      );
    }

    // Check if slug already exists (excluding current organization)
    const duplicateOrg = await db.select().from(organizations).where(eq(organizations.slug, slug)).limit(1);

    if (duplicateOrg.length > 0 && duplicateOrg[0].id !== organizationId) {
      return NextResponse.json(
        {
          code: "08",
          message: "Organization with this slug already exists",
          traceId,
          responseAt: new Date().toISOString(),
          timeConsume: Date.now() - startTime,
        } as APIResponse,
        { status: 409 },
      );
    }

    // Update organization
    await db
      .update(organizations)
      .set({
        name,
        slug,
        logo: logo || null,
        metadata: metadata || null,
      })
      .where(eq(organizations.id, organizationId));

    // Get updated organization data
    const updatedOrg = await db
      .select({
        organizationId: organizations.id,
        name: organizations.name,
        slug: organizations.slug,
        logo: organizations.logo,
        metadata: organizations.metadata,
        createdAt: organizations.createdAt,
        memberCount: sql<number>`(
          SELECT COUNT(*)
          FROM members m2
          WHERE m2.organization_organizationId = ${organizations.id}
        )`.as("memberCount"),
      })
      .from(organizations)
      .where(eq(organizations.id, organizationId))
      .limit(1);

    const responseTime = Date.now() - startTime;
    return NextResponse.json({
      traceId,
      code: "00",
      message: "Organization updated successfully",
      data: updatedOrg[0],
      responseAt: new Date().toISOString(),
      timeConsume: responseTime,
    } as APIResponse);
  } catch (error) {
    console.error("Error updating organization:", error);
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

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ organizationId: string }> }) {
  const startTime = Date.now();
  const traceId = uuidv4();

  try {
    // Get authenticated user (supports both session and Bearer token)
    const authData = await getAuthenticatedUserFromRequest(request);
    if (!authData?.user) {
      return NextResponse.json(
        {
          code: "02",
          message: "User not authenticated",
          traceId,
          responseAt: new Date().toISOString(),
          timeConsume: Date.now() - startTime,
        } as APIResponse,
        { status: 401 },
      );
    }

    const userRole = authData.user.role;
    const { organizationId } = await params;

    // Check if user is SUPERADMIN or ADMIN
    if (userRole !== UserRole.SUPERADMIN && userRole !== UserRole.ADMIN) {
      return NextResponse.json(
        {
          code: "03",
          message: "Access denied. Only SUPERADMIN and ADMIN can delete organizations.",
          traceId,
          responseAt: new Date().toISOString(),
          timeConsume: Date.now() - startTime,
        } as APIResponse,
        { status: 403 },
      );
    }

    // Check if organization exists
    const existingOrg = await db.select().from(organizations).where(eq(organizations.id, organizationId)).limit(1);

    if (existingOrg.length === 0) {
      return NextResponse.json(
        {
          code: "08",
          message: "Organization not found",
          traceId,
          responseAt: new Date().toISOString(),
          timeConsume: Date.now() - startTime,
        } as APIResponse,
        { status: 404 },
      );
    }

    // Delete organization (cascade delete will handle members due to foreign key constraints)
    await db.delete(organizations).where(eq(organizations.id, organizationId));

    const responseTime = Date.now() - startTime;
    return NextResponse.json({
      traceId,
      code: "00",
      message: "Organization deleted successfully",
      data: null,
      responseAt: new Date().toISOString(),
      timeConsume: responseTime,
    } as APIResponse);
  } catch (error) {
    console.error("Error deleting organization:", error);
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
