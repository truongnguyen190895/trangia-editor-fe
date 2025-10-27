import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputLabel,
  Checkbox,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import { CÔNG_CHỨNG_VIÊN } from "@/database/cong-chung-vien";
import dayjs from "dayjs";
import { useSearchParams } from "react-router-dom";

export interface MetaData {
  sốBảnGốc: number;
  isOutSide: boolean;
  côngChứngViên: string;
  ngày: string;
  sốHợpĐồng?: string;
  isUchi: boolean;
}

interface ThemLoiChungDialogProps {
  open: boolean;
  onClose: () => void;
  handleGenerateDocument: (metaData: MetaData) => void;
}

export const ThemLoiChungDialog = ({
  open,
  onClose,
  handleGenerateDocument,
}: ThemLoiChungDialogProps) => {
  const [sốBảnGốc, setSốBảnGốc] = useState(4);
  const [isOutSide, setIsOutSide] = useState(false);
  const [isUchi, setIsUchi] = useState(false);
  const [côngChứngViên, setCôngChứngViên] = useState<string>("");
  const [sốHợpĐồng, setSốHợpĐồng] = useState<string>("");
  const [ngày, setNgày] = useState<string>(dayjs().format("DD/MM/YYYY"));
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get("templateId");

  const handleClick = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data: MetaData = {
      sốBảnGốc,
      isOutSide,
      côngChứngViên: côngChứngViên || "                              ",
      ngày,
      sốHợpĐồng,
      isUchi,
    };
    handleGenerateDocument(data);
  };

  return (
    <Dialog open={open} fullWidth maxWidth="lg" onClose={onClose}>
      <form onSubmit={handleClick}>
        <DialogTitle>Thông tin hợp đồng</DialogTitle>
        <DialogContent>
          <Box>
            <Box
              display="grid"
              gridTemplateColumns="1fr 4fr"
              gap="0.5rem"
              alignItems="center"
              mb="1rem"
            >
              <InputLabel
                htmlFor="sốBảnGốc"
                sx={{ fontSize: "1.2rem", fontWeight: "600" }}
              >
                Số bản gốc
              </InputLabel>
              <TextField
                type="number"
                name="sốBảnGốc"
                slotProps={{
                  htmlInput: {
                    min: 2,
                  },
                }}
                value={sốBảnGốc}
                onChange={(e) => setSốBảnGốc(Number(e.target.value))}
              />
            </Box>
            <Box
              display="grid"
              gridTemplateColumns="1fr 4fr"
              gap="0.5rem"
              alignItems="center"
              mb="1rem"
            >
              <InputLabel
                htmlFor="sốBảnGốc"
                sx={{ fontSize: "1.2rem", fontWeight: "600" }}
              >
                Công chứng viên
              </InputLabel>
              <Select
                value={côngChứngViên}
                onChange={(e) => setCôngChứngViên(e.target.value)}
                fullWidth
              >
                <MenuItem value="">Chọn công chứng viên</MenuItem>
                {CÔNG_CHỨNG_VIÊN.map((item) => (
                  <MenuItem key={item.id} value={item.name}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </Box>
            <Box
              display="grid"
              gridTemplateColumns="1fr 4fr"
              gap="0.5rem"
              alignItems="center"
              mb="1rem"
            >
              <InputLabel
                htmlFor="sốBảnGốc"
                sx={{ fontSize: "1.2rem", fontWeight: "600" }}
              >
                Số hợp đồng
              </InputLabel>
              <TextField
                name="số_hợp_đồng"
                value={sốHợpĐồng}
                fullWidth
                required={isUchi}
                onChange={(e) => setSốHợpĐồng(e.target.value)}
              />
            </Box>
            <Box
              display="grid"
              gridTemplateColumns="1fr 4fr"
              gap="0.5rem"
              alignItems="center"
            >
              <InputLabel
                htmlFor="sốBảnGốc"
                sx={{ fontSize: "1.2rem", fontWeight: "600" }}
              >
                Ngày tạo hợp đồng
              </InputLabel>
              <TextField
                name="ngày"
                value={ngày}
                onChange={(e) => setNgày(e.target.value)}
                fullWidth
              />
            </Box>
            <Box display="flex" alignItems="center" gap="0.5rem">
              <InputLabel
                htmlFor="isOutSide"
                sx={{ fontSize: "1.2rem", fontWeight: "600" }}
              >
                Hợp đồng được ký bên ngoài văn phòng?
              </InputLabel>
              <Checkbox
                id="isOutSide"
                size="large"
                color="info"
                checked={isOutSide}
                onChange={() => setIsOutSide(!isOutSide)}
              />
            </Box>
            {templateId && Number(templateId) > 0 ? (
              <Box display="flex" alignItems="center" gap="0.5rem">
                <InputLabel
                  htmlFor="isUchi"
                  sx={{ fontSize: "1.2rem", fontWeight: "600" }}
                >
                  Gửi thông tin lên Uchi (Hợp đồng lưu tạm)?
                </InputLabel>
                <Checkbox
                  id="isUchi"
                  size="large"
                  color="info"
                  checked={isUchi}
                  onChange={(_e, checked) => {
                    setIsUchi(checked);
                    if (!checked) {
                      setSốHợpĐồng("");
                    }
                  }}
                />
              </Box>
            ) : null}
          </Box>
          {templateId && Number(templateId) > 0 ? (
            <Box mt="0.5rem">
              <Typography
                variant="subtitle1"
                fontSize="1.2rem"
                fontWeight="600"
                color="error"
              >
                <i>(Số hợp đồng là bắt buộc nếu gửi lên Uchi)</i>
              </Typography>
            </Box>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Hủy
          </Button>
          <Button
            variant="contained"
            color="secondary"
            disabled={sốBảnGốc <= 0}
            type="submit"
          >
            Tạo hợp đồng
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
