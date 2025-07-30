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
  isTangCho?: boolean;
  handleClose: () => void;
}

const validationSchema = Yup.object({
  số_thửa_đất: Yup.string().required("Số thửa đất là bắt buộc"),
  số_tờ_bản_đồ: Yup.string().required("Tờ bản đồ số là bắt buộc"),
  địa_chỉ_cũ: Yup.string().optional(),
  địa_chỉ_mới: Yup.string().required("Địa chỉ là bắt buộc"),
  loại_giấy_chứng_nhận: Yup.string().required("Loại giấy tờ là bắt buộc"),
  số_giấy_chứng_nhận: Yup.string().required("Số giấy tờ là bắt buộc"),
  số_vào_sổ_cấp_giấy_chứng_nhận: Yup.string().required(
    "Số vào sổ cấp GCN là bắt buộc"
  ),
  nơi_cấp_giấy_chứng_nhận: Yup.string().required(
    "Nơi cấp giấy chứng nhận là bắt buộc"
  ),
  ngày_cấp_giấy_chứng_nhận: Yup.string().required(
    "Ngày cấp giấy chứng nhận là bắt buộc"
  ),
  diện_tích: Yup.string().required("Diện tích là bắt buộc"),
  hình_thức_sử_dụng: Yup.string().required("Hình thức sử dụng là bắt buộc"),
  nguồn_gốc_sử_dụng: Yup.string().nullable(),
  giá_tiền: Yup.string().required("Giá tiền là bắt buộc"),
  giá_tiền_bằng_chữ: Yup.string().required("Giá tiền bằng chữ là bắt buộc"),
  ghi_chú: Yup.string().optional(),
});

