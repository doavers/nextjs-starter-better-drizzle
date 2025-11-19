export const maskPAN = (cardNo: string) => {
  if (cardNo) {
    const isRawCard = cardNo.indexOf("*");
    if (isRawCard === -1) {
      const ensureOnlyNumbers = cardNo.replace(/[^0-9]+/g, "");
      const maskPAN = ensureOnlyNumbers.replace(/[0-9](?<=([0-9]{7})(?=([0-9]{4})))/g, "*");

      return maskPAN.toString();
    } else {
      return cardNo;
    }
  }
  return null;
};

export const maskCVN = (CVN: string) => {
  if (CVN) {
    const isRawCVN = CVN.indexOf("*");
    if (isRawCVN === -1) {
      const ensureOnlyNumbers = CVN.replace(/[^0-9]+/g, "");
      const maskCVN = ensureOnlyNumbers.replace(/[0-9]/g, "*");
      return maskCVN.toString();
    }
  }
  return null;
};
