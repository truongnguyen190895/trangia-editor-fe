import { Box, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { DocumentThumbnail } from "../../components/document-thumbnail";
import { templates } from "@/database";


export const Documents = () => {
  const navigate = useNavigate();
  const params = useParams();
  const subCategory = params.subCategory;
  const documents = templates.filter((document) => document.subCategory === subCategory);

  return (
    <Box>
      <Typography variant="h4">Chọn văn bản cần chỉnh sửa</Typography>
      <Box display="flex" flexDirection="column" gap={2} mt={5}>
        {documents.map((document) => (
          <DocumentThumbnail
            key={document.id}
            title={document.name}
            onClick={() =>
              navigate(`/editor?type=${document.type}&name=${document.path}`)
            }
          />
        ))}
      </Box>
    </Box>
  );
};
