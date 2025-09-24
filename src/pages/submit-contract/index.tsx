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
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BRANCHES } from "@/constants/branches";
import { CONTRACT_TYPES } from "@/constants/contract-types";
import { REVIEWERS } from "@/constants/reviewer";
import { useFormik } from "formik";
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

const validationSchema = yup.object({
  unit: yup.string(),
  id: yup
    .string()
    .required("Số hợp đồng là bắt buộc")
    .matches(/^\d+$/, "Số hợp đồng chỉ được chứa số"),
  name: yup.string().required("Tên hợp đồng là bắt buộc"),
  customer: yup.string().required("Tên khách hàng là bắt buộc"),
  broker: yup.string(),
  value: yup.number().required("Số tiền là bắt buộc"),
  copiesValue: yup.number(),
  notes: yup.string(),
  nationalId: yup.string(),
});

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
  const userRoles = JSON.parse(localStorage.getItem("roles") || "[]");
  const isAdmin = userRoles.some(
    (role: string) => role === "ROLE_Admin" || role === "ROLE_Manager"
  );
  const idFromUrl = searchParams.get("id");

  const namedByUser = localStorage.getItem("username") || "";

  useEffect(() => {
    setCheckingLoading(true);
    getTheNextAvailableId(type)
      .then((resp) => {
        setNextAvailableId(resp);
        if (String(resp)?.includes("/")) {
          const [_id, suffix] = resp.split("/");
          setSuffix(suffix);
        } else {
          const [_id, suffix] = String(resp).split(".");
          setSuffix(suffix || new Date().getFullYear().toString());
        }
      })
      .finally(() => {
        setCheckingLoading(false);
      });
  }, [type]);

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
          } else {
            setType("Signature");
            const [oldId, oldSuffix] = idFromUrl.split(".");
            id = oldId;
            setSuffix(oldSuffix);
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
    console.log(error);
    if (error?.status === 400) {
      toast.error(
        "Đã có người sử dụng số hợp đồng này, vui lòng lấy số hợp đồng khác"
      );
    } else if (error?.response?.data?.message?.includes("Invalid date")) {
      toast.error("Ngày viết phiếu không hợp lệ");
    } else {
      toast.error("Có lỗi xảy ra");
    }
  };

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
        unit: "HĐ",
        relationship: "",
        nationalId: "",
        filedDate: dayjs(),
        deliveredBy: "",
        inspectedBy: "",
        externalNotes: "",
        notarizedBy: "",
      },
      onSubmit: (formValues) => {
        setIsLoading(true);
        let idToSubmit = "";
        let idPhieuThu = "";
        if (type === "Contract") {
          idToSubmit =
            formValues.id + "/" + suffix + "/" + dayjs().format("YYYY");
          idPhieuThu = formValues.id + "/" + suffix;
        } else {
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
          số_cc: idPhieuThu,
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
        };
        if (isEdit) {
          updateContract(payload)
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
              getTheNextAvailableId(type)
                .then((resp) => {
                  setNextAvailableId(resp);
                  if (String(resp)?.includes("/")) {
                    const [_id, suffix] = resp.split("/");
                    setSuffix(suffix);
                  } else {
                    const [_id, suffix] = String(resp).split(".");
                    setSuffix(suffix || new Date().getFullYear().toString());
                  }
                })
                .finally(() => {
                  setCheckingLoading(false);
                });
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
      },
    });

  const getSubmitButtonLabel = () =>
    shouldRenderPhieuThu ? "Lưu thông tin và in phiếu thu" : "Lưu thông tin";

  return (
    <Box>
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
            </Select>
          </Box>
        )}
        <Box mt="1rem">
          <Box mb="2rem">
            {isEdit ? null : (
              <Typography variant="h5">
                Số hợp đồng sẵn sàng để lấy:{" "}
                <strong style={{ color: "green" }}>
                  {checkingLoading ? "Đang kiểm tra..." : nextAvailableId}
                </strong>
              </Typography>
            )}
            <WarningBanner />
          </Box>
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gridTemplateColumns="repeat(4, 1fr)"
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
              <Box display="flex" gap="10px">
                <TextField
                  label="Số hợp đồng"
                  name="id"
                  value={values.id}
                  slotProps={{
                    input: {
                      readOnly: isEdit,
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
                      readOnly: isEdit,
                    },
                  }}
                  value={suffix}
                  onChange={(e) => setSuffix(e.target.value)}
                />
              </Box>

              <FormControl>
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
                label="Số CCCD"
                name="nationalId"
                value={values.nationalId}
                onChange={handleChange}
                error={!!errors.nationalId}
                helperText={errors.nationalId}
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
                  onChange={handleChange}
                  error={!!errors.notarizedBy}
                >
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
    </Box>
  );
};

export default SubmitContract;
