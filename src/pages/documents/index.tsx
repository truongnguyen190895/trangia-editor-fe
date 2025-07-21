import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { DocumentThumbnail } from "../../components/document-thumbnail";

const mockDocuments = [
  {
    id: 1,
    name: "HĐCN Quyền sử dụng đất toàn bộ.docx",
    type: "agreement",
    path: "hdcn-quyen-su-dung-dat-toan-bo",
  },
  {
    id: 2,
    name: "HĐMB Căn hộ.docx",
    type: "agreement",
    path: "hdmb-can-ho",
  },
  {
    id: 3,
    name: "HĐMB nhà đất.docx",
    type: "agreement",
    path: "hdmb-nha-dat",
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
              navigate(`/editor?type=${document.type}&name=${document.path}`)
            }
          />
        ))}
      </Box>
    </Box>
  );
};
