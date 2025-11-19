export const AUTH_CONFIG = {
  loginPage: process.env.NEXT_PUBLIC_LOGIN_PAGE_URL ?? "/auth/login",
  afterLoginRedirect: process.env.NEXT_PUBLIC_AFTER_LOGIN_REDIRECT_URL ?? "/profile",
  afterLogoutRedirect: process.env.NEXT_PUBLIC_AFTER_LOGOUT_REDIRECT_URL ?? "/",
  registerPage: process.env.NEXT_PUBLIC_REGISTER_PAGE_URL ?? "/auth/register",
  forgotPasswordPage: process.env.NEXT_PUBLIC_FORGOT_PASSWORD_PAGE_URL ?? "/auth/forgot-password",
  resetPasswordPage: process.env.NEXT_PUBLIC_RESET_PASSWORD_PAGE_URL ?? "/auth/new-password",
  verifyEmailPage: process.env.NEXT_PUBLIC_VERIFY_EMAIL_PAGE_URL ?? "/auth/verify-email",
  dashboardPage: process.env.NEXT_PUBLIC_DASHBOARD_PAGE_URL ?? "/dashboard",
  adminPage: process.env.NEXT_PUBLIC_ADMIN_PAGE_URL ?? "/dashboard",
};
