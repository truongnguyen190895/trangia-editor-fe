import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Box, Button } from "@mui/material";
import { ThongTinDat } from "./components/thong-tin-dat";
import { CircularProgress } from "@mui/material";
import { SectionNav } from "@/components/common/section-nav";
import { StickyActionBar } from "@/components/common/sticky-action-bar";
import { useHdcnQuyenSdDatContext } from "@/context/hdcn-quyen-sd-dat-context";
import { useThemChuTheContext } from "@/context/them-chu-the";
import type {
  HDCNQuyenSDDatPayload,
  SampleToKhaiChungPayload,
} from "@/models/agreement-entity";
import dayjs from "dayjs";
import {
  render_hdcn_quyen_sd_dat_toan_bo,
  render_hdtc_dat_toan_bo,
  render_hdcn_quyen_sd_dat_mot_phan,
  render_hdtc_dat_mot_phan,
  render_hdtc_mot_phan_dat_co_cong_van,
} from "@/api";
import { translateDateToVietnamese } from "@/utils/date-to-words";
import { numberToVietnamese } from "@/utils/number-to-words";
import { extractAddress } from "@/utils/extract-address";
import {
  extractCoupleFromParty,
  generateThoiHanSuDung,
  createDownloadLink,
  hasPartyMembers,
} from "@/utils/common";
import { ThemChuThe } from "@/components/common/them-chu-the";
import { ThemLoiChungDialog } from "@/components/common/them-loi-chung-dialog";
import type { MetaData } from "@/components/common/them-loi-chung-dialog";
import { PhieuThuLyButton } from "@/components/common/phieu-thu-ly-button";
import { KhaiThueButton } from "@/components/common/khai-thue-button";
import { uchiTemporarySave } from "@/api/uchi";
import { toast } from "react-toastify";
import { getWorkHistoryById } from "@/api/contract";
import type { ThongTinThuaDat } from "@/models/agreement-object";
import { ThemGiayUQButton } from "@components/common/them-giay-uq-btn";

interface Props {
  isNongNghiep?: boolean;
  isTangCho?: boolean;
  templateName?: string;
  isMotPhan?: boolean;
  isCoCongVan?: boolean;
  scope?: "partial" | "full";
}

