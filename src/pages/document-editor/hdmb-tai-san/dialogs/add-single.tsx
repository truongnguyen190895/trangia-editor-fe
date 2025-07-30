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
  FormHelperText,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import type { SingleAgreementParty } from "@/models/agreement-entity";
import { GENDER } from "@/models/agreement-entity";
import { useHDMBTaiSanContext } from "@/context/hdmb-tai-san";
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
  } = useHDMBTaiSanContext();
  const singleParty = side === "partyA" ? partyA : partyB;
  const singlePartyEntities = singleParty["cá_nhân"];
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
      giới_tính: GENDER.MALE,
      tên: "",
      ngày_sinh: "",
      loại_giấy_tờ: "",
      số_giấy_tờ: "",
      ngày_cấp: "",
      nơi_cấp: "",
      địa_chỉ_thường_trú: "",
      tình_trạng_hôn_nhân: "",
      quan_hệ: null,
    };
  };

  const isEdit = partyEntityIndex !== null;

  const { values, errors, touched, handleChange, handleSubmit } =
    useFormik<SingleAgreementParty>({
      initialValues: getInitialValues(),
      validationSchema: Yup.object({
        giới_tính: Yup.string().required("Giới tính là bắt buộc"),
        tên: Yup.string().required("Tên là bắt buộc"),
        ngày_sinh: Yup.string().required("Ngày sinh là bắt buộc"),
        loại_giấy_tờ: Yup.string().required("Loại giấy tờ là bắt buộc"),
        số_giấy_tờ: Yup.string().required("Số giấy tờ là bắt buộc"),
        ngày_cấp: Yup.string().required("Ngày cấp là bắt buộc"),
        nơi_cấp: Yup.string().required("Nơi cấp là bắt buộc"),
        địa_chỉ_thường_trú: Yup.string().required(
          "Địa chỉ thường trú là bắt buộc"
        ),
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
                value={values["giới_tính"] || ""}
                name="giới_tính"
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
                value={values["ngày_sinh"]}
                name="ngày_sinh"
                fullWidth
                error={!!errors["ngày_sinh"] && touched["ngày_sinh"]}
                helperText={errors["ngày_sinh"]}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl sx={{ marginBottom: "10px" }}>
              <FormLabel>Loại giấy tờ *</FormLabel>
              <Select
                value={values["loại_giấy_tờ"]}
                name="loại_giấy_tờ"
                onChange={handleChange}
                fullWidth
                error={!!errors["loại_giấy_tờ"] && touched["loại_giấy_tờ"]}
              >
                {CÁC_LOẠI_GIẤY_TỜ_ĐỊNH_DANH.map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
              {errors["loại_giấy_tờ"] && touched["loại_giấy_tờ"] && (
                <FormHelperText error>{errors["loại_giấy_tờ"]}</FormHelperText>
              )}
            </FormControl>
            <FormControl sx={{ marginBottom: "10px" }}>
              <FormLabel>Số giấy tờ *</FormLabel>
              <TextField
                value={values["số_giấy_tờ"]}
                name="số_giấy_tờ"
                onChange={handleChange}
                fullWidth
                error={!!errors["số_giấy_tờ"] && touched["số_giấy_tờ"]}
                helperText={errors["số_giấy_tờ"]}
              />
            </FormControl>
            <FormControl sx={{ marginBottom: "10px" }}>
              <FormLabel>Ngày cấp *</FormLabel>
              <TextField
                type="date"
                value={values["ngày_cấp"]}
                name="ngày_cấp"
                onChange={handleChange}
                fullWidth
                error={!!errors["ngày_cấp"] && touched["ngày_cấp"]}
                helperText={errors["ngày_cấp"]}
              />
            </FormControl>
            <FormControl sx={{ marginBottom: "10px" }}>
              <FormLabel>Nơi cấp *</FormLabel>
              <Select
                value={values["nơi_cấp"]}
                name="nơi_cấp"
                onChange={handleChange}
                fullWidth
                error={!!errors["nơi_cấp"] && touched["nơi_cấp"]}
              >
                {NƠI_CẤP_GIẤY_TỜ_ĐỊNH_DANH.map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
              {errors["nơi_cấp"] && touched["nơi_cấp"] && (
                <FormHelperText error>{errors["nơi_cấp"]}</FormHelperText>
              )}
            </FormControl>
            <FormControl sx={{ marginBottom: "10px" }}>
              <FormLabel>Địa chỉ thường trú *</FormLabel>
              <TextField
                value={values["địa_chỉ_thường_trú"]}
                name="địa_chỉ_thường_trú"
                fullWidth
                error={
                  !!errors["địa_chỉ_thường_trú"] &&
                  touched["địa_chỉ_thường_trú"]
                }
                helperText={errors["địa_chỉ_thường_trú"]}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl sx={{ marginBottom: "10px", gridColumn: "span 3" }}>
              <FormLabel>Tình trạng hôn nhân</FormLabel>
              <TextField
                value={values["tình_trạng_hôn_nhân"]}
                name="tình_trạng_hôn_nhân"
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
