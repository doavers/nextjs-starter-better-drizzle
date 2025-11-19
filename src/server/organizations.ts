"use server";

import { eq, inArray } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { members, organizations } from "@/db/schema";

import { getCurrentUser } from "./users";

export async function getOrganizations() {
  const { currentUser } = await getCurrentUser();

  const membersData = await db.query.members.findMany({
    where: eq(members.userId, currentUser.id),
  });

  const organizationsData = await db.query.organizations.findMany({
    where: inArray(
      organizations.id,
      membersData.map((member: { organizationId: string }) => member.organizationId),
    ),
  });

  return organizationsData;
}

export async function getActiveOrganization(userId: string) {
  const memberUser = await db.query.members.findFirst({
    where: eq(members.userId, userId),
  });

  if (!memberUser) {
    return null;
  }

  const activeOrganization = await db.query.organizations.findFirst({
    where: eq(organizations.id, memberUser.organizationId),
  });

  return activeOrganization;
}

export async function getOrganizationBySlug(slug: string) {
  try {
    const organizationBySlug = await db.query.organizations.findFirst({
      where: eq(organizations.slug, slug),
      with: {
        members: {
          with: {
            users: true,
          },
        },
      },
    });

    return organizationBySlug;
  } catch (error) {
    console.error(error);
    return null;
  }
}
