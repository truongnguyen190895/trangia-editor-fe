import { Autocomplete, TextField, type SxProps, type Theme } from "@mui/material";
import type { FormikProps } from "formik";

export type FormikAutocompleteProps = {
  formik: FormikProps<any>;
  name: string;
  label?: string;
  options: readonly unknown[];
  freeSolo?: boolean;
  sx?: SxProps<Theme>;
  getOptionLabel?: (option: unknown) => string;
};

const toStringValue = (value: unknown): string =>
  typeof value === "string"
    ? value
    : (value as { value?: string } | null)?.value ?? "";

export const FormikAutocomplete = ({
  formik,
  name,
  label,
  options,
  freeSolo = true,
  sx,
  getOptionLabel,
}: FormikAutocompleteProps) => {
  const showError = !!formik.errors[name] && !!formik.touched[name];

  return (
    <Autocomplete
      fullWidth
      freeSolo={freeSolo}
      sx={sx}
      options={options as unknown[]}
      getOptionLabel={getOptionLabel}
      value={formik.values[name] ?? ""}
      onChange={(_event, value) => {
        formik.setFieldValue(name, toStringValue(value));
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          onChange={(event) => {
            formik.setFieldValue(name, event.target.value ?? "");
          }}
          error={showError}
          helperText={showError ? (formik.errors[name] as string) : undefined}
        />
      )}
    />
  );
};
