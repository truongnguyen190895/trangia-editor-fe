import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Checkbox,
  FormControlLabel,
  Autocomplete,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BRANCHES } from "@/constants/branches";
import { CONTRACT_TYPES, INVOICE_TYPES } from "@/constants/contract-types";
import { REVIEWERS } from "@/constants/reviewer";
import { useFormik } from "formik";
import { WarningDialog } from "@/components/common/warning-dialog";
import {
  submitContract,
  getTheNextAvailableId,
  getContractById,
  updateContract,
} from "@/api/contract";
import { render_phieu_thu, type PhieuThuPayload } from "@/api";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import * as yup from "yup";
import dayjs, { Dayjs } from "dayjs";
import { numberToVietnamese } from "@/utils/number-to-words";
import { WarningBanner } from "./warning-banner";
import { CÔNG_CHỨNG_VIÊN } from "@/database/cong-chung-vien";

interface InitialValues {
  id: string;
  name: string;
  customer: string;
  broker: string;
  value: number;
  copiesValue: number;
  notes: string;
  unit: string;
  relationship: string;
  nationalId: string;
  filedDate: Dayjs;
  deliveredBy: string;
  inspectedBy: string;
  externalNotes: string;
  notarizedBy: string;
}

interface SubmitContractProps {
  isEdit?: boolean;
}

