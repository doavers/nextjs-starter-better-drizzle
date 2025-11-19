"use server";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { API_CONFIG } from "@/config/api-config";
import { auth } from "@/lib/auth";
import { APIPagingResponse, APIResponse } from "@/types/api/api-response";

export const getOrganizationsAction = async ({
  traceId,
  page = 1,
  limit = 10,
  sort,
  search,
}: {
  traceId: string;
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
}) => {
  const startTime = Date.now();
  let responseTime = Date.now() - startTime;
  let apiRes: APIPagingResponse | APIResponse = {
    traceId,
    code: "99",
    message: API_CONFIG.responseMaping.find((item) => item.code === "99")?.message ?? "Unknown error occurred",
    data: [],
    responseAt: Date.now().toLocaleString(),
    timeConsume: responseTime,
  } as APIResponse;

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user.id) {
      apiRes = {
        traceId,
        code: "02",
        message: "Not authenticated",
        data: [],
      } as APIResponse;

      return apiRes;
    }

    // Check if user is SUPERADMIN or ADMIN
    if (session.user.role !== "superadmin" && session.user.role !== "admin") {
      apiRes = {
        traceId,
        code: "03",
        message: "Access denied. Only SUPERADMIN and ADMIN can view all organizations.",
        data: [],
      } as APIResponse;

      return apiRes;
    }

    if (session) {
      // Use session-based authentication instead of Bearer tokens
      const cookies = await headers();
      const cookieHeader = cookies.get("cookie")?.toString() || "";

      // Construct query parameters
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (sort) params.append("sort", sort);
      if (search) params.append("search", search);

      const epUrl = `${API_CONFIG.backendURL}/v1/organizations?${params.toString()}`;

      const options: RequestInit = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieHeader,
        },
        credentials: "include",
      };

      const response = await fetch(epUrl, options);
      responseTime = Date.now() - startTime;

      // Check if response is OK and is JSON
      if (!response.ok) {
        console.error(`API request failed with status: ${response.status}`);
        apiRes = {
          traceId,
          code: "02",
          message: `API request failed: ${response.statusText} (${response.status})`,
          data: [],
          responseAt: Date.now().toLocaleString(),
          timeConsume: responseTime,
        } as APIResponse;

        return apiRes;
      }

      // Check content type to ensure it's JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error(`Unexpected content type: ${contentType}`);
        apiRes = {
          traceId,
          code: "02",
          message: "API returned non-JSON response. Endpoint may not exist.",
          data: [],
          responseAt: Date.now().toLocaleString(),
          timeConsume: responseTime,
        } as APIResponse;

        return apiRes;
      }

      const result = await response.json();

      if (result?.code !== "00") {
        apiRes = {
          traceId,
          code: result.code || "02",
          message: result.message || "Failed to fetch organizations",
          data: [],
          responseAt: Date.now().toLocaleString(),
          timeConsume: responseTime,
        } as APIResponse;

        return apiRes;
      }

      responseTime = Date.now() - startTime;
      apiRes = {
        traceId,
        code: "00",
        message: "Success",
        data: result.data || [],
        paging: result.paging || {
          size: limit,
          total_page: 1,
          current_page: page,
          total: 0,
        },
        responseAt: Date.now().toLocaleString(),
        timeConsume: responseTime,
      } as APIPagingResponse;

      return apiRes;
    }

    apiRes = {
      traceId,
      code: "02",
      message: "Not authenticated",
      data: [],
    } as APIResponse;

    return apiRes;
  } catch (error) {
    console.error("Error fetching organizations:", error);
    responseTime = Date.now() - startTime;
    return {
      ...apiRes,
      responseAt: Date.now().toLocaleString(),
      timeConsume: responseTime,
    } as APIResponse;
  }
};

