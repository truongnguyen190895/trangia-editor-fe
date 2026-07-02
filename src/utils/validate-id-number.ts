import * as Yup from "yup";

export const CCCD_12_DIGITS = /^\d{12}$/;

// Schema cho số_giấy_tờ, rule đổi theo loại_giấy_tờ cùng cấp trong form.
// loại_giấy_tờ là Autocomplete freeSolo nên rule chặt chỉ áp cho các loại
// chuẩn (CÁC_LOẠI_GIẤY_TỜ_ĐỊNH_DANH); loại lạ rơi về rule chữ+số chung.
export const sốGiấyTờSchema = (loạiField = "loại_giấy_tờ") =>
  Yup.string()
    .required("Số giấy tờ là bắt buộc")
    .when(loạiField, {
      is: (v: string) => v === "CCCD" || v === "Căn cước",
      then: (s) =>
        s.matches(CCCD_12_DIGITS, "CCCD/Căn cước phải gồm đúng 12 chữ số"),
    })
    .when(loạiField, {
      is: "CMND",
      then: (s) => s.matches(/^\d{9}$/, "CMND phải gồm đúng 9 chữ số"),
    })
    .when(loạiField, {
      is: "Hộ chiếu",
      then: (s) =>
        s.matches(
          /^[A-Za-z][A-Za-z0-9]{7,8}$/,
          "Hộ chiếu phải gồm 8-9 ký tự chữ và số (vd: C1234567)"
        ),
    })
    .matches(/^[A-Za-z0-9]+$/, "Số giấy tờ chỉ được chứa chữ và số");
