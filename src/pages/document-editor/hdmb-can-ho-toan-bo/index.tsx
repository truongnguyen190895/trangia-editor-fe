import { useState } from "react";
import { Box, Button, useTheme } from "@mui/material";
import { ThongTinCanHo } from "./components/thong-tin-can-ho";
import { CircularProgress } from "@mui/material";
import type {
  HDMBCanHoPayload,
  KhaiThueHDMBCanHoToanBoPayload,
} from "@/models/hdmb-can-ho";
import dayjs from "dayjs";
import {
  render_hdmb_can_ho,
  render_khai_thue_hdmb_can_ho_toan_bo,
  render_uy_quyen_toan_bo_can_ho,
} from "@/api";
import { extractAddress } from "@/utils/extract-address";
import { useHDMBCanHoContext } from "@/context/hdmb-can-ho";
import { useThemChuTheContext } from "@/context/them-chu-the";
import { translateDateToVietnamese } from "@/utils/date-to-words";
import { numberToVietnamese } from "@/utils/number-to-words";
import { ThemChuThe } from "@/components/common/them-chu-the";
import { ThemLoiChungDialog } from "@/components/common/them-loi-chung-dialog";
import type { MetaData } from "@/components/common/them-loi-chung-dialog";
import { PhieuThuLyButton } from "@/components/common/phieu-thu-ly-button";
import { extractCoupleFromParty } from "@/utils/common";

interface Props {
  isUyQuyen?: boolean;
  isMotPhan?: boolean;
  scope?: "partial" | "full";
}

