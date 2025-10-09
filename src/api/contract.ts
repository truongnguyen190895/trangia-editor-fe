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
  filedDate: string;
  deliveredBy: string;
  inspectedBy: string;
  externalNotes: string;
  notarizedBy: string;
  newId?: string;
}

export interface Contract {
  id: string;
  name: string;
  customer: string;
  broker: string;
  value: number;
  unit: string;
  copies_value: number;
  notes: string;
  created_by: string | null;
  national_id: string | null;
  filed_date: string;
  audit: {
    created_at: string;
    updated_at: string;
    created_by_username: string;
    updated_by_username: string;
  };
  number: number;
  date: string;
  delivered_by: string;
  inspected_by: string;
  external_notes: string;
  notarized_by: string;
}

export interface ContractResponse {
  content: Contract[];
  page: {
    number: number;
    size: number;
    total_elements: number;
    total_pages: number;
  };
  total_copies_value: number;
  total_value: number;
}

export const submitContract = (payload: SubmitContractPayload) => {
  return api.put("/files/" + payload.id, payload).then((resp) => resp.data);
};

export const updateContract = (payload: SubmitContractPayload) => {
  return api
    .patch("/files/" + payload.id, { ...payload, id: payload.newId })
    .then((resp) => resp.data);
};

interface ListContractsParams {
  customer?: string;
  broker?: string;
  id?: string;
  size?: number;
  page?: number;
  type?: string;
  dateBegin?: string;
  dateEnd?: string;
  createdBy?: string;
  sort?: string;
  unit?: string;
}

export const getContractById = (id: string): Promise<Contract> => {
  return api.get("/files/" + id).then((resp) => resp.data);
};

export const deleteContract = (id: string) => {
  return api.delete("/files/" + id).then((resp) => resp.data);
};

export const listContracts = (
  params: ListContractsParams
): Promise<ContractResponse> => {
  return api.get("/files", { params }).then((resp) => resp.data);
};

export const exportExcel = (params: ListContractsParams) => {
  return api.get("/files", {
    params,
    headers: {
      accept:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
    responseType: "blob",
  });
};

export const getTheNextAvailableId = (type: string): Promise<string> => {
  return api.get("/files/next-id?type=" + type).then((resp) => resp.data);
};
