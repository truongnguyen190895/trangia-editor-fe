import type { AgreementParty } from "@/models/agreement-entity";
import { extractAddress } from "./extract-address";

export const generateThoiHanSuDung = (
  input: {
    phân_loại: string;
    diện_tích: string;
    thời_hạn_sử_dụng: string;
  }[]
) => {
  if (input.length === 0) {
    return "";
  }

  if (input.length === 1 || input[0].diện_tích === null) {
    return input[0].thời_hạn_sử_dụng;
  }

  let result = "";
  input.forEach((item) => {
    result += `${item.phân_loại}: ${item.thời_hạn_sử_dụng}; `;
  });

  return result;
};

export const getFirstLetter = (name: string) => {
  return name.charAt(0).toUpperCase();
};

/**
 * Converts all empty string properties in an object to null.
 * Recursively handles nested objects and arrays.
 *
 * @param obj - The object to process
 * @returns A new object with empty strings converted to null
 *
 * @example
 * convertEmptyStringsToNull({name: "", age: 25, address: {street: "", city: "Hanoi"}})
 * // Returns {name: null, age: 25, address: {street: null, city: "Hanoi"}}
 */
export const convertEmptyStringsToNull = <T>(obj: T): T => {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === "string") {
    return (obj === "" ? null : obj) as T;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => convertEmptyStringsToNull(item)) as T;
  }

  if (typeof obj === "object") {
    const result = {} as T;
    for (const [key, value] of Object.entries(obj)) {
      (result as any)[key] = convertEmptyStringsToNull(value);
    }
    return result;
  }

  return obj;
};

export const extractCoupleFromParty = (
  party: AgreementParty,
  isKhaiThue = false
) => {
  let flattenArray = [];

  for (const couple of party["vợ_chồng"]) {
    flattenArray.push(couple.chồng);
    flattenArray.push(couple.vợ);
  }

  const couples = flattenArray.map((person) => ({
    ...person,
    ngày_sinh: person["ngày_sinh"],
    ngày_cấp: person["ngày_cấp"],
    tình_trạng_hôn_nhân: null,
    quan_hệ: isKhaiThue ? null : person.giới_tính === "Bà" ? "vợ" : null,
    ...extractAddress(person["địa_chỉ_thường_trú"]),
  }));

  return couples;
};

export const getPeopleNameFromParty = (party: AgreementParty) => {
  const people = party["cá_nhân"].map(
    (person) => `${person?.giới_tính?.toLocaleLowerCase()} ${person?.tên}`
  );
  const couples = extractCoupleFromParty(party).map(
    (couple) => `${couple?.giới_tính?.toLocaleLowerCase()} ${couple?.tên}`
  );
  return [...people, ...couples].join(", ");
};
