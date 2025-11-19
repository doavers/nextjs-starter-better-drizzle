import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/db/drizzle";
import { members, users } from "@/db/schema";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest, { params }: { params: Promise<{ organizationId: string }> }) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user.id) {
      return NextResponse.json({ code: "02", message: "Not authenticated" }, { status: 401 });
    }

    const { organizationId } = await params;

    // Check if user is a member of the organization or is SUPERADMIN
    let hasAccess = false;

    if (session.user.role === "superadmin") {
      hasAccess = true;
    } else {
      const userMembership = await db.query.members.findFirst({
        where: eq(members.organizationId, organizationId),
      });
      hasAccess = !!userMembership;
    }

    if (!hasAccess) {
      return NextResponse.json({ code: "03", message: "Access denied" }, { status: 403 });
    }

    // Fetch all members with user details
    const organizationMembers = await db
      .select({
        id: members.id,
        userId: members.userId,
        name: users.name,
        email: users.email,
        image: users.image,
        role: members.role,
        createdAt: members.createdAt,
      })
      .from(members)
      .innerJoin(users, eq(members.userId, users.id))
      .where(eq(members.organizationId, organizationId));

    return NextResponse.json({
      code: "00",
      message: "Success",
      data: organizationMembers,
    });
  } catch (error) {
    console.error("Error fetching organization members:", error);
    return NextResponse.json({ code: "99", message: "Internal server error" }, { status: 500 });
  }
}
