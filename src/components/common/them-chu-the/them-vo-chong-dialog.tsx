import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  FormControl,
  FormLabel,
  Autocomplete,
  Select,
  MenuItem,
  Button,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";
import { useThemChuTheContext } from "@/context/them-chu-the";
import type { Couple } from "@/models/chu-the-hop-dong";
import { GENDER } from "@/models/chu-the-hop-dong";
import { useFormik } from "formik";
import {
  CÁC_LOẠI_GIẤY_TỜ_ĐỊNH_DANH,
  NƠI_CẤP_GIẤY_TỜ_ĐỊNH_DANH,
} from "@/constants";
import * as Yup from "yup";
import { saveContractEntity, getContractEntity } from "@/api/contract_entity";
import { CopyMapper } from "../copy-mapper";

interface ThemVoChongDialogProps {
  open: boolean;
  side: "partyA" | "partyB";
  onClose: () => void;
}

const validationSchema = Yup.object({
  chồng: Yup.object({
    giới_tính: Yup.string().required("Giới tính là bắt buộc"),
    tên: Yup.string().required("Tên là bắt buộc"),
    ngày_sinh: Yup.string().required("Ngày sinh là bắt buộc"),
    loại_giấy_tờ: Yup.string().required("Loại giấy tờ là bắt buộc"),
    số_giấy_tờ: Yup.string()
      .required("Số giấy tờ là bắt buộc")
      .max(12, "Số giấy tờ không được vượt quá 12 ký tự"),
    ngày_cấp: Yup.string().required("Ngày cấp là bắt buộc"),
    nơi_cấp: Yup.string().required("Nơi cấp là bắt buộc"),
    địa_chỉ_thường_trú: Yup.string().required("Địa chỉ thường trú là bắt buộc"),
  }),
  vợ: Yup.object({
    giới_tính: Yup.string().required("Giới tính là bắt buộc"),
    tên: Yup.string().required("Tên là bắt buộc"),
    ngày_sinh: Yup.string().required("Ngày sinh là bắt buộc"),
    loại_giấy_tờ: Yup.string().required("Loại giấy tờ là bắt buộc"),
    số_giấy_tờ: Yup.string()
      .required("Số giấy tờ là bắt buộc")
      .max(12, "Số giấy tờ không được vượt quá 12 ký tự"),
    ngày_cấp: Yup.string().required("Ngày cấp là bắt buộc"),
    nơi_cấp: Yup.string().required("Nơi cấp là bắt buộc"),
    địa_chỉ_thường_trú: Yup.string().required("Địa chỉ thường trú là bắt buộc"),
  }),
});

