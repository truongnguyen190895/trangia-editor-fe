import { useState, useRef, useEffect } from "react";
import { Box, Typography, Chip } from "@mui/material";
import type { Person } from "../interface";
import { PersionComponent } from "./persion";

interface FirstClassHeirsProps {
  decedentGender: "Male" | "Female";
}

interface Heir {
  relationship: "Spouse" | "Child" | "Parent";
  detail: Person;
}
export const FirstClassHeirs = ({ decedentGender }: FirstClassHeirsProps) => {
  const [heirs, setHeirs] = useState<Heir[]>([]);
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

  const handleDelete = (index: number) => {
    setHeirs(heirs.filter((_, i) => i !== index));
  };
  const handleUpdate = (index: number, person: Person) => {
    setHeirs(heirs.map((h, i) => (i === index ? { ...h, detail: person } : h)));
  };

  const handleAddHeir = (relationship: "Spouse" | "Child" | "Parent") => {
    setHeirs([
      ...heirs,
      {
        relationship,
        detail: {
          name: "",
          sex: "Male",
          birth_year: "",
          spouses: [],
          parents: [],
          children: [],
        },
      },
    ]);
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
            onClick={() => handleAddHeir("Spouse")}
          />
          <Chip
            label="Con"
            color="secondary"
            onClick={() => handleAddHeir("Child")}
          />
          <Chip
            label="Cha"
            color="success"
            onClick={() => handleAddHeir("Parent")}
          />
          <Chip
            label="Mẹ"
            color="error"
            onClick={() => handleAddHeir("Parent")}
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
          {heirs.map((heir, index) => (
            <PersionComponent
              key={index}
              index={index}
              person={heir.detail}
              relationship={heir.relationship}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};
