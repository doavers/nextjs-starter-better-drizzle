import { and, eq } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { accounts, users } from "@/db/schema";
import { auth } from "@/lib/auth";

export const updatePassowrdByEmail = async (email: string, password: string, token: string) => {
  try {
    const existingUser = await db
      .select({
        user: users,
        account: accounts,
      })
      .from(users)
      .leftJoin(accounts, eq(users.id, accounts.userId))
      .where(and(eq(users.email, email), eq(accounts.providerId, "credential")));

    if (!existingUser) {
      return null;
    } else {
      const data = await auth.api.resetPassword({
        body: {
          newPassword: password, // required
          token, // required
        },
      });

      return data;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const updatePassowrdByToken = async (password: string, token: string) => {
  try {
    const data = await auth.api.resetPassword({
      body: {
        newPassword: password, // required
        token, // required
      },
    });

    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