export const ThemThongTinDat = ({
  open,
  handleClose,
  isTangCho = false,
}: ThemThongTinDatProps) => {
  const { agreementObject, addAgreementObject } = useHdcnQuyenSdDatContext();
  const [mụcđíchVàThờiHạnSửDụng, setMụcĐíchVàThờiHạnSửDụng] = useState<
    {
      phân_loại: string;
      diện_tích: string;
      thời_hạn_sử_dụng: string;
    }[]
  >(agreementObject?.["mục_đích_và_thời_hạn_sử_dụng"] ?? []);
  const [mụcđíchVàThờiHạnSửDụngEdit, setMụcĐíchVàThờiHạnSửDụngEdit] = useState<{
    phân_loại: string;
    diện_tích: string;
    thời_hạn_sử_dụng: string;
  }>({
    phân_loại: "",
    diện_tích: "",
    thời_hạn_sử_dụng: "",
  });
  const [indexEdit, setIndexEdit] = useState<number | null>(null);

  const submitForm = (values: ThongTinThuaDat) => {
    addAgreementObject({
      ...values,
      mục_đích_và_thời_hạn_sử_dụng: mụcđíchVàThờiHạnSửDụng,
    });
    handleClose();
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
        hình_thức_sử_dụng: "",
        nguồn_gốc_sử_dụng: null,
        giá_tiền: isTangCho ? "0" : "",
        giá_tiền_bằng_chữ: isTangCho ? "Không" : "",
        ghi_chú: "",
        mục_đích_và_thời_hạn_sử_dụng: [],
        thời_hạn: null,
        thời_hạn_bằng_chữ: null,
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
      phân_loại: "",
      diện_tích: "",
      thời_hạn_sử_dụng: "",
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
                id="số_thửa_đất"
                name="số_thửa_đất"
                label="Số thửa đất *"
                value={values["số_thửa_đất"]}
                onChange={handleChange}
                error={!!errors["số_thửa_đất"] && touched["số_thửa_đất"]}
                helperText={
                  errors["số_thửa_đất"] &&
                  touched["số_thửa_đất"] &&
                  errors["số_thửa_đất"]
                }
              />
              <TextField
                fullWidth
                id="số_tờ_bản_đồ"
                name="số_tờ_bản_đồ"
                label="Tờ bản đồ số *"
                value={values["số_tờ_bản_đồ"]}
                onChange={handleChange}
                error={!!errors["số_tờ_bản_đồ"] && touched["số_tờ_bản_đồ"]}
                helperText={
                  errors["số_tờ_bản_đồ"] &&
                  touched["số_tờ_bản_đồ"] &&
                  errors["số_tờ_bản_đồ"]
                }
              />
              <TextField
                fullWidth
                id="địa_chỉ_cũ"
                name="địa_chỉ_cũ"
                label="Địa chỉ cũ"
                value={values["địa_chỉ_cũ"]}
                onChange={handleChange}
                error={!!errors["địa_chỉ_cũ"] && touched["địa_chỉ_cũ"]}
                helperText={
                  errors["địa_chỉ_cũ"] &&
                  touched["địa_chỉ_cũ"] &&
                  errors["địa_chỉ_cũ"]
                }
              />
              <TextField
                fullWidth
                id="địa_chỉ_mới"
                name="địa_chỉ_mới"
                label="Địa chỉ mới *"
                value={values["địa_chỉ_mới"]}
                onChange={handleChange}
                error={!!errors["địa_chỉ_mới"] && touched["địa_chỉ_mới"]}
                helperText={
                  errors["địa_chỉ_mới"] &&
                  touched["địa_chỉ_mới"] &&
                  errors["địa_chỉ_mới"]
                }
              />
              <Autocomplete
                sx={{ gridColumn: "span 2" }}
                options={CÁC_LOẠI_GIẤY_CHỨNG_NHẬN_QUYỀN_SỬ_DỤNG_ĐẤT}
                value={
                  CÁC_LOẠI_GIẤY_CHỨNG_NHẬN_QUYỀN_SỬ_DỤNG_ĐẤT.find(
                    (item) => item.value === values["loại_giấy_chứng_nhận"]
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
                    label="Loại giấy chứng nhận *"
                    name="loại_giấy_chứng_nhận"
                  />
                )}
              />
              <TextField
                fullWidth
                id="số_giấy_chứng_nhận"
                name="số_giấy_chứng_nhận"
                label="Số giấy tờ *"
                value={values["số_giấy_chứng_nhận"]}
                onChange={handleChange}
                error={
                  !!errors["số_giấy_chứng_nhận"] &&
                  touched["số_giấy_chứng_nhận"]
                }
                helperText={
                  errors["số_giấy_chứng_nhận"] &&
                  touched["số_giấy_chứng_nhận"] &&
                  errors["số_giấy_chứng_nhận"]
                }
              />
              <TextField
                fullWidth
                id="số_vào_sổ_cấp_giấy_chứng_nhận"
                name="số_vào_sổ_cấp_giấy_chứng_nhận"
                label="Số vào sổ cấp GCN *"
                value={values["số_vào_sổ_cấp_giấy_chứng_nhận"]}
                onChange={handleChange}
                error={
                  !!errors["số_vào_sổ_cấp_giấy_chứng_nhận"] &&
                  touched["số_vào_sổ_cấp_giấy_chứng_nhận"]
                }
                helperText={
                  errors["số_vào_sổ_cấp_giấy_chứng_nhận"] &&
                  touched["số_vào_sổ_cấp_giấy_chứng_nhận"] &&
                  errors["số_vào_sổ_cấp_giấy_chứng_nhận"]
                }
              />
              <TextField
                fullWidth
                id="nơi_cấp_giấy_chứng_nhận"
                name="nơi_cấp_giấy_chứng_nhận"
                label="Nơi cấp giấy chứng nhận *"
                value={values["nơi_cấp_giấy_chứng_nhận"]}
                onChange={handleChange}
                error={
                  !!errors["nơi_cấp_giấy_chứng_nhận"] &&
                  touched["nơi_cấp_giấy_chứng_nhận"]
                }
                helperText={
                  errors["nơi_cấp_giấy_chứng_nhận"] &&
                  touched["nơi_cấp_giấy_chứng_nhận"] &&
                  errors["nơi_cấp_giấy_chứng_nhận"]
                }
              />
              <TextField
                fullWidth
                id="ngày_cấp_giấy_chứng_nhận"
                name="ngày_cấp_giấy_chứng_nhận"
                label="Ngày cấp giấy chứng nhận *"
                type="date"
                inputProps={{
                  max: new Date().toISOString().split("T")[0],
                }}
                slotProps={{
                  inputLabel: { shrink: true },
                }}
                value={values["ngày_cấp_giấy_chứng_nhận"]}
                onChange={handleChange}
                error={
                  !!errors["ngày_cấp_giấy_chứng_nhận"] &&
                  touched["ngày_cấp_giấy_chứng_nhận"]
                }
                helperText={
                  errors["ngày_cấp_giấy_chứng_nhận"] &&
                  touched["ngày_cấp_giấy_chứng_nhận"] &&
                  errors["ngày_cấp_giấy_chứng_nhận"]
                }
              />
              <TextField
                fullWidth
                type="text"
                id="diện_tích"
                name="diện_tích"
                label="Diện tích (m2) *"
                value={values["diện_tích"]}
                onChange={(event) => {
                  handleChange(event);
                  setFieldValue(
                    "diện_tích_bằng_chữ",
                    numberToVietnamese(
                      event.target.value?.replace(/\./g, "").replace(/\,/g, ".")
                    )
                  );
                }}
                error={!!errors["diện_tích"] && touched["diện_tích"]}
                helperText={
                  errors["diện_tích"] &&
                  touched["diện_tích"] &&
                  errors["diện_tích"]
                }
              />
              <TextField
                fullWidth
                type="text"
                id="diện_tích_bằng_chữ"
                name="diện_tích_bằng_chữ"
                label="Diện tích bằng chữ *"
                value={values["diện_tích_bằng_chữ"]}
                onChange={handleChange}
                error={
                  !!errors["diện_tích_bằng_chữ"] &&
                  touched["diện_tích_bằng_chữ"]
                }
                helperText={
                  errors["diện_tích_bằng_chữ"] &&
                  touched["diện_tích_bằng_chữ"] &&
                  errors["diện_tích_bằng_chữ"]
                }
              />
              <TextField
                fullWidth
                id="hình_thức_sử_dụng"
                name="hình_thức_sử_dụng"
                label="Hình thức sử dụng *"
                value={values["hình_thức_sử_dụng"]}
                onChange={handleChange}
                error={
                  !!errors["hình_thức_sử_dụng"] && touched["hình_thức_sử_dụng"]
                }
                helperText={
                  errors["hình_thức_sử_dụng"] &&
                  touched["hình_thức_sử_dụng"] &&
                  errors["hình_thức_sử_dụng"]
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
                          item.value === mụcđíchVàThờiHạnSửDụngEdit["phân_loại"]
                      ) ?? null
                    }
                    onChange={(_event, value) => {
                      setMụcĐíchVàThờiHạnSửDụngEdit({
                        ...mụcđíchVàThờiHạnSửDụngEdit,
                        phân_loại: value?.value ?? "",
                      });
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Mục đích sử dụng *" />
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
                    label="Thời hạn sử dụng *"
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
                freeSolo
                options={NGUỒN_GỐC_SỬ_DỤNG_ĐẤT.map((item) => item.value)}
                value={values["nguồn_gốc_sử_dụng"]}
                onChange={(_event, value) => {
                  setFieldValue("nguồn_gốc_sử_dụng", value ?? "");
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    onChange={(event) => {
                      setFieldValue(
                        "nguồn_gốc_sử_dụng",
                        event.target.value ?? ""
                      );
                    }}
                    label="Nguồn gốc sử dụng"
                  />
                )}
              />

              {!isTangCho && (
                <>
                  <TextField
                    fullWidth
                    id="giá_tiền"
                    name="giá_tiền"
                    label="Giá tiền *"
                    value={values["giá_tiền"]}
                    onChange={(event) => {
                      handleChange(event);
                      setFieldValue(
                        "giá_tiền_bằng_chữ",
                        numberToVietnamese(
                          event.target.value
                            ?.replace(/\./g, "")
                            .replace(/\,/g, ".")
                        )
                      );
                    }}
                    error={!!errors["giá_tiền"] && touched["giá_tiền"]}
                    helperText={
                      errors["giá_tiền"] &&
                      touched["giá_tiền"] &&
                      errors["giá_tiền"]
                    }
                  />
                  <TextField
                    sx={{ gridColumn: "span 2" }}
                    fullWidth
                    id="giá_tiền_bằng_chữ"
                    name="giá_tiền_bằng_chữ"
                    label="Giá tiền bằng chữ *"
                    value={values["giá_tiền_bằng_chữ"]}
                    onChange={handleChange}
                    error={
                      !!errors["giá_tiền_bằng_chữ"] &&
                      touched["giá_tiền_bằng_chữ"]
                    }
                    helperText={
                      errors["giá_tiền_bằng_chữ"] &&
                      touched["giá_tiền_bằng_chữ"] &&
                      errors["giá_tiền_bằng_chữ"]
                    }
                  />
                </>
              )}
              <Box sx={{ gridColumn: "span 3" }}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  id="ghi_chú"
                  name="ghi_chú"
                  label="Ghi chú"
                  value={values["ghi_chú"]}
                  onChange={handleChange}
                  error={!!errors["ghi_chú"] && touched["ghi_chú"]}
                  helperText={
                    errors["ghi_chú"] && touched["ghi_chú"] && errors["ghi_chú"]
                  }
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
            disabled={mụcđíchVàThờiHạnSửDụng.length === 0}
          >
            Thêm
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};
