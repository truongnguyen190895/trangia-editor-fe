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

interface ThemThongTinDatProps {
  open: boolean;
  handleClose: () => void;
}

const validationSchema = Yup.object({
  "số thửa đất": Yup.string().required("Số thửa đất là bắt buộc"),
  "tờ bản đồ": Yup.string().required("Tờ bản đồ số là bắt buộc"),
  "địa chỉ cũ": Yup.string().required("Địa chỉ là bắt buộc"),
  "địa chỉ mới": Yup.string().required("Địa chỉ là bắt buộc"),
  "loại giấy chứng nhận": Yup.string().required("Loại giấy tờ là bắt buộc"),
  "số giấy chứng nhận": Yup.string().required("Số giấy tờ là bắt buộc"),
  "số vào sổ cấp giấy chứng nhận": Yup.string().required(
    "Số vào sổ cấp GCN là bắt buộc"
  ),
  "nơi cấp giấy chứng nhận": Yup.string().required(
    "Nơi cấp giấy chứng nhận là bắt buộc"
  ),
  "ngày cấp giấy chứng nhận": Yup.string().required(
    "Ngày cấp giấy chứng nhận là bắt buộc"
  ),
  "diện tích": Yup.string().required("Diện tích là bắt buộc"),
  "hình thức sử dụng": Yup.string().required("Hình thức sử dụng là bắt buộc"),
  "nguồn gốc sử dụng": Yup.string().required("Nguồn gốc sử dụng là bắt buộc"),
  "giá tiền": Yup.string().required("Giá tiền là bắt buộc"),
  "giá tiền bằng chữ": Yup.string().required("Giá tiền bằng chữ là bắt buộc"),
  "ghi chú": Yup.string().optional(),
});

