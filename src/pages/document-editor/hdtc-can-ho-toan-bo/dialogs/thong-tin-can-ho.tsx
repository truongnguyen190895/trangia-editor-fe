import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { CÁC_LOẠI_GIẤY_CHỨNG_NHẬN_QUYỀN_SỬ_DỤNG_ĐẤT } from "@/constants";
import { numberToVietnamese } from "@/utils/number-to-words";
import type { ThongTinCanHo } from "@/models/hdmb-can-ho";
import { useHDMBCanHoContext } from "@/context/hdmb-can-ho";
import { SearchEntity } from "@/components/common/search-entity";
import { saveContractEntity } from "@/api/contract_entity";
import { useState } from "react";

interface ThongTinCanHoProps {
  open: boolean;
  handleClose: () => void;
}

const validationSchema = Yup.object({
  số_gcn: Yup.string().required("Số giấy chứng nhận là bắt buộc"),
});

export const ThongTinCanHoDialog = ({
  open,
  handleClose,
}: ThongTinCanHoProps) => {
  const { canHo, addCanHo } = useHDMBCanHoContext();
  const [saveLoading, setSaveLoading] = useState<boolean>(false);

  const submitForm = (values: ThongTinCanHo) => {
    addCanHo(values);
    setSaveLoading(true);
    saveContractEntity(values.số_gcn, values).finally(() => {
      setSaveLoading(false);
      handleClose();
    });
  };

  const getInitialValue = (): ThongTinCanHo => {
    return canHo
      ? canHo
      : {
          số_căn_hộ: "",
          tên_toà_nhà: "",
          địa_chỉ_toà_nhà: "",
          địa_chỉ_cũ: "",
          loại_gcn: "",
          số_gcn: "",
          số_vào_sổ_cấp_gcn: "",
          nơi_cấp_gcn: "",
          ngày_cấp_gcn: "",
          diện_tích_sàn_bằng_số: "",
          diện_tích_sàn_một_phần_bằng_số: "",
          diện_tích_sàn_một_phần_bằng_chữ: "",
          diện_tích_sàn_bằng_chữ: "",
          cấp_hạng: "",
          tầng_có_căn_hộ: "",
          kết_cấu: "",
          hình_thức_sở_hữu_căn_hộ: "",
          năm_hoàn_thành_xây_dựng: "",
          ghi_chú_căn_hộ: "",
          số_tiền: "0",
          số_tiền_bằng_chữ: "không",
          thời_hạn: null,
          thời_hạn_bằng_chữ: null,
        };
  };

  const {
    values,
    errors,
    touched,
    setFieldValue,
    handleChange,
    handleSubmit,
    setValues,
  } = useFormik<ThongTinCanHo>({
    initialValues: getInitialValue(),
    validationSchema,
    onSubmit: submitForm,
  });

  const handleSearch = (response: any) => {
    if (response) {
      setValues({
        ...values,
        ...response,
      });
    }
  };

  return (
    <Dialog maxWidth="xl" fullWidth open={open} onClose={handleClose}>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle>Thêm thông tin căn hộ</DialogTitle>
        <DialogContent>
          <SearchEntity
            placeholder="Nhập số giấy tờ (số sổ)"
            onSearch={handleSearch}
          />
          <Box sx={{ pt: 2 }}>
            <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={2}>
              <TextField
                fullWidth
                id="số_căn_hộ"
                name="số_căn_hộ"
                label="Số căn hộ"
                value={values["số_căn_hộ"]}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                id="tên_toà_nhà"
                name="tên_toà_nhà"
                label="Tên toà nhà"
                value={values["tên_toà_nhà"]}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                type="text"
                id="địa_chỉ_toà_nhà"
                name="địa_chỉ_toà_nhà"
                label="Địa chỉ toà nhà"
                value={values["địa_chỉ_toà_nhà"]}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                id="địa_chỉ_cũ"
                name="địa_chỉ_cũ"
                label="Địa chỉ cũ"
                value={values["địa_chỉ_cũ"]}
                onChange={handleChange}
              />
              <Autocomplete
                sx={{ gridColumn: "span 2" }}
                freeSolo
                options={CÁC_LOẠI_GIẤY_CHỨNG_NHẬN_QUYỀN_SỬ_DỤNG_ĐẤT.map(
                  (item) => item.value
                )}
                value={values["loại_gcn"]}
                onChange={(_event, value) => {
                  setFieldValue("loại_gcn", value ?? "");
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    onChange={(event) => {
                      setFieldValue("loại_gcn", event.target.value ?? "");
                    }}
                    label="Loại giấy chứng nhận"
                  />
                )}
              />
              <TextField
                fullWidth
                type="text"
                id="số_gcn"
                name="số_gcn"
                label="Số giấy chứng nhận *"
                value={values["số_gcn"]}
                onChange={handleChange}
                error={!!errors["số_gcn"] && touched["số_gcn"]}
                helperText={
                  errors["số_gcn"] && touched["số_gcn"] && errors["số_gcn"]
                }
              />
              <TextField
                fullWidth
                type="text"
                id="số_vào_sổ_cấp_gcn"
                name="số_vào_sổ_cấp_gcn"
                label="Số vào sổ cấp giấy chứng nhận"
                value={values["số_vào_sổ_cấp_gcn"]}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                type="text"
                id="nơi_cấp_gcn"
                name="nơi_cấp_gcn"
                label="Nơi cấp giấy chứng nhận"
                value={values["nơi_cấp_gcn"]}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                type="text"
                label="Ngày cấp giấy chứng nhận (DD/MM/YYYY)"
                id="ngày_cấp_gcn"
                name="ngày_cấp_gcn"
                value={values["ngày_cấp_gcn"]}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                type="text"
                id="diện_tích_sàn_bằng_số"
                name="diện_tích_sàn_bằng_số"
                label="Diện tích sàn bằng số"
                value={values["diện_tích_sàn_bằng_số"]}
                onChange={(event) => {
                  handleChange(event);
                  setFieldValue(
                    "diện_tích_sàn_bằng_chữ",
                    numberToVietnamese(
                      event.target.value?.replace(/\./g, "").replace(/\,/g, ".")
                    )
                  );
                }}
              />
              <TextField
                fullWidth
                type="text"
                id="diện_tích_sàn_bằng_chữ"
                name="diện_tích_sàn_bằng_chữ"
                label="Diện tích bằng chữ"
                value={values["diện_tích_sàn_bằng_chữ"]}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                type="text"
                id="diện_tích_sàn_một_phần_bằng_số"
                name="diện_tích_sàn_một_phần_bằng_số"
                label="Diện tích sàn một phần bằng số"
                value={values["diện_tích_sàn_một_phần_bằng_số"]}
                onChange={(event) => {
                  handleChange(event);
                  setFieldValue(
                    "diện_tích_sàn_một_phần_bằng_chữ",
                    numberToVietnamese(
                      event.target.value?.replace(/\./g, "").replace(/\,/g, ".")
                    )
                  );
                }}
              />
              <TextField
                fullWidth
                type="text"
                id="diện_tích_sàn_một_phần_bằng_chữ"
                name="diện_tích_sàn_một_phần_bằng_chữ"
                label="Diện tích sàn một phần bằng chữ"
                value={values["diện_tích_sàn_một_phần_bằng_chữ"]}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                type="text"
                id="cấp_hạng"
                name="cấp_hạng"
                label="Cấp hạng"
                value={values["cấp_hạng"]}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                type="text"
                id="tầng_có_căn_hộ"
                name="tầng_có_căn_hộ"
                label="Tầng có căn hộ"
                value={values["tầng_có_căn_hộ"]}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                type="text"
                id="kết_cấu"
                name="kết_cấu"
                label="Kết cấu"
                value={values["kết_cấu"]}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                type="text"
                id="hình_thức_sở_hữu_căn_hộ"
                name="hình_thức_sở_hữu_căn_hộ"
                label="Hình thức sở hữu căn hộ"
                value={values["hình_thức_sở_hữu_căn_hộ"]}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                type="text"
                id="năm_hoàn_thành_xây_dựng"
                name="năm_hoàn_thành_xây_dựng"
                label="Năm hoàn thành xây dựng"
                value={values["năm_hoàn_thành_xây_dựng"]}
                onChange={handleChange}
              />
              <TextField
                sx={{ gridColumn: "span 3" }}
                fullWidth
                type="text"
                multiline
                rows={4}
                id="ghi_chú_căn_hộ"
                name="ghi_chú_căn_hộ"
                label="Ghi chú căn hộ"
                value={values["ghi_chú_căn_hộ"]}
                onChange={handleChange}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button color="secondary" variant="outlined" onClick={handleClose}>
            Hủy
          </Button>
          <Button
            color="success"
            variant="contained"
            type="submit"
            disabled={saveLoading}
          >
            {saveLoading ? <CircularProgress size={20} /> : "Thêm"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};
