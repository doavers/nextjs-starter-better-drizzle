import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

import { db } from "@/db/drizzle";
import { invitations, users, members, organizations } from "@/db/schema";
import { auth } from "@/lib/auth";
import { sendOrganizationInvitationEmail } from "@/lib/mail";

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
    const { email, role } = body;

    if (!email || !role) {
      return NextResponse.json({ code: "01", message: "Email and role are required" }, { status: 400 });
    }

    // Check if user has permission to invite (SUPERADMIN, owner, or admin)
    let hasPermission = false;

    if (session.user.role === "superadmin") {
      hasPermission = true;
    } else {
      const currentUserMembership = await db.query.members.findFirst({
        where: eq(members.userId, session.user.id),
      });

      if (currentUserMembership && currentUserMembership.organizationId === organizationId) {
        hasPermission = currentUserMembership.role === "owner" || currentUserMembership.role === "admin";
      }
    }

    if (!hasPermission) {
      return NextResponse.json({ code: "03", message: "Access denied" }, { status: 403 });
    }

    // Check if user is already a member
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      const existingMembership = await db.query.members.findFirst({
        where: eq(members.userId, existingUser.id),
      });

      if (existingMembership && existingMembership.organizationId === organizationId) {
        return NextResponse.json({ code: "01", message: "User is already a member" }, { status: 400 });
      }
    }

    // Check for existing pending invitation
    const existingInvitation = await db.query.invitations.findFirst({
      where: eq(invitations.email, email),
    });

    if (
      existingInvitation &&
      existingInvitation.organizationId === organizationId &&
      existingInvitation.status === "pending"
    ) {
      return NextResponse.json({ code: "01", message: "Invitation already sent" }, { status: 400 });
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

    // Get organization details for email
    const organization = await db.query.organizations.findFirst({
      where: eq(organizations.id, organizationId),
    });

    if (!organization) {
      return NextResponse.json({ code: "01", message: "Organization not found" }, { status: 404 });
    }

    // Get inviter details for email
    const inviter = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
    });

    if (!inviter) {
      return NextResponse.json({ code: "01", message: "Inviter not found" }, { status: 404 });
    }

    // Send email invitation
    try {
      await sendOrganizationInvitationEmail(
        email,
        organization.name,
        inviter.name || "Unknown",
        inviter.email,
        invitationId,
      );
    } catch (error) {
      console.error("Failed to send invitation email:", error);
      // Don't fail the request if email fails, but log it
    }

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
