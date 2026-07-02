import { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import { ObjectEntity } from "./components/object";
import { CircularProgress } from "@mui/material";
import { SectionNav } from "@/components/common/section-nav";
import { StickyActionBar } from "@/components/common/sticky-action-bar";
import { useHdcnQuyenSdDatContext } from "@/context/hdcn-quyen-sd-dat-context";
import type { UyQuyenToanBoQuyenSdDatPayload } from "@/models/uy-quyen";
import { render_uy_quyen_toan_bo_quyen_su_dung_dat } from "@/api";
import { translateDateToVietnamese } from "@/utils/date-to-words";
import { numberToVietnamese } from "@/utils/number-to-words";
import { useThemChuTheContext } from "@/context/them-chu-the";
import { ThemChuThe } from "@/components/common/them-chu-the";
import { ThemLoiChungDialog } from "@/components/common/them-loi-chung-dialog";
import type { MetaData } from "@/components/common/them-loi-chung-dialog";
import { extractCoupleFromParty } from "@/utils/common";
import { getWorkHistoryById } from "@/api/contract";
import { useSearchParams } from "react-router-dom";
import type { ThongTinThuaDat } from "@/models/agreement-object";
import { toast } from "react-toastify";
import { uchiTemporarySave } from "@/api/uchi";
import { PhieuThuLyButton } from "@/components/common/phieu-thu-ly-button";
import { extractAddress } from "@/utils/extract-address";

interface Props {
    templateName?: string;
}

export const UyQuyenToanBoQuyenSdDat = ({ templateName }: Props) => {
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
                        originalPayload?.agreementObject as ThongTinThuaDat
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

    const isFormValid =
        (partyA["cá_nhân"].length > 0 || partyA["vợ_chồng"].length > 0) &&
        (partyB["cá_nhân"].length > 0 || partyB["vợ_chồng"].length > 0) &&
        agreementObject !== null;

    const getPayload = (
        sốBảnGốc: number,
        isOutSide: boolean,
        côngChứngViên: string,
        isUchi: boolean,
        ngày: string,
        sốHợpĐồng?: string,
        notaryId?: number
    ): UyQuyenToanBoQuyenSdDatPayload => {
        if (!agreementObject) {
            throw new Error("Agreement object is null");
        }

        const couplesA = extractCoupleFromParty(partyA);
        const couplesB = extractCoupleFromParty(partyB);

        const payload: UyQuyenToanBoQuyenSdDatPayload = {
            bên_A: {
                cá_thể: [
                    ...partyA["cá_nhân"].map((person) => ({
                        ...person,
                        ngày_sinh: person["ngày_sinh"],
                        ngày_cấp: person["ngày_cấp"],
                        tình_trạng_hôn_nhân: person["tình_trạng_hôn_nhân"] || null,
                        quan_hệ: person["quan_hệ"] || null,
                        tình_trạng_hôn_nhân_vợ_chồng: null,
                        thành_phố: null,
                        phường: null,
                        thôn: null,
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
                        thành_phố: null,
                        phường: null,
                        thôn: null,
                    })),
                    ...couplesB,
                ],
            },
            số_tiền: "0",
            property_type: "land_whole",
            số_thửa_đất: agreementObject["số_thửa_đất"],
            số_tờ_bản_đồ: agreementObject["số_tờ_bản_đồ"],
            địa_chỉ_hiển_thị: agreementObject["địa_chỉ_cũ"]
                ? `${agreementObject["địa_chỉ_cũ"]} (nay là ${agreementObject["địa_chỉ_mới"]})`
                : agreementObject["địa_chỉ_mới"],
            loại_giấy_chứng_nhận: agreementObject["loại_giấy_chứng_nhận"],
            số_giấy_chứng_nhận: agreementObject["số_giấy_chứng_nhận"],
            số_vào_sổ_cấp_giấy_chứng_nhận:
                agreementObject["số_vào_sổ_cấp_giấy_chứng_nhận"],
            ngày_cấp_giấy_chứng_nhận: agreementObject["ngày_cấp_giấy_chứng_nhận"],
            nơi_cấp_giấy_chứng_nhận: agreementObject["nơi_cấp_giấy_chứng_nhận"],
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
            thời_hạn: agreementObject["thời_hạn"] ?? "",
            thời_hạn_bằng_chữ: agreementObject["thời_hạn_bằng_chữ"] ?? "",
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
                agreementObject: agreementObject as any,
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
        render_uy_quyen_toan_bo_quyen_su_dung_dat(payload)
            .then((res) => {
                const blob = new Blob([res.data], {
                    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = "Uỷ quyền toàn bộ quyền sử dụng đất.docx";
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

    const hasPartyA =
        partyA["cá_nhân"].length > 0 || partyA["vợ_chồng"].length > 0;
    const hasPartyB =
        partyB["cá_nhân"].length > 0 || partyB["vợ_chồng"].length > 0;
    const missingParts = [
        !hasPartyA && "Bên A",
        !hasPartyB && "Bên B",
        !agreementObject && "đối tượng uỷ quyền",
    ].filter(Boolean);

    return (
        <Box display="flex" gap="1.5rem" alignItems="flex-start">
            <SectionNav
                sections={[
                    { id: "section-ben-a", label: "Bên A", complete: hasPartyA },
                    { id: "section-ben-b", label: "Bên B", complete: hasPartyB },
                    {
                        id: "section-doi-tuong",
                        label: "Đối tượng uỷ quyền",
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
                    id="section-doi-tuong"
                    numeral="III"
                    title="Đối tượng uỷ quyền"
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
                            agreementObject && agreementObject
                                ? { ...getBenABenB(), ...getAdditionalForThuLy() }
                                : null
                        }
                        type="uy-quyen-toan-bo-quyen-su-dung-dat"
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
                        Tạo hợp đồng uỷ quyền
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