export const HDMBCanHoToanBo = ({
  isUyQuyen,
  isMotPhan = false,
  scope = "full",
}: Props) => {
  const { agreementObject, canHo } = useHDMBCanHoContext();
  const { partyA, partyB } = useThemChuTheContext();
  const { palette } = useTheme();
  const [isGenerating, setIsGenerating] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  console.log(scope);
  console.log("mot phan", isMotPhan);

  const isFormValid = isUyQuyen
    ? Boolean(canHo)
    : (partyA["cá_nhân"].length > 0 || partyA["vợ_chồng"].length > 0) &&
      (partyB["cá_nhân"].length > 0 || partyB["vợ_chồng"].length > 0) &&
      agreementObject !== null &&
      canHo !== null;

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
            quan_hệ: person["quan_hệ"] || null,
            tình_trạng_hôn_nhân_vợ_chồng: null,
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
            quan_hệ: person["quan_hệ"] || null,
            tình_trạng_hôn_nhân_vợ_chồng: null,
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
      số_căn_hộ: canHo?.["số_căn_hộ"],
      tên_toà_nhà: canHo?.["tên_toà_nhà"],
      địa_chỉ_toà_nhà: canHo?.["địa_chỉ_toà_nhà"],
    };
  };

  const getPayload = (
    sốBảnGốc: number,
    isOutSide: boolean,
    côngChứngViên: string,
    ngày: string
  ): HDMBCanHoPayload => {
    if (isUyQuyen) {
      if (!canHo) {
        throw new Error("Can ho is null");
      }
    } else {
      if (!agreementObject || !canHo) {
        throw new Error("Agreement object or can ho is null");
      }
    }

    const payload: HDMBCanHoPayload = {
      ...getBenABenB(),
      số_căn_hộ: canHo["số_căn_hộ"],
      tên_toà_nhà: canHo["tên_toà_nhà"],
      địa_chỉ_hiển_thị: canHo["địa_chỉ_cũ"]
        ? `${canHo["địa_chỉ_cũ"]} (nay là ${canHo["địa_chỉ_toà_nhà"]})`
        : canHo["địa_chỉ_toà_nhà"],
      loại_gcn: canHo["loại_gcn"],
      số_gcn: canHo["số_gcn"],
      số_vào_sổ_cấp_gcn: canHo["số_vào_sổ_cấp_gcn"],
      nơi_cấp_gcn: canHo["nơi_cấp_gcn"],
      ngày_cấp_gcn: canHo["ngày_cấp_gcn"],
      diện_tích_sàn_bằng_số: canHo["diện_tích_sàn_bằng_số"],
      diện_tích_sàn_bằng_chữ: canHo["diện_tích_sàn_bằng_chữ"],
      diện_tích_sàn_một_phần_bằng_số: canHo["diện_tích_sàn_một_phần_bằng_số"],
      diện_tích_sàn_một_phần_bằng_chữ: canHo["diện_tích_sàn_một_phần_bằng_chữ"],
      cấp_hạng: canHo["cấp_hạng"],
      tầng_có_căn_hộ: canHo["tầng_có_căn_hộ"],
      kết_cấu: canHo["kết_cấu"],
      hình_thức_sở_hữu_căn_hộ: canHo["hình_thức_sở_hữu_căn_hộ"],
      năm_hoàn_thành_xây_dựng: canHo["năm_hoàn_thành_xây_dựng"],
      ghi_chú_căn_hộ: canHo["ghi_chú_căn_hộ"],
      giá_căn_hộ_bằng_số: canHo["giá_căn_hộ_bằng_số"],
      giá_căn_hộ_bằng_chữ: canHo["giá_căn_hộ_bằng_chữ"],
      số_thửa_đất: agreementObject?.["số_thửa_đất"] ?? "",
      số_tờ_bản_đồ: agreementObject?.["số_tờ_bản_đồ"] ?? "",
      diện_tích_đất_bằng_số: agreementObject?.["diện_tích_đất_bằng_số"] ?? "",
      diện_tích_đất_bằng_chữ: agreementObject?.["diện_tích_đất_bằng_chữ"] ?? "",
      hình_thức_sở_hữu_đất: agreementObject?.["hình_thức_sở_hữu_đất"] ?? "",
      mục_đích_sở_hữu_đất: agreementObject?.["mục_đích_sở_hữu_đất"] ?? "",
      thời_hạn_sử_dụng_đất: agreementObject?.["thời_hạn_sử_dụng_đất"] ?? "",
      nguồn_gốc_sử_dụng_đất: agreementObject?.["nguồn_gốc_sử_dụng_đất"] ?? "",
      ngày: ngày,
      ngày_bằng_chữ: translateDateToVietnamese(ngày),
      số_bản_gốc: sốBảnGốc < 10 ? "0" + String(sốBảnGốc) : String(sốBảnGốc),
      số_bản_gốc_bằng_chữ: numberToVietnamese(
        String(sốBảnGốc)
      )?.toLocaleLowerCase(),
      số_bản_công_chứng:
        sốBảnGốc - 1 < 10 ? "0" + String(sốBảnGốc - 1) : String(sốBảnGốc - 1),
      số_bản_công_chứng_bằng_chữ: numberToVietnamese(
        String(sốBảnGốc - 1)
      )?.toLocaleLowerCase(),
      ký_bên_ngoài: isOutSide,
      thời_hạn: canHo?.["thời_hạn"] ?? null,
      thời_hạn_bằng_chữ: canHo?.["thời_hạn_bằng_chữ"] ?? null,
      công_chứng_viên: côngChứngViên,
    };

    return payload;
  };

  const handleGenerateDocument = (metaData: MetaData) => {
    const payload = getPayload(
      metaData.sốBảnGốc,
      metaData.isOutSide,
      metaData.côngChứngViên,
      metaData.ngày
    );
    setOpenDialog(false);
    setIsGenerating(true);
    if (isUyQuyen) {
      render_uy_quyen_toan_bo_can_ho(payload)
        .then((res) => {
          const blob = new Blob([res.data], {
            type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          });

          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = "HD uỷ quyền toàn bộ căn hộ.docx";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        })
        .catch((error) => {
          console.error("Error generating document:", error);
          window.alert("Lỗi khi tạo hợp đồng");
        })
        .finally(() => {
          setIsGenerating(false);
        });
    } else {
      render_hdmb_can_ho(payload, { isMotPhan, scope })
        .then((res) => {
          const blob = new Blob([res.data], {
            type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          });

          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `Hợp đồng mua bán căn hộ - ${payload["bên_A"]["cá_thể"][0]["tên"]} - ${payload["bên_B"]["cá_thể"][0]["tên"]}.docx`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        })
        .catch((error) => {
          console.error("Error generating document:", error);
          window.alert("Lỗi khi tạo hợp đồng");
        })
        .finally(() => {
          setIsGenerating(false);
        });
    }
  };

  const getPayloadKhaiThue = (): KhaiThueHDMBCanHoToanBoPayload => {
    if (!agreementObject || !canHo) {
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

    const payload: KhaiThueHDMBCanHoToanBoPayload = {
      bên_A: {
        cá_thể: các_cá_thể_bên_A,
      },
      bên_B: {
        cá_thể: các_cá_thể_bên_B,
      },
      bảng_tncn_bên_A: các_cá_thể_bên_A.map((person, index) => ({
        stt: index + 1,
        tên: person["tên"],
        số_giấy_tờ: person["số_giấy_tờ"],
      })),
      bảng_trước_bạ_bên_B: các_cá_thể_bên_B.map((person, index) => ({
        stt: index + 1,
        tên: person["tên"],
        số_giấy_tờ: person["số_giấy_tờ"],
      })),
      bảng_bên_A: các_cá_thể_bên_A.map((person, index) => ({
        stt: index + 1,
        tên: person["tên"],
      })),
      tables: ["bảng_bên_A", "bảng_tncn_bên_A", "bảng_trước_bạ_bên_B"],
      số_thửa_đất: agreementObject["số_thửa_đất"],
      số_tờ_bản_đồ: agreementObject["số_tờ_bản_đồ"] || "",
      loại_giấy_tờ: canHo["loại_gcn"],
      số_giấy_chứng_nhận: canHo["số_gcn"],
      ngày_cấp_giấy_chứng_nhận: canHo["ngày_cấp_gcn"],
      nơi_cấp_giấy_chứng_nhận: canHo["nơi_cấp_gcn"],
      đặc_điểm_thửa_đất: {
        diện_tích: {
          số: canHo["diện_tích_sàn_bằng_số"],
        },
        mục_đích_và_thời_hạn_sử_dụng: [],
        nguồn_gốc_sử_dụng: agreementObject["nguồn_gốc_sử_dụng_đất"],
      },
      số_tiền: canHo["giá_căn_hộ_bằng_số"],
      ngày_lập_hợp_đồng: dayjs().format("DD/MM/YYYY").toString(),
      ngày_chứng_thực: dayjs().format("DD/MM/YYYY").toString(),
      diện_tích_sàn_bằng_số: canHo["diện_tích_sàn_bằng_số"],
      kết_cấu: canHo["kết_cấu"],
      tầng_có_căn_hộ: canHo["tầng_có_căn_hộ"],
      năm_hoàn_thành_xây_dựng: canHo["năm_hoàn_thành_xây_dựng"],
      cấp_hạng: canHo["cấp_hạng"],
      ...extractAddress(canHo["địa_chỉ_toà_nhà"]),
    };

    return payload;
  };

  const handleGenerateKhaiThue = () => {
    const payload = getPayloadKhaiThue();

    setOpenDialog(false);
    setIsGenerating(true);
    render_khai_thue_hdmb_can_ho_toan_bo(payload)
      .then((res) => {
        const blob = new Blob([res.data], {
          type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "to-khai-chung.docx";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("Error generating document:", error);
        window.alert("Lỗi khi tạo hợp đồng");
      })
      .finally(() => {
        setIsGenerating(false);
      });
  };

  const getPhieuThuLyType = () => {
    return isMotPhan
      ? "hdmb-can-ho-mot-phan-so-huu-toan-bo"
      : "hdmb-can-ho-toan-bo";
  };

  return (
    <Box display="flex" gap="2rem">
      <Box
        className="full-land-transfer"
        display="flex"
        gap="4rem"
        flexDirection="column"
        border="1px solid #BCCCDC"
        borderRadius="5px"
        padding="1rem"
        flex={4}
      >
        <ThemChuThe title="Bên A" side="partyA" />
        <ThemChuThe title="Bên B" side="partyB" />
        <ThongTinCanHo
          title="Đối tượng của hợp đồng"
          isUyQuyen={isUyQuyen}
          isMotPhan={isMotPhan}
        />
        <Box display="flex" gap="1rem">
          <Button
            variant="contained"
            sx={{
              backgroundColor: palette.softTeal,
              height: "50px",
              fontSize: "1.2rem",
              fontWeight: "600",
              textTransform: "uppercase",
              width: "350px",
            }}
            disabled={!isFormValid}
            onClick={() => setOpenDialog(true)}
          >
            {isUyQuyen ? "Tạo hợp đồng uỷ quyền" : "Tạo hợp đồng"}
          </Button>
          {!isUyQuyen ? (
            <Button
              variant="contained"
              sx={{
                backgroundColor: palette.softTeal,
                height: "50px",
                fontSize: "1.2rem",
                fontWeight: "600",
                textTransform: "uppercase",
                width: "200px",
              }}
              disabled={!isFormValid}
              onClick={handleGenerateKhaiThue}
            >
              {isGenerating ? <CircularProgress size={20} /> : "Khai thuế"}
            </Button>
          ) : null}
          <PhieuThuLyButton
            commonPayload={
              agreementObject
                ? { ...getBenABenB(), ...getAdditionalForThuLy() }
                : null
            }
            type={getPhieuThuLyType()}
          />
        </Box>
      </Box>
      <ThemLoiChungDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        handleGenerateDocument={handleGenerateDocument}
      />
    </Box>
  );
};
