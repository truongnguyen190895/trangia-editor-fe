import { Box, Typography } from "@mui/material";
import { useState } from "react";
import { DocumentThumbnail } from "../../components/document-thumbnail";
import { Editor } from "../../components/editor";

const mockDocuments = [
  {
    id: 1,
    name: "1. HĐCN Quyền sử dụng đất toàn bộ.docz",
    thumbnail: "https://via.placeholder.com/150",
  },
  {
    id: 2,
    name: "2. HĐMB Nhà đất toàn bộ.docz",
    thumbnail: "https://via.placeholder.com/150",
  },
];

export const Documents = () => {
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  return (
    <Box>
      <Typography variant="h3">Chọn văn bản cần chỉnh sửa</Typography>
      <Box display="flex" flexDirection="column" gap={2} mt={5}>
        {mockDocuments.map((document) => (
          <DocumentThumbnail
            key={document.id}
            title={document.name}
            onClick={() => setSelectedDocument(document.name)}
          />
        ))}
      </Box>
      {selectedDocument ? (
        <Editor
          documentName={selectedDocument}
          initialContent={selectedDocument}
          open={!!selectedDocument}
          onClose={() => setSelectedDocument(null)}
        />
      ) : null}
    </Box>
  );
};
