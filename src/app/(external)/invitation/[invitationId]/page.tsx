import { CheckCircle, XCircle, Clock } from "lucide-react";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface InvitationStatus {
  status: "accepted" | "expired" | "invalid" | "already_member" | "error";
  organizationName?: string;
  email?: string;
  message?: string;
}

async function getInvitationStatus(invitationId: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/v1/invitations/${invitationId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        status: "invalid" as const,
        message: "Invitation not found",
      };
    }

    const result = await response.json();

    if (result.code !== "00") {
      return {
        status: "invalid" as const,
        message: result.message || "Failed to fetch invitation status",
      };
    }

    const invitationData = result.data;

    // Map API status to UI status
    const statusMap: Record<string, InvitationStatus["status"]> = {
      pending: "accepted", // If pending, user can accept it
      accepted: "already_member",
      expired: "expired",
      cancelled: "invalid",
    };

    return {
      status: statusMap[invitationData.status] || "invalid",
      organizationName: invitationData.organization?.name,
      email: invitationData.email,
      message: undefined,
    };
  } catch (error) {
    console.error("Error fetching invitation status:", error);
    return {
      status: "error" as const,
      message: "Failed to fetch invitation status",
    };
  }
}

export default async function InvitationStatusPage({
  params,
  searchParams,
}: {
  params: Promise<{ invitationId: string }>;
  searchParams: Promise<{
    status?: string;
    email?: string;
    organization?: string;
    message?: string;
  }>;
}) {
  const { invitationId } = await params;
  const { status: queryStatus, email, organization, message } = await searchParams;

  // If status is provided in query params, use it (for immediate feedback after accept/reject)
  // Otherwise, fetch the current invitation status from API
  let invitationStatus: InvitationStatus;

  if (queryStatus) {
    invitationStatus = {
      status: queryStatus as InvitationStatus["status"],
      organizationName: organization || "Your Organization",
      email: email || "your.email@example.com",
      message: message,
    };
  } else {
    // Fetch current invitation status from API
    invitationStatus = await getInvitationStatus(invitationId);
  }

  const getStatusContent = () => {
    switch (invitationStatus.status) {
      case "accepted":
        return {
          icon: <CheckCircle className="h-16 w-16 text-green-500" />,
          title: "Invitation Accepted!",
          description: `You have successfully joined ${invitationStatus.organizationName}`,
          subDescription: "You can now access the organization dashboard and collaborate with your team.",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
        };
      case "expired":
        return {
          icon: <Clock className="h-16 w-16 text-yellow-500" />,
          title: "Invitation Expired",
          description: "This invitation has expired",
          subDescription: "Please contact your organization administrator to request a new invitation.",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
        };
      case "invalid":
        return {
          icon: <XCircle className="h-16 w-16 text-red-500" />,
          title: "Invalid Invitation",
          description: "This invitation is not valid or has been cancelled",
          subDescription: "Please contact your organization administrator for assistance.",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
        };
      case "already_member":
        return {
          icon: <CheckCircle className="h-16 w-16 text-blue-500" />,
          title: "Already a Member",
          description: `You are already a member of ${invitationStatus.organizationName}`,
          subDescription: "You can access the organization dashboard with your existing account.",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
        };
      case "error":
        return {
          icon: <XCircle className="h-16 w-16 text-red-500" />,
          title: "Error",
          description: invitationStatus.message || "An error occurred while processing your invitation",
          subDescription: "Please try again or contact your organization administrator for assistance.",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
        };
      default:
        return {
          icon: <XCircle className="h-16 w-16 text-red-500" />,
          title: "Unknown Status",
          description: "Unable to determine invitation status",
          subDescription: "Please contact your organization administrator for assistance.",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
        };
    }
  };

  const content = getStatusContent();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <Card className={`${content.bgColor} ${content.borderColor} border-2`}>
          <CardHeader className="pb-4 text-center">
            <div className="mb-4 flex justify-center">{content.icon}</div>
            <CardTitle className="text-2xl font-bold text-gray-900">{content.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-lg font-medium text-gray-800">{content.description}</p>
            <p className="text-sm text-gray-600">{content.subDescription}</p>

            {invitationStatus.email && (
              <div className="mt-6 rounded-lg border border-gray-200 bg-white p-3">
                <p className="text-xs text-gray-500">Invitation sent to:</p>
                <p className="text-sm font-medium text-gray-800">{invitationStatus.email}</p>
              </div>
            )}

            <div className="mt-6 space-y-3">
              <Link
                href="/dashboard"
                className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
              >
                Go to Dashboard
              </Link>
              <Link
                href="/"
                className="inline-flex w-full items-center justify-center rounded-lg bg-gray-200 px-4 py-2 font-medium text-gray-800 transition-colors hover:bg-gray-300"
              >
                Back to Home
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            If you have any questions, please contact your organization administrator.
          </p>
        </div>
      </div>
    </div>
  );
}
