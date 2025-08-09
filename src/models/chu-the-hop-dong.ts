export const GENDER = {
  MALE: "Ông",
  FEMALE: "Bà",
} as const;

export type Gender = (typeof GENDER)[keyof typeof GENDER];

interface BaseAgreementParty {
  giới_tính: Gender;
  tên: string;
  ngày_sinh: string;
  loại_giấy_tờ: string;
  số_giấy_tờ: string;
  ngày_cấp: string;
  nơi_cấp: string;
  địa_chỉ_thường_trú: string;
}

export interface SingleAgreementParty extends BaseAgreementParty {
  tình_trạng_hôn_nhân: string | null;
  quan_hệ: string | null;
}

export interface CoupleAgreementParty extends BaseAgreementParty {
  quan_hệ: string | null;
  tình_trạng_hôn_nhân_vợ_chồng: string | null;
}

export interface Couple {
  chồng: CoupleAgreementParty;
  vợ: CoupleAgreementParty;
}

export interface AgreementParty {
  cá_nhân: SingleAgreementParty[];
  vợ_chồng: Couple[];
}
