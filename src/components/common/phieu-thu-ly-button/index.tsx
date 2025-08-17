import { useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import { render_phieu_thu_ly } from "@/api";

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
        const blob = new Blob([res.data], {
          type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "Phieu thu ly CC.docx";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
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
