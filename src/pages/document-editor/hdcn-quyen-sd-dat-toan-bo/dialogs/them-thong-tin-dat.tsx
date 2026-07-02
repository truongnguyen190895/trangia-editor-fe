import { useState } from "react";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Autocomplete,
  Typography,
  TableCell,
  TableRow,
  TableHead,
  Table,
  TableContainer,
  TableBody,
  CircularProgress,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import type { ThongTinThuaDat } from "@/models/agreement-object";
import { useHdcnQuyenSdDatContext } from "@/context/hdcn-quyen-sd-dat-context";
import {
  CÁC_LOẠI_GIẤY_CHỨNG_NHẬN_QUYỀN_SỬ_DỤNG_ĐẤT,
  NGUỒN_GỐC_SỬ_DỤNG_ĐẤT,
} from "@/constants";
import { numberToVietnamese } from "@/utils/number-to-words";
import AddIcon from "@mui/icons-material/Add";
import { MỤC_ĐÍCH_SỬ_DỤNG_ĐẤT } from "@/constants";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { saveContractEntity, getContractEntity } from "@/api/contract_entity";
import {
  FormikTextField,
  FormikAutocomplete,
} from "@/components/common/formik-fields";
import SearchIcon from "@mui/icons-material/Search";

interface ThemThongTinDatProps {
  open: boolean;
  isTangCho?: boolean;
  isMotPhan?: boolean;
  isCoCongVan?: boolean;
  handleClose: () => void;
}

const validationSchema = Yup.object({
  số_thửa_đất: Yup.string(),
  số_tờ_bản_đồ: Yup.string(),
  địa_chỉ_cũ: Yup.string().optional(),
  địa_chỉ_mới: Yup.string(),
  loại_giấy_chứng_nhận: Yup.string(),
  số_giấy_chứng_nhận: Yup.string().required("Số giấy tờ là bắt buộc"),
  số_vào_sổ_cấp_giấy_chứng_nhận: Yup.string(),
  nơi_cấp_giấy_chứng_nhận: Yup.string(),
  ngày_cấp_giấy_chứng_nhận: Yup.string(),
  diện_tích: Yup.string(),
  hình_thức_sử_dụng: Yup.string(),
  nguồn_gốc_sử_dụng: Yup.string().nullable(),
  giá_tiền: Yup.string().nullable(),
  giá_tiền_bằng_chữ: Yup.string().nullable(),
  ghi_chú: Yup.string().optional(),
});