export const ThemThongTinDat = ({
  open,
  handleClose,
}: ThemThongTinDatProps) => {
  const { agreementObject, addAgreementObject } = useHdcnQuyenSdDatContext();
  const [mụcđíchVàThờiHạnSửDụng, setMụcĐíchVàThờiHạnSửDụng] = useState<
    {
      "phân loại": string;
      "diện tích": string;
      "thời hạn sử dụng": string;
    }[]
  >(agreementObject?.["mục đích và thời hạn sử dụng"] ?? []);
  const [mụcđíchVàThờiHạnSửDụngEdit, setMụcĐíchVàThờiHạnSửDụngEdit] = useState<{
    "phân loại": string;
    "diện tích": string;
    "thời hạn sử dụng": string;
  }>({
    "phân loại": "",
    "diện tích": "",
    "thời hạn sử dụng": "",
  });
  const [indexEdit, setIndexEdit] = useState<number | null>(null);

  const submitForm = (values: ThongTinThuaDat) => {
    addAgreementObject({
      ...values,
      "mục đích và thời hạn sử dụng": mụcđíchVàThờiHạnSửDụng,
    });
    handleClose();
  };

  const getInitialValue = (): ThongTinThuaDat => {
    return (
      agreementObject ?? {
        "số thửa đất": "",
        "tờ bản đồ": "",
        "địa chỉ cũ": "",
        "địa chỉ mới": "",
        "loại giấy chứng nhận": "",
        "số giấy chứng nhận": "",
        "số vào sổ cấp giấy chứng nhận": "",
        "nơi cấp giấy chứng nhận": "",
        "ngày cấp giấy chứng nhận": "",
        "diện tích": "",
        "diện tích bằng chữ": "",
        "hình thức sử dụng": "",
        "nguồn gốc sử dụng": "",
        "giá tiền": "",
        "giá tiền bằng chữ": "",
        "ghi chú": "",
        "mục đích và thời hạn sử dụng": [],
      }
    );
  };

  const { values, errors, touched, setFieldValue, handleChange, handleSubmit } =
    useFormik<ThongTinThuaDat>({
      initialValues: getInitialValue(),
      validationSchema,
      onSubmit: submitForm,
    });

  const handleAddMụcĐíchVàThờiHạnSửDụng = (indexEdit: number | null) => {
    if (indexEdit !== null) {
      setMụcĐíchVàThờiHạnSửDụng(
        mụcđíchVàThờiHạnSửDụng.map((item, index) =>
          index === indexEdit ? mụcđíchVàThờiHạnSửDụngEdit : item
        )
      );
    } else {
      setMụcĐíchVàThờiHạnSửDụng([
        ...mụcđíchVàThờiHạnSửDụng,
        mụcđíchVàThờiHạnSửDụngEdit,
      ]);
    }
    setIndexEdit(null);
    setMụcĐíchVàThờiHạnSửDụngEdit({
      "phân loại": "",
      "diện tích": "",
      "thời hạn sử dụng": "",
    });
  };

  return (
    <Dialog maxWidth="xl" fullWidth open={open} onClose={handleClose}>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle>Thêm thông tin đất</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={2}>
              <TextField
                fullWidth
                id="số thửa đất"
                name="số thửa đất"
                label="Số thửa đất *"
                value={values["số thửa đất"]}
                onChange={handleChange}
                error={!!errors["số thửa đất"] && touched["số thửa đất"]}
                helperText={
                  errors["số thửa đất"] &&
                  touched["số thửa đất"] &&
                  errors["số thửa đất"]
                }
              />
              <TextField
                fullWidth
                id="tờ bản đồ"
                name="tờ bản đồ"
                label="Tờ bản đồ số *"
                value={values["tờ bản đồ"]}
                onChange={handleChange}
                error={!!errors["tờ bản đồ"] && touched["tờ bản đồ"]}
                helperText={
                  errors["tờ bản đồ"] &&
                  touched["tờ bản đồ"] &&
                  errors["tờ bản đồ"]
                }
              />
              <TextField
                fullWidth
                id="địa chỉ cũ"
                name="địa chỉ cũ"
                label="Địa chỉ cũ *"
                value={values["địa chỉ cũ"]}
                onChange={handleChange}
                error={!!errors["địa chỉ cũ"] && touched["địa chỉ cũ"]}
                helperText={
                  errors["địa chỉ cũ"] &&
                  touched["địa chỉ cũ"] &&
                  errors["địa chỉ cũ"]
                }
              />
              <TextField
                fullWidth
                id="địa chỉ mới"
                name="địa chỉ mới"
                label="Địa chỉ mới *"
                value={values["địa chỉ mới"]}
                onChange={handleChange}
                error={!!errors["địa chỉ mới"] && touched["địa chỉ mới"]}
                helperText={
                  errors["địa chỉ mới"] &&
                  touched["địa chỉ mới"] &&
                  errors["địa chỉ mới"]
                }
              />
              <Autocomplete
                sx={{ gridColumn: "span 2" }}
                options={CÁC_LOẠI_GIẤY_CHỨNG_NHẬN_QUYỀN_SỬ_DỤNG_ĐẤT}
                value={
                  CÁC_LOẠI_GIẤY_CHỨNG_NHẬN_QUYỀN_SỬ_DỤNG_ĐẤT.find(
                    (item) => item.value === values["loại giấy chứng nhận"]
                  ) ?? null
                }
                getOptionLabel={(option) => option.label}
                onChange={(_event, value) => {
                  handleChange({
                    target: {
                      name: "loại giấy chứng nhận",
                      value: value?.value,
                    },
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={
                      !!errors["loại giấy chứng nhận"] &&
                      touched["loại giấy chứng nhận"]
                    }
                    helperText={
                      errors["loại giấy chứng nhận"] &&
                      touched["loại giấy chứng nhận"] &&
                      errors["loại giấy chứng nhận"]
                    }
                    label="Loại giấy chứng nhận *"
                    name="loại giấy chứng nhận"
                  />
                )}
              />
              <TextField
                fullWidth
                id="số giấy chứng nhận"
                name="số giấy chứng nhận"
                label="Số giấy tờ *"
                value={values["số giấy chứng nhận"]}
                onChange={handleChange}
                error={
                  !!errors["số giấy chứng nhận"] &&
                  touched["số giấy chứng nhận"]
                }
                helperText={
                  errors["số giấy chứng nhận"] &&
                  touched["số giấy chứng nhận"] &&
                  errors["số giấy chứng nhận"]
                }
              />
              <TextField
                fullWidth
                id="số vào sổ cấp giấy chứng nhận"
                name="số vào sổ cấp giấy chứng nhận"
                label="Số vào sổ cấp GCN *"
                value={values["số vào sổ cấp giấy chứng nhận"]}
                onChange={handleChange}
                error={
                  !!errors["số vào sổ cấp giấy chứng nhận"] &&
                  touched["số vào sổ cấp giấy chứng nhận"]
                }
                helperText={
                  errors["số vào sổ cấp giấy chứng nhận"] &&
                  touched["số vào sổ cấp giấy chứng nhận"] &&
                  errors["số vào sổ cấp giấy chứng nhận"]
                }
              />
              <TextField
                fullWidth
                id="nơi cấp giấy chứng nhận"
                name="nơi cấp giấy chứng nhận"
                label="Nơi cấp giấy chứng nhận *"
                value={values["nơi cấp giấy chứng nhận"]}
                onChange={handleChange}
                error={
                  !!errors["nơi cấp giấy chứng nhận"] &&
                  touched["nơi cấp giấy chứng nhận"]
                }
                helperText={
                  errors["nơi cấp giấy chứng nhận"] &&
                  touched["nơi cấp giấy chứng nhận"] &&
                  errors["nơi cấp giấy chứng nhận"]
                }
              />
              <TextField
                fullWidth
                id="ngày cấp giấy chứng nhận"
                name="ngày cấp giấy chứng nhận"
                label="Ngày cấp giấy chứng nhận *"
                type="date"
                inputProps={{
                  max: new Date().toISOString().split("T")[0],
                }}
                slotProps={{
                  inputLabel: { shrink: true },
                }}
                value={values["ngày cấp giấy chứng nhận"]}
                onChange={handleChange}
                error={
                  !!errors["ngày cấp giấy chứng nhận"] &&
                  touched["ngày cấp giấy chứng nhận"]
                }
                helperText={
                  errors["ngày cấp giấy chứng nhận"] &&
                  touched["ngày cấp giấy chứng nhận"] &&
                  errors["ngày cấp giấy chứng nhận"]
                }
              />
              <TextField
                fullWidth
                type="text"
                id="diện tích"
                name="diện tích"
                label="Diện tích (m2) *"
                value={values["diện tích"]}
                onChange={(event) => {
                  handleChange(event);
                  setFieldValue(
                    "diện tích bằng chữ",
                    numberToVietnamese(
                      event.target.value?.replace(/\./g, "").replace(/\,/g, ".")
                    )
                  );
                }}
                error={!!errors["diện tích"] && touched["diện tích"]}
                helperText={
                  errors["diện tích"] &&
                  touched["diện tích"] &&
                  errors["diện tích"]
                }
              />
              <TextField
                fullWidth
                type="text"
                id="diện tích bằng chữ"
                name="diện tích bằng chữ"
                label="Diện tích bằng chữ *"
                value={values["diện tích bằng chữ"]}
                onChange={handleChange}
                error={
                  !!errors["diện tích bằng chữ"] &&
                  touched["diện tích bằng chữ"]
                }
                helperText={
                  errors["diện tích bằng chữ"] &&
                  touched["diện tích bằng chữ"] &&
                  errors["diện tích bằng chữ"]
                }
              />
              <TextField
                fullWidth
                id="hình thức sử dụng"
                name="hình thức sử dụng"
                label="Hình thức sử dụng *"
                value={values["hình thức sử dụng"]}
                onChange={handleChange}
                error={
                  !!errors["hình thức sử dụng"] && touched["hình thức sử dụng"]
                }
                helperText={
                  errors["hình thức sử dụng"] &&
                  touched["hình thức sử dụng"] &&
                  errors["hình thức sử dụng"]
                }
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
                    id="mục đích sử dụng"
                    options={MỤC_ĐÍCH_SỬ_DỤNG_ĐẤT}
                    getOptionLabel={(option) => option.label}
                    value={
                      MỤC_ĐÍCH_SỬ_DỤNG_ĐẤT.find(
                        (item) =>
                          item.value === mụcđíchVàThờiHạnSửDụngEdit["phân loại"]
                      ) ?? null
                    }
                    onChange={(_event, value) => {
                      setMụcĐíchVàThờiHạnSửDụngEdit({
                        ...mụcđíchVàThờiHạnSửDụngEdit,
                        "phân loại": value?.value ?? "",
                      });
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Mục đích sử dụng *" />
                    )}
                  />
                  <TextField
                    fullWidth
                    id="diện tích"
                    name="diện tích"
                    label="Diện tích (m2)"
                    value={mụcđíchVàThờiHạnSửDụngEdit["diện tích"]}
                    onChange={(event) => {
                      setMụcĐíchVàThờiHạnSửDụngEdit({
                        ...mụcđíchVàThờiHạnSửDụngEdit,
                        "diện tích": event.target.value,
                      });
                    }}
                  />
                  <TextField
                    fullWidth
                    id="thời hạn sử dụng"
                    name="thời hạn sử dụng"
                    label="Thời hạn sử dụng *"
                    value={mụcđíchVàThờiHạnSửDụngEdit["thời hạn sử dụng"]}
                    onChange={(event) => {
                      setMụcĐíchVàThờiHạnSửDụngEdit({
                        ...mụcđíchVàThờiHạnSửDụngEdit,
                        "thời hạn sử dụng": event.target.value,
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
                          <TableCell>{item["phân loại"]}</TableCell>
                          <TableCell>{item["diện tích"]}</TableCell>
                          <TableCell>{item["thời hạn sử dụng"]}</TableCell>
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
                                    (_item, i) => i !== index
                                  )
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
              <Autocomplete
                sx={{ gridColumn: "span 3" }}
                options={NGUỒN_GỐC_SỬ_DỤNG_ĐẤT}
                value={
                  NGUỒN_GỐC_SỬ_DỤNG_ĐẤT.find(
                    (item) => item.value === values["nguồn gốc sử dụng"]
                  ) ?? null
                }
                onChange={(_event, value) => {
                  handleChange({
                    target: {
                      name: "nguồn gốc sử dụng",
                      value: value?.value,
                    },
                  });
                }}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Nguồn gốc sử dụng *"
                    error={
                      !!errors["nguồn gốc sử dụng"] &&
                      touched["nguồn gốc sử dụng"]
                    }
                    helperText={
                      errors["nguồn gốc sử dụng"] &&
                      touched["nguồn gốc sử dụng"] &&
                      errors["nguồn gốc sử dụng"]
                    }
                  />
                )}
              />
              <TextField
                fullWidth
                id="giá tiền"
                name="giá tiền"
                label="Giá tiền *"
                value={values["giá tiền"]}
                onChange={(event) => {
                  handleChange(event);
                  setFieldValue(
                    "giá tiền bằng chữ",
                    numberToVietnamese(
                      event.target.value?.replace(/\./g, "").replace(/\,/g, ".")
                    )
                  );
                }}
                error={!!errors["giá tiền"] && touched["giá tiền"]}
                helperText={
                  errors["giá tiền"] &&
                  touched["giá tiền"] &&
                  errors["giá tiền"]
                }
              />
              <TextField
                sx={{ gridColumn: "span 2" }}
                fullWidth
                id="giá tiền bằng chữ"
                name="giá tiền bằng chữ"
                label="Giá tiền bằng chữ *"
                value={values["giá tiền bằng chữ"]}
                onChange={handleChange}
                error={
                  !!errors["giá tiền bằng chữ"] && touched["giá tiền bằng chữ"]
                }
                helperText={
                  errors["giá tiền bằng chữ"] &&
                  touched["giá tiền bằng chữ"] &&
                  errors["giá tiền bằng chữ"]
                }
              />
              <Box sx={{ gridColumn: "span 3" }}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  id="ghi chú"
                  name="ghi chú"
                  label="Ghi chú"
                  value={values["ghi chú"]}
                  onChange={handleChange}
                  error={!!errors["ghi chú"] && touched["ghi chú"]}
                  helperText={
                    errors["ghi chú"] && touched["ghi chú"] && errors["ghi chú"]
                  }
                />
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button variant="contained" type="submit">
            Thêm
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};
