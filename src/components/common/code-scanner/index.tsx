import React, { useState, useRef } from "react";
import { Box, Button, Alert, CircularProgress } from "@mui/material";
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
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Vui lòng chọn file ảnh hợp lệ");
      return;
    }

    setIsScanning(true);
    setError(null);

    try {
      const html5QrCode = new Html5Qrcode("reader");

      const result = await html5QrCode.scanFile(file, true);
      onScanSuccess?.(result);
      await html5QrCode.clear();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Không thể quét mã QR";
      setError(errorMessage);
      onScanError?.(errorMessage);
    } finally {
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
          id="qr-code-file-input"
        />
        <label htmlFor="qr-code-file-input">
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
        {/* {!isScanning && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 1 }}
          >
            hoặc kéo thả ảnh vào đây
          </Typography>
        )} */}
      </Box>
      <Box id="reader" sx={{ display: "none" }} />
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
    </Box>
  );
};
