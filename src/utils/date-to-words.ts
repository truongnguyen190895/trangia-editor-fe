export function translateDateToVietnamese(dateString: string) {
  // Split the date into day, month, year
  const [day, month, year] = dateString.split("/").map(Number);

  // Helper functions for number conversion
  function translateNumber(num: number, isYear = false): string {
    const units = [
      "",
      "một",
      "hai",
      "ba",
      "bốn",
      "năm",
      "sáu",
      "bảy",
      "tám",
      "chín",
    ];
    const teens = [
      "mười",
      "mười một",
      "mười hai",
      "mười ba",
      "mười bốn",
      "mười lăm",
      "mười sáu",
      "mười bảy",
      "mười tám",
      "mười chín",
    ];
    const tens = [
      "",
      "mười",
      "hai mươi",
      "ba mươi",
      "bốn mươi",
      "năm mươi",
      "sáu mươi",
      "bảy mươi",
      "tám mươi",
      "chín mươi",
    ];

    if (num === 0) return "không";
    if (num < 10) return units[num];
    if (num < 20) return teens[num - 10];
    if (num < 100) {
      const ten = Math.floor(num / 10);
      const unit = num % 10;
      return (
        tens[ten] + (unit !== 0 ? " " + (unit === 5 ? "lăm" : units[unit]) : "")
      );
    }

    // Handle years (up to 9999)
    if (num < 1000) {
      const hundred = Math.floor(num / 100);
      const remainder = num % 100;
      return (
        units[hundred] +
        " trăm" +
        (remainder !== 0 ? " " + translateNumber(remainder) : "")
      );
    }

    const thousand = Math.floor(num / 1000);
    const remainder = num % 1000;

    // Special handling for years to include "zero hundred" when needed
    if (isYear && remainder < 100 && remainder !== 0) {
      return (
        translateNumber(thousand) +
        " nghìn không trăm " +
        translateNumber(remainder)
      );
    }

    return (
      translateNumber(thousand) +
      " nghìn" +
      (remainder !== 0 ? " " + translateNumber(remainder) : "")
    );
  }

  // Build the date string
  const dayStr = translateNumber(day);
  const monthStr = translateNumber(month);
  const yearStr = translateNumber(year, true); // Pass true for year to get special handling

  return `Ngày ${dayStr}, tháng ${monthStr}, năm ${yearStr}`;
}
