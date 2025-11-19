export const toIso8601String = (date: Date) => {
  return date.toISOString();
};

export const compareIsoDates = (date1: string, date2: string): number => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  if (d1 < d2) return -1;
  if (d1 > d2) return 1;
  return 0;
};

// Define date validation utility function
export const isValidTripDate = (tripDate: string): boolean => {
  // Regular expression to check for "YYYY-MM-DD" format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(tripDate)) {
    return false;
  }

  // Parse the provided date
  const providedDate = new Date(tripDate);
  const currentDate = new Date();

  // Ensure the provided date is valid
  if (isNaN(providedDate.getTime())) {
    return false;
  }

  // Compare provided date with the current date (ignoring time)
  return providedDate >= new Date(currentDate.toISOString().split("T")[0]);
};

export function formatDate(date: Date | string | number | undefined, opts: Intl.DateTimeFormatOptions = {}) {
  if (!date) return "";

  try {
    return new Intl.DateTimeFormat("en-US", {
      month: opts.month ?? "long",
      day: opts.day ?? "numeric",
      year: opts.year ?? "numeric",
      ...opts,
    }).format(new Date(date));
  } catch {
    return "";
  }
}

export const formatDateToIndonesian = (isoDate: string, options?: { withDayName?: boolean }): string => {
  const date = new Date(isoDate);

  // Define day and month names in Indonesian
  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const dayName = days[date.getDay()]; // Get the day name
  const day = date.getDate().toString().padStart(2, "0"); // Get the day (2 digits)
  const monthName = months[date.getMonth()]; // Get the month name
  const year = date.getFullYear(); // Get the year

  if (!options?.withDayName) return `${day} ${monthName} ${year}`;
  return `${dayName}, ${day} ${monthName} ${year}`;
};

export const formatTimeToIndonesian = (isoDate: string): string => {
  const date = new Date(isoDate);

  // Use Intl.DateTimeFormat to format the time in Indonesia time zone
  const formatter = new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // Use 24-hour format
    timeZone: "Asia/Jakarta", // Set time zone to Indonesia
  });

  return formatter.format(date);
};

export const isValidDate = (dateString: string): boolean => {
  // Format: YYYY-MM-DD
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
};

export const toGmt7Iso = (formatedDate: string): string => {
  // Parse the date string with format YYYY-MM-DD
  const [year, month, day] = formatedDate.split("-").map(Number);
  // Create a Date object at 00:00 local time
  const date = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
  // Subtract 7 hours to get 00:00 GMT+7 in UTC (which is 17:00 previous day UTC)
  date.setUTCHours(date.getUTCHours() - 7);
  return date.toISOString();
};

export const toGmt7IsoStartDate = (formatedDate: string): string => {
  // Parse the date string with format YYYY-MM-DD
  const [year, month, day] = formatedDate.split("-").map(Number);
  // Create a Date object at 00:00 local time
  const date = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
  const midnight = new Date(date.getTime());
  // Subtract 7 hours to get 00:00 GMT+7 in UTC (which is 17:00 previous day UTC)
  midnight.setUTCHours(midnight.getUTCHours() - 7);
  return midnight.toISOString();
};

export const toGmt7IsoEndDate = (formatedDate: string): string => {
  // Parse the date string with format YYYY-MM-DD
  const [year, month, day] = formatedDate.split("-").map(Number);
  // Create a Date object at 00:00 local time
  const date = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
  const midnight = new Date(date.getTime() + 1 * 24 * 60 * 60 * 1000);
  // Subtract 7 hours to get 00:00 GMT+7 in UTC (which is 17:00 previous day UTC)
  midnight.setUTCHours(midnight.getUTCHours() - 7);
  return midnight.toISOString();
};

export const isoDateToSimpleDateGmt7 = (isoDate: string): string => {
  const date = new Date(isoDate);
  // Format date parts in Asia/Jakarta
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Jakarta",
  };
  const [month, day, year] = new Intl.DateTimeFormat("en-US", options).format(date).split("/");

  return `${year}-${month}-${day}`;
};

export const elapsedTime = (start: Date, end: Date): string => {
  let delta = Math.abs(end.getTime() - start.getTime()) / 1000;

  const days = Math.floor(delta / 86400);
  delta -= days * 86400;

  const hours = Math.floor(delta / 3600) % 24;
  delta -= hours * 3600;

  const minutes = Math.floor(delta / 60) % 60;
  delta -= minutes * 60;

  const seconds = Math.floor(delta % 60);

  const parts = [];
  if (days > 0) parts.push(`${days} day${days !== 1 ? "s" : ""}`);
  if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? "s" : ""}`);
  if (minutes > 0) parts.push(`${minutes} minute${minutes !== 1 ? "s" : ""}`);
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds} second${seconds !== 1 ? "s" : ""}`);

  return parts.join(", ");
};

export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const addHours = (date: Date, hours: number): Date => {
  const result = new Date(date);
  result.setHours(result.getHours() + hours);
  return result;
};

export const addMinutes = (date: Date, minutes: number): Date => {
  const result = new Date(date);
  result.setMinutes(result.getMinutes() + minutes);
  return result;
};

export const addSeconds = (date: Date, seconds: number): Date => {
  const result = new Date(date);
  result.setSeconds(result.getSeconds() + seconds);
  return result;
};

export const differenceInDays = (date1: Date, date2: Date): number => {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

export const differenceInHours = (date1: Date, date2: Date): number => {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60));
};

export const differenceInMinutes = (date1: Date, date2: Date): number => {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.floor(diffTime / (1000 * 60));
};

export const differenceInSeconds = (date1: Date, date2: Date): number => {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.floor(diffTime / 1000);
};

export const isLeapYear = (year: number): boolean => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

export const daysInMonth = (year: number, month: number): number => {
  return new Date(year, month, 0).getDate();
};

export const startOfDay = (date: Date): Date => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

export const endOfDay = (date: Date): Date => {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
};

export const startOfMonth = (date: Date): Date => {
  const result = new Date(date);
  result.setDate(1);
  result.setHours(0, 0, 0, 0);
  return result;
};

export const endOfMonth = (date: Date): Date => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + 1);
  result.setDate(0);
  result.setHours(23, 59, 59, 999);
  return result;
};

export const startOfYear = (date: Date): Date => {
  const result = new Date(date);
  result.setMonth(0, 1);
  result.setHours(0, 0, 0, 0);
  return result;
};

export const endOfYear = (date: Date): Date => {
  const result = new Date(date);
  result.setMonth(11, 31);
  result.setHours(23, 59, 59, 999);
  return result;
};
