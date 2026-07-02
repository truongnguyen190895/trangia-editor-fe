import { TextField, type TextFieldProps } from "@mui/material";
import type { FormikProps } from "formik";

export type FormikTextFieldProps = Omit<
  TextFieldProps,
  "name" | "value" | "error" | "helperText"
> & {
  formik: FormikProps<any>;
  name: string;
  label: string;
  /**
   * Called after the field's own value is updated, for deriving sibling fields
   * (e.g. số → chữ). Receives the raw input value and the formik instance.
   */
  onValueChange?: (value: string, formik: FormikProps<any>) => void;
};

export const FormikTextField = ({
  formik,
  name,
  label,
  onValueChange,
  ...textFieldProps
}: FormikTextFieldProps) => {
  const showError = !!formik.errors[name] && !!formik.touched[name];

  return (
    <TextField
      fullWidth
      id={name}
      name={name}
      label={label}
      value={formik.values[name] ?? ""}
      onChange={(event) => {
        formik.handleChange(event);
        onValueChange?.(event.target.value, formik);
      }}
      error={showError}
      helperText={showError ? (formik.errors[name] as string) : undefined}
      {...textFieldProps}
    />
  );
};
