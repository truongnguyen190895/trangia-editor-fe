import axios from "axios";
import type {
  HDCNQuyenSDDatPayload,
  ToKhaiChungPayload,
} from "@/models/agreement-entity";

export const api = axios.create({
  baseURL: "https://tran-gia-be-0e12f8edbb33.herokuapp.com",
});

api.interceptors.request.use((config) => {
  config.headers["x-api-key"] = "d5be9ee46778dcaca57b709ba7bdb6ea";
  return config;
});

export const render_hdcn_quyen_sd_dat_toan_bo = async (
  payload: HDCNQuyenSDDatPayload
) => {
  return api.post("/templates/hdcn-quyen-su-dung-dat/render", payload, {
    responseType: "blob",
  });
};

export const render_to_khai_chung = async (payload: ToKhaiChungPayload) => {
  return api.post("/templates/to-khai-chung/render", payload, {
    responseType: "blob",
  });
};