export const getOrganizationByIdAction = async (traceId: string, id: string) => {
  let currentTime = new Date().toISOString();
  let apiRes: APIResponse = {
    traceId,
    code: "99",
    message: API_CONFIG.responseMaping.find((item) => item.code === "99")?.message ?? "Unknown error occurred",
    data: null,
  };

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user.id) {
      return {
        ...apiRes,
        code: "02",
        message: "Not authenticated",
      } as APIResponse;
    }

    // Check if user is SUPERADMIN or ADMIN
    if (["superadmin", "admin", "user"].indexOf(session.user.role ?? "") < 0) {
      return {
        ...apiRes,
        code: "03",
        message: "Access denied. Only SUPERADMIN and ADMIN can view organization details.",
      } as APIResponse;
    }

    // Use session-based authentication instead of Bearer tokens
    const cookies = await headers();
    const cookieHeader = cookies.get("cookie")?.toString() || "";

    const epUrl = `${API_CONFIG.backendURL}/v1/organizations/${id}`;

    const options: RequestInit = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      credentials: "include",
    };

    const response = await fetch(epUrl, options);

    // Check if response is OK and is JSON
    if (!response.ok) {
      console.error(`API request failed with status: ${response.status}`);
      return {
        ...apiRes,
        code: "02",
        message: `API request failed: ${response.statusText} (${response.status})`,
      } as APIResponse;
    }

    // Check content type to ensure it's JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error(`Unexpected content type: ${contentType}`);
      return {
        ...apiRes,
        code: "02",
        message: "API returned non-JSON response. Endpoint may not exist.",
      } as APIResponse;
    }

    const result = await response.json();

    if (result?.code !== "00") {
      return {
        ...apiRes,
        code: result.code || "01",
        message: result.message || "Organization not found",
      } as APIResponse;
    }

    currentTime = new Date().toISOString();
    apiRes = {
      traceId,
      code: "00",
      message: "Success",
      data: result.data,
      responseAt: currentTime,
    } as APIResponse;

    return apiRes;
  } catch (error) {
    console.error("Error fetching organization:", error);
    return {
      ...apiRes,
      code: "99",
      message: "Failed to fetch organization",
    } as APIResponse;
  }
};

export const createOrganizationAction = async (traceId: string, payload: any) => {
  const startTime = Date.now();
  let responseTime = Date.now() - startTime;
  let apiRes: APIResponse = {
    traceId,
    code: "99",
    message: API_CONFIG.responseMaping.find((item) => item.code === "99")?.message ?? "Unknown error occurred",
    data: null,
  };

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user.id) {
      return {
        ...apiRes,
        code: "02",
        message: "Not authenticated",
      } as APIResponse;
    }

    // Check if user is SUPERADMIN or ADMIN
    if (session.user.role !== "superadmin" && session.user.role !== "admin") {
      return {
        ...apiRes,
        code: "03",
        message: "Access denied. Only SUPERADMIN and ADMIN can create organizations.",
      } as APIResponse;
    }

    // Use session-based authentication instead of Bearer tokens
    const cookies = await headers();
    const cookieHeader = cookies.get("cookie")?.toString() || "";

    const epUrl = `${API_CONFIG.backendURL}/v1/organizations`;

    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      credentials: "include",
      body: JSON.stringify(payload),
    };

    const response = await fetch(epUrl, options);
    responseTime = Date.now() - startTime;

    // Check if response is OK and is JSON
    if (!response.ok) {
      console.error(`API request failed with status: ${response.status}`);
      return {
        ...apiRes,
        code: "02",
        message: `API request failed: ${response.statusText} (${response.status})`,
      } as APIResponse;
    }

    // Check content type to ensure it's JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error(`Unexpected content type: ${contentType}`);
      return {
        ...apiRes,
        code: "02",
        message: "API returned non-JSON response. Endpoint may not exist.",
      } as APIResponse;
    }

    const result = await response.json();

    if (result?.code !== "00") {
      return {
        ...apiRes,
        code: result.code || "99",
        message: result.message || "Failed to create organization",
      } as APIResponse;
    }

    revalidatePath("/dashboard/organization");

    responseTime = Date.now() - startTime;
    apiRes = {
      traceId,
      code: "00",
      message: "Organization created successfully",
      data: result.data,
      responseAt: Date.now().toLocaleString(),
      timeConsume: responseTime,
    } as APIResponse;

    return apiRes;
  } catch (error) {
    console.error("Error creating organization:", error);
    responseTime = Date.now() - startTime;
    return {
      ...apiRes,
      code: "99",
      message: "Failed to create organization",
      responseAt: Date.now().toLocaleString(),
      timeConsume: responseTime,
    } as APIResponse;
  }
};

