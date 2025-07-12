import { Box, Typography } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { ChuyenNhuongDatToanBo } from "@/pages/document-editor/hdcn-quyen-sd-dat-toan-bo";

export const DocumentEditor = () => {
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
      <Box className="header" height="5rem" bgcolor="grey">
        <Typography variant="h6">Chỉnh sửa văn bản</Typography>
      </Box>
      <Box className="content" paddingX="3rem" paddingY="2rem">
        {renderContent()}
      </Box>
    </Box>
  );
};