export const ChuyenNhuongDatToanBo = ({
  isNongNghiep = false,
  isTangCho = false,
  templateName,
  isMotPhan = false,
  isCoCongVan = false,
  scope = "full",
}: Props) => {
  const { agreementObject, addAgreementObject } = useHdcnQuyenSdDatContext();
  const { partyA, partyB } = useThemChuTheContext();
  const [isGenerating, setIsGenerating] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get("templateId");
  const id = searchParams.get("id");

  useEffect(() => {
    if (id) {
      getWorkHistoryById(id).then((res) => {
        const originalPayload = res.content.original_payload;
        if (originalPayload) {
          addAgreementObject(
            originalPayload?.agreementObject as ThongTinThuaDat,
          );
        }
      });
    }
  }, [id]);

  const userInfo = localStorage.getItem("user_info");
  const userInfoObject = userInfo ? JSON.parse(userInfo) : null;
  const uchiId = userInfoObject?.uchi_id;

  const getBenABenB = () => {
    const couplesA = extractCoupleFromParty(partyA);
    const couplesB = extractCoupleFromParty(partyB);

    return {
      bên_A: {
        cá_thể: [
          ...partyA["cá_nhân"].map((person) => ({
            ...person,
            ngày_sinh: person["ngày_sinh"],
            ngày_cấp: person["ngày_cấp"],
            tình_trạng_hôn_nhân: person["tình_trạng_hôn_nhân"] || null,
            tình_trạng_hôn_nhân_vợ_chồng: null,
            quan_hệ: person["quan_hệ"] || null,
            ...extractAddress(person["địa_chỉ_thường_trú"]),
          })),
          ...couplesA,
        ],
      },
      bên_B: {
        cá_thể: [
          ...partyB["cá_nhân"].map((person) => ({
            ...person,
            ngày_sinh: person["ngày_sinh"],
            ngày_cấp: person["ngày_cấp"],
            tình_trạng_hôn_nhân: person["tình_trạng_hôn_nhân"] || null,
            tình_trạng_hôn_nhân_vợ_chồng: null,
            quan_hệ: person["quan_hệ"] || null,
            ...extractAddress(person["địa_chỉ_thường_trú"]),
          })),
          ...couplesB,
        ],
      },
    };
  };

  const getAdditionalForThuLy = () => {
    if (!agreementObject) {
      return null;
    }

    return {
      số_thửa_đất: agreementObject?.["số_thửa_đất"],
      số_tờ_bản_đồ: agreementObject?.["số_tờ_bản_đồ"],
      địa_chỉ_hiển_thị: agreementObject?.["địa_chỉ_cũ"]
        ? `${agreementObject?.["địa_chỉ_cũ"]} (nay là ${agreementObject?.["địa_chỉ_mới"]})`
        : agreementObject?.["địa_chỉ_mới"],
    };
  };

  const getPayload = (
    sốBảnGốc: number,
    isOutSide: boolean,
    côngChứngViên: string,
    isUchi: boolean,
    ngày: string,
    sốHợpĐồng?: string,
    notaryId?: number,
  ): HDCNQuyenSDDatPayload => {
    if (!agreementObject) {
      throw new Error("Agreement object is null");
    }

    const payload: HDCNQuyenSDDatPayload = {
      ...getBenABenB(),
      số_thửa_đất: agreementObject["số_thửa_đất"],
      số_tờ_bản_đồ: agreementObject["số_tờ_bản_đồ"],
      địa_chỉ_cũ: agreementObject["địa_chỉ_cũ"],
      địa_chỉ_hiển_thị: agreementObject["địa_chỉ_cũ"]
        ? `${agreementObject["địa_chỉ_cũ"]} (nay là ${agreementObject["địa_chỉ_mới"]})`
        : agreementObject["địa_chỉ_mới"],
      địa_chỉ_mới: agreementObject["địa_chỉ_mới"],
      loại_giấy_chứng_nhận: agreementObject["loại_giấy_chứng_nhận"],
      số_giấy_chứng_nhận: agreementObject["số_giấy_chứng_nhận"],
      số_vào_sổ_cấp_giấy_chứng_nhận:
        agreementObject["số_vào_sổ_cấp_giấy_chứng_nhận"],
      ngày_cấp_giấy_chứng_nhận: agreementObject["ngày_cấp_giấy_chứng_nhận"],
      nơi_cấp_giấy_chứng_nhận: agreementObject["nơi_cấp_giấy_chứng_nhận"],
      đặc_điểm_thửa_đất: {
        diện_tích: {
          số: agreementObject["diện_tích"],
          chữ: agreementObject["diện_tích_bằng_chữ"],
        },
        hình_thức_sử_dụng: agreementObject["hình_thức_sử_dụng"],
        mục_đích_và_thời_hạn_sử_dụng: agreementObject[
          "mục_đích_và_thời_hạn_sử_dụng"
        ]?.map((item) => ({
          phân_loại: item["phân_loại"],
          diện_tích: item["diện_tích"] || null,
          thời_hạn_sử_dụng: item["thời_hạn_sử_dụng"],
        })),
        thời_hạn: generateThoiHanSuDung(
          agreementObject["mục_đích_và_thời_hạn_sử_dụng"],
        )?.trim(),
        nguồn_gốc_sử_dụng: agreementObject["nguồn_gốc_sử_dụng"],
        ghi_chú: agreementObject["ghi_chú"],
      },
      đặc_điểm_một_phần_thửa_đất: {
        diện_tích: {
          số: agreementObject["một_phần_diện_tích"] ?? "",
          chữ: agreementObject["một_phần_diện_tích_bằng_chữ"] ?? "",
        },
        mục_đích_và_thời_hạn_sử_dụng: agreementObject[
          "mục_đích_và_thời_hạn_sử_dụng_một_phần"
        ]?.map((item) => ({
          phân_loại: item["phân_loại"],
          diện_tích: item["diện_tích"] || null,
          thời_hạn_sử_dụng: item["thời_hạn_sử_dụng"],
        })),
      },
      số_tiền: agreementObject["giá_tiền"],
      số_tiền_bằng_chữ: agreementObject["giá_tiền_bằng_chữ"],
      // The "có công văn" template reads the partial-area data from top-level keys
      // (the land plot itself is filled via Word FORMTEXT fields, not placeholders),
      // unlike the đặc_điểm_một_phần_thửa_đất nesting used by the other mot-phan templates.
      ...(isCoCongVan
        ? {
            một_phần_diện_tích: agreementObject["một_phần_diện_tích"] ?? "",
            một_phần_diện_tích_bằng_chữ:
              agreementObject["một_phần_diện_tích_bằng_chữ"] ?? "",
            mục_đích_và_thời_hạn_sử_dụng: agreementObject[
              "mục_đích_và_thời_hạn_sử_dụng_một_phần"
            ]?.map((item) => ({
              phân_loại: item["phân_loại"],
              diện_tích: item["diện_tích"] || null,
              thời_hạn_sử_dụng: item["thời_hạn_sử_dụng"],
            })),
            // ĐIỀU 1 mục 1 — các chi tiết công-văn đặc thù (placeholder điền tự động)
            số_quyết_định: agreementObject["số_quyết_định"] ?? "",
            nơi_đăng_ký_chuyển_mục_đích:
              agreementObject["nơi_đăng_ký_chuyển_mục_đích"] ?? "",
            ngày_đăng_ký_chuyển_mục_đích:
              agreementObject["ngày_đăng_ký_chuyển_mục_đích"] ?? "",
            giới_hạn_các_điểm: agreementObject["giới_hạn_các_điểm"] ?? "",
            loại_sơ_đồ: agreementObject["loại_sơ_đồ"] ?? "",
            số_sơ_đồ: agreementObject["số_sơ_đồ"] ?? "",
            đơn_vị_lập_sơ_đồ: agreementObject["đơn_vị_lập_sơ_đồ"] ?? "",
            ngày_lập_sơ_đồ: agreementObject["ngày_lập_sơ_đồ"] ?? "",
            số_công_văn: agreementObject["số_công_văn"] ?? "",
            cơ_quan_công_văn: agreementObject["cơ_quan_công_văn"] ?? "",
            ngày_lập_công_văn: agreementObject["ngày_lập_công_văn"] ?? "",
          }
        : {}),
      ngày: ngày,
      ngày_bằng_chữ: translateDateToVietnamese(ngày),
      số_bản_gốc: sốBảnGốc < 10 ? "0" + String(sốBảnGốc) : String(sốBảnGốc),
      số_bản_gốc_bằng_chữ: numberToVietnamese(
        String(sốBảnGốc),
      )?.toLocaleLowerCase(),
      số_bản_công_chứng:
        sốBảnGốc - 1 < 10 ? "0" + String(sốBảnGốc - 1) : String(sốBảnGốc - 1),
      số_bản_công_chứng_bằng_chữ: numberToVietnamese(
        String(sốBảnGốc - 1),
      )?.toLocaleLowerCase(),
      ký_bên_ngoài: isOutSide,
      công_chứng_viên: côngChứngViên,
      template_id: templateId ? templateId : undefined,
      số_hợp_đồng: sốHợpĐồng || undefined,
      isUchi: isUchi,
      uchi_id: uchiId ? String(uchiId) : "",
      notary_id: notaryId ? String(notaryId) : "13",
      template_name: templateName,
      original_payload: {
        partyA: partyA,
        partyB: partyB,
        agreementObject: agreementObject,
      },
      id: id ? id : undefined,
    };

    return payload;
  };

  const handleGenerateDocument = (metaData: MetaData) => {
    const payload = getPayload(
      metaData.sốBảnGốc,
      metaData.isOutSide,
      metaData.côngChứngViên,
      metaData.isUchi,
      metaData.ngày,
      metaData.sốHợpĐồng,
      metaData.notaryId,
    );
    setOpenDialog(false);
    setIsGenerating(true);
    if (isTangCho) {
      // Tặng cho
      if (isMotPhan) {
        const renderMotPhan = isCoCongVan
          ? render_hdtc_mot_phan_dat_co_cong_van(payload)
          : render_hdtc_dat_mot_phan(payload, isNongNghiep, scope);
        renderMotPhan
          .then((res) => {
            createDownloadLink(
              res.data,
              `HDTC đất ${isNongNghiep ? "nông nghiệp" : ""} một phần${
                isCoCongVan ? " (có công văn)" : ""
              } - ${payload["bên_A"]["cá_thể"][0]["tên"]} - ${
                payload["bên_B"]["cá_thể"][0]["tên"]
              }`,
            );
          })
          .catch((error) => {
            console.error("Error generating document:", error);
            window.alert("Lỗi khi tạo hợp đồng");
          })
          .finally(() => {
            setIsGenerating(false);
          });
      } else {
        render_hdtc_dat_toan_bo(payload, isNongNghiep)
          .then((res) => {
            createDownloadLink(
              res.data,
              `HDTC đất ${isNongNghiep ? "nông nghiệp" : ""} toàn bộ - ${
                payload["bên_A"]["cá_thể"][0]["tên"]
              } - ${payload["bên_B"]["cá_thể"][0]["tên"]}`,
            );
            if (metaData.isUchi && templateId && Number(templateId) > 0) {
              uchiTemporarySave(payload)
                .then(() =>
                  toast.success("Hợp đồng đã được lưu tạm trong Uchi", {
                    position: "top-left",
                  }),
                )
                .catch((error) => {
                  toast.error(
                    "Lỗi khi gửi thông tin lên Uchi " +
                      error?.response?.data?.message,
                  );
                });
            }
          })
          .catch((error) => {
            console.error("Error generating document:", error);
            window.alert("Lỗi khi tạo hợp đồng");
          })
          .finally(() => {
            setIsGenerating(false);
          });
      }
    } else {
      // Chuyển nhượng
      if (isMotPhan) {
        render_hdcn_quyen_sd_dat_mot_phan(payload, scope)
          .then((res) => {
            createDownloadLink(
              res.data,
              `Hợp đồng chuyển nhượng - ${payload["bên_A"]["cá_thể"][0]["tên"]} - ${payload["bên_B"]["cá_thể"][0]["tên"]}`,
            );
            if (metaData.isUchi && templateId && Number(templateId) > 0) {
              uchiTemporarySave(payload)
                .then(() =>
                  toast.success("Hợp đồng đã được lưu tạm trong Uchi", {
                    position: "top-left",
                  }),
                )
                .catch((error) => {
                  toast.error(
                    "Lỗi khi gửi thông tin lên Uchi " +
                      error?.response?.data?.message,
                  );
                });
            }
          })
          .catch((error) => {
            console.error("Error generating document:", error);
            window.alert("Lỗi khi tạo hợp đồng");
          })
          .finally(() => {
            setIsGenerating(false);
          });
      } else {
        render_hdcn_quyen_sd_dat_toan_bo(payload, isNongNghiep)
          .then((res) => {
            createDownloadLink(
              res.data,
              `Hợp đồng chuyển nhượng - ${payload["bên_A"]["cá_thể"][0]["tên"]} - ${payload["bên_B"]["cá_thể"][0]["tên"]}`,
            );
            if (metaData.isUchi && templateId && Number(templateId) > 0) {
              uchiTemporarySave(payload)
                .then(() =>
                  toast.success("Hợp đồng đã được lưu tạm trong Uchi", {
                    position: "top-left",
                  }),
                )
                .catch((error) => {
                  toast.error(
                    "Lỗi khi gửi thông tin lên Uchi " +
                      error?.response?.data?.message,
                  );
                });
            }
          })
          .catch((error) => {
            toast.error(
              "Lỗi khi tạo hợp đồng " + error?.response?.data?.message,
            );
          })
          .finally(() => {
            setIsGenerating(false);
          });
      }
    }
  };

  const getPayloadToKhaiChung = (): SampleToKhaiChungPayload => {
    if (!agreementObject) {
      throw new Error("Agreement object is null");
    }

    const couplesA = extractCoupleFromParty(partyA, true);
    const couplesB = extractCoupleFromParty(partyB, true);

    const các_cá_thể_bên_A = [
      ...partyA["cá_nhân"].map((person) => ({
        ...person,
        ngày_sinh: person["ngày_sinh"],
        ngày_cấp: person["ngày_cấp"],
        tình_trạng_hôn_nhân: person["tình_trạng_hôn_nhân"] || null,
        ...extractAddress(person["địa_chỉ_thường_trú"]),
      })),
      ...couplesA,
    ];
    const các_cá_thể_bên_B = [
      ...partyB["cá_nhân"].map((person) => ({
        ...person,
        ngày_sinh: person["ngày_sinh"],
        ngày_cấp: person["ngày_cấp"],
        tình_trạng_hôn_nhân: person["tình_trạng_hôn_nhân"] || null,
        ...extractAddress(person["địa_chỉ_thường_trú"]),
      })),
      ...couplesB,
    ];

    const tỉ_lệ_bên_A = (100 / các_cá_thể_bên_A.length).toFixed(0) + "%";
    const tỉ_lệ_bên_B = (100 / các_cá_thể_bên_B.length).toFixed(0) + "%";

    const payload: SampleToKhaiChungPayload = {
      bên_A: {
        cá_thể: các_cá_thể_bên_A.map((person) => ({
          ...person,
          tỉ_lệ: tỉ_lệ_bên_A,
        })),
      },
      bên_B: {
        cá_thể: các_cá_thể_bên_B.map((person) => ({
          ...person,
          tỉ_lệ: tỉ_lệ_bên_B,
        })),
      },
      bảng_tncn_bên_A: các_cá_thể_bên_A.map((person, index) => ({
        stt: index + 1,
        tên: person["tên"],
        số_giấy_tờ: person["số_giấy_tờ"],
        tỉ_lệ: tỉ_lệ_bên_A,
      })),
      bảng_trước_bạ_bên_B: các_cá_thể_bên_B.map((person, index) => ({
        stt: index + 1,
        tên: person["tên"],
        số_giấy_tờ: person["số_giấy_tờ"],
        ngày_sinh: person["ngày_sinh"],
        tỉ_lệ: tỉ_lệ_bên_B,
      })),
      bảng_bên_A: các_cá_thể_bên_A.map((person, index) => ({
        stt: index + 1,
        tên: person["tên"],
      })),
      tables: ["bảng_bên_A", "bảng_tncn_bên_A", "bảng_trước_bạ_bên_B"],
      số_thửa_đất: agreementObject["số_thửa_đất"],
      số_tờ_bản_đồ: agreementObject["số_tờ_bản_đồ"],
      loại_giấy_tờ: agreementObject["loại_giấy_chứng_nhận"],
      số_giấy_chứng_nhận: agreementObject["số_giấy_chứng_nhận"],
      ngày_cấp_giấy_chứng_nhận: agreementObject["ngày_cấp_giấy_chứng_nhận"],
      nơi_cấp_giấy_chứng_nhận: agreementObject["nơi_cấp_giấy_chứng_nhận"],
      đặc_điểm_thửa_đất: {
        diện_tích: {
          số: isMotPhan
            ? (agreementObject["một_phần_diện_tích"] ?? "")
            : agreementObject["diện_tích"],
        },
        diện_tích_phi_nông_nghiệp: agreementObject["diện_tích_phi_nông_nghiệp"],
        mục_đích_và_thời_hạn_sử_dụng: isMotPhan
          ? agreementObject["mục_đích_và_thời_hạn_sử_dụng_một_phần"]?.map(
              (item) => ({
                phân_loại: item["phân_loại"],
                diện_tích: item["diện_tích"] || agreementObject["diện_tích"],
              }),
            )
          : agreementObject["mục_đích_và_thời_hạn_sử_dụng"]?.map((item) => ({
              phân_loại: item["phân_loại"],
              diện_tích: item["diện_tích"] || agreementObject["diện_tích"],
            })),
        nguồn_gốc_sử_dụng: agreementObject["nguồn_gốc_sử_dụng"],
        hình_thức_sử_dụng: agreementObject["hình_thức_sử_dụng"],
        thời_hạn: generateThoiHanSuDung(
          agreementObject["mục_đích_và_thời_hạn_sử_dụng"],
        )?.trim(),
      },
      số_tiền: agreementObject["giá_tiền"],
      ngày_lập_hợp_đồng: dayjs().format("DD/MM/YYYY").toString(),
      ngày_chứng_thực: dayjs().format("DD/MM/YYYY").toString(),
      // Mẫu Ứng Hoà in ngày ký dạng "ngày … tháng … năm …" nên cần từng phần riêng
      ngày_tạo_hđ: dayjs().format("DD").toString(),
      tháng_tạo_hđ: dayjs().format("MM").toString(),
      năm_tạo_hđ: dayjs().format("YYYY").toString(),
      địa_chỉ_hiển_thị: agreementObject["địa_chỉ_cũ"]
        ? `${agreementObject["địa_chỉ_cũ"]} (nay là ${agreementObject["địa_chỉ_mới"]})`
        : agreementObject["địa_chỉ_mới"],
      ...extractAddress(agreementObject["địa_chỉ_mới"]),
    };

    return payload;
  };

  const generateThuLyType = () => {
    if (isCoCongVan) {
      return "hd-tang-cho-mot-phan-dat-co-cong-van";
    }
    if (isTangCho) {
      if (isMotPhan) {
        if (isNongNghiep) {
          return "hd-tang-cho-dat-nong-nghiep-mot-phan-de-dong-su-dung";
        } else {
          return "hd-tang-cho-dat-mot-phan-de-dong-su-dung";
        }
      } else {
        if (isNongNghiep) {
          return "hd-tang-cho-dat-nong-nghiep-toan-bo";
        } else {
          return "hd-tang-cho-dat-toan-bo";
        }
      }
    } else {
      if (isMotPhan) {
        if (isNongNghiep) {
          return "hdcn-quyen-su-dung-dat-nong-nghiep-mot-phan-de-dong-su-dung";
        } else {
          return "hdcn-quyen-su-dung-dat-mot-phan-de-dong-su-dung";
        }
      } else {
        if (isNongNghiep) {
          return "hdcn-quyen-su-dung-dat-nong-nghiep-toan-bo";
        } else {
          return "hdcn-quyen-su-dung-dat-toan-bo";
        }
      }
    }
  };

  // Path of the source contract template being edited, mirroring the render_* selection
  // above. Used so the giấy uỷ quyền can read the exact contract name from its lời chứng.
  const getContractTemplatePath = () => {
    const nn = isNongNghiep ? "-nong-nghiep" : "";
    if (isCoCongVan) {
      return "nhom-tang-cho/hd-tang-cho-mot-phan-dat-co-cong-van";
    }
    if (isTangCho) {
      if (isMotPhan) {
        return scope === "partial"
          ? `nhom-tang-cho/hd-tang-cho-dat${nn}-mot-phan-de-dong-su-dung`
          : `nhom-tang-cho/hd-tang-cho-dat${nn}-mot-phan-de-su-dung-toan-bo`;
      }
      return `nhom-tang-cho/hd-tang-cho-dat${nn}-toan-bo`;
    }
    if (isMotPhan) {
      return scope === "partial"
        ? "nhom-chuyen-nhuong-mua-ban/hdcn-quyen-su-dung-dat-mot-phan-de-dong-su-dung"
        : "nhom-chuyen-nhuong-mua-ban/hdcn-quyen-su-dung-dat-mot-phan-de-su-dung-toan-bo";
    }
    return `nhom-chuyen-nhuong-mua-ban/hdcn-quyen-su-dung-dat${nn}-toan-bo`;
  };

  const hasPartyA = hasPartyMembers(partyA);
  const hasPartyB = hasPartyMembers(partyB);
  const missingParts = [
    !hasPartyA && "Bên A",
    !hasPartyB && "Bên B",
    !agreementObject && "thông tin thửa đất",
  ].filter(Boolean);
  const isFormValid = missingParts.length === 0;

  return (
    <Box display="flex" gap="1.5rem" alignItems="flex-start">
      <SectionNav
        sections={[
          { id: "section-ben-a", label: "Bên A", complete: hasPartyA },
          { id: "section-ben-b", label: "Bên B", complete: hasPartyB },
          {
            id: "section-thua-dat",
            label: "Thửa đất",
            complete: Boolean(agreementObject),
          },
        ]}
      />
      <Box
        className="full-land-transfer"
        display="flex"
        gap="1.5rem"
        flexDirection="column"
        flex={1}
        minWidth={0}
      >
        <ThemChuThe id="section-ben-a" numeral="I" title="Bên A" side="partyA" />
        <ThemChuThe id="section-ben-b" numeral="II" title="Bên B" side="partyB" />
        <ThongTinDat
          id="section-thua-dat"
          numeral="III"
          title="Đối tượng chuyển nhượng của hợp đồng"
          isTangCho={isTangCho}
          isMotPhan={isMotPhan}
          isCoCongVan={isCoCongVan}
        />
        <StickyActionBar missingParts={missingParts}>
          <PhieuThuLyButton
            commonPayload={
              agreementObject
                ? { ...getBenABenB(), ...getAdditionalForThuLy() }
                : null
            }
            type={generateThuLyType()}
          />
          <ThemGiayUQButton contractTemplatePath={getContractTemplatePath()} />
          <KhaiThueButton
            loại={isTangCho ? "tang-cho" : "chuyen-nhuong"}
            getPayload={getPayloadToKhaiChung}
            disabled={!isFormValid || isGenerating}
          />
          <Button
            variant="contained"
            disabled={!isFormValid || isGenerating}
            onClick={() => setOpenDialog(true)}
            startIcon={
              isGenerating ? (
                <CircularProgress size={16} color="inherit" />
              ) : undefined
            }
          >
            Tạo hợp đồng
          </Button>
        </StickyActionBar>
      </Box>
      {openDialog ? (
        <ThemLoiChungDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          handleGenerateDocument={handleGenerateDocument}
        />
      ) : null}
    </Box>
  );
};