export const updateOrganizationAction = async (traceId: string, id: string, payload: any) => {
  const startTime = Date.now();
  let responseTime = Date.now() - startTime;
  let apiRes: APIResponse = {
    traceId,
    code: "99",
    message: API_CONFIG.responseMaping.find((item) => item.code === "99")?.message ?? "Unknown error occurred",
    data: null,
  };

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user.id) {
      return {
        ...apiRes,
        code: "02",
        message: "Not authenticated",
      } as APIResponse;
    }

    // Check if user is SUPERADMIN or ADMIN
    if (session.user.role !== "superadmin" && session.user.role !== "admin") {
      return {
        ...apiRes,
        code: "03",
        message: "Access denied. Only SUPERADMIN and ADMIN can update organizations.",
      } as APIResponse;
    }

    // Use session-based authentication instead of Bearer tokens
    const cookies = await headers();
    const cookieHeader = cookies.get("cookie")?.toString() || "";

    const epUrl = `${API_CONFIG.backendURL}/v1/organizations/${id}`;

    const options: RequestInit = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      credentials: "include",
      body: JSON.stringify(payload),
    };

    const response = await fetch(epUrl, options);
    responseTime = Date.now() - startTime;

    // Check if response is OK and is JSON
    if (!response.ok) {
      console.error(`API request failed with status: ${response.status}`);
      return {
        ...apiRes,
        code: "02",
        message: `API request failed: ${response.statusText} (${response.status})`,
      } as APIResponse;
    }

    // Check content type to ensure it's JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error(`Unexpected content type: ${contentType}`);
      return {
        ...apiRes,
        code: "02",
        message: "API returned non-JSON response. Endpoint may not exist.",
      } as APIResponse;
    }

    const result = await response.json();

    if (result?.code !== "00") {
      return {
        ...apiRes,
        code: result.code || "01",
        message: result.message || "Organization not found",
      } as APIResponse;
    }

    revalidatePath("/dashboard/organization");

    responseTime = Date.now() - startTime;
    apiRes = {
      traceId,
      code: "00",
      message: "Organization updated successfully",
      data: result.data,
      responseAt: Date.now().toLocaleString(),
      timeConsume: responseTime,
    } as APIResponse;

    return apiRes;
  } catch (error) {
    console.error("Error updating organization:", error);
    responseTime = Date.now() - startTime;
    return {
      ...apiRes,
      code: "99",
      message: "Failed to update organization",
      responseAt: Date.now().toLocaleString(),
      timeConsume: responseTime,
    } as APIResponse;
  }
};

export const getOrganizationMembersAction = async (traceId: string, organizationId: string) => {
  const startTime = Date.now();
  let responseTime = Date.now() - startTime;
  let apiRes: APIResponse = {
    traceId,
    code: "99",
    message: API_CONFIG.responseMaping.find((item) => item.code === "99")?.message ?? "Unknown error occurred",
    data: [],
  };

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user.id) {
      return {
        ...apiRes,
        code: "02",
        message: "Not authenticated",
        data: [],
      } as APIResponse;
    }

    // Use session-based authentication
    const cookies = await headers();
    const cookieHeader = cookies.get("cookie")?.toString() || "";

    const epUrl = `${API_CONFIG.backendURL}/v1/organizations/${organizationId}/members`;

    const options: RequestInit = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      credentials: "include",
    };

    const response = await fetch(epUrl, options);
    responseTime = Date.now() - startTime;

    if (!response.ok) {
      console.error(`API request failed with status: ${response.status}`);
      return {
        ...apiRes,
        code: "02",
        message: `API request failed: ${response.statusText} (${response.status})`,
        data: [],
      } as APIResponse;
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error(`Unexpected content type: ${contentType}`);
      return {
        ...apiRes,
        code: "02",
        message: "API returned non-JSON response. Endpoint may not exist.",
        data: [],
      } as APIResponse;
    }

    const result = await response.json();

    responseTime = Date.now() - startTime;
    apiRes = {
      traceId,
      code: "00",
      message: "Success",
      data: result.data || [],
      responseAt: Date.now().toLocaleString(),
      timeConsume: responseTime,
    } as APIResponse;

    return apiRes;
  } catch (error) {
    console.error("Error fetching organization members:", error);
    responseTime = Date.now() - startTime;
    return {
      ...apiRes,
      responseAt: Date.now().toLocaleString(),
      timeConsume: responseTime,
    } as APIResponse;
  }
};

