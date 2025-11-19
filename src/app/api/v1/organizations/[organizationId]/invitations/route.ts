import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

import { db } from "@/db/drizzle";
import { invitations, users, members } from "@/db/schema";
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

    // Fetch all invitations with inviter details
    const organizationInvitations = await db
      .select({
        id: invitations.id,
        email: invitations.email,
        role: invitations.role,
        status: invitations.status,
        expiresAt: invitations.expiresAt,
        inviterName: users.name,
      })
      .from(invitations)
      .innerJoin(users, eq(invitations.inviterId, users.id))
      .where(eq(invitations.organizationId, organizationId));

    return NextResponse.json({
      code: "00",
      message: "Success",
      data: organizationInvitations,
    });
  } catch (error) {
    console.error("Error fetching organization invitations:", error);
    return NextResponse.json({ code: "99", message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ organizationId: string }> }) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user.id) {
      return NextResponse.json({ code: "02", message: "Not authenticated" }, { status: 401 });
    }

    const { organizationId } = await params;
    const body = await request.json();

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

    const { email, role } = body;

    if (!email || !role) {
      return NextResponse.json({ code: "01", message: "Email and role are required" }, { status: 400 });
    }

    // Check if user is already a member
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      const existingMembership = await db.query.members.findFirst({
        where: eq(members.userId, existingUser.id),
      });

      if (existingMembership) {
        return NextResponse.json({ code: "01", message: "User is already a member" }, { status: 400 });
      }
    }

    // Create invitation
    const invitationId = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Expires in 7 days

    await db.insert(invitations).values({
      id: invitationId,
      organizationId,
      email,
      role,
      status: "pending",
      expiresAt,
      inviterId: session.user.id,
    });

    // TODO: Send email invitation

    return NextResponse.json({
      code: "00",
      message: "Invitation sent successfully",
      data: {
        id: invitationId,
        email,
        role,
        status: "pending",
        expiresAt,
      },
    });
  } catch (error) {
    console.error("Error creating invitation:", error);
    return NextResponse.json({ code: "99", message: "Internal server error" }, { status: 500 });
  }
}
