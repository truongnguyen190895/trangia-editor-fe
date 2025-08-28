import { api } from ".";

export interface SubmitContractPayload {
  name: string;
  customer: string;
  broker: string;
  value: number;
  copiesValue: number;
  notes?: string;
}

export interface Contract {
  id: string;
  name: string;
  customer: string;
  broker: string;
  value: number;
  copies_value: number;
  notes: string;
  audit: {
    created_at: string;
    updated_at: string;
    created_by_username: string;
    updated_by_username: string;
  };
  number: number;
  date: string;
}

export interface ContractResponse {
  content: Contract[];
  page: {
    number: number;
    size: number;
    total_elements: number;
    total_pages: number;
  };
}

export const submitContract = (payload: SubmitContractPayload) => {
  return api.post("/files", payload).then((resp) => resp.data);
};

export const listContracts = (): Promise<ContractResponse> => {
  return api.get("/files").then((resp) => resp.data);
};
