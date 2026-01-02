import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Typography,
  IconButton,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import type {
  Person,
  DeathCertificate,
  RefusalDocument,
} from "@/api/inheritance";
import { IOSSwitch } from "./switch";
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
    return person.sex;
  };

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
    if (field === "sex") {
      const newGender = value as "Male" | "Female";

      if (relationship === "Spouse") {
        const expectedGender = decedentGender === "Male" ? "Female" : "Male";
        if (newGender !== expectedGender) {
          value = expectedGender;
        }
      } else if (relationship === "Father" && newGender !== "Male") {
        value = "Male";
      } else if (relationship === "Mother" && newGender !== "Female") {
        value = "Female";
      }
    }

    const processedValue = field === "birth_year" ? Number(value) || 0 : value;
    onUpdate(relationshipKey, index, { ...person, [field]: processedValue });
  };

  const handleDeathCertificateUpdate = (
    field: keyof DeathCertificate,
    value: any
  ) => {
    const updatedDeathCertificate: DeathCertificate = {
      ...(person.death_certificate || {
        id: "",
        died_date: "",
        issued_by: "",
        issued_date: "",
        issued_by_address: "",
      }),
      [field]: value,
    };
    onUpdate(relationshipKey, index, {
      ...person,
      death_certificate: updatedDeathCertificate,
    });
  };

  const handleRefusalDocumentUpdate = (
    field: keyof RefusalDocument,
    value: any
  ) => {
    const updatedRefusalDocument: RefusalDocument = {
      ...(person.refusal_document || {
        id: "",
        notarized_by: "",
        notarized_date: "",
      }),
      [field]: value,
    };
    onUpdate(relationshipKey, index, {
      ...person,
      refusal_document: updatedRefusalDocument,
    });
  };

  useEffect(() => {
    if (relationship !== "Child") {
      const expectedGender = getExpectedGender();
      if (person.sex !== expectedGender) {
        onUpdate(relationshipKey, index, { ...person, sex: expectedGender });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [relationship, decedentGender]);

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
    <Box border="1px solid #e0e0e0" borderRadius="5px" padding="20px">
      <Box display="flex" alignItems="center" gap="10px">
        <TextField
          slotProps={{ input: { readOnly: true, sx: { width: "120px" } } }}
          label="Quan hệ"
          variant="outlined"
          value={generateRelationship()}
        />
        <FormControl sx={{ width: "120px" }}>
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
        <TextField
          label="Năm sinh"
          variant="outlined"
          value={person.birth_year}
          onChange={(e) => handleUpdate("birth_year", e.target.value)}
        />

        <Box display="flex" alignItems="center" gap="10px">
          <IconButton onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
        </Box>
      </Box>
      <Box mt={2}>
        <Typography>Tình trạng</Typography>
        <Box
          display="flex"
          alignItems="center"
          gap="50px"
          width="50%"
          mt="20px"
        >
          <Box display="flex" alignItems="center" gap="8px" flex={1}>
            <IOSSwitch
              checked={isAlive}
              onChange={() => setIsAlive(!isAlive)}
            />
            <Typography sx={{ lineHeight: 1, minWidth: "fit-content" }}>
              {isAlive ? "Đang sống" : "Đã chết"}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap="8px" flex={1}>
            <IOSSwitch
              checked={refuseToInherit}
              onChange={() => setRefuseToInherit(!refuseToInherit)}
            />
            <Typography sx={{ lineHeight: 1, minWidth: "fit-content" }}>
              {refuseToInherit ? "Từ chối" : "Không từ chối"}
            </Typography>
          </Box>
        </Box>

        <Box className="dead-certificate-section" mt="20px">
          <Typography>Thông tin giấy chứng tử</Typography>
          <Box
            display="flex"
            alignItems="center"
            gap="20px"
            mt="20px"
            flexWrap="wrap"
          >
            <TextField
              disabled={isAlive}
              label="Chết ngày"
              variant="outlined"
              value={person.death_certificate?.died_date || ""}
              onChange={(e) =>
                handleDeathCertificateUpdate("died_date", e.target.value)
              }
            />
            <TextField
              disabled={isAlive}
              label="Số trích lục khai tử"
              variant="outlined"
              value={person.death_certificate?.id || ""}
              onChange={(e) =>
                handleDeathCertificateUpdate("id", e.target.value)
              }
            />
            <TextField
              disabled={isAlive}
              label="Nơi cấp"
              variant="outlined"
              value={person.death_certificate?.issued_by || ""}
              onChange={(e) =>
                handleDeathCertificateUpdate("issued_by", e.target.value)
              }
            />
            <TextField
              disabled={isAlive}
              label="Ngày cấp"
              variant="outlined"
              value={person.death_certificate?.issued_date || ""}
              onChange={(e) =>
                handleDeathCertificateUpdate("issued_date", e.target.value)
              }
            />
            <TextField
              disabled={isAlive}
              label="Địa chỉ nơi cấp"
              variant="outlined"
              value={person.death_certificate?.issued_by_address || ""}
              onChange={(e) =>
                handleDeathCertificateUpdate(
                  "issued_by_address",
                  e.target.value
                )
              }
            />
            <TextField
              disabled={isAlive}
              label="Địa chỉ nơi cấp (địa chỉ cũ nếu có)"
              variant="outlined"
              value={person.death_certificate?.issued_by_address_old || ""}
              onChange={(e) =>
                handleDeathCertificateUpdate(
                  "issued_by_address_old",
                  e.target.value
                )
              }
            />
          </Box>
        </Box>

        <Box className="refusal-document-section" mt="20px">
          <Typography>Thông tin từ chối</Typography>
          <Box
            display="flex"
            alignItems="center"
            gap="20px"
            mt="20px"
            flexWrap="wrap"
          >
            <TextField
              disabled={!refuseToInherit}
              label="Từ chối"
              variant="outlined"
              value={person.refusal_document?.id || ""}
              onChange={(e) =>
                handleRefusalDocumentUpdate("id", e.target.value)
              }
            />
            <TextField
              disabled={!refuseToInherit}
              label="Ngày cấp"
              variant="outlined"
              value={person.refusal_document?.notarized_date || ""}
              onChange={(e) =>
                handleRefusalDocumentUpdate("notarized_date", e.target.value)
              }
            />
            <TextField
              disabled={!refuseToInherit}
              label="Người công chứng"
              variant="outlined"
              value={person.refusal_document?.notarized_by || ""}
              onChange={(e) =>
                handleRefusalDocumentUpdate("notarized_by", e.target.value)
              }
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
