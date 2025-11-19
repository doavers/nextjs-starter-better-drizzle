import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/db/drizzle";
import { invitations, members, users, organizations } from "@/db/schema";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest, { params }: { params: Promise<{ invitationId: string }> }) {
  try {
    const { invitationId } = await params;

    // Get the invitation
    const invitation = await db.query.invitations.findFirst({
      where: eq(invitations.id, invitationId),
    });

    if (!invitation) {
      return NextResponse.json(
        {
          code: "01",
          message: "Invitation not found",
          data: null,
        },
        { status: 404 },
      );
    }

    // Get inviter details separately
    const inviter = await db.query.users.findFirst({
      where: eq(users.id, invitation.inviterId),
      columns: {
        id: true,
        name: true,
        email: true,
      },
    });

    // Get organization details
    const organization = await db.query.organizations.findFirst({
      where: eq(organizations.id, invitation.organizationId),
      columns: {
        id: true,
        name: true,
        slug: true,
      },
    });

    // Check if the invitation has expired
    const isExpired = new Date() > invitation.expiresAt;

    // Determine the status
    let status: "pending" | "expired" | "accepted" | "cancelled" = invitation.status as
      | "pending"
      | "expired"
      | "accepted"
      | "cancelled";

    if (isExpired && invitation.status === "pending") {
      status = "expired";
    }

    // Check if user is already a member (accepted scenario)
    if (invitation.status === "pending") {
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, invitation.email),
      });

      if (existingUser) {
        const existingMembership = await db.query.members.findFirst({
          where: eq(members.userId, existingUser.id),
        });

        if (existingMembership && existingMembership.organizationId === invitation.organizationId) {
          status = "accepted";
        }
      }
    }

    const responseData = {
      id: invitation.id,
      email: invitation.email,
      role: invitation.role,
      status,
      expiresAt: invitation.expiresAt,
      inviterId: invitation.inviterId,
      organization: organization
        ? {
            id: organization.id,
            name: organization.name,
            slug: organization.slug,
          }
        : null,
      inviter: inviter
        ? {
            id: inviter.id,
            name: inviter.name,
            email: inviter.email,
          }
        : null,
    };

    return NextResponse.json({
      code: "00",
      message: "Success",
      data: responseData,
    });
  } catch (error) {
    console.error("Error fetching invitation:", error);
    return NextResponse.json(
      {
        code: "99",
        message: "Internal server error",
        data: null,
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ invitationId: string }> }) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user.id) {
      return NextResponse.json({ code: "02", message: "Not authenticated" }, { status: 401 });
    }

    const { invitationId } = await params;

    // Get the invitation to be cancelled
    const invitation = await db.query.invitations.findFirst({
      where: eq(invitations.id, invitationId),
    });

    if (!invitation) {
      return NextResponse.json({ code: "01", message: "Invitation not found" }, { status: 404 });
    }

    // Check if the current user has permission to cancel invitations (SUPERADMIN, owner, or admin)
    let hasPermission = false;

    if (session.user.role === "superadmin") {
      hasPermission = true;
    } else {
      const currentUserMembership = await db.query.members.findFirst({
        where: eq(members.userId, session.user.id),
      });

      if (currentUserMembership && currentUserMembership.organizationId === invitation.organizationId) {
        hasPermission = currentUserMembership.role === "owner" || currentUserMembership.role === "admin";
      }
    }

    if (!hasPermission) {
      return NextResponse.json({ code: "03", message: "Access denied" }, { status: 403 });
    }

    // Only pending invitations can be cancelled
    if (invitation.status !== "pending") {
      return NextResponse.json({ code: "01", message: "Only pending invitations can be cancelled" }, { status: 400 });
    }

    // Update invitation status to cancelled
    await db.update(invitations).set({ status: "cancelled" }).where(eq(invitations.id, invitationId));

    return NextResponse.json({
      code: "00",
      message: "Invitation cancelled successfully",
    });
  } catch (error) {
    console.error("Error cancelling invitation:", error);
    return NextResponse.json({ code: "99", message: "Internal server error" }, { status: 500 });
  }
}
