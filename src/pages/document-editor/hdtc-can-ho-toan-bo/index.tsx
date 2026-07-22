import { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import { ObjectEntity } from "./components/object";
import { CircularProgress } from "@mui/material";
import { SectionNav } from "@/components/common/section-nav";
import { StickyActionBar } from "@/components/common/sticky-action-bar";
import type {
  HDMBCanHoPayload,
  KhaiThueHDMBCanHoToanBoPayload,
  ThongTinCanHo as ThongTinCanHoType,
  ThongTinThuaDat,
} from "@/models/hdmb-can-ho";
import dayjs from "dayjs";
import {
  render_hdtc_can_ho_toan_bo,
  render_khai_thue_hdtc_can_ho_toan_bo,
} from "@/api";
import { extractAddress } from "@/utils/extract-address";
import { useHDMBCanHoContext } from "@/context/hdmb-can-ho";
import { translateDateToVietnamese } from "@/utils/date-to-words";
import { numberToVietnamese } from "@/utils/number-to-words";
import { ThemChuThe } from "@/components/common/them-chu-the";
import { ThemLoiChungDialog } from "@/components/common/them-loi-chung-dialog";
import type { MetaData } from "@/components/common/them-loi-chung-dialog";
import { useThemChuTheContext } from "@/context/them-chu-the";
import { PhieuThuLyButton } from "@/components/common/phieu-thu-ly-button";
import { extractCoupleFromParty, hasPartyMembers } from "@/utils/common";
import { useSearchParams } from "react-router-dom";
import { getWorkHistoryById } from "@/api/contract";
import { toast } from "react-toastify";
import { uchiTemporarySave } from "@/api/uchi";
import { createDownloadLink } from "@/utils/common";

interface Props {
  templateName?: string;
  isMotPhan?: boolean;
  scope?: "partial" | "full";
}

export const HDTangChoCanHo = ({ templateName, isMotPhan, scope }: Props) => {
  const { agreementObject, canHo, addAgreementObject, addCanHo } =
    useHDMBCanHoContext();
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
          addCanHo(originalPayload?.canHo as ThongTinCanHoType);
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

  const getCanHo = () => {
    if (!canHo) {
      throw new Error("Agreement object or can ho is null");
    }
    return {
      số_căn_hộ: canHo["số_căn_hộ"],
      tên_toà_nhà: canHo["tên_toà_nhà"],
      địa_chỉ_hiển_thị: canHo["địa_chỉ_cũ"]
        ? `${canHo["địa_chỉ_cũ"]} (nay là ${canHo["địa_chỉ_toà_nhà"]})`
        : canHo["địa_chỉ_toà_nhà"],
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
  ): HDMBCanHoPayload => {
    if (!agreementObject || !canHo) {
      throw new Error("Agreement object or can ho is null");
    }
    const payload: HDMBCanHoPayload = {
      ...getBenABenB(),
      ...getCanHo(),
      property_type: "apartment_whole",
      loại_giấy_chứng_nhận: canHo["loại_giấy_chứng_nhận"],
      số_giấy_chứng_nhận: canHo["số_giấy_chứng_nhận"],
      số_vào_sổ_cấp_giấy_chứng_nhận: canHo["số_vào_sổ_cấp_giấy_chứng_nhận"],
      nơi_cấp_giấy_chứng_nhận: canHo["nơi_cấp_giấy_chứng_nhận"],
      ngày_cấp_giấy_chứng_nhận: canHo["ngày_cấp_giấy_chứng_nhận"],
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
      số_tiền: canHo["số_tiền"],
      số_tiền_bằng_chữ: canHo["số_tiền_bằng_chữ"],
      số_thửa_đất: agreementObject["số_thửa_đất"],
      số_tờ_bản_đồ: agreementObject["số_tờ_bản_đồ"],
      diện_tích_đất_bằng_số: agreementObject["diện_tích_đất_bằng_số"],
      diện_tích_đất_bằng_chữ: agreementObject["diện_tích_đất_bằng_chữ"],
      hình_thức_sử_dụng_đất: agreementObject["hình_thức_sử_dụng_đất"],
      mục_đích_sử_dụng_đất: agreementObject["mục_đích_sử_dụng_đất"],
      thời_hạn_sử_dụng_đất: agreementObject["thời_hạn_sử_dụng_đất"],
      nguồn_gốc_sử_dụng_đất: agreementObject["nguồn_gốc_sử_dụng_đất"],
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
      thời_hạn: null,
      thời_hạn_bằng_chữ: null,
      công_chứng_viên: côngChứngViên,
      template_id: templateId ? templateId : undefined,
      số_hợp_đồng: sốHợpĐồng || undefined,
      isUchi: isUchi,
      uchi_id: uchiId ? String(uchiId) : "",
      notary_id: notaryId ? String(notaryId) : "13",
      template_name: templateName,
      original_payload: {
        partyA,
        partyB,
        agreementObject,
        canHo,
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
    render_hdtc_can_ho_toan_bo(payload, Boolean(isMotPhan), scope)
      .then((res) => {
        createDownloadLink(
          res.data,
          `Hợp đồng tặng cho căn hộ - ${payload["bên_A"]["cá_thể"][0]["tên"]} - ${payload["bên_B"]["cá_thể"][0]["tên"]}`
        );
        if (metaData.isUchi && templateId && Number(templateId) > 0) {
          setIsGenerating(true);
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
            })
            .finally(() => {
              setIsGenerating(false);
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
      loại_giấy_tờ: canHo["loại_giấy_chứng_nhận"],
      số_giấy_chứng_nhận: canHo["số_giấy_chứng_nhận"],
      ngày_cấp_giấy_chứng_nhận: canHo["ngày_cấp_giấy_chứng_nhận"],
      nơi_cấp_giấy_chứng_nhận: canHo["nơi_cấp_giấy_chứng_nhận"],
      đặc_điểm_thửa_đất: {
        diện_tích: {
          số: isMotPhan
            ? canHo["diện_tích_sàn_một_phần_bằng_số"] ?? ""
            : canHo["diện_tích_sàn_bằng_số"],
        },
        mục_đích_và_thời_hạn_sử_dụng: [],
        nguồn_gốc_sử_dụng: agreementObject["nguồn_gốc_sử_dụng_đất"],
      },
      số_tiền: canHo["số_tiền"],
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

  const handleGenerateKhaiThue = (isND373?: boolean) => {
    const payload = getPayloadKhaiThue();
    setOpenDialog(false);
    setIsGenerating(true);
    render_khai_thue_hdtc_can_ho_toan_bo(payload, isND373)
      .then((res) => {
        createDownloadLink(
          res.data,
          `Khai thuế hợp đồng tặng cho căn hộ - ${payload["bên_A"]["cá_thể"][0]["tên"]} - ${payload["bên_B"]["cá_thể"][0]["tên"]}`
        );
      })
      .catch((error) => {
        console.error("Error generating document:", error);
        window.alert("Lỗi khi tạo hợp đồng");
      })
      .finally(() => {
        setIsGenerating(false);
      });
  };

  const hasPartyA = hasPartyMembers(partyA);
  const hasPartyB = hasPartyMembers(partyB);
  const missingParts = [
    !hasPartyA && "Bên A",
    !hasPartyB && "Bên B",
    !canHo && "thông tin căn hộ",
    !agreementObject && "thông tin mảnh đất",
  ].filter(Boolean);
  const isFormValid = missingParts.length === 0;

  return (
    <Box display="flex" gap="1.5rem" alignItems="flex-start">
      <SectionNav
        sections={[
          { id: "section-ben-a", label: "Bên A", complete: hasPartyA },
          { id: "section-ben-b", label: "Bên B", complete: hasPartyB },
          {
            id: "section-can-ho",
            label: "Căn hộ",
            complete: Boolean(canHo) && Boolean(agreementObject),
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
          id="section-can-ho"
          numeral="III"
          title="Đối tượng chuyển nhượng của hợp đồng"
        />
        <StickyActionBar
          missingParts={missingParts}
        >
          <PhieuThuLyButton
            commonPayload={
              agreementObject && canHo
                ? { ...getBenABenB(), ...getCanHo() }
                : null
            }
            type={
              isMotPhan
                ? "hd-tang-cho-can-ho-mot-phan"
                : "hd-tang-cho-can-ho-toan-bo"
            }
          />
          <Button
            variant="outlined"
            disabled={!isFormValid || isGenerating}
            onClick={() => handleGenerateKhaiThue(false)}
          >
            Khai thuế
          </Button>
          <Button
            variant="outlined"
            disabled={!isFormValid || isGenerating}
            onClick={() => handleGenerateKhaiThue(true)}
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
