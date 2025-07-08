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
import { AgreementEntity } from "../agreement-entity";
import { AgreementObject } from "../agreement-object";
import type { AgreementEntity as AgreementEntityModel } from "../../models/agreement-entity";
import type { AgreementObject as AgreementObjectModel } from "../../models/agreement-object";

interface EditorProps {
  open: boolean;
  documentName: string;
  onClose: () => void;
}

const SELLER_AGREEMENT_ENTITIES: AgreementEntityModel[] = [
  {
    gender: "Ông",
    dateOfBirth: "01/01/1990",
    name: "Nguyễn Văn A",
    address: "123 Đường ABC, Quận XYZ, TP. HCM",
    documentType: "CCCD",
    documentNumber: "1234567890",
    documentIssuedBy: "Công an quận XYZ",
    documentIssuedDate: "01/07/2025",
  },
];

const BUYER_AGREEMENT_ENTITIES: AgreementEntityModel[] = [
  {
    gender: "Ông",
    dateOfBirth: "01/01/1991",
    name: "Nguyễn Văn B",
    address: "123 Đường ABC, Quận XYZ, TP. HCM",
    documentType: "CCCD",
    documentNumber: "321321321",
    documentIssuedBy: "Công an quận ABC",
    documentIssuedDate: "11/07/2025",
  },
];

const AGREEMENT_OBJECT: AgreementObjectModel = {
  address: "123 Đường ABC, Quận XYZ, TP. HCM",
  objectNumber: "1234567890",
  objectMapNumber: "1234567890",
  certificateName: "Bằng chứng nhận",
  certificateNumber: "1234567890",
  certificateIssueNumber: "1234567890",
  certificateIssueBy: "Công an quận XYZ",
  certificateIssueDate: "01/07/2025",
  detail: {
    square: 100,
    purpose: "Sử dụng",
    validityPeriod: "10 năm",
    usageSource: "Sử dụng",
    note: "Note",
  },
  price: 1000000000,
};

export const Editor = ({ documentName, open, onClose }: EditorProps) => {
  const [sellers, setSellers] = useState<AgreementEntityModel[]>(
    SELLER_AGREEMENT_ENTITIES
  );
  const [buyers, setBuyers] = useState<AgreementEntityModel[]>(
    BUYER_AGREEMENT_ENTITIES
  );
  const [agreementObject, setAgreementObject] = useState<AgreementObjectModel>(
    AGREEMENT_OBJECT
  );
  const handleSave = () => {
    // Handle save logic here
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth>
      <DialogTitle>
        <Typography variant="h5">{documentName}</Typography>
      </DialogTitle>
      <DialogContent sx={{ paddingTop: '20px' }}>
        <Box>
          <Box className="seller-container" sx={{ mb: 4 }}>
            <AgreementEntity
              title="Bên chuyển nhượng"
              agreementEntities={sellers}
              onEntitiesChange={setSellers}
            />
          </Box>
          <Box className="buyer-container">
            <AgreementEntity
              title="Bên nhận chuyển nhượng"
              agreementEntities={buyers}
              onEntitiesChange={setBuyers}
            />
          </Box>
          <Box className="object-container" mt={4}>
            <AgreementObject />
          </Box>
        </Box>
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
