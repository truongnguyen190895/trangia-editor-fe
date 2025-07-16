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

export interface SingleAgreementParty extends BaseAgreementParty {
  "tình trạng hôn nhân"?: string;
}

export interface CoupleAgreementParty extends BaseAgreementParty {
  "quan hệ"?: string;
  "giấy chứng nhận kết hôn"?: {
    "số giấy chứng nhận": string;
    "quyển số": string;
    "nơi cấp": string;
    "ngày cấp": string;
  };
}

export interface Couple {
  chồng: CoupleAgreementParty;
  vợ: CoupleAgreementParty;
}

export interface AgreementParty {
  "cá nhân": SingleAgreementParty[];
  "vợ chồng": Couple[];
}

export interface HDCNQuyenSDDatPayload {
  "bên A": {
    "cá thể": Array<{
      "giới tính": Gender;
      tên: string;
      "ngày sinh": string;
      "loại giấy tờ": string;
      "số giấy tờ": string;
      "nơi cấp": string;
      "ngày cấp": string;
      "địa chỉ thường trú cũ": string;
      "địa chỉ thường trú mới": string;
      "quan hệ"?: string;
    }>;
  };
  "bên B": {
    "cá thể": Array<{
      "giới tính": Gender;
      tên: string;
      "ngày sinh": string;
      "loại giấy tờ": string;
      "số giấy tờ": string;
      "nơi cấp": string;
      "ngày cấp": string;
      "địa chỉ thường trú cũ": string;
      "địa chỉ thường trú mới": string;
      "tình trạng hôn nhân"?: string;
    }>;
  };
  "số thửa đất": string;
  "tờ bản đồ": string;
  "địa chỉ cũ": string;
  "địa chỉ mới": string;
  "loại giấy chứng nhận": string;
  "số giấy chứng nhận": string;
  "số vào sổ cấp giấy chứng nhận": string;
  "nơi cấp giấy chứng nhận": string;
  "ngày cấp giấy chứng nhận": string;
  "đặc điểm thửa đất": {
    "diện tích": {
      số: string;
      chữ: string;
    };
    "hình thức sử dụng": string;
    "mục đích và thời hạn sử dụng": Array<{
      "phân loại": string;
      "diện tích"?: string;
      "thời hạn sử dụng": string;
    }>;
    "nguồn gốc sử dụng": string;
    "ghi chú": string;
  };
  "số tiền": string;
  "số tiền bằng chữ": string;
  ngày: string;
  "ngày bằng chữ": string;
  "số bản gốc": string;
  "số bản gốc bằng chữ": string;
  "ký bên ngoài": boolean;
}
