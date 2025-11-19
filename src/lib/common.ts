export const headersToObject = (headers: Headers): { [key: string]: string } => {
  const result: { [key: string]: string } = {};
  headers.forEach((value, key) => {
    if (
      Object.prototype.hasOwnProperty.call(result, key) ||
      Object.prototype.hasOwnProperty.call(Object.prototype, key)
    ) {
      // Skip prototype pollution keys
      return;
    }
    if (
      typeof key === "string" &&
      !["__proto__", "constructor", "prototype"].includes(key) &&
      /^[a-zA-Z0-9_-]+$/.test(key) // Only allow alphanumeric, underscore, and hyphen
    ) {
      Object.defineProperty(result, key, {
        value,
        enumerable: true,
        writable: true,
        configurable: true,
      });
    }
  });
  return result;
};

export const removeCircularReferences = () => {
  const seen = new WeakSet();
  return (key: string, value: unknown): unknown => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) return undefined;
      seen.add(value);
    }
    return value;
  };
};

export const toQueryString = (params: object): string => {
  return Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null) // Exclude undefined or null values
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`) // Encode key-value pairs
    .join("&"); // Join with '&'
};

export const isEmpty = (value: unknown): boolean => {
  if (value === null || value === undefined) {
    return true;
  }

  if (typeof value === "string" && value.trim() === "") {
    return true;
  }

  if (Array.isArray(value) && value.length === 0) {
    return true;
  }

  if (typeof value === "object" && Object.keys(value).length === 0) {
    return true;
  }

  return false;
};

export const isJsonString = (str: string): boolean => {
  try {
    JSON.parse(str);
  } catch {
    return false;
  }
  return true;
};

export const getHostnameFromUrl = (urlString: string): string | null => {
  try {
    const url = new URL(urlString);
    return url.hostname;
  } catch (e) {
    console.error("Invalid URL:", e);
    return null;
  }
};

export const batchArray = (arr: [], batchSize: number) => {
  const batchedArray = [];
  for (let i = 0; i < arr.length; i += batchSize) {
    batchedArray.push(arr.slice(i, i + batchSize));
  }
  return batchedArray;
};

export const getFulfilledPromiseValues = (values: PromiseSettledResult<unknown>[][]): unknown[] => {
  const datas = [];
  for (let i = 0; i < values.length; i++) {
    const subValue = values[i];
    for (let j = 0; j < subValue.length; j++) {
      if (subValue[j].status === "fulfilled") {
        datas.push((subValue[j] as PromiseFulfilledResult<unknown>).value);
      }
    }
  }

  return datas;
};
