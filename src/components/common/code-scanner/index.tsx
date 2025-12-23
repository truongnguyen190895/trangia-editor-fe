import React, { useState, useRef, useId } from "react";
import { Box, Button, Alert, CircularProgress, Typography } from "@mui/material";
import { Html5Qrcode } from "html5-qrcode";
import QrCodeIcon from "@mui/icons-material/QrCode";

interface CodeScannerProps {
  onScanSuccess?: (decodedText: string) => void;
  onScanError?: (error: string) => void;
}

export const CodeScanner: React.FC<CodeScannerProps> = ({
  onScanSuccess,
  onScanError,
}) => {
  const uniqueId = useId();
  const readerId = `reader-${uniqueId}`;
  const fileInputId = `qr-code-file-input-${uniqueId}`;
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase();
      
      if (
        errorMessage.includes("no multiformat readers") ||
        errorMessage.includes("no code detected") ||
        errorMessage.includes("not found") ||
        errorMessage.includes("unable to detect") ||
        errorMessage.includes("exception") ||
        errorMessage.includes("failed to load")
      ) {
        return "Không tìm thấy mã QR trong ảnh. Vui lòng đảm bảo:\n- Ảnh rõ nét, không bị mờ\n- Mã QR không bị che khuất\n- Ánh sáng đủ để nhìn rõ mã QR\n- Thử chụp lại ảnh gần hơn\n- Thử tải lại trang nếu vấn đề vẫn tiếp tục";
      }
      
      return error.message;
    }
    return "Không thể quét mã QR. Vui lòng thử lại với ảnh khác.";
  };

  const processFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Vui lòng chọn file ảnh hợp lệ");
      return;
    }

    setIsScanning(true);
    setError(null);

    let html5QrCode: Html5Qrcode | null = null;

    try {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const readerElement = document.getElementById(readerId);
      if (!readerElement) {
        throw new Error("Không thể khởi tạo trình quét mã QR");
      }
      if (!Html5Qrcode) {
        throw new Error("Thư viện quét mã QR chưa được tải");
      }
      html5QrCode = new Html5Qrcode(readerId, {
        verbose: false,
      });

      let result: string;
      
      try {
        result = await html5QrCode.scanFile(file, true);
      } catch (firstError) {
        try {
          result = await html5QrCode.scanFile(file, false);
        } catch (secondError) {
          await new Promise((resolve) => setTimeout(resolve, 200));
          try {
            result = await html5QrCode.scanFile(file, false);
          } catch (thirdError) {
            throw firstError;
          }
        }
      }

      onScanSuccess?.(result);
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      onScanError?.(errorMessage);
    } finally {
      if (html5QrCode) {
        try {
          await html5QrCode.clear();
        } catch (clearError) {
          console.warn("Error clearing QR scanner:", clearError);
        }
      }
      setIsScanning(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    await processFile(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    await processFile(file);
  };

  return (
    <Box>
      <Box
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        sx={{
          border: `2px dashed ${isDragging ? "primary.main" : "grey.300"}`,
          borderRadius: 2,
          p: 3,
          textAlign: "center",
          backgroundColor: isDragging ? "action.hover" : "#f5f5f5",
          transition: "all 0.2s ease-in-out",
          cursor: "pointer",
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          style={{ display: "none" }}
          id={fileInputId}
        />
        <label htmlFor={fileInputId}>
          <Button
            variant="contained"
            component="span"
            disabled={isScanning}
            fullWidth
          >
            {isScanning ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Đang quét...
              </>
            ) : (
              <QrCodeIcon />
            )}
          </Button>
        </label>
      </Box>
      <Box id={readerId} sx={{ display: "none" }} />
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          <Typography component="pre" sx={{ whiteSpace: "pre-wrap", margin: 0 }}>
            {error}
          </Typography>
        </Alert>
      )}
    </Box>
  );
};
