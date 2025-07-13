export const GENDER = {
  MALE: "Ông",
  FEMALE: "Bà",
} as const;

export type Gender = (typeof GENDER)[keyof typeof GENDER];

export interface AgreementEntity extends BaseAgreementParty {
  "tình trạng hôn nhân"?: string;
  "quan hệ"?: string;
  "giấy chứng nhận kết hôn"?: {
    "số giấy chứng nhận": string;
    "quyển số": string;
    "nơi cấp": string;
    "ngày cấp": string;
  };
}

interface BaseAgreementParty {
  "giới tính": Gender;
  tên: string;
  "ngày sinh": string;
  "loại giấy tờ": string;
  "số giấy tờ": string;
  "ngày cấp": string;
  "nơi cấp": string;
  "địa chỉ thường trú cũ": string;
  "địa chỉ thường trú mới": string;
}

interface SingleAgreementParty extends BaseAgreementParty {
  "tình trạng hôn nhân"?: string;
}

interface CoupleAgreementParty extends BaseAgreementParty {
  "quan hệ"?: string;
  "giấy chứng nhận kết hôn"?: {
    "số giấy chứng nhận": string;
    "quyển số": string;
    "nơi cấp": string;
    "ngày cấp": string;
  };
}

export interface AgreementParty {
  "cá nhân": SingleAgreementParty[];
  "vợ chồng": CoupleAgreementParty[];
}
