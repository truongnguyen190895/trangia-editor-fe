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
    name: "HĐMB Căn hộ toàn bộ.docx",
    type: "agreement",
    path: "hdmb-can-ho-toan-bo",
  },
  {
    id: 3,
    name: "HĐMB nhà đất toàn bộ.docx",
    type: "agreement",
    path: "hdmb-nha-dat-toan-bo",
  },
  {
    id: 4,
    name: "HĐCN Quyền sử dụng đất nông nghiệp toàn bộ.docx",
    type: "agreement",
    path: "hdcn-quyen-su-dung-dat-nong-nghiep-toan-bo",
  },
  {
    id: 5,
    name: "HĐCN đất và tài sản gắn liền với đất toàn bộ.docx",
    type: "agreement",
    path: "hdcn-dat-va-tai-san-gan-lien-voi-dat-toan-bo",
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
