import { Box, Button, TextField } from "@mui/material";
import { useState } from "react";
import { toast } from "react-toastify";

interface CopyMapperProps {
  onMapped: (data: Record<string, string>) => void;
  rows?: number;
}

const fieldMapping: Record<string, string> = {
  "Số CCCD": "cccd",
  "Số CMND": "cmnd",
  "Họ và tên": "hoTen",
  "Giới tính": "gioiTinh",
  "Ngày sinh": "ngaySinh",
  "Nơi thường trú": "noiThuongTru",
  "Ngày cấp CCCD": "ngayCapCCCD",
  "Ngày cấp CMND": "ngayCapCMND",
  "Nơi sinh": "noiSinh",
  "Quốc tịch": "quocTich",
  "Dân tộc": "danToc",
  "Tôn giáo": "tonGiao",
  "Nghề nghiệp": "ngheNghiep",
  "Địa chỉ": "diaChi",
};

const parseInput = (input: string): Record<string, string> => {
  const result: Record<string, string> = {};
  const lines = input.split("\n").filter((line) => line.trim());

  for (const line of lines) {
    const colonIndex = line.indexOf(":");
    if (colonIndex === -1) continue;

    const key = line.substring(0, colonIndex).trim();
    const value = line.substring(colonIndex + 1).trim();

    if (!value) continue;

    const mappedKey =
      fieldMapping[key] || key.toLowerCase().replace(/\s+/g, "");
    result[mappedKey] = value;
  }

  return result;
};

export const CopyMapper = ({ onMapped, rows = 5 }: CopyMapperProps) => {
  const [input, setInput] = useState<string>("");

  const handleProcess = () => {
    if (!input.trim()) {
      toast.error("Vui lòng nhập dữ liệu");
      return;
    }
    try {
      const mapped = parseInput(input);
      onMapped?.(mapped);
      setInput("");
    } catch (err) {
      toast.error("Có lỗi xảy ra khi xử lý dữ liệu");
    }
  };

  return (
    <Box display="flex" gap="1rem" alignItems="center">
      <TextField
        multiline
        rows={rows}
        fullWidth
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Copy dữ liệu quét và click nút xử lý"
        variant="outlined"
      />

      <Button
        variant="contained"
        color="primary"
        sx={{ width: "200px" }}
        disabled={!input.trim()}
        onClick={handleProcess}
      >
        Xử lý dữ liệu
      </Button>
    </Box>
  );
};
