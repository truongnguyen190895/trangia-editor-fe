import { Box, Typography, Button } from "@mui/material";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ChuyenNhuongDatToanBo } from "@/pages/document-editor/hdcn-quyen-sd-dat-toan-bo";
import BackIcon from "@mui/icons-material/ArrowBack";

export const DocumentEditor = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");
  const id = searchParams.get("id");
  console.log(type, id);

  const renderContent = () => {
    switch (type) {
      case "agreement":
        return <ChuyenNhuongDatToanBo />;
    }
  };

  return (
    <Box>
      <Box className="header" height="5rem" bgcolor="grey" paddingX="1.5rem">
        <Typography variant="h6">Chỉnh sửa văn bản</Typography>
      </Box>
      <Box className="content" paddingX="1.5rem" paddingY="1rem">
        <Button variant="contained" onClick={() => navigate("/")} sx={{ mb: 2 }} startIcon={<BackIcon />}>
          Quay lại trang chủ
        </Button>
        {renderContent()}
      </Box>
    </Box>
  );
};
