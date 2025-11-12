import { Box, Typography, Button } from "@mui/material";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ChuyenNhuongDatToanBo } from "@/pages/document-editor/hdcn-quyen-sd-dat-toan-bo";
import { HDMBCanHoToanBo } from "@/pages/document-editor/hdmb-can-ho-toan-bo";
import { HDMBNhaDatToanBo } from "@/pages/document-editor/hdmb-nha-dat-toan-bo";
import { HDCNDatVaTaiSanGanLienVoiDatToanBo } from "@/pages/document-editor/hdcn-dat-va-tai-san-gan-lien-voi-dat-toan-bo";
import BackIcon from "@mui/icons-material/ArrowBack";
import { HdcnQuyenSdDatProvider } from "@/context/hdcn-quyen-sd-dat-context";
import { HDMBCanHoProvider } from "@/context/hdmb-can-ho";
import { HDMBNhaDatProvider } from "@/context/hdmb-nha-dat";
import { HDMBTaiSanProvider } from "@/context/hdmb-tai-san";
import { HDDatCocProvider } from "@/context/hd-dat-coc";
import { HDMBXeProvider } from "@/context/hdmb-xe";
import { HDCNDatVaTaiSanGanLienVoiDatToanBoProvider } from "@/context/hdcn-dat-va-tai-san-glvd";
import { HDTangChoCanHoToanBo } from "@/pages/document-editor/hdtc-can-ho-toan-bo";
import { UyQuyenToanBoQuyenSdDat } from "@/pages/document-editor/uy-quyen-toan-bo-quyen-sd-dat";
import { HDMBXe } from "@/pages/document-editor/hdmb-xe";
import { HDMBTaiSan } from "@/pages/document-editor/hdmb-tai-san";
import { NhomHuySuaDoi } from "@/pages/document-editor/nhom-huy-sua-doi";
import { NhomThueMuonDatCoc } from "@/pages/document-editor/nhom-thue-muon-dat-coc";
import { getTemplateName } from "@/utils/common";
import { getWorkHistoryById } from "@/api/contract";
import { useEffect } from "react";
import type { Couple, SingleAgreementParty } from "@/models/agreement-entity";
import { useThemChuTheContext } from "@/context/them-chu-the";
import { LoadingDialog } from "@/components/common/loading-dialog";
import { useState } from "react";

