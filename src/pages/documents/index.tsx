import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { DocumentThumbnail } from "../../components/document-thumbnail";

const mockDocuments = [
  {
    id: 1,
    name: "1. HĐCN Quyền sử dụng đất toàn bộ.docz",
    thumbnail: "https://via.placeholder.com/150",
    type: "agreement",
  },
  {
    id: 2,
    name: "2. HĐMB Nhà đất toàn bộ.docz",
    thumbnail: "https://via.placeholder.com/150",
    type: "agreement",
  },
];

export const Documents = () => {
  const navigate = useNavigate();
  return (
    <Box>
      <Typography variant="h3">Chọn văn bản cần chỉnh sửa</Typography>
      <Box display="flex" flexDirection="column" gap={2} mt={5}>
        {mockDocuments.map((document) => (
          <DocumentThumbnail
            key={document.id}
            title={document.name}
            onClick={() =>
              navigate(`/editor?type=${document.type}&id=${document.id}`)
            }
          />
        ))}
      </Box>
    </Box>
  );
};
