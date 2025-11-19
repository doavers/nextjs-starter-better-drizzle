import crypto from "crypto";

export const getTokenMaxAge = (tokenExp = "15m") => {
  // Example 7 days = maxAge: 7 * 24 * 60 * 60 * 1000 //cookie expiry: set to match rT
  let tokenExpAge = 0;
  if (tokenExp.slice(-1) === "s") {
    tokenExpAge = parseInt(tokenExp.substring(0, tokenExp.length - 1)) * 1000;
  } else if (tokenExp.slice(-1) === "m") {
    tokenExpAge = parseInt(tokenExp.substring(0, tokenExp.length - 1)) * 60 * 1000;
  } else if (tokenExp.slice(-1) === "h") {
    tokenExpAge = parseInt(tokenExp.substring(0, tokenExp.length - 1)) * 60 * 60 * 1000;
  } else if (tokenExp.slice(-1) === "d") {
    tokenExpAge = parseInt(tokenExp.substring(0, tokenExp.length - 1)) * 24 * 60 * 60 * 1000;
  }

  return tokenExpAge;
};

export const generateToken = () => {
  return crypto.randomBytes(32).toString("hex"); // 64-char token
};

export const hashToken = (token: string) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};