export const getOrganizationInvitationsAction = async (traceId: string, organizationId: string) => {
  const startTime = Date.now();
  let responseTime = Date.now() - startTime;
  let apiRes: APIResponse = {
    traceId,
    code: "99",
    message: API_CONFIG.responseMaping.find((item) => item.code === "99")?.message ?? "Unknown error occurred",
    data: [],
  };

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user.id) {
      return {
        ...apiRes,
        code: "02",
        message: "Not authenticated",
        data: [],
      } as APIResponse;
    }

    // Use session-based authentication
    const cookies = await headers();
    const cookieHeader = cookies.get("cookie")?.toString() || "";

    const epUrl = `${API_CONFIG.backendURL}/v1/organizations/${organizationId}/invitations`;

    const options: RequestInit = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      credentials: "include",
    };

    const response = await fetch(epUrl, options);
    responseTime = Date.now() - startTime;

    if (!response.ok) {
      console.error(`API request failed with status: ${response.status}`);
      return {
        ...apiRes,
        code: "02",
        message: `API request failed: ${response.statusText} (${response.status})`,
        data: [],
      } as APIResponse;
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error(`Unexpected content type: ${contentType}`);
      return {
        ...apiRes,
        code: "02",
        message: "API returned non-JSON response. Endpoint may not exist.",
        data: [],
      } as APIResponse;
    }

    const result = await response.json();

    responseTime = Date.now() - startTime;
    apiRes = {
      traceId,
      code: "00",
      message: "Success",
      data: result.data || [],
      responseAt: Date.now().toLocaleString(),
      timeConsume: responseTime,
    } as APIResponse;

    return apiRes;
  } catch (error) {
    console.error("Error fetching organization invitations:", error);
    responseTime = Date.now() - startTime;
    return {
      ...apiRes,
      responseAt: Date.now().toLocaleString(),
      timeConsume: responseTime,
    } as APIResponse;
  }
};

export const inviteMemberAction = async (
  traceId: string,
  organizationId: string,
  payload: {
    email: string;
    role: string;
    message?: string;
  },
) => {
  const startTime = Date.now();
  let responseTime = Date.now() - startTime;
  let apiRes: APIResponse = {
    traceId,
    code: "99",
    message: API_CONFIG.responseMaping.find((item) => item.code === "99")?.message ?? "Unknown error occurred",
    data: null,
  };

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user.id) {
      return {
        ...apiRes,
        code: "02",
        message: "Not authenticated",
      } as APIResponse;
    }

    // Use session-based authentication
    const cookies = await headers();
    const cookieHeader = cookies.get("cookie")?.toString() || "";

    const epUrl = `${API_CONFIG.backendURL}/v1/organizations/${organizationId}/invite`;

    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      credentials: "include",
      body: JSON.stringify(payload),
    };

    const response = await fetch(epUrl, options);
    responseTime = Date.now() - startTime;

    if (!response.ok) {
      console.error(`API request failed with status: ${response.status}`);
      return {
        ...apiRes,
        code: "02",
        message: `API request invite member failed: ${response.statusText} (${response.status})`,
      } as APIResponse;
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error(`Unexpected content type: ${contentType}`);
      return {
        ...apiRes,
        code: "02",
        message: "API returned non-JSON response. Endpoint may not exist.",
      } as APIResponse;
    }

    const result = await response.json();

    if (result?.code !== "00") {
      return {
        ...apiRes,
        code: result.code || "99",
        message: result.message || "Failed to send invitation",
      } as APIResponse;
    }

    responseTime = Date.now() - startTime;
    apiRes = {
      traceId,
      code: "00",
      message: "Invitation sent successfully",
      data: result.data,
      responseAt: Date.now().toLocaleString(),
      timeConsume: responseTime,
    } as APIResponse;

    return apiRes;
  } catch (error) {
    console.error("Error inviting member:", error);
    responseTime = Date.now() - startTime;
    return {
      ...apiRes,
      code: "99",
      message: "Failed to send invitation",
      responseAt: Date.now().toLocaleString(),
      timeConsume: responseTime,
    } as APIResponse;
  }
};