const SubmitContract = ({ isEdit = false }: SubmitContractProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [checkingLoading, setCheckingLoading] = useState(false);
  const [type, setType] = useState<string>("Contract");
  const [suffix, setSuffix] = useState<string>("");
  const [nextAvailableId, setNextAvailableId] = useState<string>("");
  const [shouldRenderPhieuThu, setShouldRenderPhieuThu] = useState(false);
  const [warningDialogOpen, setWarningDialogOpen] = useState(false);
  const userRoles = JSON.parse(localStorage.getItem("roles") || "[]");
  const isAdmin = userRoles.some(
    (role: string) => role === "ROLE_Admin" || role === "ROLE_Manager"
  );
  const idFromUrl = searchParams.get("id");
  const namedByUser = localStorage.getItem("username") || "";
  const user = JSON.parse(localStorage.getItem("user_info") || "{}");
  const userBranch = user?.branches[0]?.id;

  useEffect(() => {
    if (!isEdit) {
      setCheckingLoading(true);
      getTheNextAvailableId(type)
        .then((resp) => {
          setNextAvailableId(resp);
          if (String(resp)?.includes("/")) {
            const [_id, suffix] = resp.split("/");
            setSuffix(suffix);
            setValues({ ...values, id: "" });
          } else if (String(resp)?.includes("!")) {
            setValues({ ...values, id: resp });
            setSuffix("");
          } else {
            const [_id, suffix] = String(resp).split(".");
            setSuffix(suffix || new Date().getFullYear().toString());
            setValues({ ...values, id: "" });
          }
        })
        .finally(() => {
          setCheckingLoading(false);
        });
    }
  }, [type, isEdit]);

  useEffect(() => {
    if (isEdit && idFromUrl) {
      setIsLoading(true);
      getContractById(idFromUrl)
        .then((resp) => {
          let id = "";
          if (idFromUrl?.includes("/")) {
            const [oldId, oldSuffix] = idFromUrl.split("/");
            id = oldId;
            setSuffix(oldSuffix);
            setType("Contract");
          } else if (idFromUrl?.includes(".")) {
            setType("Signature");
            const [oldId, oldSuffix] = idFromUrl.split(".");
            id = oldId;
            setSuffix(oldSuffix);
          } else {
            setType("Invoice");
            id = idFromUrl;
          }
          setValues({
            id: id,
            name: resp.name,
            customer: resp.customer,
            broker: resp.broker,
            value: resp.value,
            copiesValue: resp.copies_value,
            notes: resp.notes,
            unit: resp.unit,
            relationship: resp.broker,
            nationalId: resp.national_id || "",
            filedDate: dayjs(resp.filed_date),
            deliveredBy: resp.delivered_by,
            inspectedBy: resp.inspected_by,
            externalNotes: resp.external_notes,
            notarizedBy: resp.notarized_by,
          });
        })
        .catch((error) => {
          errorHandler(error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isEdit, idFromUrl]);

  const handleRenderPhieuThu = (phieuThuPayload: PhieuThuPayload) => {
    render_phieu_thu(phieuThuPayload).then((resp) => {
      const blob = new Blob([resp.data], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "phieu-thu-tt200.docx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    });
  };

  const errorHandler = (error: any) => {
    if (error?.status === 400) {
      toast.error(error?.response?.data?.message);
    } else if (error?.status === 404) {
      toast.error("Hợp đồng không tồn tại");
    } else if (error?.response?.data?.message?.includes("Invalid date")) {
      toast.error("Ngày viết phiếu không hợp lệ");
    } else {
      toast.error("Có lỗi xảy ra");
    }
  };

  const validationSchema = yup.object({
    unit: yup.string(),
    id: yup.string().when([], {
      is: () => type !== "Invoice",
      then: (schema) =>
        schema
          .required("Số hợp đồng là bắt buộc")
          .matches(
            /^\d+-?\d*$/,
            "Số hợp đồng chỉ được chứa số và một dấu gạch ngang"
          ),
      otherwise: (schema) => schema,
    }),
    name: yup.string().required("Bắt buộc"),
    customer: yup.string().required("Tên khách hàng là bắt buộc"),
    broker: yup.string(),
    value: yup.number().required("Số tiền là bắt buộc"),
    copiesValue: yup.number(),
    notes: yup.string(),
    nationalId: yup.string().when([], {
      is: () => type === "Signature",
      then: (schema) => schema.required("Số CCCD là bắt buộc"),
      otherwise: (schema) => schema,
    }),
    notarizedBy: yup.string().when([], {
      is: () => type === "Signature",
      then: (schema) => schema.required("CCV là bắt buộc"),
      otherwise: (schema) => schema,
    }),
  });

  const { values, errors, resetForm, handleChange, handleSubmit, setValues } =
    useFormik<InitialValues>({
      validationSchema,
      initialValues: {
        id: "",
        name: "",
        customer: "",
        broker: "",
        value: 0,
        copiesValue: 0,
        notes: "",
        unit: userBranch || "",
        relationship: "",
        nationalId: "",
        filedDate: dayjs(),
        deliveredBy: "",
        inspectedBy: "",
        externalNotes: "",
        notarizedBy: "",
      },
      onSubmit: async (formValues) => {
        try {
          setIsLoading(true);
          let idToSubmit = "";
          let idPhieuThu = "";
          if (type === "Contract") {
            if (!isEdit && Number(formValues.id) > 9999) {
              setWarningDialogOpen(true);
              setIsLoading(false);
              return;
            }
            idToSubmit =
              formValues.id + "/" + suffix + "/" + dayjs().format("YYYY");
            idPhieuThu = formValues.id + "/" + suffix;
          } else if (type === "Invoice") {
            const resp = await getTheNextAvailableId("Invoice");
            idToSubmit = resp;
            idPhieuThu = resp;
          } else {
            if (!isEdit && Number(formValues.id) > 30000) {
              setWarningDialogOpen(true);
              setIsLoading(false);
              return;
            }
            idToSubmit = formValues.id + "." + suffix;
            idPhieuThu = formValues.id + "." + suffix;
          }
          const payload = {
            ...formValues,
            customer: formValues.customer?.trim(),
            id: idToSubmit,
            filedDate: formValues?.filedDate?.format("YYYY-MM-DD"),
          };
          const phieuThuPayload: PhieuThuPayload = {
            d: dayjs(formValues?.filedDate).format("DD"),
            m: dayjs(formValues?.filedDate).format("MM"),
            y: dayjs(formValues?.filedDate).format("YYYY"),
            người_nộp_tiền: formValues.customer,
            số_cc: type === "Invoice" ? null : idPhieuThu,
            số_tiền: (
              Number(formValues.value * 1000) +
              Number(formValues.copiesValue * 1000)
            ).toLocaleString(),
            số_tiền_bằng_chữ: numberToVietnamese(
              (
                Number(formValues.value * 1000) +
                Number(formValues.copiesValue * 1000)
              )
                .toString()
                .replace(/\./g, "")
                .replace(/\,/g, ".")
            ),
            tên_chuyên_viên: namedByUser,
            loại_hđ: formValues.name,
            ghi_chú: `(Công chứng: ${(
              formValues.value * 1000 || 0
            )?.toLocaleString()}đ; Bản sao: ${(
              formValues.copiesValue * 1000 || 0
            )?.toLocaleString()}đ)`,
            lý_do_nộp:
              type === "Invoice"
                ? formValues.name
                : `Phí, giá dịch vụ yêu cầu theo hồ sơ cc ${formValues.name} số:`,
          };
          if (isEdit) {
            updateContract({
              ...payload,
              id: idFromUrl as string,
              newId: idToSubmit,
            })
              .then(() => {
                toast.success("Cập nhật thành công");
                if (shouldRenderPhieuThu) {
                  handleRenderPhieuThu(phieuThuPayload);
                }
              })
              .catch((error) => {
                errorHandler(error);
              })
              .finally(() => {
                setIsLoading(false);
              });
          } else {
            submitContract(payload)
              .then(() => {
                toast.success("Tạo thành công");
                if (shouldRenderPhieuThu) {
                  handleRenderPhieuThu(phieuThuPayload);
                }
                resetForm();
              })
              .catch((error) => {
                errorHandler(error);
              })
              .finally(() => {
                getTheNextAvailableId(type)
                  .then((resp) => {
                    setNextAvailableId(resp);
                  })
                  .finally(() => {
                    setCheckingLoading(false);
                  });
                setIsLoading(false);
              });
          }
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      },
    });

  const getSubmitButtonLabel = () =>
    shouldRenderPhieuThu ? "Lưu thông tin và in phiếu thu" : "Lưu thông tin";

  return (
    <Box pb="3rem">
      {isEdit ? (
        <Typography fontWeight={600} variant="h3">
          Chỉnh sửa phiếu thu số {idFromUrl}
        </Typography>
      ) : (
        <Typography fontWeight={600} variant="h3">
          Nhập phiếu thu
        </Typography>
      )}
      <Box mt="2rem">
        {isEdit ? null : (
          <Box>
            <Typography>Chọn loại hình công chứng</Typography>
            <Select
              sx={{ width: "300px", marginTop: "1rem" }}
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <MenuItem value="Contract">Công chứng Hợp Đồng</MenuItem>
              <MenuItem value="Signature">Chứng thực chữ ký</MenuItem>
              <MenuItem value="Invoice">Phiếu thu khác</MenuItem>
            </Select>
          </Box>
        )}
        <Box mt="1rem">
          <Box mb="2rem">
            {isEdit || type === "Invoice" ? null : (
              <Typography variant="h5">
                Số hợp đồng sẵn sàng để lấy:{" "}
                <strong style={{ color: "green" }}>
                  {checkingLoading ? "Đang kiểm tra..." : nextAvailableId}
                </strong>
              </Typography>
            )}
            <Box sx={{ display: { xs: "none", md: "block" } }}>
              <WarningBanner />
            </Box>
          </Box>
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              sx={{ gridTemplateColumns: { xs: "1fr", md: "repeat(4, 1fr)" } }}
              gap="20px"
              mt="1rem"
            >
              <FormControl>
                <InputLabel htmlFor="unit">Đơn vị</InputLabel>
                <Select
                  id="unit"
                  name="unit"
                  label="Đơn vị"
                  value={values.unit}
                  onChange={handleChange}
                >
                  {BRANCHES.map((branch) => (
                    <MenuItem key={branch.id} value={branch.value}>
                      {branch.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Box display={type === "Invoice" ? "none" : "flex"} gap="10px">
                <TextField
                  label="Số hợp đồng"
                  name="id"
                  value={values.id}
                  slotProps={{
                    input: {
                      readOnly: isEdit && !isAdmin,
                    },
                  }}
                  error={!!errors.id}
                  helperText={errors.id}
                  onChange={handleChange}
                />
                <TextField
                  name="suffix"
                  label=""
                  slotProps={{
                    input: {
                      readOnly: isEdit && !isAdmin,
                    },
                  }}
                  value={suffix}
                  onChange={(e) => setSuffix(e.target.value)}
                />
              </Box>
              <FormControl>
                {type === "Invoice" ? (
                  <Autocomplete
                    id="ten"
                    freeSolo
                    value={values.name}
                    options={INVOICE_TYPES.map((invoice) => invoice.label)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        error={!!errors.name}
                        helperText={errors.name}
                        label="Nội dung thu"
                        name="name"
                        onChange={handleChange}
                      />
                    )}
                    onChange={(_e, value) =>
                      setValues({ ...values, name: value ?? "" })
                    }
                  />
                ) : (
                  <>
                    <InputLabel htmlFor="unit">Tên Hợp Đồng</InputLabel>
                    <Select
                      id="ten"
                      name="name"
                      label="Tên Hợp Đồng"
                      value={values.name}
                      onChange={handleChange}
                      error={!!errors.name}
                    >
                      {CONTRACT_TYPES.map((branch) => (
                        <MenuItem key={branch.id} value={branch.value}>
                          {branch.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </>
                )}
              </FormControl>
              <TextField
                label="Tên khách hàng"
                name="customer"
                value={values.customer}
                onChange={handleChange}
                error={!!errors.customer}
                helperText={errors.customer}
              />
              <TextField
                slotProps={{
                  input: {
                    disabled: isEdit && !isAdmin,
                  },
                }}
                label="Số tiền công chứng"
                name="value"
                placeholder="Vd: 100 = 100,000"
                value={values.value}
                onChange={handleChange}
                error={!!errors.value}
                helperText={errors.value}
              />
              <TextField
                slotProps={{
                  input: {
                    disabled: isEdit && !isAdmin,
                  },
                }}
                label="Số tiền làm bản sao"
                name="copiesValue"
                value={values.copiesValue}
                onChange={handleChange}
                error={!!errors.copiesValue}
                helperText={errors.copiesValue}
              />
              <TextField
                label="Quan hệ"
                name="broker"
                value={values.broker}
                onChange={handleChange}
                error={!!errors.broker}
                helperText={errors.broker}
              />
              <TextField
                label="Số CCCD"
                name="nationalId"
                disabled={type === "Contract"}
                value={values.nationalId}
                error={!!errors.nationalId}
                helperText={errors.nationalId}
                onChange={handleChange}
              />
              <DatePicker
                label="Ngày viết phiếu"
                value={values.filedDate}
                onChange={(e) =>
                  setValues({ ...values, filedDate: e as Dayjs })
                }
                format="DD/MM/YYYY"
              />
              <FormControl>
                <InputLabel htmlFor="deliveredBy">Người giao</InputLabel>
                <Select
                  id="deliveredBy"
                  name="deliveredBy"
                  label="Người giao"
                  value={values.deliveredBy}
                  onChange={handleChange}
                  error={!!errors.deliveredBy}
                >
                  <MenuItem value="">Chọn người giao</MenuItem>
                  {REVIEWERS.map((reviewer) => (
                    <MenuItem key={reviewer.id} value={reviewer.value}>
                      {reviewer.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <InputLabel htmlFor="inspectedBy">Người kiểm tra</InputLabel>
                <Select
                  id="inspectedBy"
                  name="inspectedBy"
                  label="Người kiểm tra"
                  value={values.inspectedBy}
                  onChange={handleChange}
                  error={!!errors.inspectedBy}
                >
                  <MenuItem value="">Chọn người kiểm tra</MenuItem>
                  {REVIEWERS.map((reviewer) => (
                    <MenuItem key={reviewer.id} value={reviewer.value}>
                      {reviewer.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <InputLabel htmlFor="inspectedBy">CCV</InputLabel>
                <Select
                  id="notarizedBy"
                  name="notarizedBy"
                  label="CCV"
                  value={values.notarizedBy}
                  error={!!errors.notarizedBy}
                  disabled={type === "Contract"}
                  onChange={handleChange}
                >
                  <MenuItem value="">Chọn CCV</MenuItem>
                  {CÔNG_CHỨNG_VIÊN.map((reviewer) => (
                    <MenuItem key={reviewer.id} value={reviewer.value}>
                      {reviewer.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Ghi chú"
                name="notes"
                value={values.notes}
                onChange={handleChange}
                error={!!errors.notes}
                helperText={errors.notes}
              />
              <TextField
                label="Ký ngoài"
                name="externalNotes"
                value={values.externalNotes}
                onChange={handleChange}
                error={!!errors.externalNotes}
                helperText={errors.externalNotes}
              />
            </Box>
            <Box>
              <FormControlLabel
                control={
                  <Checkbox
                    name="shouldRenderPhieuThu"
                    checked={shouldRenderPhieuThu}
                    onChange={(e) => setShouldRenderPhieuThu(e.target.checked)}
                  />
                }
                label="In phiếu thu"
              />
            </Box>
            <Box display="flex" gap="10px" mt="1rem">
              {isEdit ? (
                <Button
                  variant="outlined"
                  sx={{
                    width: "100px",
                    height: "40px",
                  }}
                  onClick={() => navigate("/history")}
                >
                  Huỷ
                </Button>
              ) : null}
              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: "green",
                  width: "300px",
                  height: "40px",
                }}
              >
                {isLoading ? (
                  <CircularProgress size={20} />
                ) : (
                  getSubmitButtonLabel()
                )}
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
      <WarningDialog
        open={warningDialogOpen}
        title="Cảnh báo"
        message="Vui lòng kiểm tra lại số Hợp đồng vừa nhập."
        onConfirm={() => setWarningDialogOpen(false)}
      />
    </Box>
  );
};

export default SubmitContract;
