"use client";

import ReCAPTCHA from "react-google-recaptcha";

interface CaptchaProps {
  onChange: (token: string | null) => void;
  error?: string;
}

const Captcha = ({ onChange, error }: CaptchaProps) => {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  if (!siteKey) {
    console.error("RECAPTCHA_SITE_KEY is not defined in environment variables");
    return (
      <div className="mb-4 rounded-md bg-yellow-100 p-4 text-yellow-800">
        reCAPTCHA is not configured. Please add NEXT_PUBLIC_RECAPTCHA_SITE_KEY to your environment variables.
      </div>
    );
  }

  return (
    <div className="mb-[22px]">
      <div className="mb-4">
        <label className="block text-sm dark:text-gray-200">Verification*</label>
      </div>
      <div className={error ? "rounded ring-2 ring-red-500" : ""}>
        <ReCAPTCHA sitekey={siteKey} onChange={onChange} onExpired={() => onChange(null)} />
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Captcha;