export const removeMemberAction = async (traceId: string, memberId: string) => {
  const startTime = Date.now();
  let responseTime = Date.now() - startTime;
  let apiRes: APIResponse = {
    traceId,
    code: "99",
    message: API_CONFIG.responseMaping.find((item) => item.code === "99")?.message ?? "Unknown error occurred",
    data: null,
  };

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user.id) {
      return {
        ...apiRes,
        code: "02",
        message: "Not authenticated",
      } as APIResponse;
    }

    // Use session-based authentication
    const cookies = await headers();
    const cookieHeader = cookies.get("cookie")?.toString() || "";

    const epUrl = `${API_CONFIG.backendURL}/v1/members/${memberId}`;

    const options: RequestInit = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      credentials: "include",
    };

    const response = await fetch(epUrl, options);
    responseTime = Date.now() - startTime;

    if (!response.ok) {
      console.error(`API request failed with status: ${response.status}`);
      return {
        ...apiRes,
        code: "02",
        message: `API request failed: ${response.statusText} (${response.status})`,
      } as APIResponse;
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error(`Unexpected content type: ${contentType}`);
      return {
        ...apiRes,
        code: "02",
        message: "API returned non-JSON response. Endpoint may not exist.",
      } as APIResponse;
    }

    const result = await response.json();

    if (result?.code !== "00") {
      return {
        ...apiRes,
        code: result.code || "01",
        message: result.message || "Failed to remove member",
      } as APIResponse;
    }

    responseTime = Date.now() - startTime;
    apiRes = {
      traceId,
      code: "00",
      message: "Member removed successfully",
      data: null,
      responseAt: Date.now().toLocaleString(),
      timeConsume: responseTime,
    } as APIResponse;

    return apiRes;
  } catch (error) {
    console.error("Error removing member:", error);
    responseTime = Date.now() - startTime;
    return {
      ...apiRes,
      code: "99",
      message: "Failed to remove member",
      responseAt: Date.now().toLocaleString(),
      timeConsume: responseTime,
    } as APIResponse;
  }
};

export const cancelInvitationAction = async (traceId: string, invitationId: string) => {
  const startTime = Date.now();
  let responseTime = Date.now() - startTime;
  let apiRes: APIResponse = {
    traceId,
    code: "99",
    message: API_CONFIG.responseMaping.find((item) => item.code === "99")?.message ?? "Unknown error occurred",
    data: null,
  };

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user.id) {
      return {
        ...apiRes,
        code: "02",
        message: "Not authenticated",
      } as APIResponse;
    }

    // Use session-based authentication
    const cookies = await headers();
    const cookieHeader = cookies.get("cookie")?.toString() || "";

    const epUrl = `${API_CONFIG.backendURL}/v1/invitations/${invitationId}`;

    const options: RequestInit = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      credentials: "include",
    };

    const response = await fetch(epUrl, options);
    responseTime = Date.now() - startTime;

    if (!response.ok) {
      console.error(`API request failed with status: ${response.status}`);
      return {
        ...apiRes,
        code: "02",
        message: `API request failed: ${response.statusText} (${response.status})`,
      } as APIResponse;
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error(`Unexpected content type: ${contentType}`);
      return {
        ...apiRes,
        code: "02",
        message: "API returned non-JSON response. Endpoint may not exist.",
      } as APIResponse;
    }

    const result = await response.json();

    if (result?.code !== "00") {
      return {
        ...apiRes,
        code: result.code || "01",
        message: result.message || "Failed to cancel invitation",
      } as APIResponse;
    }

    responseTime = Date.now() - startTime;
    apiRes = {
      traceId,
      code: "00",
      message: "Invitation cancelled successfully",
      data: null,
      responseAt: Date.now().toLocaleString(),
      timeConsume: responseTime,
    } as APIResponse;

    return apiRes;
  } catch (error) {
    console.error("Error cancelling invitation:", error);
    responseTime = Date.now() - startTime;
    return {
      ...apiRes,
      code: "99",
      message: "Failed to cancel invitation",
      responseAt: Date.now().toLocaleString(),
      timeConsume: responseTime,
    } as APIResponse;
  }
};

