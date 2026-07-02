import { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import { ObjectEntity } from "./components/object";
import { CircularProgress } from "@mui/material";
import { SectionNav } from "@/components/common/section-nav";
import { StickyActionBar } from "@/components/common/sticky-action-bar";
import type { HDMBXeOtoPayload, ThongTinXeOto } from "@/models/hdmb-xe";
import { render_hdmb_xe_oto, render_uy_quyen_toan_bo_xe_oto } from "@/api";
import { translateDateToVietnamese } from "@/utils/date-to-words";
import { numberToVietnamese } from "@/utils/number-to-words";
import { useHDMBXeContext } from "@/context/hdmb-xe";
import { ThemChuThe } from "@/components/common/them-chu-the";
import { ThemLoiChungDialog } from "@/components/common/them-loi-chung-dialog";
import type { MetaData } from "@/components/common/them-loi-chung-dialog";
import { useThemChuTheContext } from "@/context/them-chu-the";
import { PhieuThuLyButton } from "@/components/common/phieu-thu-ly-button";
import { extractCoupleFromParty } from "@/utils/common";
import { getWorkHistoryById } from "@/api/contract";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { uchiTemporarySave } from "@/api/uchi";

interface HDMBXeProps {
  isXeMay?: boolean;
  isDauGia?: boolean;
  isUyQuyen?: boolean;
  templateName?: string;
}

export const HDMBXe = ({
  isXeMay = false,
  isDauGia = false,
  isUyQuyen = false,
  templateName,
}: HDMBXeProps) => {
  const { agreementObject, addAgreementObject } = useHDMBXeContext();
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
          addAgreementObject(originalPayload?.agreementObject as ThongTinXeOto);
        }
      });
    }
  }, [id]);

  const userInfo = localStorage.getItem("user_info");
  const userInfoObject = userInfo ? JSON.parse(userInfo) : null;
  const uchiId = userInfoObject?.uchi_id;

  const isFormValid =
    (partyA["cá_nhân"].length > 0 || partyA["vợ_chồng"].length > 0) &&
    (partyB["cá_nhân"].length > 0 || partyB["vợ_chồng"].length > 0) &&
    agreementObject !== null;

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
    isUchi: boolean,
    ngày: string,
    sốHợpĐồng?: string,
    notaryId?: number
  ): HDMBXeOtoPayload => {
    if (!agreementObject) {
      throw new Error("Agreement object is null");
    }

    const payload: HDMBXeOtoPayload = {
      ...getBenABenB(),
      ...agreementObject,
      ngày: ngày,
      property_type: isXeMay ? "motorbike" : "car",
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
      metaData.notaryId
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
          if (metaData.isUchi && templateId && Number(templateId) > 0) {
            uchiTemporarySave(payload)
              .then(() =>
                toast.success("Hợp đồng đã được lưu tạm trong Uchi", {
                  position: "top-left",
                })
              )
              .catch((error) => {
                toast.error(
                  "Lỗi khi gửi thông tin lên Uchi " +
                    error?.response?.data?.message
                );
              });
          }
        })
        .catch((error) => {
          toast.error("Lỗi khi tạo hợp đồng " + error?.response?.data?.message);
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
          if (metaData.isUchi && templateId && Number(templateId) > 0) {
            uchiTemporarySave(payload)
              .then(() =>
                toast.success("Hợp đồng đã được lưu tạm trong Uchi", {
                  position: "top-left",
                })
              )
              .catch((error) => {
                toast.error(
                  "Lỗi khi gửi thông tin lên Uchi " +
                    error?.response?.data?.message
                );
              });
          }
        })
        .catch((error) => {
          toast.error("Lỗi khi tạo hợp đồng " + error?.response?.data?.message);
        })
        .finally(() => {
          setIsGenerating(false);
        });
    }
  };

  const hasPartyA =
    partyA["cá_nhân"].length > 0 || partyA["vợ_chồng"].length > 0;
  const hasPartyB =
    partyB["cá_nhân"].length > 0 || partyB["vợ_chồng"].length > 0;
  const missingParts = [
    !hasPartyA && "Bên A",
    !hasPartyB && "Bên B",
    !agreementObject && "thông tin xe",
  ].filter(Boolean);

  return (
    <Box display="flex" gap="1.5rem" alignItems="flex-start">
      <SectionNav
        sections={[
          { id: "section-ben-a", label: "Bên A", complete: hasPartyA },
          { id: "section-ben-b", label: "Bên B", complete: hasPartyB },
          {
            id: "section-xe",
            label: "Xe",
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
        <ObjectEntity
          id="section-xe"
          numeral="III"
          title="Đối tượng của hợp đồng"
          isXeMay={isXeMay}
          isDauGia={isDauGia}
          isUyQuyen={isUyQuyen}
        />
        <StickyActionBar
          status={
            isFormValid
              ? "Đủ thông tin — sẵn sàng tạo văn bản"
              : `Còn thiếu: ${missingParts.join(", ")}`
          }
        >
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
      <ThemLoiChungDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        handleGenerateDocument={handleGenerateDocument}
      />
    </Box>
  );
};
