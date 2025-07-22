import axios from "axios";
import type {
  HDCNQuyenSDDatPayload,
  SampleToKhaiChungPayload,
} from "@/models/agreement-entity";
import type { HDMBCanHoPayload } from "@/models/hdmb-can-ho";
import type { HDMBNhaDatPayload } from "@/models/hdmb-nha-dat";

export const api = axios.create({
  baseURL: "https://tran-gia-be-0e12f8edbb33.herokuapp.com",
    // baseURL: "http://localhost:8080",
});

api.interceptors.request.use((config) => {
  config.headers["x-api-key"] = "d5be9ee46778dcaca57b709ba7bdb6ea";
  return config;
});

export const render_hdcn_quyen_sd_dat_toan_bo = async (
  payload: HDCNQuyenSDDatPayload
) => {
  return api.post(
    "/templates/nhom-chuyen-nhuong-mua-ban/hdcn-quyen-su-dung-dat-toan-bo",
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

export const render_hdmb_nha_dat = async (payload: HDMBNhaDatPayload) => {
    return api.post(
      "/templates/nhom-chuyen-nhuong-mua-ban/hdmb-nha-dat-toan-bo",
      payload,
      {
        responseType: "blob",
      }
    );
  };

export const render_to_khai_chung = async (
  payload: SampleToKhaiChungPayload
) => {
  return api.post("/templates/to-khai-chung", payload, {
    responseType: "blob",
  });
};
