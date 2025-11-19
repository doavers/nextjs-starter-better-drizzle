import os from "os";

export const getServerIP = (): null | string => {
  const networkInterfaces = os.networkInterfaces();
  for (const interfaceName in networkInterfaces) {
    const addresses = networkInterfaces[interfaceName];
    if (addresses) {
      for (const address of addresses) {
        if (address.family === "IPv4" && !address.internal) {
          return address.address; // Returns the server's IP address
        }
      }
    }
  }
  return null; // If no external IPv4 address is found
};
