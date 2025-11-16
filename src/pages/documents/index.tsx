import { Box, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { DocumentThumbnail } from "../../components/document-thumbnail";
import { templates } from "@/database";

export const Documents = () => {
  const navigate = useNavigate();
  const params = useParams();
  const subCategory = params.subCategory;
  const documents = templates.filter(
    (document) => document.subCategory === subCategory
  );

  return (
    <Box>
      <Typography fontWeight={600} variant="h3">
        Chọn văn bản cần chỉnh sửa
      </Typography>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        gap={2}
        mt={2}
        bgcolor="#799EFF"
        height="70px"
        px="10px"
        borderRadius="5px"
      >
        <Typography fontWeight={600} variant="h6">
          Tên mẫu
        </Typography>
        <Typography fontWeight={600} variant="h6">
          Hỗ trợ lên uchi
        </Typography>
      </Box>
      <Box display="flex" flexDirection="column" gap={2} mt={2}>
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
    </Box>
  );
};
