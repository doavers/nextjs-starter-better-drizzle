import { eq, ilike, desc, sql, and } from "drizzle-orm";
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
      console.error("Token validation failed:", error);
    }
  }

  return null;
}

export async function POST(request: NextRequest) {
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
        },
        { status: 401 },
      );
    }

    const userRole = authData.user.role;
    const userId = authData.user.id;
    const isAdmin = userRole === UserRole.SUPERADMIN || userRole === UserRole.ADMIN;

    // For regular users, check if they already have an organization
    if (!isAdmin) {
      try {
        const existingUserOrgs = await db
          .select({
            id: organizations.id,
            name: organizations.name,
          })
          .from(members)
          .innerJoin(organizations, eq(members.organizationId, organizations.id))
          .where(eq(members.userId, userId))
          .limit(1);

        if (existingUserOrgs.length > 0) {
          return NextResponse.json(
            {
              code: "03",
              message: "You can only create one organization. You already have an organization.",
              traceId,
              responseAt: new Date().toISOString(),
              timeConsume: Date.now() - startTime,
            },
            { status: 403 },
          );
        }
      } catch (error) {
        console.error("Error checking existing organizations:", error);
        return NextResponse.json(
          {
            code: "10",
            message: "Failed to check existing organizations",
            traceId,
            responseAt: new Date().toISOString(),
            timeConsume: Date.now() - startTime,
          },
          { status: 500 },
        );
      }
    }

    const body = await request.json();
    const { name, slug, logo, metadata } = body;

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json(
        {
          code: "01",
          message: "Name and slug are required",
          traceId,
          responseAt: new Date().toISOString(),
          timeConsume: Date.now() - startTime,
        },
        { status: 400 },
      );
    }

    // Check if slug already exists
    const existingOrg = await db.select().from(organizations).where(eq(organizations.slug, slug)).limit(1);

    if (existingOrg.length > 0) {
      return NextResponse.json(
        {
          code: "08",
          message: "Organization with this slug already exists",
          traceId,
          responseAt: new Date().toISOString(),
          timeConsume: Date.now() - startTime,
        },
        { status: 409 },
      );
    }

    // Create organization
    const orgId = uuidv4();
    const newOrganization = {
      id: orgId,
      name,
      slug,
      logo: logo || null,
      metadata: metadata || null,
      createdAt: new Date(),
    };

    await db.insert(organizations).values(newOrganization);

    // Add the creator as an owner member
    const memberId = uuidv4();
    await db.insert(members).values({
      id: memberId,
      organizationId: orgId,
      userId: authData.user.id,
      role: "owner",
      createdAt: new Date(),
    });

    const responseTime = Date.now() - startTime;
    const apiResponse: APIResponse = {
      traceId,
      code: "00",
      message: "Organization created successfully",
      data: {
        id: orgId,
        name,
        slug,
        logo: logo || null,
        metadata: metadata || null,
        createdAt: newOrganization.createdAt,
        role: "owner",
      },
      responseAt: new Date().toISOString(),
      timeConsume: responseTime,
    };

    return NextResponse.json(apiResponse);
  } catch (error) {
    console.error("Error creating organization:", error);
    const responseTime = Date.now() - startTime;

    return NextResponse.json(
      {
        code: "10",
        message: "Internal server error",
        traceId,
        responseAt: new Date().toISOString(),
        timeConsume: responseTime,
      },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
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
        },
        { status: 401 },
      );
    }

    const userRole = authData.user.role;
    const userId = authData.user.id;

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort");

    let organizationsQuery;

    // SUPERADMIN and ADMIN can see all organizations
    if (userRole === UserRole.SUPERADMIN || userRole === UserRole.ADMIN) {
      // Build the query with optional search filter
      const whereConditions = [];

      if (search) {
        whereConditions.push(ilike(organizations.name, `%${search}%`));
      }

      organizationsQuery = db
        .select({
          id: organizations.id,
          name: organizations.name,
          slug: organizations.slug,
          logo: organizations.logo,
          metadata: organizations.metadata,
          createdAt: organizations.createdAt,
          role: sql<string>`'admin'`.as("role"), // Admins get admin role
          memberCount: sql<number>`(
            SELECT COUNT(*)
            FROM ${members}
            WHERE ${members.organizationId} = ${organizations.id}
          )`.as("memberCount"),
        })
        .from(organizations)
        .leftJoin(members, eq(members.organizationId, organizations.id))
        .groupBy(organizations.id)
        .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
        .orderBy(sort === "name" ? organizations.name : desc(organizations.createdAt));
    } else {
      // Regular users only see organizations they are members of
      // Build the base query with user filter and optional search filter
      const whereConditions = [eq(members.userId, userId)];

      if (search) {
        whereConditions.push(ilike(organizations.name, `%${search}%`));
      }

      organizationsQuery = db
        .select({
          id: organizations.id,
          name: organizations.name,
          slug: organizations.slug,
          logo: organizations.logo,
          metadata: organizations.metadata,
          createdAt: organizations.createdAt,
          role: members.role,
          memberCount: sql<number>`(
            SELECT COUNT(*)
            FROM ${members} m2
            WHERE m2.organizationId = ${organizations.id}
          )`.as("memberCount"),
        })
        .from(members)
        .innerJoin(organizations, eq(members.organizationId, organizations.id))
        .where(and(...whereConditions))
        .orderBy(sort === "name" ? organizations.name : desc(organizations.createdAt));
    }

    const allOrgs = await organizationsQuery;
    const total = allOrgs.length;

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const paginatedOrgs = allOrgs.slice(startIndex, startIndex + limit);

    const responseTime = Date.now() - startTime;
    return NextResponse.json({
      traceId,
      code: "00",
      message: "Success",
      data: paginatedOrgs,
      paging: {
        size: limit,
        total_page: Math.ceil(total / limit),
        current_page: page,
        total,
      },
      responseAt: new Date().toISOString(),
      timeConsume: responseTime,
    });
  } catch (error) {
    console.error("Error fetching organizations:", error);
    const responseTime = Date.now() - startTime;

    return NextResponse.json(
      {
        code: "10",
        message: "Internal server error",
        traceId,
        responseAt: new Date().toISOString(),
        timeConsume: responseTime,
      },
      { status: 500 },
    );
  }
}
