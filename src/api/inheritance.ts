import { api } from "./index";

/**
 * TypeScript type definitions for Inheritance Document API payload
 *
 * Endpoint: POST /templates/thua-ke/van-ban-thua-ke
 *
 * Note: All properties use snake_case naming convention
 */

export type Sex = "Male" | "Female";

export interface DeathCertificate {
  id: string;
  died_date: string; // ISO format: YYYY-MM-DD
  issued_by: string;
  issued_date: string; // ISO format: YYYY-MM-DD
  issued_by_address: string;
  issued_by_address_old?: string | null;
}

export interface RefusalDocument {
  id: string;
  notarized_by: string;
  notarized_date: string; // ISO format: YYYY-MM-DD
}

export interface Person {
  name: string;
  sex: Sex;
  birth_year: number;
  parents?: Person[] | null;
  adopted_parents?: Person[] | null;
  spouses?: Person[] | null;
  children?: Person[] | null;
  adopted_children?: Person[] | null;
  death_certificate?: DeathCertificate | null;
  refusal_document?: RefusalDocument | null;
}

export interface Property {
  id: string;
  doc_type: string;
  doc_id: string;
  notebook_id: string;
  address: string;
  address_old?: string | null;
  issued_by: string;
  issued_date: string; // ISO format: YYYY-MM-DD
}

export interface InheritanceDto {
  decedent: Person;
  property: Property;
}

export const createInheritance = (payload: InheritanceDto) => {
  return api.post("/templates/thua-ke/van-ban-thua-ke", payload, {
    responseType: "blob",
  });
};