export const deleteOrganizationAction = async (traceId: string, id: string) => {
  const startTime = Date.now();
  let responseTime = Date.now() - startTime;
  let apiRes: APIResponse = {
    traceId,
    code: "99",
    message: API_CONFIG.responseMaping.find((item) => item.code === "99")?.message ?? "Unknown error occurred",
    data: null,
  };

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user.id) {
      return {
        ...apiRes,
        code: "02",
        message: "Not authenticated",
      } as APIResponse;
    }

    // Check if user is SUPERADMIN or ADMIN
    if (session.user.role !== "superadmin" && session.user.role !== "admin") {
      return {
        ...apiRes,
        code: "03",
        message: "Access denied. Only SUPERADMIN and ADMIN can delete organizations.",
      } as APIResponse;
    }

    // Use session-based authentication instead of Bearer tokens
    const cookies = await headers();
    const cookieHeader = cookies.get("cookie")?.toString() || "";

    const epUrl = `${API_CONFIG.backendURL}/v1/organizations/${id}`;

    const options: RequestInit = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      credentials: "include",
    };

    const response = await fetch(epUrl, options);
    responseTime = Date.now() - startTime;

    // Check if response is OK and is JSON
    if (!response.ok) {
      console.error(`API request failed with status: ${response.status}`);
      return {
        ...apiRes,
        code: "02",
        message: `API request failed: ${response.statusText} (${response.status})`,
      } as APIResponse;
    }

    // Check content type to ensure it's JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error(`Unexpected content type: ${contentType}`);
      return {
        ...apiRes,
        code: "02",
        message: "API returned non-JSON response. Endpoint may not exist.",
      } as APIResponse;
    }

    const result = await response.json();

    if (result?.code !== "00") {
      return {
        ...apiRes,
        code: result.code || "01",
        message: result.message || "Organization not found",
      } as APIResponse;
    }

    revalidatePath("/dashboard/organization");

    responseTime = Date.now() - startTime;
    apiRes = {
      traceId,
      code: "00",
      message: "Organization deleted successfully",
      data: null,
      responseAt: Date.now().toLocaleString(),
      timeConsume: responseTime,
    } as APIResponse;

    return apiRes;
  } catch (error) {
    console.error("Error deleting organization:", error);
    responseTime = Date.now() - startTime;
    return {
      ...apiRes,
      code: "99",
      message: "Failed to delete organization",
      responseAt: Date.now().toLocaleString(),
      timeConsume: responseTime,
    } as APIResponse;
  }
};

// New action for regular users to get their organizations
export const getUserOrganizationsAction = async ({
  traceId,
  page = 1,
  limit = 10,
  sort,
  search,
}: {
  traceId: string;
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
}) => {
  const startTime = Date.now();
  let responseTime = Date.now() - startTime;
  let apiRes: APIPagingResponse | APIResponse = {
    traceId,
    code: "99",
    message: API_CONFIG.responseMaping.find((item) => item.code === "99")?.message ?? "Unknown error occurred",
    data: [],
    responseAt: Date.now().toLocaleString(),
    timeConsume: responseTime,
  } as APIResponse;

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user.id) {
      apiRes = {
        traceId,
        code: "02",
        message: "Not authenticated",
        data: [],
      } as APIResponse;

      return apiRes;
    }

    // Use session-based authentication
    const cookies = await headers();
    const cookieHeader = cookies.get("cookie")?.toString() || "";

    // Construct query parameters
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (sort) params.append("sort", sort);
    if (search) params.append("search", search);

    const epUrl = `${API_CONFIG.backendURL}/v1/users/organizations?${params.toString()}`;

    const options: RequestInit = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      credentials: "include",
    };

    const response = await fetch(epUrl, options);
    responseTime = Date.now() - startTime;

    // Check if response is OK and is JSON
    if (!response.ok) {
      console.error(`API request failed with status: ${response.status}`);
      apiRes = {
        traceId,
        code: "02",
        message: `API request failed: ${response.statusText} (${response.status})`,
        data: [],
        responseAt: Date.now().toLocaleString(),
        timeConsume: responseTime,
      } as APIResponse;

      return apiRes;
    }

    // Check content type to ensure it's JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error(`Unexpected content type: ${contentType}`);
      apiRes = {
        traceId,
        code: "02",
        message: "API returned non-JSON response. Endpoint may not exist.",
        data: [],
        responseAt: Date.now().toLocaleString(),
        timeConsume: responseTime,
      } as APIResponse;

      return apiRes;
    }

    const result = await response.json();

    if (result?.code !== "00") {
      apiRes = {
        traceId,
        code: result.code || "02",
        message: result.message || "Failed to fetch organizations",
        data: [],
        responseAt: Date.now().toLocaleString(),
        timeConsume: responseTime,
      } as APIResponse;

      return apiRes;
    }

    // Transform the response to match expected format
    const organizations = result.data?.organizations || [];
    const total = organizations.length;

    responseTime = Date.now() - startTime;
    apiRes = {
      traceId,
      code: "00",
      message: "Success",
      data: organizations,
      paging: {
        size: limit,
        total_page: Math.ceil(total / limit),
        current_page: page,
        total: total,
      },
      responseAt: Date.now().toLocaleString(),
      timeConsume: responseTime,
    } as APIPagingResponse;

    return apiRes;
  } catch (error) {
    console.error("Error fetching user organizations:", error);
    responseTime = Date.now() - startTime;
    return {
      ...apiRes,
      responseAt: Date.now().toLocaleString(),
      timeConsume: responseTime,
    } as APIResponse;
  }
};

