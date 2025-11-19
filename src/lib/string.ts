import crypto from "crypto";

export const toTitleCase = (str: string): string => {
  const words = str.split(" ");
  if (words.length > 1) {
    return str
      .toLowerCase() // optional: make everything lowercase first
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  } else if (str.length > 1) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  } else if (str.length === 1) {
    return str.toUpperCase();
  } else {
    return str;
  }
};

export const removeSpecialCharacters = (inputString: string): string => {
  // Use a regular expression to remove all characters that are not letters, numbers, or spaces
  return inputString.replace(/[^A-Za-z0-9\s]/g, "");
};

export const generateString = (length: number): string => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const generateSlug = (title: string): string => {
  const slug = title
    .toLowerCase() // Convert to lowercase
    .replace(/[^a-z0-9\s-]/g, "") // Remove non-alphanumeric characters except spaces and hyphens
    .trim() // Trim leading/trailing spaces
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-"); // Replace multiple hyphens with a single hyphen
  return slug;
};

export const safeCompare = (str1: string, str2: string) => {
  const buf1 = Buffer.from(str1);
  const buf2 = Buffer.from(str2);

  if (buf1.length !== buf2.length) {
    return false;
  }

  return crypto.timingSafeEqual(buf1, buf2);
};
