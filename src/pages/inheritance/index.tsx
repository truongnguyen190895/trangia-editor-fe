import { useReducer } from "react";
import { Box, Button, Typography } from "@mui/material";
import { DecedentSection } from "./components/decedent-section";
import { PropertySection } from "./components/property-section";
import {
  type InheritanceDto,
  type Person,
  type Property,
  type DeathCertificate,
} from "@/api/inheritance";

/**
 * State Management Solution:
 *
 * This component uses useReducer for managing complex nested inheritance state.
 *
 * Benefits:
 * 1. Centralized state management - all state updates go through a single reducer
 * 2. Type-safe actions - each action is properly typed with TypeScript
 * 3. Predictable updates - reducer pattern ensures consistent state transitions
 * 4. Easier debugging - all state changes are traceable through action dispatches
 * 5. Better performance - reducer pattern avoids unnecessary re-renders
 * 6. Maintainability - clear separation between state structure and update logic
 *
 * The reducer handles:
 * - Decedent information updates (name, sex, birth_year)
 * - Death certificate management (nested object updates)
 * - Heirs management (spouses, children, parents - add/update/remove)
 * - Property information updates
 * - Full state reset and initialization
 *
 * Action creators are provided as a convenient API for child components,
 * abstracting away the dispatch mechanism.
 */

const initialInheritance: InheritanceDto = {
  decedent: {
    name: "",
    sex: "Male",
    birth_year: 0,
    spouses: [],
    parents: [],
    children: [],
  },
  property: {
    id: "",
    doc_type: "",
    doc_id: "",
    notebook_id: "",
    address: "",
    address_old: "",
    issued_by: "",
    issued_date: "",
  },
};

// Action types for the reducer
type InheritanceAction =
  | { type: "UPDATE_DECEDENT_FIELD"; field: keyof Person; value: any }
  | { type: "UPDATE_DECEDENT_DEATH_CERTIFICATE"; certificate: DeathCertificate }
  | {
      type: "UPDATE_DECEDENT_DEATH_CERTIFICATE_FIELD";
      field: keyof DeathCertificate;
      value: any;
    }
  | {
      type: "ADD_HEIR";
      relationship: "spouses" | "children" | "parents";
      person: Person;
    }
  | {
      type: "UPDATE_HEIR";
      relationship: "spouses" | "children" | "parents";
      index: number;
      person: Person;
    }
  | {
      type: "REMOVE_HEIR";
      relationship: "spouses" | "children" | "parents";
      index: number;
    }
  | { type: "UPDATE_PROPERTY_FIELD"; field: keyof Property; value: any }
  | { type: "UPDATE_PROPERTY"; property: Property }
  | { type: "RESET_INHERITANCE" }
  | { type: "SET_INHERITANCE"; inheritance: InheritanceDto };

// Reducer function to handle all state updates
function inheritanceReducer(
  state: InheritanceDto,
  action: InheritanceAction
): InheritanceDto {
  switch (action.type) {
    case "UPDATE_DECEDENT_FIELD":
      return {
        ...state,
        decedent: {
          ...state.decedent,
          [action.field]: action.value,
        },
      };

    case "UPDATE_DECEDENT_DEATH_CERTIFICATE":
      return {
        ...state,
        decedent: {
          ...state.decedent,
          death_certificate: action.certificate,
        },
      };

    case "UPDATE_DECEDENT_DEATH_CERTIFICATE_FIELD":
      const currentCertificate = state.decedent.death_certificate || {
        id: "",
        died_date: "",
        issued_date: "",
        issued_by: "",
        issued_by_address: "",
      };
      return {
        ...state,
        decedent: {
          ...state.decedent,
          death_certificate: {
            ...currentCertificate,
            [action.field]: action.value,
          },
        },
      };

    case "ADD_HEIR":
      return {
        ...state,
        decedent: {
          ...state.decedent,
          [action.relationship]: [
            ...(state.decedent[action.relationship] || []),
            action.person,
          ],
        },
      };

    case "UPDATE_HEIR":
      const currentHeirs = state.decedent[action.relationship] || [];
      return {
        ...state,
        decedent: {
          ...state.decedent,
          [action.relationship]: currentHeirs.map((heir, index) =>
            index === action.index ? action.person : heir
          ),
        },
      };

    case "REMOVE_HEIR":
      const heirsToFilter = state.decedent[action.relationship] || [];
      return {
        ...state,
        decedent: {
          ...state.decedent,
          [action.relationship]: heirsToFilter.filter(
            (_, index) => index !== action.index
          ),
        },
      };

    case "UPDATE_PROPERTY_FIELD":
      return {
        ...state,
        property: {
          ...state.property,
          [action.field]: action.value,
        },
      };

    case "UPDATE_PROPERTY":
      return {
        ...state,
        property: action.property,
      };

    case "RESET_INHERITANCE":
      return initialInheritance;

    case "SET_INHERITANCE":
      return action.inheritance;

    default:
      return state;
  }
}

const InheritancePage = () => {
  const [inheritance, dispatch] = useReducer(
    inheritanceReducer,
    initialInheritance
  );

  // Action creators for easier usage in components
  const inheritanceActions = {
    updateDecedentField: (field: keyof Person, value: any) =>
      dispatch({ type: "UPDATE_DECEDENT_FIELD", field, value }),

    updateDeathCertificate: (certificate: DeathCertificate) =>
      dispatch({ type: "UPDATE_DECEDENT_DEATH_CERTIFICATE", certificate }),

    updateDeathCertificateField: (field: keyof DeathCertificate, value: any) =>
      dispatch({
        type: "UPDATE_DECEDENT_DEATH_CERTIFICATE_FIELD",
        field,
        value,
      }),

    addHeir: (
      relationship: "spouses" | "children" | "parents",
      person: Person
    ) => dispatch({ type: "ADD_HEIR", relationship, person }),

    updateHeir: (
      relationship: "spouses" | "children" | "parents",
      index: number,
      person: Person
    ) => dispatch({ type: "UPDATE_HEIR", relationship, index, person }),

    removeHeir: (
      relationship: "spouses" | "children" | "parents",
      index: number
    ) => dispatch({ type: "REMOVE_HEIR", relationship, index }),

    updatePropertyField: (field: keyof Property, value: any) =>
      dispatch({ type: "UPDATE_PROPERTY_FIELD", field, value }),

    updateProperty: (property: Property) =>
      dispatch({ type: "UPDATE_PROPERTY", property }),

    resetInheritance: () => dispatch({ type: "RESET_INHERITANCE" }),

    setInheritance: (inheritance: InheritanceDto) =>
      dispatch({ type: "SET_INHERITANCE", inheritance }),
  };

  console.log("inheritance", inheritance);

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
      <Box display="flex" gap="20px" flexDirection="column">
        <DecedentSection
          decedent={inheritance.decedent}
          actions={inheritanceActions}
        />
        <PropertySection
          property={inheritance.property}
          actions={inheritanceActions}
        />
      </Box>
      <Box mt="2rem" mb="1rem">
        <Button variant="contained" color="primary">
          In văn bản thừa kế
        </Button>
      </Box>
    </Box>
  );
};

export default InheritancePage;
