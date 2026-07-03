import { Box, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";

export interface SectionNavItem {
  id: string;
  label: string;
  complete: boolean;
}

interface SectionNavProps {
  sections: SectionNavItem[];
}

/**
 * Sticky rail listing the form's sections with completion state.
 * Clicking an item scrolls its FormSection (matched by id) into view.
 * Hidden on mobile — sections stack naturally there.
 */
export const SectionNav = ({ sections }: SectionNavProps) => {
  const handleClick = (id: string) => {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <Box
      component="nav"
      sx={{
        display: { xs: "none", lg: "block" },
        position: "sticky",
        top: 16,
        alignSelf: "flex-start",
        width: 210,
        flexShrink: 0,
      }}
    >
      <Typography variant="overline" sx={{ mb: 1, px: 1.5 }}>
        Các phần của hợp đồng
      </Typography>
      {sections.map((section, index) => (
        <Box
          key={section.id}
          onClick={() => handleClick(section.id)}
          display="flex"
          alignItems="center"
          gap={1}
          sx={{
            px: 1.5,
            py: 0.9,
            borderRadius: 1.5,
            cursor: "pointer",
            color: section.complete ? "text.primary" : "text.secondary",
            "&:hover": { backgroundColor: "action.hover" },
          }}
        >
          {section.complete ? (
            <CheckCircleIcon sx={{ fontSize: "1rem", color: "success.main" }} />
          ) : (
            <RadioButtonUncheckedIcon
              sx={{ fontSize: "1rem", color: "text.secondary" }}
            />
          )}
          <Typography sx={{ fontSize: "0.85rem", fontWeight: 500 }}>
            {index + 1}. {section.label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};
