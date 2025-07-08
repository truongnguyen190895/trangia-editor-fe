export const GENDER = {
  MALE: "Ông",
  FEMALE: "Bà",
} as const;

export type Gender = (typeof GENDER)[keyof typeof GENDER];

export interface AgreementEntity {
  gender: Gender;
  dateOfBirth: string;
  name: string;
  address: string;
  documentType: string;
  documentNumber: string;
  documentIssuedBy: string;
  documentIssuedDate: string;
}