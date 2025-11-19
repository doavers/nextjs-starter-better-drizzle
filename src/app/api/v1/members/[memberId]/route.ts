import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/db/drizzle";
import { members } from "@/db/schema";
import { auth } from "@/lib/auth";

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ memberId: string }> }) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user.id) {
      return NextResponse.json({ code: "02", message: "Not authenticated" }, { status: 401 });
    }

    const { memberId } = await params;

    // Get the member to be removed
    const memberToRemove = await db.query.members.findFirst({
      where: eq(members.id, memberId),
    });

    if (!memberToRemove) {
      return NextResponse.json({ code: "01", message: "Member not found" }, { status: 404 });
    }

    // Check if the current user has permission to remove members (SUPERADMIN, owner, or admin)
    let hasPermission = false;

    if (session.user.role === "superadmin") {
      hasPermission = true;
    } else {
      const currentUserMembership = await db.query.members.findFirst({
        where: eq(members.userId, session.user.id),
      });

      if (currentUserMembership) {
        hasPermission = currentUserMembership.role === "owner" || currentUserMembership.role === "admin";
      }
    }

    if (!hasPermission) {
      return NextResponse.json({ code: "03", message: "Access denied" }, { status: 403 });
    }

    // Cannot remove the owner
    if (memberToRemove.role === "owner") {
      return NextResponse.json({ code: "01", message: "Cannot remove organization owner" }, { status: 400 });
    }

    // Delete the member
    await db.delete(members).where(eq(members.id, memberId));

    return NextResponse.json({
      code: "00",
      message: "Member removed successfully",
    });
  } catch (error) {
    console.error("Error removing member:", error);
    return NextResponse.json({ code: "99", message: "Internal server error" }, { status: 500 });
  }
}
