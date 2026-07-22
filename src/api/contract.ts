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
  deliveredBy?: string;
  inspectedBy?: string;
  id?: string;
  size?: number;
  page?: number;
  type?: string;
  dateBegin?: string;
  dateEnd?: string;
  createdBy?: string;
  sort?: string;
  unit?: string;
  [key: string]: string | number | undefined;
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

interface ListWorkHistoryParams {
  size?: number;
  page?: number;
  /** ISO date `YYYY-MM-DD`, filters by contract creation date (inclusive). */
  dateBegin?: string;
  dateEnd?: string;
  /** Case-insensitive partial match on Bên A or Bên B (first party name). */
  partyName?: string;
}
export const listWorkHistory = (
  params: ListWorkHistoryParams
): Promise<WorkHistoryPageResponse> => {
  return api
    .get("/contracts?sort=audit.createdAt,desc", { params })
    .then((resp) => resp.data);
};

export interface WorkHistoryItem {
  id: string;
  template: string;
  audit: {
    created_at: string;
    updated_at: string;
    created_by_username: string;
    updated_by_username: string;
  };
  content: any;
}

export interface WorkHistoryPageResponse {
  content: WorkHistoryItem[];
  page: {
    number: number;
    size: number;
    total_elements: number;
    total_pages: number;
  };
}
/**
 * Chuẩn hoá key legacy trong original_payload của các contract lưu TRƯỚC các đợt
 * rename placeholder (docs/placeholder-normalization-plan.md bên BE): đổi tên key
 * đệ quy để editor (đã dùng key mới) prefill được draft cũ. Key mới nếu đã tồn
 * tại thì giữ nguyên.
 * - 2026-07 GĐ2: *_gcn -> *_giấy_chứng_nhận
 * - 2026-07 GĐ3: {hình_thức,mục_đích}_sở_hữu_đất -> *_sử_dụng_đất
 */
const LEGACY_KEY_SUFFIX = /_gcn$/;
const LEGACY_KEY_RENAMES: Record<string, string> = {
  hình_thức_sở_hữu_đất: "hình_thức_sử_dụng_đất",
  mục_đích_sở_hữu_đất: "mục_đích_sử_dụng_đất",
};
const normalizeLegacyKeys = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map(normalizeLegacyKeys);
  }
  if (value !== null && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, v] of Object.entries(value as Record<string, unknown>)) {
      const renamed = LEGACY_KEY_RENAMES[key] ?? key;
      const newKey = LEGACY_KEY_SUFFIX.test(renamed)
        ? renamed.replace(LEGACY_KEY_SUFFIX, "_giấy_chứng_nhận")
        : renamed;
      if (!(newKey in out)) {
        out[newKey] = normalizeLegacyKeys(v);
      }
    }
    return out;
  }
  return value;
};

export const getWorkHistoryById = (
  id: string
): Promise<WorkHistoryItem> => {
  return api.get("/contracts/" + id).then((resp) => {
    const data = resp.data as WorkHistoryItem;
    if (data?.content?.original_payload) {
      data.content.original_payload = normalizeLegacyKeys(
        data.content.original_payload
      );
    }
    return data;
  });
};
