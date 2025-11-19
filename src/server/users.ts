"use server";

import { count, eq, inArray, desc } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { AUTH_CONFIG } from "@/config/auth-config";
import { db } from "@/db/drizzle";
import { members, users } from "@/db/schema";
import { auth } from "@/lib/auth";
import UserType from "@/types/common/user-type";

export const getCurrentUser = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect(AUTH_CONFIG.loginPage);
  }

  const currentUser = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  });

  if (!currentUser) {
    redirect(AUTH_CONFIG.loginPage);
  }

  return {
    ...session,
    currentUser,
  };
};

export const userEmailSignIn = async (email: string, password: string) => {
  try {
    let bearerJwt = "";
    const data = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });

    if (data) {
      const { token } = await auth.api.getToken({
        headers: await headers(),
      });
      bearerJwt = token;
      console.log("JWT Token:", token);
    }

    return {
      success: true,
      message: "Signed in successfully.",
      data: { ...data, bearerJwt },
    };
  } catch (error) {
    const e = error as Error;

    return {
      success: false,
      message: e.message || "An unknown error occurred.",
    };
  }
};

export const signUp = async (email: string, password: string, username: string) => {
  try {
    const data = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name: username,
      },
    });

    return {
      success: true,
      message: "Signed up successfully.",
      data,
    };
  } catch (error) {
    const e = error as Error;

    return {
      success: false,
      message: e.message || "An unknown error occurred.",
    };
  }
};

export const getUsers = async (
  page: number = 1,
  size: number = 10,
  search?: string,
  role?: string,
  currentUser?: UserType,
) => {
  try {
    const offset = (page - 1) * size;
    let query;

    if (currentUser) {
      // Implement role-based access control
      if (currentUser.role === "superadmin") {
        // SUPERADMIN can see all users
        query = db.query.users.findMany({
          limit: size,
          offset,
          orderBy: desc(users.createdAt),
        });
      } else if (currentUser.role === "admin") {
        // ADMIN can see all users (for now, same as superadmin)
        // In a more complex system, you might limit admins to their org
        query = db.query.users.findMany({
          limit: size,
          offset,
          orderBy: desc(users.createdAt),
        });
      } else {
        // Regular USER can only see users in their organizations
        const userOrgMembers = await db.query.members.findMany({
          where: eq(members.userId, currentUser.id),
          columns: {
            organizationId: true,
          },
        });

        const organizationIds = userOrgMembers.map((member) => member.organizationId);

        if (organizationIds.length > 0) {
          const orgUsers = await db
            .selectDistinct({
              userId: members.userId,
            })
            .from(members)
            .where(inArray(members.organizationId, organizationIds));

          const userIds = orgUsers.map((member) => member.userId);

          query = db.query.users.findMany({
            where: inArray(users.id, userIds),
            limit: size,
            offset,
            orderBy: desc(users.createdAt),
          });
        } else {
          // User is not a member of any organization
          return {
            users: [],
            paging: {
              size,
              total_page: 0,
              current_page: page,
              total: 0,
            },
          };
        }
      }
    } else {
      // Fallback for backward compatibility - return all users
      query = db.query.users.findMany({
        limit: size,
        offset,
        orderBy: desc(users.createdAt),
      });
    }

    const usersData = await query;

    // Apply search filter if provided
    let filteredUsers = usersData;
    if (search) {
      filteredUsers = usersData.filter(
        (user) =>
          user.name.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase()),
      );
    }

    // Apply role filter if provided (only for SUPERADMIN/ADMIN)
    if (role && currentUser && (currentUser.role === "superadmin" || currentUser.role === "admin")) {
      filteredUsers = filteredUsers.filter((user) => user.role === role);
    }

    // Get total count based on the same filters
    let total;
    if (currentUser && currentUser.role === "user") {
      // For regular users, count users in their organizations
      const userOrgMembers = await db.query.members.findMany({
        where: eq(members.userId, currentUser.id),
        columns: {
          organizationId: true,
        },
      });

      const organizationIds = userOrgMembers.map((member) => member.organizationId);

      if (organizationIds.length > 0) {
        const orgUsers = await db
          .selectDistinct({
            userId: members.userId,
          })
          .from(members)
          .where(inArray(members.organizationId, organizationIds));

        const userIds = orgUsers.map((member) => member.userId);
        const totalRes = await db.select({ count: count() }).from(users).where(inArray(users.id, userIds));
        total = totalRes[0]?.count ?? 0;
      } else {
        total = 0;
      }
    } else {
      // For SUPERADMIN/ADMIN or no user context, count all users
      const totalRes = await db.select({ count: count() }).from(users);
      total = totalRes[0]?.count ?? 0;
    }

    return {
      users: filteredUsers,
      paging: {
        size,
        total_page: Math.ceil(total / size),
        current_page: page,
        total,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      users: [],
      paging: {
        size,
        total_page: 0,
        current_page: page,
        total: 0,
      },
    };
  }
};

export const getUsersInOrganization = async (organizationId: string) => {
  try {
    const membersData = await db.query.members.findMany({
      where: eq(members.organizationId, organizationId),
      with: {
        users: true,
      },
    });
    return membersData.map((member) => member.users);
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    return existingUser ?? null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.id, id),
    });

    return existingUser ?? null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const updateUserRoleByEmail = async (email: string, role: string) => {
  try {
    const updatedUser = await db.update(users).set({ role }).where(eq(users.email, email)).returning();

    return updatedUser[0] ?? null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const updateUserById = async (id: string, data: Partial<typeof users.$inferInsert>) => {
  try {
    const updatedUser = await db.update(users).set(data).where(eq(users.id, id)).returning();
    return updatedUser[0] ?? null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const deleteUserById = async (id: string) => {
  try {
    const deletedUser = await db.delete(users).where(eq(users.id, id)).returning();
    return deletedUser[0] ?? null;
  } catch (error) {
    console.error(error);
    return null;
  }
};
