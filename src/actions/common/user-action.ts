"use server";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { API_CONFIG } from "@/config/api-config";
import { auth } from "@/lib/auth";
import { APIPagingResponse, APIResponse } from "@/types/api/api-response";

export const getUsersAction = async ({
  traceId,
  page = 1,
  limit = 10,
  sort,
  roles,
  categories,
  search,
}: {
  traceId: string;
  page?: number;
  limit?: number;
  sort?: string;
  roles?: string;
  categories?: string;
  search?: string;
}) => {
  const startTime = Date.now();
  const rolesArray = roles ? roles.split(".") : [];
  const categoriesArray = categories ? categories.split(".") : [];

  let accessToken = "";
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
        message: API_CONFIG.responseMaping.find((item) => item.code === "02")?.message ?? "Success",
        data: [],
      } as APIResponse;

      return apiRes;
    }

    if (session) {
      const { token } = await auth.api.getToken({
        headers: await headers(),
      });

      accessToken = token;
    }

    // Construct query parameters
    const params = new URLSearchParams({ page: String(page), limit: String(limit), sort: String(sort) });

    // Append additional parameters if needed
    if (categories) {
      params.append("categories", categories);
    }
    if (search) {
      params.append("search", search);
    }

    const epUrl = `${API_CONFIG.backendURL}/v1/users?${params.toString()}`;
    console.log("accessToken", accessToken);
    if (accessToken.length === 0) {
      apiRes = {
        traceId,
        code: "02",
        message: API_CONFIG.responseMaping.find((item) => item.code === "02")?.message ?? "Success",
        data: [],
      } as APIResponse;

      return apiRes;
    }
    const options: RequestInit = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await fetch(epUrl, options);
    const result = await response.json();
    responseTime = Date.now() - startTime;

    if (result?.code !== "00") {
      apiRes = {
        traceId,
        code: "02",
        message: API_CONFIG.responseMaping.find((item) => item.code === "02")?.message ?? "Success",
        data: [],
        responseAt: Date.now().toLocaleString(),
        timeConsume: responseTime,
      } as APIResponse;

      return apiRes;
    }

    const data = result.data;
    let searchedData = [];
    let filteredData = [];

    if (search && search.length > 0) {
      searchedData = data.users.filter((item: any) => {
        return item.name.toLowerCase().includes(search.toLowerCase());
      });
    } else {
      searchedData = data.users;
    }

    if (rolesArray.length > 0) {
      rolesArray.forEach((filterValue) => {
        const filter = searchedData.filter((item: any) => {
          if (item.role === filterValue) return item;
        });
        filteredData.push(...filter);
      });
    } else if (categoriesArray.length > 0) {
      categoriesArray.forEach((filterValue) => {
        const filter = searchedData.filter((item: any) => {
          if (item.role === filterValue) return item;
        });
        filteredData.push(...filter);
      });
    } else {
      filteredData = searchedData;
    }

    const sortString = params.get("sort") !== "undefined" ? params.get("sort") : "[]";
    const sortArray = sortString ? JSON.parse(sortString) : [];
    let sortData = Array.isArray(filteredData)
      ? filteredData.sort((a: any, b: any) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        })
      : [];

    if (
      Array.isArray(sortArray) &&
      sortArray.length > 0 &&
      sortArray[0] !== null &&
      typeof sortArray[0] === "object" &&
      "id" in sortArray[0] &&
      "desc" in sortArray[0]
    ) {
      const { id, desc } = sortArray[0];

      if (id === "name") {
        sortData = sortData.sort((a: any, b: any) => {
          if (desc) {
            return b.name.localeCompare(a.name);
          } else {
            return a.name.localeCompare(b.name);
          }
        });
      } else if (id === "role") {
        sortData = sortData.sort((a: any, b: any) => {
          if (desc) {
            return b.role.localeCompare(a.role);
          } else {
            return a.role.localeCompare(b.role);
          }
        });
      } else if (id === "email") {
        sortData = sortData.sort((a: any, b: any) => {
          if (desc) {
            return b.email.localeCompare(a.email);
          } else {
            return a.email.localeCompare(b.email);
          }
        });
      } else {
        // Default to createdAt sorting if id is not name
        sortData = sortData.sort((a: any, b: any) => {
          return desc
            ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        });
      }
    }

    const offset = (page - 1) * limit;
    const paginatedData = sortData.slice(offset, offset + limit);
    responseTime = Date.now() - startTime;

    apiRes = {
      traceId,
      code: "00",
      message: API_CONFIG.responseMaping.find((item) => item.code === "00")?.message ?? "Success",
      data: paginatedData,
      paging: {
        size: limit,
        total_page: Math.ceil(filteredData.length / limit),
        current_page: page,
        total: filteredData.length,
      },
      responseAt: Date.now().toLocaleString(),
      timeConsume: responseTime,
    } as APIPagingResponse;

    return apiRes;
  } catch (error) {
    console.log("Error", error);
    responseTime = Date.now() - startTime;
    return {
      ...apiRes,
      responseAt: Date.now().toLocaleString(),
      timeConsume: responseTime,
    } as APIResponse;
  }
};

