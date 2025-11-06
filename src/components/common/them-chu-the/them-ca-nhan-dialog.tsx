import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Autocomplete,
  Select,
  MenuItem,
  FormControl,
  FormLabel,
  CircularProgress,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import type { SingleAgreementParty } from "@/models/agreement-entity";
import { GENDER } from "@/models/agreement-entity";
import { useThemChuTheContext } from "@/context/them-chu-the";
import SearchIcon from "@mui/icons-material/Search";
import {
  CÁC_LOẠI_GIẤY_TỜ_ĐỊNH_DANH,
  NƠI_CẤP_GIẤY_TỜ_ĐỊNH_DANH,
} from "@/constants";
import { saveContractEntity, getContractEntity } from "@/api/contract_entity";

interface ThemCaNhanDialogProps {
  open: boolean;
  side: "partyA" | "partyB";
  onClose: () => void;
}

export const ThemCaNhanDialog = ({
  open,
  side,
  onClose,
}: ThemCaNhanDialogProps) => {
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
  } = useThemChuTheContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [notExisted, setNotExisted] = useState<boolean>(false);
  const [searchNumber, setSearchNumber] = useState<string>("");

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

  const {
    values,
    errors,
    touched,
    handleChange,
    handleSubmit,
    setValues,
    setFieldValue,
  } = useFormik<SingleAgreementParty>({
    initialValues: getInitialValues(),
    validationSchema: Yup.object({
      giới_tính: Yup.string().required("Giới tính là bắt buộc"),
      tên: Yup.string().required("Tên là bắt buộc"),
      ngày_sinh: Yup.string().required("Ngày sinh là bắt buộc"),
      loại_giấy_tờ: Yup.string().required("Loại giấy tờ là bắt buộc"),
      số_giấy_tờ: Yup.string()
        .required("Số giấy tờ là bắt buộc")
        .max(12, "Số giấy tờ không được vượt quá 12 ký tự"),
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
      setLoading(true);
      saveContractEntity(values.số_giấy_tờ, values)
        .finally(() => handleClose())
        .finally(() => {
          setLoading(false);
        });
    },
  });

  const handleClose = () => {
    setSinglePartyAEntityIndex(null);
    setSinglePartyBEntityIndex(null);
    onClose();
  };

  const handleSearch = () => {
    if (searchNumber !== "") {
      setLoading(true);
      getContractEntity(searchNumber)
        .then((res) => {
          setNotExisted(false);
          handleFillForm(res);
        })
        .catch(() => {
          setNotExisted(true);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const handleFillForm = (reponse: any) => {
    setValues({
      ...values,
      ...reponse,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xl">
      <DialogTitle>
        <Typography variant="body1" fontSize="2rem" fontWeight="600">
          Thêm thông tin cá nhân
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ padding: "20px" }}>
        <Box
          display="flex"
          alignItems="center"
          gap="10px"
          border="1px solid #e0e0e0"
          p="1rem"
          borderRadius="5px"
          bgcolor="#f5f5f5"
        >
          <Typography fontSize="1.2rem" fontWeight="500">
            Tìm theo số giấy tờ
          </Typography>
          <TextField
            sx={{ width: "400px" }}
            value={searchNumber}
            onChange={(e) => {
              setNotExisted(false);
              setSearchNumber(e.target.value);
            }}
            placeholder="nhập số giấy tờ"
          />
          <Button
            onClick={handleSearch}
            disabled={loading}
            variant="contained"
            color="success"
          >
            {loading ? <CircularProgress size={20} /> : <SearchIcon />}
          </Button>
        </Box>
        {notExisted ? (
          <Typography
            variant="body1"
            fontSize="1.2rem"
            fontWeight="600"
            color="warning.main"
          >
            Số này không tồn tại trong hệ thống và sẽ được lưu lại
          </Typography>
        ) : null}
        <form onSubmit={handleSubmit}>
          <Box
            display="grid"
            gridTemplateColumns="1fr 1fr 1fr"
            gap="10px"
            mt="1rem"
          >
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
                value={values["ngày_sinh"]}
                name="ngày_sinh"
                fullWidth
                error={!!errors["ngày_sinh"] && touched["ngày_sinh"]}
                helperText={errors["ngày_sinh"]}
                onChange={handleChange}
              />
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
              <FormLabel>Loại giấy tờ *</FormLabel>
              <Autocomplete
                freeSolo
                options={CÁC_LOẠI_GIẤY_TỜ_ĐỊNH_DANH.map((o) => o.value)}
                value={values["loại_giấy_tờ"] || ""}
                onChange={(_, newValue) =>
                  setFieldValue("loại_giấy_tờ", (newValue as string) || "")
                }
                onInputChange={(_, newInputValue) =>
                  setFieldValue("loại_giấy_tờ", newInputValue)
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    error={!!errors["loại_giấy_tờ"] && touched["loại_giấy_tờ"]}
                    helperText={
                      (touched["loại_giấy_tờ"] && errors["loại_giấy_tờ"]) || ""
                    }
                  />
                )}
              />
            </FormControl>
            <FormControl sx={{ marginBottom: "10px" }}>
              <FormLabel>Ngày cấp *</FormLabel>
              <TextField
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
              <Autocomplete
                freeSolo
                options={NƠI_CẤP_GIẤY_TỜ_ĐỊNH_DANH.map((o) => o.value)}
                value={values["nơi_cấp"] || ""}
                onChange={(_, newValue) =>
                  setFieldValue("nơi_cấp", (newValue as string) || "")
                }
                onInputChange={(_, newInputValue) =>
                  setFieldValue("nơi_cấp", newInputValue)
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    error={!!errors["nơi_cấp"] && touched["nơi_cấp"]}
                    helperText={(touched["nơi_cấp"] && errors["nơi_cấp"]) || ""}
                  />
                )}
              />
            </FormControl>
            <FormControl sx={{ marginBottom: "10px", gridColumn: "span 2" }}>
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
        <Button
          variant="contained"
          disabled={loading}
          onClick={() => handleSubmit()}
        >
          Thêm
        </Button>
      </DialogActions>
    </Dialog>
  );
};
