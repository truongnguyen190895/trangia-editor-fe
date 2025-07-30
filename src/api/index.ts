import axios from "axios";
import type {
  HDCNQuyenSDDatPayload,
  SampleToKhaiChungPayload,
} from "@/models/agreement-entity";
import type {
  HDMBCanHoPayload,
  KhaiThueHDMBCanHoToanBoPayload,
} from "@/models/hdmb-can-ho";
import type {
  HDMBNhaDatPayload,
  KhaiThueHDMBNhaDatToanBoPayload,
} from "@/models/hdmb-nha-dat";
import type {
  HDCNDatVaTaiSanGanLienVoiDatToanBoPayload,
  KhaiThueHDCNDatVaTaiSanGanLienVoiDatToanBoPayload,
} from "@/models/hdcn-dat-va-tsglvd";
import type { UyQuyenToanBoQuyenSdDatPayload } from "@/models/uy-quyen";

export const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL,
});

api.interceptors.request.use((config) => {
  config.headers["x-api-key"] = import.meta.env.VITE_API_KEY;
  return config;
});

export const render_hdcn_quyen_sd_dat_toan_bo = async (
  payload: HDCNQuyenSDDatPayload,
  isNongNghiep: boolean
) => {
  return api.post(
    `/templates/nhom-chuyen-nhuong-mua-ban/hdcn-quyen-su-dung-dat${
      isNongNghiep ? "-nong-nghiep" : ""
    }-toan-bo`,
    payload,
    {
      responseType: "blob",
    }
  );
};

export const render_hdmb_can_ho = async (payload: HDMBCanHoPayload) => {
  return api.post(
    "/templates/nhom-chuyen-nhuong-mua-ban/hdmb-can-ho-toan-bo",
    payload,
    {
      responseType: "blob",
    }
  );
};

export const render_uy_quyen_toan_bo_can_ho = async (
  payload: HDMBCanHoPayload
) => {
  return api.post("/templates/nhom-uy-quyen/uq-toan-bo-can-ho", payload, {
    responseType: "blob",
  });
};

export const render_hdmb_nha_dat = async (payload: HDMBNhaDatPayload) => {
  return api.post(
    "/templates/nhom-chuyen-nhuong-mua-ban/hdmb-nha-dat-toan-bo",
    payload,
    {
      responseType: "blob",
    }
  );
};

export const render_hdtc_nha_dat_toan_bo = async (
  payload: HDMBNhaDatPayload
) => {
  return api.post(
    "/templates/nhom-tang-cho/hd-tang-cho-nha-dat-toan-bo",
    payload,
    {
      responseType: "blob",
    }
  );
};

export const render_hdcn_dat_va_tai_san_gan_lien_voi_dat_toan_bo = async (
  payload: HDCNDatVaTaiSanGanLienVoiDatToanBoPayload
) => {
  return api.post(
    "/templates/nhom-chuyen-nhuong-mua-ban/hdcn-dat-va-tsglvd-toan-bo",
    payload,
    {
      responseType: "blob",
    }
  );
};

export const render_hdtc_can_ho_toan_bo = async (payload: HDMBCanHoPayload) => {
  return api.post(
    "/templates/nhom-tang-cho/hd-tang-cho-can-ho-toan-bo",
    payload,
    {
      responseType: "blob",
    }
  );
};

export const render_hdtc_dat_toan_bo = async (
  payload: HDCNQuyenSDDatPayload,
  isNongNghiep: boolean
) => {
  return api.post(
    `/templates/nhom-tang-cho/hd-tang-cho-dat${
      isNongNghiep ? "-nong-nghiep" : ""
    }-toan-bo`,
    payload,
    {
      responseType: "blob",
    }
  );
};

export const render_khai_thue_chuyen_nhuong_dat_va_dat_nong_nghiep = async (
  payload: SampleToKhaiChungPayload
) => {
  return api.post(
    "/templates/khai-thue/khai-thue-chuyen-nhuong-dat-va-dat-nong-nghiep",
    payload,
    {
      responseType: "blob",
    }
  );
};

export const render_khai_thue_tang_cho_dat_va_dat_nong_nghiep_toan_bo = async (
  payload: SampleToKhaiChungPayload
) => {
  return api.post(
    "/templates/khai-thue/khai-thue-tang-cho-dat-va-dat-nong-nghiep",
    payload,
    {
      responseType: "blob",
    }
  );
};

export const render_khai_thue_hdmb_can_ho_toan_bo = async (
  payload: KhaiThueHDMBCanHoToanBoPayload
) => {
  return api.post("/templates/khai-thue/khai-thue-mua-ban-can-ho", payload, {
    responseType: "blob",
  });
};

export const render_khai_thue_hdmb_nha_dat_toan_bo = async (
  payload: KhaiThueHDMBNhaDatToanBoPayload
) => {
  return api.post("/templates/khai-thue/khai-thue-mua-ban-nha-dat", payload, {
    responseType: "blob",
  });
};

export const render_khai_thue_hdcn_dat_va_tsglvd_toan_bo = async (
  payload: KhaiThueHDCNDatVaTaiSanGanLienVoiDatToanBoPayload
) => {
  return api.post(
    "/templates/khai-thue/khai-thue-mua-ban-nha-dat-va-tsglvd",
    payload,
    {
      responseType: "blob",
    }
  );
};

export const render_khai_thue_hdtc_nha_dat_toan_bo = async (
  payload: KhaiThueHDMBNhaDatToanBoPayload
) => {
  return api.post("/templates/khai-thue/khai-thue-tang-cho-nha-dat", payload, {
    responseType: "blob",
  });
};

export const render_khai_thue_hdtc_can_ho_toan_bo = async (
  payload: KhaiThueHDMBCanHoToanBoPayload
) => {
  return api.post("/templates/khai-thue/khai-thue-tang-cho-can-ho", payload, {
    responseType: "blob",
  });
};

export const render_uy_quyen_toan_bo_quyen_su_dung_dat = async (
  payload: UyQuyenToanBoQuyenSdDatPayload
) => {
  return api.post("/templates/nhom-uy-quyen/uq-toan-bo-quyen-sd-dat", payload, {
    responseType: "blob",
  });
};

export const render_uy_quyen_toan_bo_nha_dat = async (
  payload: HDMBNhaDatPayload
) => {
  return api.post("/templates/nhom-uy-quyen/uq-toan-bo-nha-dat", payload, {
    responseType: "blob",
  });
};