export const ThemThongTinDat = ({
  open,
  handleClose,
  isTangCho = false,
  isMotPhan = false,
  isCoCongVan = false,
}: ThemThongTinDatProps) => {
  const { agreementObject, addAgreementObject } = useHdcnQuyenSdDatContext();
  const [mụcđíchVàThờiHạnSửDụng, setMụcĐíchVàThờiHạnSửDụng] = useState<
    {
      phân_loại: string;
      diện_tích: string;
      thời_hạn_sử_dụng: string;
    }[]
  >(agreementObject?.["mục_đích_và_thời_hạn_sử_dụng"] ?? []);
  const [mụcđíchVàThờiHạnSửDụngMotPhan, setMụcĐíchVàThờiHạnSửDụngMotPhan] =
    useState<
      {
        phân_loại: string;
        diện_tích: string;
        thời_hạn_sử_dụng: string;
      }[]
    >(agreementObject?.["mục_đích_và_thời_hạn_sử_dụng_một_phần"] ?? []);
  const [mụcđíchVàThờiHạnSửDụngEdit, setMụcĐíchVàThờiHạnSửDụngEdit] = useState<{
    phân_loại: string;
    diện_tích: string;
    thời_hạn_sử_dụng: string;
  }>({
    phân_loại: "",
    diện_tích: "",
    thời_hạn_sử_dụng: "",
  });
  const [
    mụcđíchVàThờiHạnSửDụngMotPhanEdit,
    setMụcĐíchVàThờiHạnSửDụngMotPhanEdit,
  ] = useState<{
    phân_loại: string;
    diện_tích: string;
    thời_hạn_sử_dụng: string;
  }>({
    phân_loại: "",
    diện_tích: "",
    thời_hạn_sử_dụng: "",
  });
  const [indexEdit, setIndexEdit] = useState<number | null>(null);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [searchNumber, setSearchNumber] = useState<string>("");
  const [isNotExisted, setIsNotExisted] = useState<boolean>(false);

  const submitForm = (values: ThongTinThuaDat) => {
    const payload = {
      ...values,
      mục_đích_và_thời_hạn_sử_dụng: mụcđíchVàThờiHạnSửDụng,
      mục_đích_và_thời_hạn_sử_dụng_một_phần: mụcđíchVàThờiHạnSửDụngMotPhan,
    };
    addAgreementObject(payload);
    setSaveLoading(true);
    saveContractEntity(values.số_giấy_chứng_nhận, payload).finally(() => {
      setSaveLoading(false);
      handleClose();
    });
  };

  const getInitialValue = (): ThongTinThuaDat => {
    return (
      agreementObject ?? {
        số_thửa_đất: "",
        số_tờ_bản_đồ: "",
        địa_chỉ_cũ: "",
        địa_chỉ_mới: "",
        loại_giấy_chứng_nhận: "",
        số_giấy_chứng_nhận: "",
        số_vào_sổ_cấp_giấy_chứng_nhận: "",
        nơi_cấp_giấy_chứng_nhận: "",
        ngày_cấp_giấy_chứng_nhận: "",
        diện_tích: "",
        diện_tích_bằng_chữ: "",
        diện_tích_phi_nông_nghiệp: "",
        một_phần_diện_tích: "",
        một_phần_diện_tích_bằng_chữ: "",
        hình_thức_sử_dụng: "",
        nguồn_gốc_sử_dụng: null,
        giá_tiền: isTangCho ? "0" : "",
        giá_tiền_bằng_chữ: isTangCho ? "Không" : "",
        ghi_chú: "",
        mục_đích_và_thời_hạn_sử_dụng: [],
        mục_đích_và_thời_hạn_sử_dụng_một_phần: [],
        thời_hạn: null,
        thời_hạn_bằng_chữ: null,
        số_quyết_định: "",
        nơi_đăng_ký_chuyển_mục_đích: "",
        ngày_đăng_ký_chuyển_mục_đích: "",
        giới_hạn_các_điểm: "",
        loại_sơ_đồ: "",
        số_sơ_đồ: "",
        đơn_vị_lập_sơ_đồ: "",
        ngày_lập_sơ_đồ: "",
        số_công_văn: "",
        cơ_quan_công_văn: "",
        ngày_lập_công_văn: "",
      }
    );
  };

  const formik = useFormik<ThongTinThuaDat>({
    initialValues: getInitialValue(),
    validationSchema,
    onSubmit: submitForm,
  });
  const { values, errors, touched, handleChange } = formik;

  const handleAddMụcĐíchVàThờiHạnSửDụng = (indexEdit: number | null) => {
    if (indexEdit !== null) {
      setMụcĐíchVàThờiHạnSửDụng(
        mụcđíchVàThờiHạnSửDụng.map((item, index) =>
          index === indexEdit ? mụcđíchVàThờiHạnSửDụngEdit : item,
        ),
      );
    } else {
      setMụcĐíchVàThờiHạnSửDụng([
        ...mụcđíchVàThờiHạnSửDụng,
        mụcđíchVàThờiHạnSửDụngEdit,
      ]);
    }
    setIndexEdit(null);
    setMụcĐíchVàThờiHạnSửDụngEdit({
      phân_loại: "",
      diện_tích: "",
      thời_hạn_sử_dụng: "",
    });
  };

  const handleSearch = () => {
    setSearchLoading(true);
    getContractEntity(searchNumber)
      .then((response) => {
        setIsNotExisted(false);
        formik.setValues({
          ...formik.values,
          ...response,
        });
        setMụcĐíchVàThờiHạnSửDụng(response.mục_đích_và_thời_hạn_sử_dụng ?? []);
        setMụcĐíchVàThờiHạnSửDụngMotPhan(
          response.mục_đích_và_thời_hạn_sử_dụng_một_phần ?? [],
        );
      })
      .catch(() => {
        setIsNotExisted(true);
      })
      .finally(() => {
        setSearchLoading(false);
      });
  };

  return (
    <Dialog maxWidth="xl" fullWidth open={open} onClose={handleClose}>
      <Box component="form" onSubmit={formik.handleSubmit}>
        <DialogTitle>
          <Typography variant="body1" fontSize="2rem" fontWeight="600">
            Thêm thông tin đất
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box
            className="search"
            display="flex"
            alignItems="center"
            gap="10px"
            mb="0.5rem"
          >
            <TextField
              value={searchNumber}
              onChange={(event) => setSearchNumber(event.target.value)}
              placeholder="Nhập số giấy tờ (số sổ)"
              sx={{ width: "400px" }}
            />
            <Button
              onClick={handleSearch}
              disabled={searchLoading}
              variant="contained"
              color="success"
            >
              {searchLoading ? <CircularProgress size={20} /> : <SearchIcon />}
            </Button>
          </Box>
          {isNotExisted ? (
            <Typography
              variant="body1"
              fontSize="1.2rem"
              fontWeight="600"
              color="warning.main"
            >
              Số thửa đất này không tồn tại trong hệ thống và sẽ được lưu lại
            </Typography>
          ) : null}
          <Box sx={{ pt: 2 }}>
            <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={2}>
              <FormikTextField
                formik={formik}
                name="số_thửa_đất"
                label="Số thửa đất"
              />
              <FormikTextField
                formik={formik}
                name="số_tờ_bản_đồ"
                label="Tờ bản đồ số"
              />
              <FormikTextField
                formik={formik}
                name="địa_chỉ_cũ"
                label="Địa chỉ cũ"
              />
              <FormikTextField
                formik={formik}
                name="địa_chỉ_mới"
                label="Địa chỉ mới"
              />
              <Autocomplete
                sx={{ gridColumn: "span 2" }}
                options={CÁC_LOẠI_GIẤY_CHỨNG_NHẬN_QUYỀN_SỬ_DỤNG_ĐẤT}
                value={
                  CÁC_LOẠI_GIẤY_CHỨNG_NHẬN_QUYỀN_SỬ_DỤNG_ĐẤT.find(
                    (item) => item.value === values["loại_giấy_chứng_nhận"],
                  ) ?? null
                }
                getOptionLabel={(option) => option.label}
                onChange={(_event, value) => {
                  handleChange({
                    target: {
                      name: "loại_giấy_chứng_nhận",
                      value: value?.value,
                    },
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={
                      !!errors["loại_giấy_chứng_nhận"] &&
                      touched["loại_giấy_chứng_nhận"]
                    }
                    helperText={
                      errors["loại_giấy_chứng_nhận"] &&
                      touched["loại_giấy_chứng_nhận"] &&
                      errors["loại_giấy_chứng_nhận"]
                    }
                    label="Loại giấy chứng nhận"
                    name="loại_giấy_chứng_nhận"
                  />
                )}
              />
              <FormikTextField
                formik={formik}
                name="số_giấy_chứng_nhận"
                label="Số giấy tờ"
              />
              <FormikTextField
                formik={formik}
                name="số_vào_sổ_cấp_giấy_chứng_nhận"
                label="Số vào sổ cấp GCN"
              />
              <FormikTextField
                formik={formik}
                name="nơi_cấp_giấy_chứng_nhận"
                label="Nơi cấp giấy chứng nhận"
              />
              <FormikTextField
                formik={formik}
                name="ngày_cấp_giấy_chứng_nhận"
                label="Ngày cấp giấy chứng nhận"
              />
              <FormikTextField
                formik={formik}
                name="diện_tích"
                label="Diện tích (m2)"
                onValueChange={(value, formik) => {
                  formik.setFieldValue(
                    "diện_tích_bằng_chữ",
                    numberToVietnamese(
                      value?.replace(/\./g, "").replace(/\,/g, ".")
                    )
                  );
                }}
              />
              <FormikTextField
                formik={formik}
                name="diện_tích_bằng_chữ"
                label="Diện tích bằng chữ"
              />
              {isMotPhan ? (
                <>
                  <FormikTextField
                    formik={formik}
                    name="một_phần_diện_tích"
                    label="Diện tích một phần (m2)"
                    onValueChange={(value, formik) => {
                      formik.setFieldValue(
                        "một_phần_diện_tích_bằng_chữ",
                        numberToVietnamese(
                          value?.replace(/\./g, "").replace(/\,/g, ".")
                        )
                      );
                    }}
                  />
                  <FormikTextField
                    formik={formik}
                    name="một_phần_diện_tích_bằng_chữ"
                    label="Diện tích một phần bằng chữ"
                  />
                </>
              ) : null}
              <FormikTextField
                formik={formik}
                name="diện_tích_phi_nông_nghiệp"
                label="Diện tích phi nông nghiệp (m2)"
              />
              <FormikTextField
                formik={formik}
                name="hình_thức_sử_dụng"
                label="Hình thức sử dụng"
              />
              <Box
                sx={{ gridColumn: "span 3" }}
                border="1px solid #ccc"
                borderRadius="10px"
                padding="20px"
              >
                <Typography
                  variant="body1"
                  fontSize="1.2rem"
                  fontWeight="600"
                  sx={{ marginBottom: "20px" }}
                >
                  Mục đích và thời hạn sử dụng (nhập các giá trị sau đó bấm nút
                  để thêm vào)
                </Typography>
                <Box
                  display="grid"
                  gridTemplateColumns="repeat(3, 1fr)"
                  gap="20px"
                >
                  <Autocomplete
                    fullWidth
                    freeSolo
                    id="mục đích sử dụng"
                    options={MỤC_ĐÍCH_SỬ_DỤNG_ĐẤT}
                    getOptionLabel={(option) =>
                      typeof option === "string" ? option : option.label
                    }
                    value={
                      MỤC_ĐÍCH_SỬ_DỤNG_ĐẤT.find(
                        (item) =>
                          item.value ===
                          mụcđíchVàThờiHạnSửDụngEdit["phân_loại"],
                      ) ?? mụcđíchVàThờiHạnSửDụngEdit["phân_loại"]
                    }
                    onChange={(_event, value) => {
                      const newValue =
                        typeof value === "string"
                          ? value
                          : (value?.value ?? "");
                      setMụcĐíchVàThờiHạnSửDụngEdit({
                        ...mụcđíchVàThờiHạnSửDụngEdit,
                        phân_loại: newValue,
                      });
                    }}
                    onInputChange={(_event, newInputValue) => {
                      setMụcĐíchVàThờiHạnSửDụngEdit({
                        ...mụcđíchVàThờiHạnSửDụngEdit,
                        phân_loại: newInputValue,
                      });
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Mục đích sử dụng" />
                    )}
                  />
                  <TextField
                    fullWidth
                    id="diện_tích"
                    name="diện_tích"
                    label="Diện tích (m2)"
                    value={mụcđíchVàThờiHạnSửDụngEdit["diện_tích"]}
                    onChange={(event) => {
                      setMụcĐíchVàThờiHạnSửDụngEdit({
                        ...mụcđíchVàThờiHạnSửDụngEdit,
                        diện_tích: event.target.value,
                      });
                    }}
                  />
                  <TextField
                    fullWidth
                    id="thời_hạn_sử_dụng"
                    name="thời_hạn_sử_dụng"
                    label="Thời hạn sử dụng"
                    value={mụcđíchVàThờiHạnSửDụngEdit["thời_hạn_sử_dụng"]}
                    onChange={(event) => {
                      setMụcĐíchVàThờiHạnSửDụngEdit({
                        ...mụcđíchVàThờiHạnSửDụngEdit,
                        thời_hạn_sử_dụng: event.target.value,
                      });
                    }}
                  />
                </Box>
                <Button
                  variant="contained"
                  color="success"
                  sx={{ marginTop: "20px" }}
                  startIcon={<AddIcon />}
                  onClick={() => handleAddMụcĐíchVàThờiHạnSửDụng(indexEdit)}
                >
                  Thêm mục đích và thời hạn sử dụng
                </Button>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <Typography
                            variant="body1"
                            fontSize="1rem"
                            fontWeight="600"
                          >
                            Phân loại
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body1"
                            fontSize="1rem"
                            fontWeight="600"
                          >
                            Diện tích (m2)
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body1"
                            fontSize="1rem"
                            fontWeight="600"
                          >
                            Thời hạn sử dụng
                          </Typography>
                        </TableCell>
                        <TableCell>Thao tác</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {mụcđíchVàThờiHạnSửDụng.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item["phân_loại"]}</TableCell>
                          <TableCell>{item["diện_tích"]}</TableCell>
                          <TableCell>{item["thời_hạn_sử_dụng"]}</TableCell>
                          <TableCell>
                            <Button
                              variant="contained"
                              color="primary"
                              startIcon={<EditIcon />}
                              onClick={() => {
                                setMụcĐíchVàThờiHạnSửDụngEdit(item);
                                setIndexEdit(index);
                              }}
                            >
                              Sửa
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              startIcon={<DeleteIcon />}
                              onClick={() => {
                                setMụcĐíchVàThờiHạnSửDụng(
                                  mụcđíchVàThờiHạnSửDụng.filter(
                                    (_item, i) => i !== index,
                                  ),
                                );
                              }}
                            >
                              Xóa
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
              {isMotPhan ? (
                <Box
                  sx={{ gridColumn: "span 3" }}
                  border="1px solid #ccc"
                  borderRadius="10px"
                  padding="20px"
                >
                  <Typography
                    variant="body1"
                    fontSize="1.2rem"
                    fontWeight="600"
                    sx={{ marginBottom: "20px" }}
                  >
                    Mục đích và thời hạn sử dụng của một phần thửa đất (nhập các
                    giá trị sau đó bấm nút để thêm vào)
                  </Typography>
                  <Box
                    display="grid"
                    gridTemplateColumns="repeat(3, 1fr)"
                    gap="20px"
                  >
                    <Autocomplete
                      fullWidth
                      freeSolo
                      id="mục đích sử dụng"
                      options={MỤC_ĐÍCH_SỬ_DỤNG_ĐẤT}
                      getOptionLabel={(option) =>
                        typeof option === "string" ? option : option.label
                      }
                      value={
                        MỤC_ĐÍCH_SỬ_DỤNG_ĐẤT.find(
                          (item) =>
                            item.value ===
                            mụcđíchVàThờiHạnSửDụngMotPhanEdit["phân_loại"],
                        ) ?? mụcđíchVàThờiHạnSửDụngMotPhanEdit["phân_loại"]
                      }
                      onChange={(_event, value) => {
                        const newValue =
                          typeof value === "string"
                            ? value
                            : (value?.value ?? "");
                        setMụcĐíchVàThờiHạnSửDụngMotPhanEdit({
                          ...mụcđíchVàThờiHạnSửDụngMotPhanEdit,
                          phân_loại: newValue,
                        });
                      }}
                      onInputChange={(_event, newInputValue) => {
                        setMụcĐíchVàThờiHạnSửDụngMotPhanEdit({
                          ...mụcđíchVàThờiHạnSửDụngMotPhanEdit,
                          phân_loại: newInputValue,
                        });
                      }}
                      renderInput={(params) => (
                        <TextField {...params} label="Mục đích sử dụng" />
                      )}
                    />
                    <TextField
                      fullWidth
                      id="diện_tích"
                      name="diện_tích"
                      label="Diện tích (m2)"
                      value={mụcđíchVàThờiHạnSửDụngMotPhanEdit["diện_tích"]}
                      onChange={(event) => {
                        setMụcĐíchVàThờiHạnSửDụngMotPhanEdit({
                          ...mụcđíchVàThờiHạnSửDụngMotPhanEdit,
                          diện_tích: event.target.value,
                        });
                      }}
                    />
                    <TextField
                      fullWidth
                      id="thời_hạn_sử_dụng"
                      name="thời_hạn_sử_dụng"
                      label="Thời hạn sử dụng"
                      value={
                        mụcđíchVàThờiHạnSửDụngMotPhanEdit["thời_hạn_sử_dụng"]
                      }
                      onChange={(event) => {
                        setMụcĐíchVàThờiHạnSửDụngMotPhanEdit({
                          ...mụcđíchVàThờiHạnSửDụngMotPhanEdit,
                          thời_hạn_sử_dụng: event.target.value,
                        });
                      }}
                    />
                  </Box>
                  <Button
                    variant="contained"
                    color="success"
                    sx={{ marginTop: "20px" }}
                    startIcon={<AddIcon />}
                    onClick={() => {
                      // Adding or editing logic for mục_đích_và_thời_hạn_sử_dụng_một_phần
                      if (
                        indexEdit !== null &&
                        typeof indexEdit === "number" &&
                        indexEdit >= 0
                      ) {
                        // Edit
                        setMụcĐíchVàThờiHạnSửDụngMotPhan((prev) => {
                          const updated = [...prev];
                          updated[indexEdit] = {
                            ...mụcđíchVàThờiHạnSửDụngMotPhanEdit,
                          };
                          return updated;
                        });
                      } else {
                        // Add
                        setMụcĐíchVàThờiHạnSửDụngMotPhan((prev) => [
                          ...prev,
                          { ...mụcđíchVàThờiHạnSửDụngMotPhanEdit },
                        ]);
                      }
                      // Clear edit
                      setMụcĐíchVàThờiHạnSửDụngMotPhanEdit({
                        phân_loại: "",
                        diện_tích: "",
                        thời_hạn_sử_dụng: "",
                      });
                      setIndexEdit(null);
                    }}
                  >
                    Thêm mục đích và thời hạn sử dụng
                  </Button>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>
                            <Typography
                              variant="body1"
                              fontSize="1rem"
                              fontWeight="600"
                            >
                              Phân loại
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="body1"
                              fontSize="1rem"
                              fontWeight="600"
                            >
                              Diện tích (m2)
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="body1"
                              fontSize="1rem"
                              fontWeight="600"
                            >
                              Thời hạn sử dụng
                            </Typography>
                          </TableCell>
                          <TableCell>Thao tác</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {mụcđíchVàThờiHạnSửDụngMotPhan.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item["phân_loại"]}</TableCell>
                            <TableCell>{item["diện_tích"]}</TableCell>
                            <TableCell>{item["thời_hạn_sử_dụng"]}</TableCell>
                            <TableCell>
                              <Button
                                variant="contained"
                                color="primary"
                                startIcon={<EditIcon />}
                                onClick={() => {
                                  setMụcĐíchVàThờiHạnSửDụngMotPhanEdit(item);
                                  setIndexEdit(index);
                                }}
                              >
                                Sửa
                              </Button>
                              <Button
                                variant="contained"
                                color="error"
                                startIcon={<DeleteIcon />}
                                onClick={() => {
                                  setMụcĐíchVàThờiHạnSửDụngMotPhan((prev) =>
                                    prev.filter((_item, i) => i !== index),
                                  );
                                  // Clear edit state if deleted item was being edited
                                  if (indexEdit === index) {
                                    setMụcĐíchVàThờiHạnSửDụngMotPhanEdit({
                                      phân_loại: "",
                                      diện_tích: "",
                                      thời_hạn_sử_dụng: "",
                                    });
                                    setIndexEdit(null);
                                  }
                                }}
                              >
                                Xóa
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              ) : null}
              <FormikAutocomplete
                formik={formik}
                name="nguồn_gốc_sử_dụng"
                label="Nguồn gốc sử dụng"
                sx={{ gridColumn: "span 3" }}
                options={NGUỒN_GỐC_SỬ_DỤNG_ĐẤT.map((item) => item.value)}
              />

              {!isTangCho && (
                <>
                  <FormikTextField
                    formik={formik}
                    name="giá_tiền"
                    label="Giá tiền"
                    onValueChange={(value, formik) => {
                      formik.setFieldValue(
                        "giá_tiền_bằng_chữ",
                        numberToVietnamese(
                          value?.replace(/\./g, "").replace(/\,/g, ".")
                        )
                      );
                    }}
                  />
                  <FormikTextField
                    formik={formik}
                    name="giá_tiền_bằng_chữ"
                    label="Giá tiền bằng chữ"
                    sx={{ gridColumn: "span 2" }}
                  />
                </>
              )}
              {isCoCongVan ? (
                <Box
                  sx={{ gridColumn: "span 3" }}
                  border="1px solid #ccc"
                  borderRadius="10px"
                  padding="20px"
                >
                  <Typography
                    variant="body1"
                    fontSize="1.2rem"
                    fontWeight="600"
                    sx={{ marginBottom: "20px" }}
                  >
                    Chi tiết công văn (ĐIỀU 1, mục 1 — mẫu có công văn)
                  </Typography>
                  <Box
                    display="grid"
                    gridTemplateColumns="repeat(3, 1fr)"
                    gap="20px"
                  >
                    <FormikTextField
                      formik={formik}
                      name="số_quyết_định"
                      label="Số quyết định (.../QĐ-UB)"
                    />
                    <FormikTextField
                      formik={formik}
                      name="nơi_đăng_ký_chuyển_mục_đích"
                      label="Nơi đăng ký chuyển mục đích SDĐ"
                    />
                    <FormikTextField
                      formik={formik}
                      name="ngày_đăng_ký_chuyển_mục_đích"
                      label="Ngày đăng ký chuyển mục đích"
                    />
                    <FormikTextField
                      formik={formik}
                      name="giới_hạn_các_điểm"
                      label="Giới hạn bởi các điểm"
                      sx={{ gridColumn: "span 3" }}
                    />
                    <FormikTextField
                      formik={formik}
                      name="loại_sơ_đồ"
                      label="Loại sơ đồ (theo ...)"
                    />
                    <FormikTextField
                      formik={formik}
                      name="số_sơ_đồ"
                      label="Số sơ đồ"
                    />
                    <FormikTextField
                      formik={formik}
                      name="đơn_vị_lập_sơ_đồ"
                      label="Đơn vị lập sơ đồ"
                    />
                    <FormikTextField
                      formik={formik}
                      name="ngày_lập_sơ_đồ"
                      label="Ngày lập sơ đồ"
                    />
                    <FormikTextField
                      formik={formik}
                      name="số_công_văn"
                      label="Số công văn"
                    />
                    <FormikTextField
                      formik={formik}
                      name="cơ_quan_công_văn"
                      label="Cơ quan lập công văn"
                    />
                    <FormikTextField
                      formik={formik}
                      name="ngày_lập_công_văn"
                      label="Ngày lập công văn"
                    />
                  </Box>
                </Box>
              ) : null}
              <Box sx={{ gridColumn: "span 3" }}>
                <FormikTextField
                  formik={formik}
                  name="ghi_chú"
                  label="Ghi chú"
                  multiline
                  rows={4}
                />
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button
            variant="contained"
            type="submit"
            disabled={mụcđíchVàThờiHạnSửDụng.length === 0 || saveLoading}
          >
            {saveLoading ? <CircularProgress size={20} /> : "Thêm"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};