// New action for regular users to create their own organization (limited to 1)
export const createUserOrganizationAction = async (traceId: string, payload: any) => {
  const startTime = Date.now();
  let responseTime = Date.now() - startTime;
  let apiRes: APIResponse = {
    traceId,
    code: "99",
    message: API_CONFIG.responseMaping.find((item) => item.code === "99")?.message ?? "Unknown error occurred",
    data: null,
  };

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user.id) {
      return {
        ...apiRes,
        code: "02",
        message: "Not authenticated",
      } as APIResponse;
    }

    // Note: The API endpoint now handles the organization limit check
    // for regular users (1 organization max)

    // Use session-based authentication
    const cookies = await headers();
    const cookieHeader = cookies.get("cookie")?.toString() || "";

    const epUrl = `${API_CONFIG.backendURL}/v1/organizations`;

    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      credentials: "include",
      body: JSON.stringify(payload),
    };

    const response = await fetch(epUrl, options);
    responseTime = Date.now() - startTime;

    // Check if response is OK and is JSON
    if (!response.ok) {
      console.error(`API request failed with status: ${response.status}`);

      // Try to get the error message from the response body
      try {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorResult = await response.json();
          return {
            ...apiRes,
            code: errorResult.code || "02",
            message: errorResult.message || `API request failed: ${response.statusText} (${response.status})`,
          } as APIResponse;
        }
      } catch (parseError) {
        console.warn("Failed to parse error response body:", parseError);
      }

      return {
        ...apiRes,
        code: "02",
        message: `API request failed: ${response.statusText} (${response.status})`,
      } as APIResponse;
    }

    // Check content type to ensure it's JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error(`Unexpected content type: ${contentType}`);
      return {
        ...apiRes,
        code: "02",
        message: "API returned non-JSON response. Endpoint may not exist.",
      } as APIResponse;
    }

    const result = await response.json();

    if (result?.code !== "00") {
      return {
        ...apiRes,
        code: result.code || "99",
        message: result.message || "Failed to create organization",
      } as APIResponse;
    }

    // Note: The API endpoint now automatically adds the user as an owner member
    // for regular users when creating an organization

    revalidatePath("/dashboard/organization");

    responseTime = Date.now() - startTime;
    apiRes = {
      traceId,
      code: "00",
      message: "Organization created successfully",
      data: result.data,
      responseAt: Date.now().toLocaleString(),
      timeConsume: responseTime,
    } as APIResponse;

    return apiRes;
  } catch (error) {
    console.error("Error creating user organization:", error);
    responseTime = Date.now() - startTime;
    return {
      ...apiRes,
      code: "99",
      message: "Failed to create organization",
      responseAt: Date.now().toLocaleString(),
      timeConsume: responseTime,
    } as APIResponse;
  }
};
