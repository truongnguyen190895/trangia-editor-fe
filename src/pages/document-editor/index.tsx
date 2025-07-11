import { Box, Typography } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { FullLandTransfer } from "@/pages/document-editor/full-land-transfer/full-land-transfer";

export const DocumentEditor = () => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");
  const id = searchParams.get("id");
  console.log(type, id);

  const renderContent = () => {
    switch (type) {
      case "agreement":
        return <FullLandTransfer />;
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
