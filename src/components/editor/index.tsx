import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { useState } from "react";

interface EditorProps {
  open: boolean;
  documentName: string;
  initialContent?: string;
  onClose: () => void;
}

export const Editor = ({ documentName, initialContent = "", open, onClose }: EditorProps) => {
  const [content, setContent] = useState(initialContent);


  const handleSave = () => {
    // Handle save logic here
    console.log("Saving content:", content);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h5">{documentName}</Typography>
      </DialogTitle>

      <DialogContent>
        <Box
          component="textarea"
          sx={{
            width: "100%",
            minHeight: "400px",
            padding: 2,
            borderRadius: 1,
            border: "1px solid #ccc",
            fontFamily: "inherit",
            fontSize: "16px",
            marginTop: 2,
            "&:focus": {
              outline: "none",
              border: "2px solid #1976d2",
            },
          }}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};
