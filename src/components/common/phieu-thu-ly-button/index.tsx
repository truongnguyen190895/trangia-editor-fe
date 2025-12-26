import { useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import { render_phieu_thu_ly } from "@/api";
import { createDownloadLink } from "@/utils/common";

interface PhieuThuLyButtonProps {
  commonPayload: any;
  type: string;
}

export const PhieuThuLyButton = ({
  commonPayload,
  type,
}: PhieuThuLyButtonProps) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const getPayload = (): any => {
    const tenChuyenVien = localStorage.getItem("username") || "";
    return {
      ...commonPayload,
      tên_chuyên_viên: tenChuyenVien,
    };
  };

  const handleGenerateDocument = () => {
    const payload = getPayload();
    setIsGenerating(true);
    render_phieu_thu_ly(payload, type)
      .then((res) => {
        createDownloadLink(res.data, "Phieu thu ly CC.docx");
      })
      .catch((err) => {
        console.error("Error generating document:", err);
        window.alert("Lỗi khi tạo hợp đồng");
      })
      .finally(() => {
        setIsGenerating(false);
      });
  };
  return (
    <Button
      variant="contained"
      sx={{
        height: "50px",
        fontSize: "1.2rem",
        fontWeight: "600",
        textTransform: "uppercase",
        width: "250px",
      }}
      onClick={handleGenerateDocument}
      disabled={isGenerating || !commonPayload}
    >
      {isGenerating ? <CircularProgress size={20} /> : "Tạo phiếu thụ lý"}
    </Button>
  );
};
