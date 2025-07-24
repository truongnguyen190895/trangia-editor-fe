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
import { HDCNDatVaTaiSanGanLienVoiDatToanBoProvider } from "@/context/hdcn-dat-va-tai-san-glvd";

export const DocumentEditor = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const name = searchParams.get("name");

  const renderContent = () => {
    switch (name) {
      case "hdcn-quyen-su-dung-dat-toan-bo":
      case "hdcn-quyen-su-dung-dat-nong-nghiep-toan-bo":
        return (
          <HdcnQuyenSdDatProvider>
            <ChuyenNhuongDatToanBo
              isNongNghiep={
                name === "hdcn-quyen-su-dung-dat-nong-nghiep-toan-bo"
              }
            />
          </HdcnQuyenSdDatProvider>
        );
      case "hdmb-can-ho-toan-bo":
        return (
          <HDMBCanHoProvider>
            <HDMBCanHoToanBo />
          </HDMBCanHoProvider>
        );
      case "hdmb-nha-dat-toan-bo":
        return (
          <HDMBNhaDatProvider>
            <HDMBNhaDatToanBo />
          </HDMBNhaDatProvider>
        );
      case "hdcn-dat-va-tai-san-gan-lien-voi-dat-toan-bo":
        return (
          <HDCNDatVaTaiSanGanLienVoiDatToanBoProvider>
            <HDCNDatVaTaiSanGanLienVoiDatToanBo />
          </HDCNDatVaTaiSanGanLienVoiDatToanBoProvider>
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
