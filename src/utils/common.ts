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
  isKhaiThue = false //TODO: consider remove this parameter
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

export const checkIsObjectEmpty = (obj: Record<string, any>) => {
  return Object.values(obj).every((value) => {
    if (typeof value === "string") {
      return value.trim() === "";
    }
    if (typeof value === "number") {
      return value === 0;
    }
    return value == null;
  });
};

export const getTemplateName = (name: string) => {
  switch (name) {
    case "hdcn-quyen-su-dung-dat-toan-bo":
      return "Hợp đồng chuyển nhượng quyền sử dụng đất (toàn bộ)";
    case "hdmb-can-ho-toan-bo":
      return "Hợp đồng mua bán căn hộ toàn bộ";
    case "hdmb-can-ho-mot-phan-so-huu-toan-bo":
      return "Hợp đồng mua bán căn hộ một phần (để sở hữu toàn bộ)";
    case "hdmb-nha-dat-toan-bo":
      return "Hợp đồng mua bán nhà đất toàn bộ";
    case "hdcn-quyen-su-dung-dat-nong-nghiep-toan-bo":
      return "Hợp đồng chuyển nhượng quyền sử dụng đất nông nghiệp (toàn bộ)";
    case "hdcn-dat-va-tsglvd-toan-bo":
      return "Hợp đồng chuyển nhượng quyền sử dụng đất và tài sản gắn liền với đất (toàn bộ)";
    case "hd-tang-cho-can-ho-toan-bo":
      return "Hợp đồng tặng cho căn hộ (toàn bộ)";
    case "hd-tang-cho-dat-nong-nghiep-toan-bo":
      return "Hợp đồng tặng cho đất nông nghiệp (toàn bộ)";
    case "hd-tang-cho-dat-toan-bo":
      return "Hợp đồng tặng cho đất (toàn bộ)";
    case "uy-quyen-toan-bo-quyen-su-dung-dat":
      return "Uỷ quyền toàn bộ quyền sử dụng đất";
    case "uy-quyen-toan-bo-nha-dat":
      return "Uỷ quyền toàn bộ nhà + đất";
    case "uy-quyen-toan-bo-can-ho":
      return "Uỷ quyền toàn bộ căn hộ";
    case "hdmb-xe-oto":
      return "Hợp đồng mua bán xe ô tô";
    case "hdmb-xe-may":
      return "Hợp đồng mua bán xe máy";
    case "hdmb-xe-oto-bien-so-xe":
      return "Hợp đồng mua bán xe ô tô + biển số xe";
    case "uy-quyen-xe-oto":
      return "Uỷ quyền xe ô tô";
    case "hdmb-tai-san":
      return "Hợp đồng mua bán tài sản";
    case "vb-huy":
      return "Văn bản huỷ";
    case "vb-cham-dut-hq-uy-quyen":
      return "Văn bản chấm dứt hợp đồng uỷ quyền";
    case "vb-cham-dut-hd":
      return "Văn bản chấm dứt hợp đồng";
    case "hd-dat-coc":
      return "Hợp đồng đặt cọc";
    case "hd-dat-coc-chua-xoa-chap":
      return "Hợp đồng đặt cọc chưa xoá chấp";
    case "hd-tang-cho-nha-dat-toan-bo":
      return "Hợp đồng tặng cho nhà đất toàn bộ";
    case "hdcn-mot-phan-dat-va-tsglvd-de-dong-su-dung":
      return "HĐCN một phần đất và TSGLVĐ (đồng sử dụng)";
    case "hdcn-mot-phan-dat-va-tsglvd-de-su-dung-toan-bo":
      return "HĐCN một phần đất và TSGLVĐ (để sử dụng toàn bộ)";
    case "hdcn-quyen-su-dung-dat-mot-phan-de-dong-su-dung":
      return "HĐCN Quyền sử dụng đất một phần (đồng sử dụng)";
    case "hdcn-quyen-su-dung-dat-mot-phan-de-su-dung-toan-bo":
      return "HĐCN Quyền sử dụng đất một phần (để sở hữu toàn bộ)";
    default:
      return "";
  }
};
