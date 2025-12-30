import { useState } from "react";
import { Box, Switch, TextField, Typography, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import type { Person } from "../interface";

interface PersionComponentProps {
  index: number;
  person: Person;
  relationship: "Spouse" | "Child" | "Parent";
  onDelete: (index: number) => void;
  onUpdate: (index: number, person: Person) => void;
}

export const PersionComponent = ({
  index,
  person,
  relationship,
  onDelete,
  onUpdate,
}: PersionComponentProps) => {
  const [isAlive, setIsAlive] = useState(true);
  const [refuseToInherit, setRefuseToInherit] = useState(false);
  const handleDelete = (index: number) => {
    onDelete(index);
  };

  const generateRelationship = () => {
    switch (relationship) {
      case "Spouse":
        return "Chồng/Vợ";
      case "Child":
        return "Con";
      case "Parent":
        return "Cha/Mẹ";
      default:
        return "";
    }
  };

  return (
    <Box border="1px solid #e0e0e0" borderRadius="5px" padding="10px">
      <Box display="flex" alignItems="center" gap="10px">
        <TextField
          slotProps={{ input: { readOnly: true } }}
          label="Quan hệ với người để lại di sản"
          variant="outlined"
          value={generateRelationship()}
        />
        <TextField
          label="Tên"
          variant="outlined"
          value={person.name}
          onChange={(e) => onUpdate(index, { ...person, name: e.target.value })}
        />
        <TextField label="Số giấy tờ" variant="outlined" />
        <Box display="flex" alignItems="center" gap="10px">
          <Switch checked={isAlive} onChange={() => setIsAlive(!isAlive)} />
          <Typography>Đang sống</Typography>
          <Switch
            checked={refuseToInherit}
            onChange={() => setRefuseToInherit(!refuseToInherit)}
          />
          <Typography>Từ chối thừa kế</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap="10px">
          <IconButton onClick={() => handleDelete(index)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};
