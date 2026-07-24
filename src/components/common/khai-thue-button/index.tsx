import { useState } from "react";
import {
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import {
  render_khai_thue,
  type KhaiThueLoai,
  type KhaiThuePayload,
} from "@/api";
import { createDownloadLink } from "@/utils/common";
import {
  getVanPhongDangKyGroup,
  type VanPhongDangKyGroup,
} from "@/utils/extract-address";

const VAN_PHONG_OPTIONS: Array<{
  value: VanPhongDangKyGroup;
  label: string;
}> = [
  { value: "mac-dinh", label: "Mặc định (các văn phòng khác)" },
  { value: "chuong-my", label: "VPĐK Chương Mỹ" },
  { value: "ung-hoa", label: "VPĐK Ứng Hoà" },
];

interface KhaiThueButtonProps {
  loại: KhaiThueLoai;
  // Build tại thời điểm bấm để lấy state mới nhất; null = form chưa đủ dữ liệu.
  getPayload: () => KhaiThuePayload | null;
  fileName?: string | (() => string);
  disabled?: boolean;
}

export const KhaiThueButton = ({
  loại,
  getPayload,
  fileName,
  disabled,
}: KhaiThueButtonProps) => {
  const [open, setOpen] = useState(false);
  const [vanPhong, setVanPhong] = useState<VanPhongDangKyGroup>("mac-dinh");
  const [inNgayThang, setInNgayThang] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleOpen = () => {
    // Mặc định theo địa chỉ thửa đất; user vẫn đổi được trong dropdown.
    const payload = getPayload();
    setVanPhong(getVanPhongDangKyGroup(payload?.["phường"] ?? null));
    setInNgayThang(true);
    setOpen(true);
  };

  const handleGenerate = () => {
    const payload = getPayload();
    if (!payload) return;
    setOpen(false);
    setIsGenerating(true);
    render_khai_thue(loại, vanPhong, payload, inNgayThang)
      .then((res) => {
        const name = typeof fileName === "function" ? fileName() : fileName;
        createDownloadLink(res.data, name || "to-khai-chung.docx");
      })
      .catch((error) => {
        console.error("Error generating document:", error);
        window.alert("Lỗi khi tạo tờ khai");
      })
      .finally(() => {
        setIsGenerating(false);
      });
  };

  return (
    <>
      <Button
        variant="outlined"
        onClick={handleOpen}
        disabled={disabled || isGenerating}
      >
        {isGenerating ? <CircularProgress size={20} /> : "Khai thuế"}
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Khai thuế</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel id="van-phong-dang-ky-label">
              Văn phòng đăng ký đất đai
            </InputLabel>
            <Select
              labelId="van-phong-dang-ky-label"
              label="Văn phòng đăng ký đất đai"
              value={vanPhong}
              onChange={(e) =>
                setVanPhong(e.target.value as VanPhongDangKyGroup)
              }
            >
              {VAN_PHONG_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle2" color="text.secondary">
            Tuỳ chỉnh
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={inNgayThang}
                onChange={(e) => setInNgayThang(e.target.checked)}
              />
            }
            label="In ngày/tháng trên mẫu khai thuế"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleGenerate}>
            Tạo tờ khai
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
