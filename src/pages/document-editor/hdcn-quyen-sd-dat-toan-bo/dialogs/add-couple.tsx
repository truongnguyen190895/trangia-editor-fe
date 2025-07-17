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
  FormHelperText,
} from "@mui/material";
import { useHdcnQuyenSdDatContext } from "@/context/hdcn-quyen-sd-dat-context";
import type { Couple } from "@/models/agreement-entity";
import { GENDER } from "@/models/agreement-entity";
import { useFormik } from "formik";
import {
  CÁC_LOẠI_GIẤY_TỜ_ĐỊNH_DANH,
  NƠI_CẤP_GIẤY_TỜ_ĐỊNH_DANH,
} from "@/constants";
import * as Yup from "yup";

interface AddCoupleDialogProps {
  open: boolean;
  side: "partyA" | "partyB";
  onClose: () => void;
}

const validationSchema = Yup.object({
  "chồng": Yup.object({
    "giới_tính": Yup.string().required("Giới tính là bắt buộc"),
    tên: Yup.string().required("Tên là bắt buộc"),
    "ngày_sinh": Yup.string().required("Ngày sinh là bắt buộc"),
    "loại_giấy_tờ": Yup.string().required("Loại giấy tờ là bắt buộc"),
    "số_giấy_tờ": Yup.string().required("Số giấy tờ là bắt buộc"),
    "ngày_cấp": Yup.string().required("Ngày cấp là bắt buộc"),
    "nơi_cấp": Yup.string().required("Nơi cấp là bắt buộc"),
    "địa_chỉ_thường_trú_cũ": Yup.string().required("Địa chỉ thường trú cũ là bắt buộc"),
    "địa_chỉ_thường_trú_mới": Yup.string().required("Địa chỉ thường trú mới là bắt buộc"),
  }),
  "vợ": Yup.object({
    "giới_tính": Yup.string().required("Giới tính là bắt buộc"),
    tên: Yup.string().required("Tên là bắt buộc"),
    "ngày_sinh": Yup.string().required("Ngày sinh là bắt buộc"),
    "loại_giấy_tờ": Yup.string().required("Loại giấy tờ là bắt buộc"),
    "số_giấy_tờ": Yup.string().required("Số giấy tờ là bắt buộc"),
    "ngày_cấp": Yup.string().required("Ngày cấp là bắt buộc"),
    "nơi_cấp": Yup.string().required("Nơi cấp là bắt buộc"),
    "địa_chỉ_thường_trú_cũ": Yup.string().required("Địa chỉ thường trú cũ là bắt buộc"),
    "địa_chỉ_thường_trú_mới": Yup.string().required("Địa chỉ thường trú mới là bắt buộc"),
  }),
});

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
      return partyA["vợ_chồng"][couplePartyAEntityIndex];
    } else if (side === "partyB" && couplePartyBEntityIndex !== null) {
      return partyB["vợ_chồng"][couplePartyBEntityIndex];
    } else {
      return {
        chồng: {
          "giới_tính": GENDER.MALE,
          tên: "",
          "ngày_sinh": "",
          "loại_giấy_tờ": "",
          "số_giấy_tờ": "",
          "ngày_cấp": "",
          "nơi_cấp": "",
          "địa_chỉ_thường_trú_cũ": "",
          "địa_chỉ_thường_trú_mới": "",
          "quan_hệ": null,
        },
        vợ: {
          "giới_tính": GENDER.FEMALE,
          tên: "",
          "ngày_sinh": "",
          "loại_giấy_tờ": "",
          "số_giấy_tờ": "",
          "ngày_cấp": "",
          "nơi_cấp": "",
          "địa_chỉ_thường_trú_cũ": "",
          "địa_chỉ_thường_trú_mới": "",
          "quan_hệ": null,
        },
      };
    }
  };

  const { values, errors, handleChange, handleSubmit } = useFormik<Couple>({
    initialValues: getInitialValues(),
    validationSchema,
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

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xl">
      <DialogTitle>
        <Typography variant="body1" fontSize="2rem" fontWeight="600">Thêm thông tin vợ chồng</Typography>
      </DialogTitle>
      <DialogContent sx={{ padding: "20px" }}>
        <form>
          <Box display="grid" gridTemplateColumns="1fr 1fr" gap="4rem">
            <Box>
              <Typography variant="body1" sx={{ marginBottom: "20px" }}>Thông tin chồng</Typography>
              <Box border="1px solid #ccc" borderRadius="10px" padding="20px">
                <Box
                  display="grid"
                  gridTemplateColumns="1fr 1fr 1fr"
                  gap="10px"
                >
                  <FormControl sx={{ marginBottom: "10px" }}>
                    <FormLabel>Giới tính *</FormLabel>
                    <Select
                      value={values["chồng"]["giới_tính"] || ""}
                      name="chồng.giới_tính"
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
                      error={!!errors["chồng"]?.["tên"]}
                      helperText={errors["chồng"]?.["tên"]}
                      onChange={handleChange}
                      fullWidth
                    />
                  </FormControl>
                  <FormControl sx={{ marginBottom: "10px" }}>
                    <FormLabel>Ngày sinh *</FormLabel>
                    <TextField
                      type="date"
                      value={values["chồng"]["ngày_sinh"]}
                      name="chồng.ngày_sinh"
                      onChange={handleChange}
                      fullWidth
                      error={!!errors["chồng"]?.["ngày_sinh"]}
                      helperText={errors["chồng"]?.["ngày_sinh"]}
                    />
                  </FormControl>
                  <FormControl sx={{ marginBottom: "10px" }}>
                    <FormLabel>Loại giấy tờ *</FormLabel>
                    <Select
                      value={values["chồng"]["loại_giấy_tờ"]}
                      name="chồng.loại_giấy_tờ"
                      onChange={handleChange}
                      fullWidth
                      error={!!errors["chồng"]?.["loại_giấy_tờ"]}
                    >
                      {CÁC_LOẠI_GIẤY_TỜ_ĐỊNH_DANH.map((item) => (
                        <MenuItem key={item.value} value={item.value}>
                          {item.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors["chồng"]?.["loại_giấy_tờ"] && (
                      <FormHelperText error>{errors["chồng"]?.["loại_giấy_tờ"]}</FormHelperText>
                    )}
                  </FormControl>
                  <FormControl sx={{ marginBottom: "10px" }}>
                    <FormLabel>Số giấy tờ *</FormLabel>
                    <TextField
                      value={values["chồng"]["số_giấy_tờ"]}
                      name="chồng.số_giấy_tờ"
                      error={!!errors["chồng"]?.["số_giấy_tờ"]}
                      helperText={errors["chồng"]?.["số_giấy_tờ"]}
                      onChange={handleChange}
                      fullWidth
                    />
                  </FormControl>
                  <FormControl sx={{ marginBottom: "10px" }}>
                    <FormLabel>Ngày cấp *</FormLabel>
                    <TextField
                      type="date"
                      value={values["chồng"]["ngày_cấp"]}
                      name="chồng.ngày_cấp"
                      onChange={handleChange}
                      fullWidth
                      error={!!errors["chồng"]?.["ngày_cấp"]}
                      helperText={errors["chồng"]?.["ngày_cấp"]}
                    />
                  </FormControl>
                  <FormControl sx={{ marginBottom: "10px" }}>
                    <FormLabel>Nơi cấp *</FormLabel>
                    <Select
                      value={values["chồng"]["nơi_cấp"]}
                      name="chồng.nơi_cấp"
                      onChange={handleChange}
                      fullWidth
                      error={!!errors["chồng"]?.["nơi_cấp"]}
                    >
                      {NƠI_CẤP_GIẤY_TỜ_ĐỊNH_DANH.map((item) => (
                        <MenuItem key={item.value} value={item.value}>
                          {item.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors["chồng"]?.["nơi_cấp"] && (
                      <FormHelperText error>{errors["chồng"]?.["nơi_cấp"]}</FormHelperText>
                    )}
                  </FormControl>
                  <FormControl sx={{ marginBottom: "10px" }}>
                    <FormLabel>Địa chỉ thường trú cũ *</FormLabel>
                    <TextField
                      value={values["chồng"]["địa_chỉ_thường_trú_cũ"]}
                      name="chồng.địa_chỉ_thường_trú_cũ"
                      onChange={handleChange}
                      fullWidth
                      error={!!errors["chồng"]?.["địa_chỉ_thường_trú_cũ"]}
                      helperText={errors["chồng"]?.["địa_chỉ_thường_trú_cũ"]}
                    />
                  </FormControl>
                  <FormControl sx={{ marginBottom: "10px" }}>
                    <FormLabel>Địa chỉ thường trú mới *</FormLabel>
                    <TextField
                      value={values["chồng"]["địa_chỉ_thường_trú_mới"]}
                      name="chồng.địa_chỉ_thường_trú_mới"
                      onChange={handleChange}
                      fullWidth
                      error={!!errors["chồng"]?.["địa_chỉ_thường_trú_mới"]}
                      helperText={errors["chồng"]?.["địa_chỉ_thường_trú_mới"]}
                    />
                  </FormControl>
                </Box>
              </Box>
            </Box>
            <Box>
              <Typography variant="body1" sx={{ marginBottom: "20px" }}>Thông tin vợ</Typography>
              <Box border="1px solid #ccc" borderRadius="10px" padding="20px">
                <Box
                  display="grid"
                  gridTemplateColumns="1fr 1fr 1fr"
                  gap="10px"
                >
                  <FormControl sx={{ marginBottom: "10px" }}>
                    <FormLabel>Giới tính *</FormLabel>
                    <Select
                      value={values["vợ"]["giới_tính"] || ""}
                      name="vợ.giới_tính"
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
                      error={!!errors["vợ"]?.["tên"]}
                      helperText={errors["vợ"]?.["tên"]}
                      onChange={handleChange}
                      fullWidth
                    />
                  </FormControl>
                  <FormControl sx={{ marginBottom: "10px" }}>
                    <FormLabel>Ngày sinh *</FormLabel>
                    <TextField
                      type="date"
                      value={values["vợ"]["ngày_sinh"]}
                      name="vợ.ngày_sinh"
                      onChange={handleChange}
                      fullWidth
                      error={!!errors["vợ"]?.["ngày_sinh"]}
                      helperText={errors["vợ"]?.["ngày_sinh"]}
                    />
                  </FormControl>
                  <FormControl sx={{ marginBottom: "10px" }}>
                    <FormLabel>Loại giấy tờ *</FormLabel>
                    <Select
                      value={values["vợ"]["loại_giấy_tờ"]}
                      name="vợ.loại_giấy_tờ"
                      onChange={handleChange}
                      fullWidth
                      error={!!errors["vợ"]?.["loại_giấy_tờ"]}
                    >
                      {CÁC_LOẠI_GIẤY_TỜ_ĐỊNH_DANH.map((item) => (
                        <MenuItem key={item.value} value={item.value}>
                          {item.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors["vợ"]?.["loại_giấy_tờ"] && (
                      <FormHelperText error>{errors["vợ"]?.["loại_giấy_tờ"]}</FormHelperText>
                    )}
                  </FormControl>
                  <FormControl sx={{ marginBottom: "10px" }}>
                    <FormLabel>Số giấy tờ *</FormLabel>
                    <TextField
                      value={values["vợ"]["số_giấy_tờ"]}
                      name="vợ.số_giấy_tờ"
                      onChange={handleChange}
                      fullWidth
                      error={!!errors["vợ"]?.["số_giấy_tờ"]}
                      helperText={errors["vợ"]?.["số_giấy_tờ"]}
                    />
                  </FormControl>
                  <FormControl sx={{ marginBottom: "10px" }}>
                    <FormLabel>Ngày cấp *</FormLabel>
                    <TextField
                      type="date"
                      value={values["vợ"]["ngày_cấp"]}
                      name="vợ.ngày_cấp"
                      onChange={handleChange}
                      fullWidth
                      error={!!errors["vợ"]?.["ngày_cấp"]}
                      helperText={errors["vợ"]?.["ngày_cấp"]}
                    />
                  </FormControl>
                  <FormControl sx={{ marginBottom: "10px" }}>
                    <FormLabel>Nơi cấp *</FormLabel>
                    <Select
                      value={values["vợ"]["nơi_cấp"]}
                      name="vợ.nơi_cấp"
                      onChange={handleChange}
                      fullWidth
                      error={!!errors["vợ"]?.["nơi_cấp"]}
                    >
                      {NƠI_CẤP_GIẤY_TỜ_ĐỊNH_DANH.map((item) => (
                        <MenuItem key={item.value} value={item.value}>
                          {item.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors["vợ"]?.["nơi_cấp"] && (
                      <FormHelperText error>{errors["vợ"]?.["nơi_cấp"]}</FormHelperText>
                    )}
                  </FormControl>
                  <FormControl sx={{ marginBottom: "10px" }}>
                    <FormLabel>Địa chỉ thường trú cũ *</FormLabel>
                    <TextField
                      value={values["vợ"]["địa_chỉ_thường_trú_cũ"]}
                      name="vợ.địa_chỉ_thường_trú_cũ"
                      onChange={handleChange}
                      fullWidth
                      error={!!errors["vợ"]?.["địa_chỉ_thường_trú_cũ"]}
                      helperText={errors["vợ"]?.["địa_chỉ_thường_trú_cũ"]}
                    />
                  </FormControl>
                  <FormControl sx={{ marginBottom: "10px" }}>
                    <FormLabel>Địa chỉ thường trú mới *</FormLabel>
                    <TextField
                      value={values["vợ"]["địa_chỉ_thường_trú_mới"]}
                      name="vợ.địa_chỉ_thường_trú_mới"
                      onChange={handleChange}
                      fullWidth
                      error={!!errors["vợ"]?.["địa_chỉ_thường_trú_mới"]}
                      helperText={errors["vợ"]?.["địa_chỉ_thường_trú_mới"]}
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
