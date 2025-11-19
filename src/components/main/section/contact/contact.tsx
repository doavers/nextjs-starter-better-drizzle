"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { z } from "zod";

import Captcha from "@/components/common/captcha";
import { sendContactUsEmail } from "@/lib/mail";

// Define a Zod schema for validation
const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
  captchaToken: z.string().min(1, "Please complete the captcha verification"),
});

const ContactSection = () => {
  const t = useTranslations("contact");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!captchaToken) {
      setCaptchaError("Please complete the captcha verification");
      return;
    }

    const formData = new FormData(event.currentTarget);

    const data = {
      name: formData.get("fullName")?.toString() ?? "",
      email: formData.get("email")?.toString() ?? "",
      phone: formData.get("phone")?.toString() ?? "",
      subject: formData.get("subject")?.toString() ?? "",
      message: formData.get("message")?.toString() ?? "",
      captchaToken,
    };

    const result = contactSchema.safeParse(data);

    if (!result.success) {
      setError("Validation errors occurred. Please check your inputs.");
      // Extract field errors from Zod validation
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        // Convert path element to string to avoid TypeScript error
        const fieldName = String(issue.path[0]);
        errors[fieldName] = issue.message;
      });
      setFieldErrors(errors);
      return;
    }

    try {
      const response = await sendContactUsEmail(data);
      if (response) {
        setSuccess(true);
        setError(null);
        setCaptchaError(null);
        setCaptchaToken(null);
        setFieldErrors({});
      }
    } catch {
      setError("Failed to send the email. Please try again.");
    }
  };

  const handleCaptchaChange = (token: string | null) => {
    setCaptchaToken(token);
    if (token) {
      setCaptchaError(null);
    }
  };

  return (
    <section id="contact" className="relative py-20 md:py-[120px]">
      <div className="absolute top-0 left-0 -z-1 h-full w-full dark:bg-black"></div>
      <div className="absolute top-0 left-0 -z-1 h-1/2 w-full bg-[#E9F9FF] lg:h-[45%] xl:h-1/2 dark:bg-gray-800"></div>
      <div className="mx-auto max-w-screen-xl px-4">
        <div className="-mx-4 flex flex-wrap items-center">
          <div className="w-full px-4 lg:w-7/12 xl:w-8/12">
            <div className="ud-contact-content-wrapper">
              <div className="ud-contact-title mb-12 lg:mb-[150px]">
                <span className="mb-6 block text-base font-medium text-black dark:text-white">
                  {t("title").toUpperCase()}
                </span>
                <h2 className="max-w-[260px] text-[35px] leading-[1.14] font-semibold text-black dark:text-white">
                  {t("subtitle")}
                </h2>
              </div>
              <div className="mb-12 flex flex-wrap justify-between lg:mb-0">
                <div className="mb-8 flex w-[330px] max-w-full">
                  <div className="text-primary mr-6 text-[32px]">{/* SVG goes here */}</div>
                  <div>
                    <h3 className="mb-[18px] text-lg font-semibold text-black dark:text-white">{t("our-location")}</h3>
                    {/* Content goes here */}
                  </div>
                </div>
                <div className="mb-8 flex w-[330px] max-w-full">
                  <div className="text-primary mr-6 text-[32px]">{/* SVG goes here */}</div>
                  <div>
                    <h3 className="mb-[18px] text-lg font-semibold text-black dark:text-white">
                      {t("how-can-we-help")}
                    </h3>
                    {/* Content goes here */}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full px-4 lg:w-5/12 xl:w-4/12">
            <div
              className="wow fadeInUp shadow-testimonial rounded-lg bg-white px-8 py-10 sm:px-10 sm:py-12 md:p-[60px] lg:p-10 lg:px-10 lg:py-12 2xl:p-[60px] dark:bg-gray-800 dark:shadow-none"
              data-wow-delay=".2s"
            >
              <h3 className="mb-8 text-2xl font-semibold text-black md:text-[28px] md:leading-[1.42] dark:text-white">
                {t("send-us-a-message")}
              </h3>
              {success && (
                <div className="mb-4 rounded-md bg-green-100 p-4 text-green-800">Email sent successfully!</div>
              )}
              {error && <div className="mb-4 rounded-md bg-red-100 p-4 text-red-800">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-[22px]">
                  <label htmlFor="fullName" className="mb-4 block text-sm dark:text-gray-200">
                    {t("name")}*
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    placeholder={t("name-placeholder")}
                    className={`focus:border-primary dark:border-dark-3 w-full border-0 border-b bg-transparent py-1 text-black placeholder:text-gray-500 placeholder:opacity-80 focus:outline-none dark:text-white ${
                      fieldErrors.name ? "border-red-500" : "border-[#f1f1f1]"
                    }`}
                  />
                  {fieldErrors.name && <p className="mt-1 text-sm text-red-500">{fieldErrors.name}</p>}
                </div>
                <div className="mb-[22px]">
                  <label htmlFor="email" className="mb-4 block text-sm dark:text-gray-200">
                    {t("email")}*
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    autoComplete="email"
                    placeholder={t("email-placeholder")}
                    className={`focus:border-primary dark:border-dark-3 w-full border-0 border-b bg-transparent py-1 text-black placeholder:text-gray-500 placeholder:opacity-80 focus:outline-none dark:text-white ${
                      fieldErrors.email ? "border-red-500" : "border-[#f1f1f1]"
                    }`}
                  />
                  {fieldErrors.email && <p className="mt-1 text-sm text-red-500">{fieldErrors.email}</p>}
                </div>
                <div className="mb-[22px]">
                  <label htmlFor="phone" className="mb-4 block text-sm dark:text-gray-200">
                    {t("phone")}*
                  </label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    autoComplete="tel"
                    placeholder={t("phone-placeholder")}
                    className={`focus:border-primary dark:border-dark-3 w-full border-0 border-b bg-transparent py-1 text-black placeholder:text-gray-500 placeholder:opacity-80 focus:outline-none dark:text-white ${
                      fieldErrors.phone ? "border-red-500" : "border-[#f1f1f1]"
                    }`}
                  />
                  {fieldErrors.phone && <p className="mt-1 text-sm text-red-500">{fieldErrors.phone}</p>}
                </div>
                <div className="mb-[22px]">
                  <label htmlFor="subject" className="mb-4 block text-sm dark:text-gray-200">
                    {t("subject")}*
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    placeholder={t("subject-placeholder")}
                    className={`focus:border-primary dark:border-dark-3 w-full border-0 border-b bg-transparent py-1 text-black placeholder:text-gray-500 placeholder:opacity-80 focus:outline-none dark:text-white ${
                      fieldErrors.subject ? "border-red-500" : "border-[#f1f1f1]"
                    }`}
                  />
                  {fieldErrors.subject && <p className="mt-1 text-sm text-red-500">{fieldErrors.subject}</p>}
                </div>
                <div className="mb-[30px]">
                  <label htmlFor="message" className="mb-4 block text-sm dark:text-gray-200">
                    {t("message")}*
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={1}
                    placeholder={t("message-placeholder")}
                    className={`focus:border-primary dark:border-dark-3 w-full resize-none border-0 border-b bg-transparent py-1 text-black placeholder:text-gray-500 placeholder:opacity-80 focus:outline-none dark:text-white ${
                      fieldErrors.message ? "border-red-500" : "border-[#f1f1f1]"
                    }`}
                  ></textarea>
                  {fieldErrors.message && <p className="mt-1 text-sm text-red-500">{fieldErrors.message}</p>}
                </div>
                <Captcha onChange={handleCaptchaChange} error={captchaError ?? undefined} />
                <div className="mb-0">
                  <button
                    type="submit"
                    className="bg-primary hover:bg-primary/90 inline-flex items-center justify-center rounded-md px-10 py-3 text-base font-medium text-white transition duration-300 ease-in-out dark:text-black"
                  >
                    {t("send-message")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
