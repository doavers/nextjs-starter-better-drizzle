import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";

export async function GET(request: NextRequest, { params }: { params: Promise<{ invitationId: string }> }) {
  const { invitationId } = await params;

  try {
    const data = await auth.api.acceptInvitation({
      body: {
        invitationId,
      },
      headers: await headers(),
    });

    console.log("Invitation accepted successfully:", data);
    // Redirect to invitation status page with success status
    const redirectUrl = new URL(`/invitation/${invitationId}?status=accepted`, request.url);

    // Add additional info as query params if available
    // Note: The actual structure of data depends on what auth.api.acceptInvitation returns
    // For now, we'll add the invitation email if available in the invitation object
    if (data?.invitation?.email) {
      redirectUrl.searchParams.set("email", data.invitation.email);
    }

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("Error accepting invitation:", error);
    // Redirect to invitation status page with error status
    const redirectUrl = new URL(`/invitation/${invitationId}?status=error`, request.url);
    redirectUrl.searchParams.set("message", "Failed to accept invitation");
    return NextResponse.redirect(redirectUrl);
  }
}
