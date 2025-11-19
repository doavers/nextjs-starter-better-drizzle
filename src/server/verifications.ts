import { and, eq, lt } from "drizzle-orm";

import { API_CONFIG } from "@/config/api-config";
import { db } from "@/db/drizzle";
import { verifications } from "@/db/schema";
import { generateToken, getTokenMaxAge, hashToken } from "@/lib/auth/token";
import { sendPasswordResetEmail } from "@/lib/mail";

export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    const passwordResetToken = await db.query.verifications.findFirst({
      where: and(
        eq(verifications.id, `reset_pwd_${email}`),
        eq(verifications.identifier, email),
        // lt(verifications.expiresAt, new Date()),
      ),
    });

    return passwordResetToken;
  } catch {
    return null;
  }
};

export const getPasswordResetToken = async (token: string) => {
  try {
    const hashedToken = hashToken(token);
    const passwordResetToken = await db.query.verifications.findFirst({
      where: and(eq(verifications.value, hashedToken), lt(verifications.expiresAt, new Date())),
    });

    return passwordResetToken;
  } catch {
    return null;
  }
};

export const deletePasswordResetTokenById = async (id: string) => {
  try {
    const deletedToken = await db.delete(verifications).where(eq(verifications.id, id)).returning();

    return deletedToken[0] ?? null;
  } catch {
    return null;
  }
};

export const addPasswordResetToken = async (email: string) => {
  const rawToken = generateToken(); // send to user
  const hashedToken = hashToken(rawToken); // store in DB
  const expires = new Date(getTokenMaxAge(API_CONFIG.resetpassTokenExpired));

  const passwordResetToken = await db
    .insert(verifications)
    .values({
      id: `reset_pwd_${email}`,
      identifier: email,
      value: hashedToken,
      expiresAt: expires,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  return { data: passwordResetToken[0], token: rawToken };
};

export const generatePasswordResetToken = async (email: string) => {
  try {
    const existingToken = await getPasswordResetTokenByEmail(email);

    if (existingToken) {
      await deletePasswordResetTokenById(existingToken.id);
    }

    const passwordResetToken = await addPasswordResetToken(email);

    await sendPasswordResetEmail(passwordResetToken.data.identifier, passwordResetToken.token);

    return passwordResetToken;
  } catch {
    return null;
  }
};
