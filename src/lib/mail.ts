/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { Resend } from "resend";

import ContactUsEmail from "@/components/emails/contact-us-email";
import OrganizationInvitationEmail from "@/components/emails/organization-invitation";

import { verifyRecaptcha } from "./captcha";

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.NEXT_PUBLIC_APP_URL;

interface ContactUsEmailProps {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  captchaToken: string;
}

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: process.env.EMAIL_FROM ?? "onboarding@resend.dev",
    to: [`${email}`],
    subject: "2FA Code",
    html: `<p>Your 2FA code: ${token}</p>`,
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${domain}/auth/new-password?token=${token}`;

  await resend.emails.send({
    from: process.env.EMAIL_FROM ?? "onboarding@resend.dev",
    to: [`${email}`],
    subject: "Reset your password",
    html: `<p>Click <a href="${resetLink}">here</a> to reset password.</p>`,
  });
};

export const sendVerificationEmail = async (email: string, token: string) => {
  console.log("RESEND_API_KEY", process.env.RESEND_API_KEY);
  console.log("EMAIL_FROM", process.env.EMAIL_FROM);
  console.log("email", email);
  const confirmLink = `${domain}/auth/new-verification?token=${token}`;

  await resend.emails.send({
    from: process.env.EMAIL_FROM ?? "onboarding@resend.dev",
    to: [`${email}`],
    subject: "Confirm your email",
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`,
  });
};

export const sendContactUsEmail = async (data: ContactUsEmailProps) => {
  // Verify reCAPTCHA token first
  const isValidCaptcha = await verifyRecaptcha(data.captchaToken);

  if (!isValidCaptcha) {
    console.error("Invalid reCAPTCHA token");
    throw new Error("Invalid captcha verification");
  }

  // Destructure data without captchaToken for the email
  const { captchaToken: _, ...emailData } = data;
  const emailContent = await ContactUsEmail(emailData);

  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM ?? "onboarding@resend.dev",
      to: process.env.EMAIL_SUPPORT ?? "admin@doavers.com",
      subject: `Inquiry Regarding [${data.subject}]`,
      react: emailContent,
    });
    console.log("Email sent successfully");
    return true;
  } catch (error) {
    console.error("Error sending email", error);
    return false;
  }
};

export const sendOrganizationInvitationEmail = async (
  email: string,
  organizationName: string,
  invitedByUsername: string,
  invitedByEmail: string,
  invitationId: string,
) => {
  try {
    const inviteLink = `${domain}/api/accept-invitation/${invitationId}`;

    const emailContent = OrganizationInvitationEmail({
      email,
      invitedByUsername,
      invitedByEmail,
      teamName: organizationName,
      inviteLink,
    });

    await resend.emails.send({
      from:
        process.env.EMAIL_FROM ||
        (process.env.EMAIL_SENDER_NAME && process.env.EMAIL_SENDER_ADDRESS
          ? `${process.env.EMAIL_SENDER_NAME} <${process.env.EMAIL_SENDER_ADDRESS}>`
          : "onboarding@resend.dev"),
      to: [email],
      subject: "You've been invited to join our organization",
      react: emailContent,
    });

    console.log("Organization invitation email sent successfully");
    return true;
  } catch (error) {
    console.error("Error sending organization invitation email", error);
    return false;
  }
};
