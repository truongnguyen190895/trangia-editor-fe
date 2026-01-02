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

/**
 * TypeScript type definitions for OCR Land Certificate API
 *
 * Endpoint: POST /ocr/land-certificate
 *
 * Extracts Land Certificate ID from an image using OCR
 */
export interface LandCertificateResponse {
  id: string; // Format: "[A-Z]{2} [digits]" (e.g., "AB 12345")
}

export interface ErrorResponse {
  timestamp: string; // ISO 8601 format
  status: number;
  error: string;
  message: string;
}

/**
 * Extracts Land Certificate ID from an image file using OCR
 *
 * @param file - Image file containing the Land Certificate document
 * @returns Promise resolving to LandCertificateResponse with extracted ID
 * @throws Error if the land certificate ID cannot be found or if the request fails
 *
 * @example
 * ```typescript
 * const fileInput = document.querySelector('input[type="file"]');
 * const file = fileInput.files[0];
 * const result = await ocrLandCertificate(file);
 * console.log(result.id); // "AB 12345"
 * ```
 */
export const ocrLandCertificate = async (
  file: File
): Promise<LandCertificateResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post<LandCertificateResponse>(
    "/ocr/land-certificate",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};
