"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { API_CONFIG } from "@/config/api-config";
import { APIResponse } from "@/types/api/api-response";

/**
 * Check if the current user has access to a specific organization
 * @param organizationId - The ID of the organization to check access for
 * @returns Promise<boolean> - True if user has access, false otherwise
 */
export async function checkOrganizationAccess(organizationId: string): Promise<boolean> {
  try {
    const cookies = await headers();
    const cookieHeader = cookies.get("cookie")?.toString() || "";

    const epUrl = `${API_CONFIG.backendURL}/v1/members/check-access`;

    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      credentials: "include",
      body: JSON.stringify({ organizationId }),
    };

    const response = await fetch(epUrl, options);

    if (!response.ok) {
      console.error(`API request failed with status: ${response.status}`);
      return false;
    }

    const result = (await response.json()) as APIResponse & {
      data?: {
        hasAccess: boolean;
        role: string | null;
        organizationId: string;
        userId: string;
      };
    };
    return result.code === "00" && !!result.data?.hasAccess;
  } catch (error) {
    console.error("Error checking organization access:", error);
    return false;
  }
}

/**
 * Require organization access, redirect if user doesn't have access
 * @param organizationId - The ID of the organization to require access for
 * @returns Promise<void> - Redirects to unauthorized page if no access
 */
export async function requireOrganizationAccess(organizationId: string): Promise<void> {
  const hasAccess = await checkOrganizationAccess(organizationId);

  if (!hasAccess) {
    redirect("/unauthorized");
  }
}

/**
 * Get user's role in a specific organization
 * @param organizationId - The ID of the organization
 * @returns Promise<string | null> - The user's role in the organization, or null if not a member
 */
export async function getUserOrganizationRole(organizationId: string): Promise<string | null> {
  try {
    const cookies = await headers();
    const cookieHeader = cookies.get("cookie")?.toString() || "";

    const epUrl = `${API_CONFIG.backendURL}/v1/members/check-access`;

    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      credentials: "include",
      body: JSON.stringify({ organizationId }),
    };

    const response = await fetch(epUrl, options);

    if (!response.ok) {
      console.error(`API request failed with status: ${response.status}`);
      return null;
    }

    const result = (await response.json()) as APIResponse & {
      data?: {
        hasAccess: boolean;
        role: string | null;
        organizationId: string;
        userId: string;
      };
    };
    return result.code === "00" && result.data?.role ? result.data.role : null;
  } catch (error) {
    console.error("Error getting user organization role:", error);
    return null;
  }
}
