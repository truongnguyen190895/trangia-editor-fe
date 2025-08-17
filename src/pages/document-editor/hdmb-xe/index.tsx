import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  useTheme,
} from "@mui/material";
import { ObjectEntity } from "./components/object";
import SearchIcon from "@mui/icons-material/Search";
import { CircularProgress } from "@mui/material";
import type { HDMBXeOtoPayload } from "@/models/hdmb-xe";
import { render_hdmb_xe_oto, render_uy_quyen_toan_bo_xe_oto } from "@/api";
import { translateDateToVietnamese } from "@/utils/date-to-words";
import { numberToVietnamese } from "@/utils/number-to-words";
import { useHDMBXeContext } from "@/context/hdmb-xe";
import { ThemChuThe } from "@/components/common/them-chu-the";
import { ThemLoiChungDialog } from "@/components/common/them-loi-chung-dialog";
import type { MetaData } from "@/components/common/them-loi-chung-dialog";
import { useThemChuTheContext } from "@/context/them-chu-the";
import { PhieuThuLyButton } from "@/components/common/phieu-thu-ly-button";

interface HDMBXeProps {
  isXeMay?: boolean;
  isDauGia?: boolean;
  isUyQuyen?: boolean;
}

export const HDMBXe = ({
  isXeMay = false,
  isDauGia = false,
  isUyQuyen = false,
}: HDMBXeProps) => {
  const { agreementObject } = useHDMBXeContext();
  const { partyA, partyB } = useThemChuTheContext();
  const { palette } = useTheme();
  const [isGenerating, setIsGenerating] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const isFormValid =
    (partyA["cá_nhân"].length > 0 || partyA["vợ_chồng"].length > 0) &&
    (partyB["cá_nhân"].length > 0 || partyB["vợ_chồng"].length > 0) &&
    agreementObject !== null;

  const getBenABenB = () => {
    const couplesA = partyA["vợ_chồng"]
      .map((couple) => ({
        ...couple.chồng,
        ngày_sinh: couple.chồng["ngày_sinh"],
        ngày_cấp: couple.chồng["ngày_cấp"],
        tình_trạng_hôn_nhân: null,
        tình_trạng_hôn_nhân_vợ_chồng:
          couple.chồng["tình_trạng_hôn_nhân_vợ_chồng"],
      }))
      .concat(
        partyA["vợ_chồng"].map((couple) => ({
          ...couple.vợ,
          quan_hệ: "vợ",
          ngày_sinh: couple.vợ["ngày_sinh"],
          ngày_cấp: couple.vợ["ngày_cấp"],
          tình_trạng_hôn_nhân: null,
          tình_trạng_hôn_nhân_vợ_chồng:
            couple.vợ["tình_trạng_hôn_nhân_vợ_chồng"],
        }))
      );
    const couplesB = partyB["vợ_chồng"]
      .map((couple) => ({
        ...couple.chồng,
        ngày_sinh: couple.chồng["ngày_sinh"],
        ngày_cấp: couple.chồng["ngày_cấp"],
        tình_trạng_hôn_nhân: null,
        tình_trạng_hôn_nhân_vợ_chồng:
          couple.chồng["tình_trạng_hôn_nhân_vợ_chồng"],
      }))
      .concat(
        partyB["vợ_chồng"].map((couple) => ({
          ...couple.vợ,
          quan_hệ: "vợ",
          ngày_sinh: couple.vợ["ngày_sinh"],
          ngày_cấp: couple.vợ["ngày_cấp"],
          tình_trạng_hôn_nhân: null,
          tình_trạng_hôn_nhân_vợ_chồng:
            couple.vợ["tình_trạng_hôn_nhân_vợ_chồng"],
        }))
      );

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
      nhãn_hiệu: agreementObject?.["nhãn_hiệu"] ?? "",
      màu_sơn: agreementObject?.["màu_sơn"] ?? "",
      loại_xe: agreementObject?.["loại_xe"] ?? "",
      số_máy: agreementObject?.["số_máy"] ?? "",
      số_khung: agreementObject?.["số_khung"] ?? "",
      biển_số: agreementObject?.["biển_số"] ?? "",
      số_loại: agreementObject?.["số_loại"] ?? "",
      số_đăng_ký: agreementObject?.["số_đăng_ký"] ?? "",
    };
  };

  const getPayload = (
    sốBảnGốc: number,
    isOutSide: boolean,
    côngChứngViên: string,
    ngày: string
  ): HDMBXeOtoPayload => {
    if (!agreementObject) {
      throw new Error("Agreement object is null");
    }

    const payload: HDMBXeOtoPayload = {
      ...getBenABenB(),
      ...agreementObject,
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
    let fileName = "";
    if (isXeMay) {
      fileName = "HDMB-Xe-may.docx";
    } else if (isDauGia) {
      fileName = "HDMB-Xe-oto-bien-so-xe.docx";
    } else {
      fileName = "HDMB-Xe-oto.docx";
    }
    setOpenDialog(false);
    setIsGenerating(true);
    if (isUyQuyen) {
      render_uy_quyen_toan_bo_xe_oto(payload)
        .then((res) => {
          const blob = new Blob([res.data], {
            type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = "UQ-Xe-oto.docx";
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
      render_hdmb_xe_oto(payload, isXeMay, isDauGia)
        .then((res) => {
          const blob = new Blob([res.data], {
            type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = fileName;
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

  return (
    <Box display="flex" gap="2rem">
      <Box
        border="1px solid #BCCCDC"
        borderRadius="5px"
        padding="1rem"
        display="none" // TODO: temporary hide search
        flex={1}
      >
        <Typography variant="h6">Tìm kiếm</Typography>
        <TextField
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            },
          }}
          fullWidth
          placeholder="Tên hoặc CCCD/CMND/Hộ chiếu"
          sx={{ mt: 2 }}
        />
      </Box>
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
        <ThemChuThe title="Bên B" side="partyB" isUyQuyen={isUyQuyen} />
        <ObjectEntity
          title="Đối tượng của hợp đồng"
          isXeMay={isXeMay}
          isDauGia={isDauGia}
          isUyQuyen={isUyQuyen}
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
              width: "200px",
            }}
            disabled={!isFormValid}
            onClick={() => setOpenDialog(true)}
          >
            {isGenerating ? <CircularProgress size={20} /> : "Tạo hợp đồng"}
          </Button>
          <PhieuThuLyButton
            commonPayload={
              agreementObject
                ? { ...getBenABenB(), ...getAdditionalForThuLy() }
                : null
            }
            type={
              isXeMay
                ? "hdmb-xe-may"
                : isDauGia
                ? "hdmb-xe-oto-bien-so-xe"
                : "hdmb-xe-oto"
            }
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
