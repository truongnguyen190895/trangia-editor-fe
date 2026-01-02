import { Switch } from "@mui/material";

interface iOSSwitchProps {
  checked: boolean;
  onChange: () => void;
}

export const IOSSwitch = ({ checked, onChange }: iOSSwitchProps) => {
  return (
    <Switch
      checked={checked}
      onChange={onChange}
      sx={{
        width: 51,
        height: 29,
        padding: 0,
        margin: 0,
        "& .MuiSwitch-switchBase": {
          padding: 0,
          marginTop: '1px',
          transitionDuration: "300ms",
          "&.Mui-checked": {
            transform: "translateX(24px)",
            color: "#fff",
            "& + .MuiSwitch-track": {
              backgroundColor: "#34C759",
              opacity: 1,
              border: 0,
            },
            "&.Mui-disabled + .MuiSwitch-track": {
              opacity: 0.5,
            },
          },
        },
        "& .MuiSwitch-thumb": {
          boxSizing: "border-box",
          width: 27,
          height: 27,
        },
        "& .MuiSwitch-track": {
          borderRadius: 31 / 2,
          backgroundColor: "#E9E9EA",
          opacity: 1,
          transition: "background-color 300ms cubic-bezier(0.4, 0, 0.2, 1)",
        },
      }}
    />
  );
};
