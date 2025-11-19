export const API_CONFIG = {
  timeout: 10000, // in milliseconds
  maxFreeAIGenCount: 5,
  backendURL: process.env.BACKEND_URL ?? "http://localhost:3000/api",
  authNeedActivation: process.env.AUTH_NEED_ACTIVATION ?? "N", // Y or N
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET ?? "your_access_token_secret",
  accessTokenVerify: process.env.ACCESS_TOKEN_VERIFY ?? "your_access_token_verify",
  accessTokenExpired: process.env.ACCESS_TOKEN_EXPIRED ?? "1d",
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET ?? "your_refresh_token_secret",
  refreshTokenVerify: process.env.REFRESH_TOKEN_VERIFY ?? "your_refresh_token_verify",
  refreshTokenExpired: process.env.REFRESH_TOKEN_EXPIRED ?? "7d",
  resetpassTokenExpired: process.env.RESETPASS_TOKEN_EXPIRED ?? "1h",
  responseMaping: [
    { code: "00", message: "Success" },
    { code: "99", message: "Unknown error occurred" },
    { code: "01", message: "Invalid request parameters" },
    { code: "02", message: "Authentication failed" },
    { code: "03", message: "Resource not found" },
    { code: "04", message: "Operation not permitted" },
    { code: "05", message: "Rate limit exceeded" },
    { code: "06", message: "Service unavailable" },
    { code: "07", message: "Timeout error" },
    { code: "08", message: "Conflict error" },
    { code: "09", message: "Data validation error" },
    { code: "10", message: "Internal server error" },
  ],
};
