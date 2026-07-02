import { Box, Paper, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { DocumentThumbnail } from "../../components/document-thumbnail";
import { PageHeader } from "@/components/common/page-header";
import { templates } from "@/database";

const columnLabelSx = {
  fontSize: "0.7rem",
  fontWeight: 700,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "text.secondary",
} as const;

export const Documents = () => {
  const navigate = useNavigate();
  const params = useParams();
  const subCategory = params.subCategory;
  const documents = templates.filter(
    (document) => document.subCategory === subCategory
  );

  return (
    <Box>
      <PageHeader title="Chọn văn bản cần chỉnh sửa" />
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Box display="flex" alignItems="center" gap={1} pb={1}>
          <Typography sx={{ ...columnLabelSx, flex: 1 }}>Tên mẫu</Typography>
          <Typography
            sx={{ ...columnLabelSx, minWidth: "100px", textAlign: "center" }}
          >
            Hỗ trợ lên uchi
          </Typography>
        </Box>
        <Box display="flex" flexDirection="column" gap={2}>
          {documents.map((document) => (
            <DocumentThumbnail
              key={document.id}
              title={document.name}
              isUchiReady={document.templateId > 0}
              onClick={() =>
                navigate(
                  `/editor?type=${document.type}&name=${document.path}&templateId=${document.templateId}`
                )
              }
            />
          ))}
        </Box>
      </Paper>
    </Box>
  );
};
