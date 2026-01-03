import { useState, useRef, useEffect, useMemo } from "react";
import { Box, Typography, Chip } from "@mui/material";
import type { Person } from "@/api/inheritance";
import { PersionComponent } from "./persion";

interface InheritanceActions {
  addHeir: (
    relationship: "spouses" | "children" | "parents",
    person: Person
  ) => void;
  updateHeir: (
    relationship: "spouses" | "children" | "parents",
    index: number,
    person: Person
  ) => void;
  removeHeir: (
    relationship: "spouses" | "children" | "parents",
    index: number
  ) => void;
}

interface FirstClassHeirsProps {
  decedentGender: "Male" | "Female";
  spouses: Person[];
  children: Person[];
  parents: Person[];
  actions: InheritanceActions;
}

interface Heir {
  relationship: "spouses" | "children" | "parents";
  relationshipLabel: "Spouse" | "Child" | "Father" | "Mother";
  detail: Person;
  index: number;
}

export const FirstClassHeirs = ({
  decedentGender,
  spouses,
  children,
  parents,
  actions,
}: FirstClassHeirsProps) => {
  const heirs = useMemo<Heir[]>(() => {
    const result: Heir[] = [];
    
    spouses.forEach((person, index) => {
      result.push({
        relationship: "spouses",
        relationshipLabel: "Spouse",
        detail: person,
        index,
      });
    });
    
    children.forEach((person, index) => {
      result.push({
        relationship: "children",
        relationshipLabel: "Child",
        detail: person,
        index,
      });
    });
    
    parents.forEach((person, index) => {
      const relationshipLabel: "Father" | "Mother" = 
        person.sex === "Male" ? "Father" : "Mother";
      result.push({
        relationship: "parents",
        relationshipLabel,
        detail: person,
        index,
      });
    });
    
    return result;
  }, [spouses, children, parents]);

  const [containerHeight, setContainerHeight] = useState<number | "auto">(
    "auto"
  );
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateHeight = () => {
      if (contentRef.current) {
        const height = contentRef.current.scrollHeight;
        setContainerHeight(height);
      }
    };

    requestAnimationFrame(() => {
      requestAnimationFrame(updateHeight);
    });
  }, [heirs]);

  const handleDelete = (relationship: "spouses" | "children" | "parents", index: number) => {
    actions.removeHeir(relationship, index);
  };

  const handleUpdate = (
    relationship: "spouses" | "children" | "parents",
    index: number,
    person: Person
  ) => {
    actions.updateHeir(relationship, index, person);
  };

  const getDefaultGender = (
    relationship: "spouses" | "children" | "parents",
    parentType?: "father" | "mother"
  ): "Male" | "Female" => {
    if (relationship === "spouses") {
      return decedentGender === "Male" ? "Female" : "Male";
    }
    if (relationship === "parents") {
      return parentType === "father" ? "Male" : "Female";
    }
    return "Male";
  };

  const handleAddHeir = (
    relationship: "spouses" | "children" | "parents",
    parentType?: "father" | "mother"
  ) => {
    const newPerson: Person = {
      name: "",
      sex: getDefaultGender(relationship, parentType),
      birth_year: 0,
      spouses: [],
      parents: [],
      children: [],
    };
    actions.addHeir(relationship, newPerson);
  };
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" sx={{ mb: 2 }}>
          Hàng thừa kế thứ nhất
        </Typography>
        <Box
          display="flex"
          gap="10px"
          sx={{
            "& .MuiChip-root": {
              padding: "10px 20px",
              borderRadius: "5px",
              fontSize: "16px",
              fontWeight: "600",
              color: "#fff",
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "#000000",
              },
            },
          }}
        >
          <Chip
            label={decedentGender === "Male" ? "+Vợ" : "+Chồng"}
            color="info"
            onClick={() => handleAddHeir("spouses")}
          />
          <Chip
            label="+Con"
            color="secondary"
            onClick={() => handleAddHeir("children")}
          />
          <Chip
            label="+Cha"
            color="success"
            onClick={() => handleAddHeir("parents", "father")}
          />
          <Chip
            label="+Mẹ"
            color="error"
            onClick={() => handleAddHeir("parents", "mother")}
          />
        </Box>
      </Box>

      <Box
        className="heirs-container"
        sx={{
          height:
            typeof containerHeight === "number"
              ? `${containerHeight}px`
              : containerHeight,
          overflow: "hidden",
          transition: "height 0.3s ease-in-out",
        }}
      >
        <Box
          ref={contentRef}
          padding="10px"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "40px",
          }}
        >
          {heirs.length <= 0 ? (
            <Box
              height="100px"
              border="1px dashed #e0e0e0"
              borderRadius="5px"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Typography variant="body1">Không có người thừa kế</Typography>
            </Box>
          ) : null}
          {heirs.map((heir) => (
            <PersionComponent
              key={`${heir.relationship}-${heir.index}`}
              index={heir.index}
              person={heir.detail}
              relationship={heir.relationshipLabel}
              relationshipKey={heir.relationship}
              decedentGender={decedentGender}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};