export const DocumentEditor = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const name = searchParams.get("name");
  const id = searchParams.get("id");
  const {
    addSinglePartyAEntity,
    addCouplePartyAEntity,
    addSinglePartyBEntity,
    addCouplePartyBEntity,
  } = useThemChuTheContext();

  useEffect(() => {
    if (id) {
      setLoading(true);
      getWorkHistoryById(id)
        .then((res) => {
          const originalPayload = res.content.original_payload;
          if (originalPayload) {
            originalPayload.partyA["cá_nhân"].forEach(
              (entity: SingleAgreementParty) => {
                addSinglePartyAEntity(entity);
              }
            );
            originalPayload.partyA["vợ_chồng"].forEach((entity: Couple) => {
              addCouplePartyAEntity(entity);
            });
            originalPayload.partyB["cá_nhân"].forEach(
              (entity: SingleAgreementParty) => {
                addSinglePartyBEntity(entity);
              }
            );
            originalPayload.partyB["vợ_chồng"].forEach((entity: Couple) => {
              addCouplePartyBEntity(entity);
            });
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]);

  const renderContent = () => {
    switch (name) {
      case "hdcn-quyen-su-dung-dat-toan-bo":
      case "hdcn-quyen-su-dung-dat-nong-nghiep-toan-bo":
      case "hd-tang-cho-dat-nong-nghiep-toan-bo":
      case "hd-tang-cho-dat-toan-bo":
        return (
          <HdcnQuyenSdDatProvider>
            <ChuyenNhuongDatToanBo
              isNongNghiep={/nong-nghiep/.test(name ?? "")}
              isTangCho={/tang-cho/.test(name ?? "")}
              templateName={getTemplateName(name ?? "")}
            />
          </HdcnQuyenSdDatProvider>
        );
      case "hdmb-can-ho-toan-bo":
      case "hdmb-can-ho-mot-phan-so-huu-toan-bo":
      case "uy-quyen-toan-bo-can-ho":
        return (
          <HDMBCanHoProvider>
            <HDMBCanHoToanBo
              isUyQuyen={/uy-quyen/.test(name ?? "")}
              isMotPhan={/mot-phan/.test(name ?? "")}
              scope={/so-huu-toan-bo/.test(name ?? "") ? "full" : "partial"}
              templateName={getTemplateName(name ?? "")}
            />
          </HDMBCanHoProvider>
        );
      case "hdmb-nha-dat-toan-bo":
      case "hd-tang-cho-nha-dat-toan-bo":
      case "uy-quyen-toan-bo-nha-dat":
        return (
          <HDMBNhaDatProvider>
            <HDMBNhaDatToanBo
              isTangCho={/tang-cho/.test(name ?? "")}
              isUyQuyen={/uy-quyen/.test(name ?? "")}
            />
          </HDMBNhaDatProvider>
        );
      case "hdcn-dat-va-tsglvd-toan-bo":
      case "hdcn-mot-phan-dat-va-tsglvd-de-dong-su-dung":
      case "hdcn-mot-phan-dat-va-tsglvd-de-su-dung-toan-bo":
        return (
          <HDCNDatVaTaiSanGanLienVoiDatToanBoProvider>
            <HDCNDatVaTaiSanGanLienVoiDatToanBo
              isMotPhan={/mot-phan/.test(name ?? "")}
              scope={/dong-su-dung/.test(name ?? "") ? "partial" : "full"}
              templateName={getTemplateName(name ?? "")}
            />
          </HDCNDatVaTaiSanGanLienVoiDatToanBoProvider>
        );
      case "hd-tang-cho-can-ho-toan-bo":
        return (
          <HDMBCanHoProvider>
            <HDTangChoCanHoToanBo />
          </HDMBCanHoProvider>
        );
      case "uy-quyen-toan-bo-quyen-su-dung-dat":
        return (
          <HdcnQuyenSdDatProvider>
            <UyQuyenToanBoQuyenSdDat />
          </HdcnQuyenSdDatProvider>
        );
      case "hdmb-xe-oto":
      case "hdmb-xe-may":
      case "hdmb-xe-oto-bien-so-xe":
      case "uy-quyen-xe-oto":
        return (
          <HDMBXeProvider>
            <HDMBXe
              isXeMay={/hdmb-xe-may/.test(name ?? "")}
              isDauGia={/bien-so-xe/.test(name ?? "")}
              isUyQuyen={/uy-quyen/.test(name ?? "")}
              templateName={getTemplateName(name ?? "")}
            />
          </HDMBXeProvider>
        );
      case "hdmb-tai-san":
        return (
          <HDMBTaiSanProvider>
            <HDMBTaiSan />
          </HDMBTaiSanProvider>
        );
      case "vb-huy":
      case "vb-cham-dut-hd":
      case "vb-cham-dut-hq-uy-quyen":
        return (
          <HDMBXeProvider>
            <NhomHuySuaDoi
              isHuy={/huy/.test(name ?? "")}
              isChamDutHD={/cham-dut-hd/.test(name ?? "")}
              isChamDutHQUyQuyen={/cham-dut-hq-uy-quyen/.test(name ?? "")}
            />
          </HDMBXeProvider>
        );
      case "hd-dat-coc":
      case "hd-dat-coc-chua-xoa-chap":
        return (
          <HDDatCocProvider>
            <NhomThueMuonDatCoc
              isChuaXoaChap={/chua-xoa-chap/.test(name ?? "")}
            />
          </HDDatCocProvider>
        );
      default:
        return <Box>Not found</Box>;
    }
  };

  return (
    <Box className="editor-container">
      <Box
        className="header"
        height="8rem"
        bgcolor="#E0E0E0"
        paddingX="1.5rem"
        display="flex"
        alignItems="center"
      >
        <Typography variant="h4">
          Tên văn bản: {getTemplateName(name ?? "")}
        </Typography>
      </Box>
      <Box className="content" py="1rem">
        <Button variant="contained" onClick={() => navigate(-1)} sx={{ mb: 2 }}>
          <BackIcon />
        </Button>
        {renderContent()}
      </Box>
      <LoadingDialog open={loading} />
    </Box>
  );
};
