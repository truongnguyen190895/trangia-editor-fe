import { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import { ObjectEntity } from "./components/object";
import { CircularProgress } from "@mui/material";
import { SectionNav } from "@/components/common/section-nav";
import { StickyActionBar } from "@/components/common/sticky-action-bar";
import type {
  HDMBTaiSanPayload,
  KhaiThueHDMBTaiSanPayload,
  ThongTinTaiSan,
  ThongTinThuaDat,
} from "@/models/hdmb-tai-san";
import dayjs from "dayjs";
import { render_hdmb_tai_san, render_khai_thue_hdmb_tai_san } from "@/api";
import { extractAddress } from "@/utils/extract-address";
import { useHDMBTaiSanContext } from "@/context/hdmb-tai-san";
import { translateDateToVietnamese } from "@/utils/date-to-words";
import { numberToVietnamese } from "@/utils/number-to-words";
import { useThemChuTheContext } from "@/context/them-chu-the";
import { ThemChuThe } from "@/components/common/them-chu-the";
import { ThemLoiChungDialog } from "@/components/common/them-loi-chung-dialog";
import type { MetaData } from "@/components/common/them-loi-chung-dialog";
import { PhieuThuLyButton } from "@/components/common/phieu-thu-ly-button";
import { extractCoupleFromParty } from "@/utils/common";
import { useSearchParams } from "react-router-dom";
import { getWorkHistoryById } from "@/api/contract";
import { toast } from "react-toastify";
import { uchiTemporarySave } from "@/api/uchi";

interface Props {
  templateName?: string;
}

export const HDMBTaiSan = ({ templateName }: Props) => {
  const { agreementObject, taiSan, addAgreementObject, addTaiSan } =
    useHDMBTaiSanContext();
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
            originalPayload?.agreementObject as ThongTinThuaDat
          );
          addTaiSan(originalPayload?.taiSan as ThongTinTaiSan);
        }
      });
    }
  }, [id]);

  const isFormValid =
    (partyA["cá_nhân"].length > 0 || partyA["vợ_chồng"].length > 0) &&
    (partyB["cá_nhân"].length > 0 || partyB["vợ_chồng"].length > 0) &&
    agreementObject !== null &&
    taiSan !== null;

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
    return {
      tên_tài_sản: taiSan?.tên_tài_sản ?? "",
      địa_chỉ: agreementObject?.["địa_chỉ"] ?? "",
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
  ): HDMBTaiSanPayload => {
    if (!agreementObject || !taiSan) {
      throw new Error("Agreement object or nha dat is null");
    }

    const payload: HDMBTaiSanPayload = {
      ...getBenABenB(),
      ...agreementObject,
      ...taiSan,
      số_tiền: taiSan.số_tiền,
      số_tiền_bằng_chữ: taiSan.số_tiền_bằng_chữ,
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
        taiSan: taiSan,
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
    setOpenDialog(false);
    setIsGenerating(true);
    render_hdmb_tai_san(payload)
      .then((res) => {
        const blob = new Blob([res.data], {
          type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "HDMB Tai San.docx";
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
        console.error("Error generating document:", error);
        window.alert("Lỗi khi tạo hợp đồng");
      })
      .finally(() => {
        setIsGenerating(false);
      });
  };

  const getPayloadToKhaiChung = (): KhaiThueHDMBTaiSanPayload => {
    if (!agreementObject || !taiSan) {
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

    const payload: KhaiThueHDMBTaiSanPayload = {
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
      số_thửa_đất: "",
      số_tờ_bản_đồ: "",
      số_giấy_chứng_nhận: agreementObject["số_gcn"],
      nơi_cấp_giấy_chứng_nhận: agreementObject["nơi_cấp_gcn"],
      ngày_cấp_giấy_chứng_nhận: agreementObject["ngày_cấp_gcn"],
      đặc_điểm_thửa_đất: {
        diện_tích: {
          số: agreementObject["diện_tích_đất_bằng_số"],
        },
        mục_đích_và_thời_hạn_sử_dụng: [
          {
            phân_loại: agreementObject["mục_đích_sử_dụng_đất"],
            diện_tích: agreementObject["diện_tích_đất_bằng_số"],
          },
        ],
        nguồn_gốc_sử_dụng: agreementObject["nguồn_gốc_sử_dụng_đất"],
      },
      số_tiền: taiSan["số_tiền"],
      ngày_chứng_thực: dayjs().format("DD/MM/YYYY").toString(),
      tên_tài_sản: taiSan.tên_tài_sản,
      nguồn_gốc_sử_dụng_đất: agreementObject["nguồn_gốc_sử_dụng_đất"],
      ngày_lập_hợp_đồng: dayjs().format("DD/MM/YYYY").toString(),
      diện_tích_sàn: taiSan.diện_tích_sử_dụng,
      ...extractAddress(agreementObject["địa_chỉ"]),
    };

    return payload;
  };

  const handleGenerateToKhaiThue = (isND373?: boolean) => {
    const payload = getPayloadToKhaiChung();
    setOpenDialog(false);
    setIsGenerating(true);
    render_khai_thue_hdmb_tai_san(payload, isND373)
      .then((res) => {
        const blob = new Blob([res.data], {
          type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "Khai thuế mua bán tài sản.docx";
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

  const hasPartyA =
    partyA["cá_nhân"].length > 0 || partyA["vợ_chồng"].length > 0;
  const hasPartyB =
    partyB["cá_nhân"].length > 0 || partyB["vợ_chồng"].length > 0;
  const missingParts = [
    !hasPartyA && "Bên A",
    !hasPartyB && "Bên B",
    !taiSan && "thông tin tài sản",
    !agreementObject && "thông tin mảnh đất",
  ].filter(Boolean);

  return (
    <Box display="flex" gap="1.5rem" alignItems="flex-start">
      <SectionNav
        sections={[
          { id: "section-ben-a", label: "Bên A", complete: hasPartyA },
          { id: "section-ben-b", label: "Bên B", complete: hasPartyB },
          {
            id: "section-tai-san",
            label: "Tài sản",
            complete: Boolean(taiSan) && Boolean(agreementObject),
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
          id="section-tai-san"
          numeral="III"
          title="Đối tượng chuyển nhượng của hợp đồng"
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
              agreementObject && taiSan
                ? { ...getBenABenB(), ...getAdditionalForThuLy() }
                : null
            }
            type="hdmb-tai-san"
          />
          <Button
            variant="outlined"
            disabled={!isFormValid || isGenerating}
            onClick={() => handleGenerateToKhaiThue(false)}
          >
            Khai thuế
          </Button>
          <Button
            variant="outlined"
            disabled={!isFormValid || isGenerating}
            onClick={() => handleGenerateToKhaiThue(true)}
          >
            Khai thuế theo NĐ 373
          </Button>
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
