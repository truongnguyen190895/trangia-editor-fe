import { useState, useEffect } from "react";
import {
  Box,
  Switch,
  TextField,
  Typography,
  IconButton,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import type { Person } from "@/api/inheritance";

interface PersionComponentProps {
  index: number;
  person: Person;
  relationship: "Spouse" | "Child" | "Father" | "Mother";
  relationshipKey: "spouses" | "children" | "parents";
  decedentGender: "Male" | "Female";
  onDelete: (
    relationship: "spouses" | "children" | "parents",
    index: number
  ) => void;
  onUpdate: (
    relationship: "spouses" | "children" | "parents",
    index: number,
    person: Person
  ) => void;
}

export const PersionComponent = ({
  index,
  person,
  relationship,
  relationshipKey,
  decedentGender,
  onDelete,
  onUpdate,
}: PersionComponentProps) => {
  const [isAlive, setIsAlive] = useState(true);
  const [refuseToInherit, setRefuseToInherit] = useState(false);

  /**
   * Gets the expected gender for this relationship
   */
  const getExpectedGender = (): "Male" | "Female" => {
    if (relationship === "Spouse") {
      return decedentGender === "Male" ? "Female" : "Male";
    }
    if (relationship === "Father") {
      return "Male";
    }
    if (relationship === "Mother") {
      return "Female";
    }
    // Child can be either
    return person.sex;
  };

  /**
   * Determines if gender selection should be disabled based on relationship
   */
  const isGenderDisabled = (): boolean => {
    return (
      relationship === "Spouse" ||
      relationship === "Father" ||
      relationship === "Mother"
    );
  };

  const handleDelete = () => {
    onDelete(relationshipKey, index);
  };

  const handleUpdate = (field: keyof Person, value: any) => {
    // Enforce gender rules based on relationship
    if (field === "sex") {
      const newGender = value as "Male" | "Female";
      
      // Validate gender changes based on relationship
      if (relationship === "Spouse") {
        // Spouse must be opposite of decedent
        const expectedGender = decedentGender === "Male" ? "Female" : "Male";
        if (newGender !== expectedGender) {
          // Auto-correct to expected gender
          value = expectedGender;
        }
      } else if (relationship === "Father" && newGender !== "Male") {
        // Father must be Male
        value = "Male";
      } else if (relationship === "Mother" && newGender !== "Female") {
        // Mother must be Female
        value = "Female";
      }
    }
    
    const processedValue = field === "birth_year" ? Number(value) || 0 : value;
    onUpdate(relationshipKey, index, { ...person, [field]: processedValue });
  };

  // Enforce correct gender based on relationship when component mounts or relationship changes
  useEffect(() => {
    // Only auto-correct if gender doesn't match expected and it's not a child
    if (relationship !== "Child") {
      const expectedGender = getExpectedGender();
      if (person.sex !== expectedGender) {
        // Use onUpdate directly to avoid infinite loop
        onUpdate(relationshipKey, index, { ...person, sex: expectedGender });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [relationship, decedentGender]); // Only run when relationship or decedent gender changes

  const generateRelationship = () => {
    switch (relationship) {
      case "Spouse":
        return decedentGender === "Male" ? "Vợ" : "Chồng";
      case "Child":
        return "Con";
      case "Father":
        return "Cha";
      case "Mother":
        return "Mẹ";
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
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel id={`gender-select-label-${index}`}>Giới tính</InputLabel>
          <Select
            labelId={`gender-select-label-${index}`}
            value={person.sex}
            label="Giới tính"
            disabled={isGenderDisabled()}
            onChange={(e) =>
              handleUpdate("sex", e.target.value as "Male" | "Female")
            }
            sx={{
              "& .MuiSelect-select.Mui-disabled": {
                backgroundColor: "rgba(0, 0, 0, 0.06)",
              },
            }}
          >
            <MenuItem value="Male">Nam</MenuItem>
            <MenuItem value="Female">Nữ</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Tên"
          variant="outlined"
          value={person.name}
          onChange={(e) => handleUpdate("name", e.target.value)}
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
          <IconButton onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};
