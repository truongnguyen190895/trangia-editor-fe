export interface AgreementObject {
  objectNumber: string;
  objectMapNumber: string;
  address: string;
  certificateName: string;
  certificateNumber: string;
  certificateIssueNumber: string;
  certificateIssueBy: string;
  certificateIssueDate: string;
  detail: {
    square: number;
    purpose: string;
    validityPeriod: string;
    usageSource: string;
    note: string;
  };
  price: number;
}