import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  Button,
  DialogActions,
} from "@mui/material";
import { useHdcnQuyenSdDatContext } from "@/context/hdcn-quyen-sd-dat-context";
import type { Couple } from "@/models/agreement-entity";
import { GENDER } from "@/models/agreement-entity";
import { useFormik } from "formik";
import {
  CÁC_LOẠI_GIẤY_TỜ_ĐỊNH_DANH,
  NƠI_CẤP_GIẤY_TỜ_ĐỊNH_DANH,
} from "@/constants";

interface AddCoupleDialogProps {
  open: boolean;
  side: "partyA" | "partyB";
  onClose: () => void;
}

export const AddCoupleDialog = ({
  open,
  side,
  onClose,
}: AddCoupleDialogProps) => {
  const {
    partyA,
    partyB,
    couplePartyAEntityIndex,
    couplePartyBEntityIndex,
    addCouplePartyAEntity,
    addCouplePartyBEntity,
    editCouplePartyAEntity,
    editCouplePartyBEntity,
  } = useHdcnQuyenSdDatContext();

  const addPartyEntity =
    side === "partyA" ? addCouplePartyAEntity : addCouplePartyBEntity;
  const editPartyEntity =
    side === "partyA" ? editCouplePartyAEntity : editCouplePartyBEntity;
  const partyEntityIndex =
    side === "partyA" ? couplePartyAEntityIndex : couplePartyBEntityIndex;
  const isEdit = partyEntityIndex !== null;

  const getInitialValues = () => {
    if (side === "partyA" && couplePartyAEntityIndex !== null) {
      return partyA["vợ chồng"][couplePartyAEntityIndex];
    } else if (side === "partyB" && couplePartyBEntityIndex !== null) {
      return partyB["vợ chồng"][couplePartyBEntityIndex];
    } else {
      return {
        chồng: {
          "giới tính": GENDER.MALE,
          tên: "",
          "ngày sinh": "",
          "loại giấy tờ": "",
          "số giấy tờ": "",
          "ngày cấp": "",
          "nơi cấp": "",
          "địa chỉ thường trú cũ": "",
          "địa chỉ thường trú mới": "",
        },
        vợ: {
          "giới tính": GENDER.FEMALE,
          tên: "",
          "ngày sinh": "",
          "loại giấy tờ": "",
          "số giấy tờ": "",
          "ngày cấp": "",
          "nơi cấp": "",
          "địa chỉ thường trú cũ": "",
          "địa chỉ thường trú mới": "",
        },
      };
    }
  };

  const { values, handleChange, handleSubmit } = useFormik<Couple>({
    initialValues: getInitialValues(),
    onSubmit: (values) => {
      handleSubmitCouple(values);
    },
  });

  const handleSubmitCouple = (values: Couple) => {
    if (isEdit) {
      editPartyEntity(values, partyEntityIndex as number);
    } else {
      addPartyEntity(values);
    }
    onClose();
  };
  console.log(values);
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xl">
      <DialogTitle>
        <Typography variant="body1">Thêm thông tin vợ chồng</Typography>
      </DialogTitle>
      <DialogContent sx={{ padding: "20px" }}>
        <form>
          <Box display="grid" gridTemplateColumns="1fr 1fr" gap="4rem">
            <Box>
              <Typography variant="body1">Thông tin chồng</Typography>
              <Box>
                <Box
                  display="grid"
                  gridTemplateColumns="1fr 1fr 1fr"
                  gap="10px"
                >
                  <FormControl sx={{ marginBottom: "10px" }}>
                    <FormLabel>Giới tính *</FormLabel>
                    <Select
                      value={values["chồng"]["giới tính"] || ""}
                      name="chồng.giới tính"
                      onChange={handleChange}
                    >
                      <MenuItem value="Ông">Ông</MenuItem>
                      <MenuItem value="Bà">Bà</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl sx={{ marginBottom: "10px" }}>
                    <FormLabel>Tên *</FormLabel>
                    <TextField
                      value={values["chồng"].tên}
                      name="chồng.tên"
                      onChange={handleChange}
                      fullWidth
                    />
                  </FormControl>
                  <FormControl sx={{ marginBottom: "10px" }}>
                    <FormLabel>Ngày sinh *</FormLabel>
                    <TextField
                      type="date"
                      value={values["chồng"]["ngày sinh"]}
                      name="chồng.ngày sinh"
                      onChange={handleChange}
                      fullWidth
                    />
                  </FormControl>
                  <FormControl sx={{ marginBottom: "10px" }}>
                    <FormLabel>Loại giấy tờ *</FormLabel>
                    <Select
                      value={values["chồng"]["loại giấy tờ"]}
                      name="chồng.loại giấy tờ"
                      onChange={handleChange}
                      fullWidth
                    >
                      {CÁC_LOẠI_GIẤY_TỜ_ĐỊNH_DANH.map((item) => (
                        <MenuItem key={item.value} value={item.value}>
                          {item.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl sx={{ marginBottom: "10px" }}>
                    <FormLabel>Số giấy tờ *</FormLabel>
                    <TextField
                      value={values["chồng"]["số giấy tờ"]}
                      name="chồng.số giấy tờ"
                      onChange={handleChange}
                      fullWidth
                    />
                  </FormControl>
                  <FormControl sx={{ marginBottom: "10px" }}>
                    <FormLabel>Ngày cấp *</FormLabel>
                    <TextField
                      type="date"
                      value={values["chồng"]["ngày cấp"]}
                      name="chồng.ngày cấp"
                      onChange={handleChange}
                      fullWidth
                    />
                  </FormControl>
                  <FormControl sx={{ marginBottom: "10px" }}>
                    <FormLabel>Nơi cấp *</FormLabel>
                    <Select
                      value={values["chồng"]["nơi cấp"]}
                      name="chồng.nơi cấp"
                      onChange={handleChange}
                      fullWidth
                    >
                      {NƠI_CẤP_GIẤY_TỜ_ĐỊNH_DANH.map((item) => (
                        <MenuItem key={item.value} value={item.value}>
                          {item.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl sx={{ marginBottom: "10px" }}>
                    <FormLabel>Địa chỉ thường trú cũ *</FormLabel>
                    <TextField
                      value={values["chồng"]["địa chỉ thường trú cũ"]}
                      name="chồng.địa chỉ thường trú cũ"
                      onChange={handleChange}
                      fullWidth
                    />
                  </FormControl>
                  <FormControl sx={{ marginBottom: "10px" }}>
                    <FormLabel>Địa chỉ thường trú mới *</FormLabel>
                    <TextField
                      value={values["chồng"]["địa chỉ thường trú mới"]}
                      name="chồng.địa chỉ thường trú mới"
                      onChange={handleChange}
                      fullWidth
                    />
                  </FormControl>
                </Box>
              </Box>
            </Box>
            <Box>
              <Typography variant="body1">Thông tin vợ</Typography>
              <Box>
                <Box
                  display="grid"
                  gridTemplateColumns="1fr 1fr 1fr"
                  gap="10px"
                >
                  <FormControl sx={{ marginBottom: "10px" }}>
                    <FormLabel>Giới tính *</FormLabel>
                    <Select
                      value={values["vợ"]["giới tính"] || ""}
                      name="vợ.giới tính"
                      onChange={handleChange}
                    >
                      <MenuItem value="Ông">Ông</MenuItem>
                      <MenuItem value="Bà">Bà</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl sx={{ marginBottom: "10px" }}>
                    <FormLabel>Tên *</FormLabel>
                    <TextField
                      value={values["vợ"].tên}
                      name="vợ.tên"
                      onChange={handleChange}
                      fullWidth
                    />
                  </FormControl>
                  <FormControl sx={{ marginBottom: "10px" }}>
                    <FormLabel>Ngày sinh *</FormLabel>
                    <TextField
                      type="date"
                      value={values["vợ"]["ngày sinh"]}
                      name="vợ.ngày sinh"
                      onChange={handleChange}
                      fullWidth
                    />
                  </FormControl>
                  <FormControl sx={{ marginBottom: "10px" }}>
                    <FormLabel>Loại giấy tờ *</FormLabel>
                    <Select
                      value={values["vợ"]["loại giấy tờ"]}
                      name="vợ.loại giấy tờ"
                      onChange={handleChange}
                      fullWidth
                    >
                      {CÁC_LOẠI_GIẤY_TỜ_ĐỊNH_DANH.map((item) => (
                        <MenuItem key={item.value} value={item.value}>
                          {item.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl sx={{ marginBottom: "10px" }}>
                    <FormLabel>Số giấy tờ *</FormLabel>
                    <TextField
                      value={values["vợ"]["số giấy tờ"]}
                      name="vợ.số giấy tờ"
                      onChange={handleChange}
                      fullWidth
                    />
                  </FormControl>
                  <FormControl sx={{ marginBottom: "10px" }}>
                    <FormLabel>Ngày cấp *</FormLabel>
                    <TextField
                      type="date"
                      value={values["vợ"]["ngày cấp"]}
                      name="vợ.ngày cấp"
                      onChange={handleChange}
                      fullWidth
                    />
                  </FormControl>
                  <FormControl sx={{ marginBottom: "10px" }}>
                    <FormLabel>Nơi cấp *</FormLabel>
                    <Select
                      value={values["vợ"]["nơi cấp"]}
                      name="vợ.nơi cấp"
                      onChange={handleChange}
                      fullWidth
                    >
                      {NƠI_CẤP_GIẤY_TỜ_ĐỊNH_DANH.map((item) => (
                        <MenuItem key={item.value} value={item.value}>
                          {item.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl sx={{ marginBottom: "10px" }}>
                    <FormLabel>Địa chỉ thường trú cũ *</FormLabel>
                    <TextField
                      value={values["vợ"]["địa chỉ thường trú cũ"]}
                      name="vợ.địa chỉ thường trú cũ"
                      onChange={handleChange}
                      fullWidth
                    />
                  </FormControl>
                  <FormControl sx={{ marginBottom: "10px" }}>
                    <FormLabel>Địa chỉ thường trú mới *</FormLabel>
                    <TextField
                      value={values["vợ"]["địa chỉ thường trú mới"]}
                      name="vợ.địa chỉ thường trú mới"
                      onChange={handleChange}
                      fullWidth
                    />
                  </FormControl>
                </Box>
              </Box>
            </Box>
          </Box>
          <input type="submit" hidden />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Hủy
        </Button>
        <Button onClick={() => handleSubmit()} variant="contained">
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
};
