/* eslint-disable @typescript-eslint/no-explicit-any */
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin, bearer, jwt, organization } from "better-auth/plugins";
import { Resend } from "resend";

import OrganizationInvitationEmail from "@/components/emails/organization-invitation";
import ForgotPasswordEmail from "@/components/emails/reset-password";
import VerifyEmail from "@/components/emails/verify-email";
import { UserRole } from "@/config/role-config";

import { db } from "../db/drizzle";

import { member, owner } from "./auth/permissions";

const resend = new Resend(process.env.RESEND_API_KEY as string);

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
  }),
  onAPIError: {
    errorURL: "/auth/error",
  },
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      resend.emails.send({
        from: `${process.env.EMAIL_SENDER_NAME} <${process.env.EMAIL_SENDER_ADDRESS}>`,
        to: user.email,
        subject: "Reset your password",
        react: ForgotPasswordEmail({
          username: user.name,
          resetUrl: url,
          userEmail: user.email,
        }),
      });
    },
    requireEmailVerification: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    autoSignIn: false,
  },
  emailVerification: {
    sendVerificationEmail: async (data) => {
      const payload = {
        from:
          process.env.EMAIL_FROM && process.env.EMAIL_FROM_NAME
            ? `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`
            : "onboarding@resend.dev",
        // from: process.env.EMAIL_FROM ? `${process.env.EMAIL_FROM}` : "onboarding@resend.dev",
        to: data.user.email,
        subject: "Verify your email",
        react: VerifyEmail({ username: data.user.name, verifyUrl: data.url }),
      };
      const result = await resend.emails.send(payload);
      console.log("payload", payload);
      console.log("result", result);
    },
    sendOnSignUp: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      mapProfileToUser: (profile) => {
        return {
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: UserRole.USER,
        };
      },
    },
  },
  events: {
    async onSignIn({ user, account, profile }: { user: any; account: any; profile: any }) {
      console.log("user account", { user, account, profile });
      // 👇 send user info to your backend
      await fetch(`${process.env.BACKEND_URL}/api/auth/social-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.INTERNAL_API_KEY ?? ""}`, // if you want to secure it
        },
        body: JSON.stringify({
          provider: account.provider,
          providerAccountId: account.providerAccountId,
          email: user.email,
          name: user.name,
          avatar: user.image,
        }),
      });
    },
  },
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
    defaultCookieAttributes: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    },
  },
  databaseHooks: {
    session: {
      create: {
        before: async (session) => {
          return {
            data: {
              ...session,
              activeOrganizationId: null,
            },
          };
        },
      },
    },
  },

  // START Models configuration
  user: {
    modelName: "user",
    additionalFields: {
      lastName: {
        type: "string",
        required: false,
      },
      isOnboarded: {
        type: "boolean",
        required: false,
        defaultValue: false,
      },
    },
  },
  verification: {
    modelName: "verification",
  },
  session: {
    modelName: "session",
    expiresIn: 60 * 60 * 24 * 3, // 3 days
    updateAge: 60 * 60 * 24 * 1, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
    },
    disableSessionRefresh: true, // Session will not be extended, updateAge is ignored.
  },
  account: {
    modelName: "account",
  },
  // END Models configuration

  plugins: [
    admin({
      roles: {
        superadmin: true,
        admin: true,
        user: true,
      } as any,
      adminRoles: [UserRole.SUPERADMIN, UserRole.ADMIN],
      defaultRole: UserRole.USER,
    }),
    bearer(),
    jwt({
      // Optional: customize JWT settings
      jwks: {
        keyPairConfig: {
          alg: "RS256",
        },
      },
    }),
    organization({
      schema: {
        organization: {
          modelName: "organization",
        },
        invitation: {
          modelName: "invitation",
        },
        member: {
          modelName: "member",
        },
      },
      async sendInvitationEmail(data) {
        const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/api/accept-invitation/${data.id}`;

        resend.emails.send({
          from: `${process.env.EMAIL_SENDER_NAME} <${process.env.EMAIL_SENDER_ADDRESS}>`,
          to: data.email,
          subject: "You've been invited to join our organization",
          react: OrganizationInvitationEmail({
            email: data.email,
            invitedByUsername: data.inviter.user.name,
            invitedByEmail: data.inviter.user.email,
            teamName: data.organization.name,
            inviteLink,
          }),
        });
      },
      roles: {
        owner,
        member,
      },
    }),
    nextCookies(),
  ],
});

export type Session = typeof auth.$Infer.Session;