export const getUserByIdAction = async (traceId: string, id: string) => {
  const startTime = Date.now();
  let accessToken = "";
  let apiRes: APIResponse = {
    traceId,
    code: "99",
    message: API_CONFIG.responseMaping.find((item) => item.code === "99")?.message ?? "Unknown error occurred",
    data: null,
    responseAt: Date.now().toLocaleString(),
    timeConsume: Date.now() - startTime,
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
        data: null,
        responseAt: Date.now().toLocaleString(),
        timeConsume: Date.now() - startTime,
      } as APIResponse;

      return apiRes;
    }

    if (session) {
      const { token } = await auth.api.getToken({
        headers: await headers(),
      });

      accessToken = token;
    }

    if (accessToken.length === 0) {
      apiRes = {
        traceId,
        code: "02",
        message: API_CONFIG.responseMaping.find((item) => item.code === "02")?.message ?? "Success",
        data: [],
        responseAt: Date.now().toLocaleString(),
        timeConsume: Date.now() - startTime,
      } as APIResponse;

      return apiRes;
    }

    const epUrl = `${API_CONFIG.backendURL}/v1/users/${id}`;

    const options: RequestInit = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
    };

    const response = await fetch(epUrl, options);
    const result = await response.json();

    if (result?.code !== "00") {
      apiRes = {
        traceId,
        code: result?.code ?? "99",
        message: API_CONFIG.responseMaping.find((item) => item.code === (result?.code ?? "99"))?.message ?? "Error",
        data: result.data,
        responseAt: Date.now().toLocaleString(),
        timeConsume: Date.now() - startTime,
      } as APIResponse;

      return apiRes;
    }

    apiRes = {
      traceId,
      code: "00",
      message: API_CONFIG.responseMaping.find((item) => item.code === "00")?.message ?? "Success",
      data: result.data,
      responseAt: Date.now().toLocaleString(),
      timeConsume: Date.now() - startTime,
    } as APIResponse;

    return apiRes;
  } catch {
    return apiRes;
  }
};

export const getUserByEmailAction = async (traceId: string, email: string) => {
  const startTime = Date.now();
  let responseTime = Date.now() - startTime;
  let apiRes: APIResponse = {
    traceId,
    code: "99",
    message: API_CONFIG.responseMaping.find((item) => item.code === "99")?.message ?? "Unknown error occurred",
    data: null,
    responseAt: Date.now().toLocaleString(),
    timeConsume: responseTime,
  } as APIResponse;

  try {
    const epUrl = `${API_CONFIG.backendURL}/v1/users/email/${email}`;

    const options: RequestInit = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await fetch(epUrl, options);
    const result = await response.json();
    responseTime = Date.now() - startTime;

    if (result?.code !== "00") {
      apiRes = {
        traceId,
        code: "02",
        message: API_CONFIG.responseMaping.find((item) => item.code === "02")?.message ?? "Success",
        data: [],
        responseAt: Date.now().toLocaleString(),
        timeConsume: responseTime,
      } as APIResponse;

      return apiRes;
    }

    apiRes = {
      ...result,
      traceId,
    } as APIResponse;

    return apiRes;
  } catch {
    return apiRes;
  }
};

export const updateUserAction = async (traceId: string, id: string, payload: any) => {
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
        success: false,
        error: "Not authenticated",
      };
    }

    // Use session-based authentication instead of Bearer tokens
    const cookies = await headers();
    const cookieHeader = cookies.get("cookie")?.toString() || "";

    const epUrl = `${API_CONFIG.backendURL}/v1/users/${id}`;

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
    const result = await response.json();
    responseTime = Date.now() - startTime;

    if (result?.code !== "00") {
      apiRes = { ...result, time: responseTime };
      return apiRes;
    }

    const userData = result?.data;

    if (!userData) {
      return {
        code: "01",
        message: "User not found!",
      };
    }

    revalidatePath("/admin/users");

    return {
      code: "00",
      message: "User updated successfully",
      data: userData,
    };
  } catch {
    return {
      code: "99",
      message: "Failed to update user data",
    };
  }
};

export const createUserAction = async (traceId: string, payload: any) => {
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
        success: false,
        error: "Not authenticated",
      };
    }

    // Use session-based authentication instead of Bearer tokens
    const cookies = await headers();
    const cookieHeader = cookies.get("cookie")?.toString() || "";

    const epUrl = `${API_CONFIG.backendURL}/v1/users`;

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
    const result = await response.json();
    responseTime = Date.now() - startTime;

    if (result?.code !== "00") {
      apiRes = { ...result, time: responseTime };
      return apiRes;
    }

    const userData = result?.data;

    revalidatePath("/dashboard/user");

    return {
      code: "00",
      message: "User created successfully",
      data: userData,
    };
  } catch (error) {
    console.error("Error creating user:", error);
    return {
      code: "99",
      message: "Failed to create user",
    };
  }
};

export const deleteUserAction = async (traceId: string, id: string) => {
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
        success: false,
        error: "Not authenticated",
      };
    }

    // Use session-based authentication instead of Bearer tokens
    const cookies = await headers();
    const cookieHeader = cookies.get("cookie")?.toString() || "";

    const epUrl = `${API_CONFIG.backendURL}/v1/users/${id}`;

    const options: RequestInit = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      credentials: "include",
    };

    const response = await fetch(epUrl, options);
    const result = await response.json();
    responseTime = Date.now() - startTime;

    if (result?.code !== "00") {
      apiRes = { ...result, time: responseTime };
      return apiRes;
    }

    revalidatePath("/dashboard/user");

    return {
      code: "00",
      message: "User deleted successfully",
      data: null,
    };
  } catch (error) {
    console.error("Error deleting user:", error);
    return {
      code: "99",
      message: "Failed to delete user",
    };
  }
};