export const ThemVoChongDialog = ({
  open,
  side,
  onClose,
}: ThemVoChongDialogProps) => {
  const [loadingHusband, setLoadingHusband] = useState(false);
  const [loadingWife, setLoadingWife] = useState(false);
  const [searchNumberHusband, setSearchNumberHusband] = useState("");
  const [searchNumberWife, setSearchNumberWife] = useState("");
  const [isNotExistedHusband, setIsNotExistedHusband] = useState(false);
  const [isNotExistedWife, setIsNotExistedWife] = useState(false);
  const {
    partyA,
    partyB,
    couplePartyAEntityIndex,
    couplePartyBEntityIndex,
    addCouplePartyAEntity,
    addCouplePartyBEntity,
    editCouplePartyAEntity,
    editCouplePartyBEntity,
  } = useThemChuTheContext();

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
          giới_tính: GENDER.MALE,
          tên: "",
          ngày_sinh: "",
          loại_giấy_tờ: "",
          số_giấy_tờ: "",
          ngày_cấp: "",
          nơi_cấp: "",
          địa_chỉ_thường_trú: "",
          quan_hệ: null,
          tình_trạng_hôn_nhân_vợ_chồng: null,
        },
        vợ: {
          giới_tính: GENDER.FEMALE,
          tên: "",
          ngày_sinh: "",
          loại_giấy_tờ: "",
          số_giấy_tờ: "",
          ngày_cấp: "",
          nơi_cấp: "",
          địa_chỉ_thường_trú: "",
          quan_hệ: null,
          tình_trạng_hôn_nhân_vợ_chồng: null,
        },
      };
    }
  };

  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    setValues,
    setFieldValue,
  } = useFormik<Couple>({
    initialValues: getInitialValues(),
    validationSchema,
    onSubmit: (values) => {
      handleSubmitCouple(values);
    },
  });

  const handleSubmitCouple = async (values: Couple) => {
    if (isEdit) {
      editPartyEntity(values, partyEntityIndex as number);
    } else {
      addPartyEntity(values);
    }
    try {
      const husband = values.chồng;
      const wife = values.vợ;
      await saveContractEntity(husband.số_giấy_tờ, husband);
      await saveContractEntity(wife.số_giấy_tờ, wife);
    } catch (error) {
      console.error(error);
    } finally {
      onClose();
    }
  };

  const handleSearchHusband = () => {
    if (searchNumberHusband !== "") {
      setLoadingHusband(true);
      getContractEntity(searchNumberHusband)
        .then((res) => {
          setIsNotExistedHusband(false);
          setValues({
            ...values,
            chồng: res,
          });
        })
        .catch(() => {
          setIsNotExistedHusband(true);
        })
        .finally(() => {
          setLoadingHusband(false);
        });
    }
  };

  const handleSearchWife = () => {
    if (searchNumberWife !== "") {
      setLoadingWife(true);
      getContractEntity(searchNumberWife)
        .then((res) => {
          setIsNotExistedWife(false);
          setValues({
            ...values,
            vợ: res,
          });
        })
        .catch(() => {
          setIsNotExistedWife(true);
        })
        .finally(() => {
          setLoadingWife(false);
        });
    }
  };

  const handleScanSuccessHusband = (text: Record<string, string>) => {
    setValues({
      ...values,
      chồng: {
        ...values.chồng,
        số_giấy_tờ: text?.cccd,
        tên: text?.hoTen,
        ngày_sinh: text?.ngaySinh,
        giới_tính: text?.gioiTinh === "Nam" ? GENDER.MALE : GENDER.FEMALE,
        địa_chỉ_thường_trú: text?.noiThuongTru,
        ngày_cấp: text?.ngayCapCCCD,
      },
    });
  };

  const handleScanSuccessWife = (text: Record<string, string>) => {
    setValues({
      ...values,
      vợ: {
        ...values.vợ,
        số_giấy_tờ: text?.cccd,
        tên: text?.hoTen,
        ngày_sinh: text?.ngaySinh,
        giới_tính: text?.gioiTinh === "Nam" ? GENDER.MALE : GENDER.FEMALE,
        địa_chỉ_thường_trú: text?.noiThuongTru,
        ngày_cấp: text?.ngayCapCCCD,
      },
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xl">
      <DialogTitle>
        <Typography variant="body1" fontSize="2rem" fontWeight="600">
          Thêm thông tin vợ chồng
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ padding: "20px" }}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <Box display="grid" gridTemplateColumns="1fr 1fr" gap="2rem">
            <Box>
              <Typography
                variant="body1"
                fontSize="1.4rem"
                fontWeight="600"
                sx={{ marginBottom: "20px" }}
              >
                Thông tin chồng
              </Typography>
              <Box
                display="flex"
                alignItems="center"
                gap="10px"
                border="1px solid #e0e0e0"
                p="1rem"
                borderRadius="5px"
                bgcolor="#f5f5f5"
                mb="1rem"
              >
                <TextField
                  sx={{ width: "400px" }}
                  value={searchNumberHusband}
                  onChange={(e) => {
                    setIsNotExistedHusband(false);
                    setSearchNumberHusband(e.target.value);
                  }}
                  placeholder="nhập số giấy tờ chồng"
                />
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleSearchHusband}
                  disabled={loadingHusband}
                >
                  {loadingHusband ? (
                    <CircularProgress size={20} />
                  ) : (
                    <SearchIcon />
                  )}
                </Button>
              </Box>
              {isNotExistedHusband ? (
                <Typography
                  variant="body1"
                  fontSize="1.2rem"
                  fontWeight="600"
                  color="warning.main"
                >
                  Số này không tồn tại trong hệ thống và sẽ được lưu lại
                </Typography>
              ) : null}
              <CopyMapper onMapped={handleScanSuccessHusband} />
              <Box
                border="1px solid #ccc"
                borderRadius="10px"
                padding="20px"
                mt="1rem"
              >
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
                    <Autocomplete
                      freeSolo
                      options={CÁC_LOẠI_GIẤY_TỜ_ĐỊNH_DANH.map((o) => o.value)}
                      value={values["chồng"]["loại_giấy_tờ"] || ""}
                      onChange={(_, newValue) =>
                        setFieldValue(
                          "chồng.loại_giấy_tờ",
                          (newValue as string) || ""
                        )
                      }
                      onInputChange={(_, newInputValue) =>
                        setFieldValue("chồng.loại_giấy_tờ", newInputValue)
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          error={!!errors["chồng"]?.["loại_giấy_tờ"]}
                          helperText={errors["chồng"]?.["loại_giấy_tờ"] || ""}
                        />
                      )}
                    />
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
                    <Autocomplete
                      freeSolo
                      options={NƠI_CẤP_GIẤY_TỜ_ĐỊNH_DANH.map((o) => o.value)}
                      value={values["chồng"]["nơi_cấp"] || ""}
                      onChange={(_, newValue) =>
                        setFieldValue(
                          "chồng.nơi_cấp",
                          (newValue as string) || ""
                        )
                      }
                      onInputChange={(_, newInputValue) =>
                        setFieldValue("chồng.nơi_cấp", newInputValue)
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          error={!!errors["chồng"]?.["nơi_cấp"]}
                          helperText={errors["chồng"]?.["nơi_cấp"] || ""}
                        />
                      )}
                    />
                  </FormControl>
                  <FormControl
                    sx={{ marginBottom: "10px", gridColumn: "span 2" }}
                  >
                    <FormLabel>Địa chỉ thường trú *</FormLabel>
                    <TextField
                      value={values["chồng"]["địa_chỉ_thường_trú"]}
                      name="chồng.địa_chỉ_thường_trú"
                      onChange={handleChange}
                      fullWidth
                      error={!!errors["chồng"]?.["địa_chỉ_thường_trú"]}
                      helperText={errors["chồng"]?.["địa_chỉ_thường_trú"]}
                    />
                  </FormControl>
                </Box>
              </Box>
            </Box>
            <Box>
              <Typography
                variant="body1"
                fontSize="1.4rem"
                fontWeight="600"
                sx={{ marginBottom: "20px" }}
              >
                Thông tin vợ
              </Typography>
              <Box
                display="flex"
                alignItems="center"
                gap="10px"
                border="1px solid #e0e0e0"
                p="1rem"
                borderRadius="5px"
                bgcolor="#f5f5f5"
                mb="1rem"
              >
                <TextField
                  sx={{ width: "400px" }}
                  value={searchNumberWife}
                  onChange={(e) => {
                    setIsNotExistedWife(false);
                    setSearchNumberWife(e.target.value);
                  }}
                  placeholder="nhập số giấy tờ vợ"
                />
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleSearchWife}
                  disabled={loadingWife}
                >
                  {loadingWife ? (
                    <CircularProgress size={20} />
                  ) : (
                    <SearchIcon />
                  )}
                </Button>
              </Box>
              {isNotExistedWife ? (
                <Typography
                  variant="body1"
                  fontSize="1.2rem"
                  fontWeight="600"
                  color="warning.main"
                >
                  Số này không tồn tại trong hệ thống và sẽ được lưu lại
                </Typography>
              ) : null}
              <CopyMapper onMapped={handleScanSuccessWife} />
              <Box
                border="1px solid #ccc"
                borderRadius="10px"
                padding="20px"
                mt="1rem"
              >
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
                    <Autocomplete
                      freeSolo
                      options={CÁC_LOẠI_GIẤY_TỜ_ĐỊNH_DANH.map((o) => o.value)}
                      value={values["vợ"]["loại_giấy_tờ"] || ""}
                      onChange={(_, newValue) =>
                        setFieldValue(
                          "vợ.loại_giấy_tờ",
                          (newValue as string) || ""
                        )
                      }
                      onInputChange={(_, newInputValue) =>
                        setFieldValue("vợ.loại_giấy_tờ", newInputValue)
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          error={!!errors["vợ"]?.["loại_giấy_tờ"]}
                          helperText={errors["vợ"]?.["loại_giấy_tờ"] || ""}
                        />
                      )}
                    />
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
                    <Autocomplete
                      freeSolo
                      options={NƠI_CẤP_GIẤY_TỜ_ĐỊNH_DANH.map((o) => o.value)}
                      value={values["vợ"]["nơi_cấp"] || ""}
                      onChange={(_, newValue) =>
                        setFieldValue("vợ.nơi_cấp", (newValue as string) || "")
                      }
                      onInputChange={(_, newInputValue) =>
                        setFieldValue("vợ.nơi_cấp", newInputValue)
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          error={!!errors["vợ"]?.["nơi_cấp"]}
                          helperText={errors["vợ"]?.["nơi_cấp"] || ""}
                        />
                      )}
                    />
                  </FormControl>
                  <FormControl
                    sx={{ marginBottom: "10px", gridColumn: "span 2" }}
                  >
                    <FormLabel>Địa chỉ thường trú *</FormLabel>
                    <TextField
                      value={values["vợ"]["địa_chỉ_thường_trú"]}
                      name="vợ.địa_chỉ_thường_trú"
                      onChange={handleChange}
                      fullWidth
                      error={!!errors["vợ"]?.["địa_chỉ_thường_trú"]}
                      helperText={errors["vợ"]?.["địa_chỉ_thường_trú"]}
                    />
                  </FormControl>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box py="1rem">
            <Typography
              variant="body1"
              fontSize="1.4rem"
              fontWeight="600"
              sx={{ marginBottom: "20px" }}
            >
              Thông tin kết hôn của vợ chồng
            </Typography>
            <TextField
              multiline
              rows={4}
              value={values["vợ"]["tình_trạng_hôn_nhân_vợ_chồng"]}
              name="vợ.tình_trạng_hôn_nhân_vợ_chồng"
              onChange={handleChange}
              fullWidth
            />
          </Box>
          <input type="submit" hidden />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Hủy
        </Button>
        <Button
          disabled={loadingHusband || loadingWife}
          onClick={() => handleSubmit()}
          variant="contained"
        >
          {loadingHusband || loadingWife ? (
            <CircularProgress size={20} />
          ) : (
            "Lưu"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
