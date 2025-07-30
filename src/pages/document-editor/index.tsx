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
import { HDMBXeProvider } from "@/context/hdmb-xe";
import { HDCNDatVaTaiSanGanLienVoiDatToanBoProvider } from "@/context/hdcn-dat-va-tai-san-glvd";
import { HDTangChoCanHoToanBo } from "@/pages/document-editor/hdtc-can-ho-toan-bo";
import { UyQuyenToanBoQuyenSdDat } from "@/pages/document-editor/uy-quyen-toan-bo-quyen-sd-dat";
import { HDMBXe } from "@/pages/document-editor/hdmb-xe";

export const DocumentEditor = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const name = searchParams.get("name");

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
            />
          </HdcnQuyenSdDatProvider>
        );
      case "hdmb-can-ho-toan-bo":
      case "uy-quyen-toan-bo-can-ho":
        return (
          <HDMBCanHoProvider>
            <HDMBCanHoToanBo isUyQuyen={/uy-quyen/.test(name ?? "")} />
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
      case "hdcn-dat-va-tai-san-gan-lien-voi-dat-toan-bo":
        return (
          <HDCNDatVaTaiSanGanLienVoiDatToanBoProvider>
            <HDCNDatVaTaiSanGanLienVoiDatToanBo />
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
        return (
          <HDMBXeProvider>
            <HDMBXe />
          </HDMBXeProvider>
        );
      default:
        return <Box>Not found</Box>;
    }
  };

  const getTemplateName = () => {
    switch (name) {
      case "hdcn-quyen-su-dung-dat-toan-bo":
        return "Hợp đồng chuyển nhượng quyền sử dụng đất (toàn bộ)";
      case "hdmb-can-ho-toan-bo":
        return "Hợp đồng mua bán căn hộ toàn bộ";
      case "hdmb-nha-dat-toan-bo":
        return "Hợp đồng mua bán nhà đất toàn bộ";
      case "hdcn-quyen-su-dung-dat-nong-nghiep-toan-bo":
        return "Hợp đồng chuyển nhượng quyền sử dụng đất nông nghiệp (toàn bộ)";
      case "hdcn-dat-va-tai-san-gan-lien-voi-dat-toan-bo":
        return "Hợp đồng chuyển nhượng quyền sử dụng đất và tài sản gắn liền với đất (toàn bộ)";
      case "hd-tang-cho-can-ho-toan-bo":
        return "Hợp đồng tặng cho căn hộ (toàn bộ)";
      case "hd-tang-cho-dat-nong-nghiep-toan-bo":
        return "Hợp đồng tặng cho đất nông nghiệp (toàn bộ)";
      case "hd-tang-cho-dat-toan-bo":
        return "Hợp đồng tặng cho đất (toàn bộ)";
      case "uy-quyen-toan-bo-quyen-su-dung-dat":
        return "Uỷ quyền toàn bộ quyền sử dụng đất";
      case "uy-quyen-toan-bo-nha-dat":
        return "Uỷ quyền toàn bộ nhà + đất";
      case "uy-quyen-toan-bo-can-ho":
        return "Uỷ quyền toàn bộ căn hộ";
      default:
        return "";
    }
  };

  return (
    <Box>
      <Box
        className="header"
        height="8rem"
        bgcolor="#E0E0E0"
        paddingX="1.5rem"
        display="flex"
        alignItems="center"
      >
        <Typography variant="h4">
          Chỉnh sửa văn bản: {getTemplateName()}
        </Typography>
      </Box>
      <Box className="content" paddingX="1.5rem" paddingY="1rem">
        <Button
          variant="contained"
          onClick={() => navigate("/")}
          sx={{ mb: 2 }}
          startIcon={<BackIcon />}
        >
          Quay lại trang chủ
        </Button>
        {renderContent()}
      </Box>
    </Box>
  );
};
