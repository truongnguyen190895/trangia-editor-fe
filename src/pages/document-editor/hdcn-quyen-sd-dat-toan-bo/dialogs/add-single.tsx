import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  FormLabel,
  FormHelperText
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import type { SingleAgreementParty } from "@/models/agreement-entity";
import { GENDER } from "@/models/agreement-entity";
import { useHdcnQuyenSdDatContext } from "@/context/hdcn-quyen-sd-dat-context";
import {
  CÁC_LOẠI_GIẤY_TỜ_ĐỊNH_DANH,
  NƠI_CẤP_GIẤY_TỜ_ĐỊNH_DANH,
} from "@/constants";

interface AddSingleDialogProps {
  open: boolean;
  side: "partyA" | "partyB";
  onClose: () => void;
}

export const AddSingleDialog = ({
  open,
  side,
  onClose,
}: AddSingleDialogProps) => {
  const {
    partyA,
    partyB,
    singlePartyAEntityIndex,
    singlePartyBEntityIndex,
    addSinglePartyAEntity,
    addSinglePartyBEntity,
    editSinglePartyAEntity,
    editSinglePartyBEntity,
    setSinglePartyAEntityIndex,
    setSinglePartyBEntityIndex,
  } = useHdcnQuyenSdDatContext();
  const singleParty = side === "partyA" ? partyA : partyB;
  const singlePartyEntities = singleParty["cá nhân"];
  const addPartyEntity =
    side === "partyA" ? addSinglePartyAEntity : addSinglePartyBEntity;
  const editPartyEntity =
    side === "partyA" ? editSinglePartyAEntity : editSinglePartyBEntity;
  const partyEntityIndex =
    side === "partyA" ? singlePartyAEntityIndex : singlePartyBEntityIndex;

  const getInitialValues = () => {
    if (partyEntityIndex !== null) {
      return singlePartyEntities[partyEntityIndex];
    }
    return {
      "giới tính": GENDER.MALE,
      tên: "",
      "ngày sinh": "",
      "loại giấy tờ": "",
      "số giấy tờ": "",
      "ngày cấp": "",
      "nơi cấp": "",
      "địa chỉ thường trú cũ": "",
      "địa chỉ thường trú mới": "",
      "tình trạng hôn nhân": "",
    };
  };

  const isEdit = partyEntityIndex !== null;

  const { values, errors, touched, handleChange, handleSubmit } =
    useFormik<SingleAgreementParty>({
      initialValues: getInitialValues(),
      validationSchema: Yup.object({
        "giới tính": Yup.string().required("Giới tính là bắt buộc"),
        tên: Yup.string().required("Tên là bắt buộc"),
        "ngày sinh": Yup.string().required("Ngày sinh là bắt buộc"),
        "loại giấy tờ": Yup.string().required("Loại giấy tờ là bắt buộc"),
        "số giấy tờ": Yup.string().required("Số giấy tờ là bắt buộc"),
        "ngày cấp": Yup.string().required("Ngày cấp là bắt buộc"),
        "nơi cấp": Yup.string().required("Nơi cấp là bắt buộc"),
        "địa chỉ thường trú cũ": Yup.string().required("Địa chỉ thường trú cũ là bắt buộc"),
        "địa chỉ thường trú mới": Yup.string().required("Địa chỉ thường trú mới là bắt buộc"),
      }),
      onSubmit: (values) => {
        if (isEdit) {
          editPartyEntity(values, partyEntityIndex as number);
        } else {
          addPartyEntity(values);
        }
        handleClose();
      },
    });

  const handleClose = () => {
    setSinglePartyAEntityIndex(null);
    setSinglePartyBEntityIndex(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xl">
      <DialogTitle>
        <Typography variant="body1" fontSize="2rem" fontWeight="600">
          Thêm thông tin cá nhân
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ padding: "20px" }}>
        <form onSubmit={handleSubmit}>
          <Box display="grid" gridTemplateColumns="1fr 1fr 1fr" gap="10px">
            <FormControl sx={{ marginBottom: "10px" }}>
              <FormLabel>Giới tính *</FormLabel>
              <Select
                value={values["giới tính"] || ""}
                name="giới tính"
                onChange={handleChange}
              >
                <MenuItem value="Ông">Ông</MenuItem>
                <MenuItem value="Bà">Bà</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ marginBottom: "10px" }}>
              <FormLabel>Tên *</FormLabel>
              <TextField
                value={values.tên}
                name="tên"
                fullWidth
                error={!!errors.tên && touched.tên}
                helperText={errors.tên}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl sx={{ marginBottom: "10px" }}>
              <FormLabel>Ngày sinh *</FormLabel>
              <TextField
                type="date"
                value={values["ngày sinh"]}
                name="ngày sinh"
                fullWidth
                error={!!errors["ngày sinh"] && touched["ngày sinh"]}
                helperText={errors["ngày sinh"]}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl sx={{ marginBottom: "10px" }}>
              <FormLabel>Loại giấy tờ *</FormLabel>
              <Select
                value={values["loại giấy tờ"]}
                name="loại giấy tờ"
                onChange={handleChange}
                fullWidth
                error={!!errors["loại giấy tờ"] && touched["loại giấy tờ"]}
              >
                {CÁC_LOẠI_GIẤY_TỜ_ĐỊNH_DANH.map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
              {errors["loại giấy tờ"] && touched["loại giấy tờ"] && (
                <FormHelperText error>{errors["loại giấy tờ"]}</FormHelperText>
              )}
            </FormControl>
            <FormControl sx={{ marginBottom: "10px" }}>
              <FormLabel>Số giấy tờ *</FormLabel>
              <TextField
                value={values["số giấy tờ"]}
                name="số giấy tờ"
                onChange={handleChange}
                fullWidth
                error={!!errors["số giấy tờ"] && touched["số giấy tờ"]}
                helperText={errors["số giấy tờ"]}
              />
            </FormControl>
            <FormControl sx={{ marginBottom: "10px" }}>
              <FormLabel>Ngày cấp *</FormLabel>
              <TextField
                type="date"
                value={values["ngày cấp"]}
                name="ngày cấp"
                onChange={handleChange}
                fullWidth
                error={!!errors["ngày cấp"] && touched["ngày cấp"]}
                helperText={errors["ngày cấp"]}
              />
            </FormControl>
            <FormControl sx={{ marginBottom: "10px" }}>
              <FormLabel>Nơi cấp *</FormLabel>
              <Select
                value={values["nơi cấp"]}
                name="nơi cấp"
                onChange={handleChange}
                fullWidth
                error={!!errors["nơi cấp"] && touched["nơi cấp"]}
              >
                {NƠI_CẤP_GIẤY_TỜ_ĐỊNH_DANH.map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
              {errors["nơi cấp"] && touched["nơi cấp"] && (
                <FormHelperText error>{errors["nơi cấp"]}</FormHelperText>
              )}
            </FormControl>
            <FormControl sx={{ marginBottom: "10px" }}>
              <FormLabel>Địa chỉ thường trú cũ *</FormLabel>
              <TextField
                value={values["địa chỉ thường trú cũ"]}
                name="địa chỉ thường trú cũ"
                onChange={handleChange}
                fullWidth
                error={!!errors["địa chỉ thường trú cũ"] && touched["địa chỉ thường trú cũ"]}
                helperText={errors["địa chỉ thường trú cũ"]}
              />
            </FormControl>
            <FormControl sx={{ marginBottom: "10px" }}>
              <FormLabel>Địa chỉ thường trú mới *</FormLabel>
              <TextField
                value={values["địa chỉ thường trú mới"]}
                name="địa chỉ thường trú mới"
                onChange={handleChange}
                fullWidth
                error={!!errors["địa chỉ thường trú mới"] && touched["địa chỉ thường trú mới"]}
                helperText={errors["địa chỉ thường trú mới"]}
              />
            </FormControl>
            <FormControl sx={{ marginBottom: "10px", gridColumn: "span 3" }}>
              <FormLabel>Tình trạng hôn nhân</FormLabel>
              <TextField
                value={values["tình trạng hôn nhân"]}
                name="tình trạng hôn nhân"
                onChange={handleChange}
                fullWidth
                multiline
                rows={4}
              />
            </FormControl>
          </Box>
          <input type="submit" hidden />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose()} variant="outlined">
          Hủy
        </Button>
        <Button variant="contained" onClick={() => handleSubmit()}>
          Thêm
        </Button>
      </DialogActions>
    </Dialog>
  );
};
