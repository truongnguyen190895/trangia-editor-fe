import { useState } from "react";
import { Box, Typography } from "@mui/material";
import { DecedentSection } from "./components/decedent-section";
import type { Inheritance, Person } from "./interface";

const InheritancePage = () => {
  const [inheritance, setInheritance] = useState<Inheritance>({
    decedent: {
      name: "",
      sex: "Male",
      birth_year: "",
      spouses: [],
      parents: [],
      children: [],
    },
    property: {
      id: "",
    },
  });

  const handleDecedentChange = (decedent: Person) => {
    setInheritance({ ...inheritance, decedent });
  };

  return (
    <Box>
      <Box
        className="banner-container"
        sx={{
          backgroundColor: "#EDA35A",
          padding: "2rem",
          borderRadius: "5px",
          mb: "2rem",
        }}
      >
        <Typography variant="h5" fontWeight={600}>
          Tính năng đang phát triển
        </Typography>
      </Box>
      <DecedentSection
        decedent={inheritance.decedent}
        onDecedentChange={handleDecedentChange}
      />
    </Box>
  );
};

export default InheritancePage;
