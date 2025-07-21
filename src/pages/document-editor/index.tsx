import { Box, Typography, Button } from "@mui/material";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ChuyenNhuongDatToanBo } from "@/pages/document-editor/hdcn-quyen-sd-dat-toan-bo";
import { HDMBCanHo } from "@/pages/document-editor/hdmb-can-ho";
import { HDMBNhaDat } from "@/pages/document-editor/hdmb-nha-dat";
import BackIcon from "@mui/icons-material/ArrowBack";
import { HdcnQuyenSdDatProvider } from "@/context/hdcn-quyen-sd-dat-context";
import { HDMBCanHoProvider } from "@/context/hdmb-can-ho";
import { HDMBNhaDatProvider } from "@/context/hdmb-nha-dat";

export const DocumentEditor = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const name = searchParams.get("name");

  const renderContent = () => {
    switch (name) {
      case "hdcn-quyen-su-dung-dat-toan-bo":
        return (
          <HdcnQuyenSdDatProvider>
            <ChuyenNhuongDatToanBo />
          </HdcnQuyenSdDatProvider>
        );
      case "hdmb-can-ho":
        return (
          <HDMBCanHoProvider>
            <HDMBCanHo />
          </HDMBCanHoProvider>
        );
      case "hdmb-nha-dat":
        return (
          <HDMBNhaDatProvider>
            <HDMBNhaDat />
          </HDMBNhaDatProvider>
        );
      default:
        return <Box>Not found</Box>;
    }
  };

  const getTemplateName = () => {
    switch (name) {
      case "hdcn-quyen-su-dung-dat-toan-bo":
        return "Hợp đồng chuyển nhượng quyền sử dụng đất (toàn bộ)";
      case "hdmb-can-ho":
        return "Hợp đồng mua bán căn hộ";
      case "hdmb-nha-dat":
        return "Hợp đồng mua bán nhà đất";
      default:
        return "";
    }
  };

  return (
    <Box>
      <Box
        className="header"
        height="5rem"
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
