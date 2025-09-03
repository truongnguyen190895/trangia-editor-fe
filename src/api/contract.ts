import { api } from ".";

export interface SubmitContractPayload {
  id: string;
  name: string;
  customer: string;
  broker: string;
  value: number;
  copiesValue: number;
  notes: string;
  unit: string;
  relationship: string;
  nationalId: string;
}

export interface Contract {
  id: string;
  name: string;
  customer: string;
  broker: string;
  value: number;
  copies_value: number;
  notes: string;
  created_by: string | null;
  national_id: string | null;
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
  console.log("submitContract", payload);
  return api.put("/files/" + payload.id, payload).then((resp) => resp.data);
};

export const listContracts = (): Promise<ContractResponse> => {
  return api.get("/files").then((resp) => resp.data);
};

export const exportExcel = () => {
  return api.get("/files", {
    headers: {
      accept:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
    responseType: "blob",
  });
};

export const getTheNextAvailableId = () : Promise<string> => {
  return api.get("/files/next-id").then((resp) => resp.data);
};
