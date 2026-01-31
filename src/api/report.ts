import { api } from ".";

interface ReportCounts {
  contract: number;
  signature: number;
  invoice: number;
  total: number;
}
export interface UserReport {
  username: string;
  full_name: string;
  branch_name: string;
  report: ReportCounts;
}

interface GetUserReportParams {
  startDate: string;
  endDate: string;
}

export const getUserReport = async (
  params: GetUserReportParams
): Promise<UserReport[]> => {
  const response = await api.get("/reports/contracts/count", { params });
  return response.data;
};

export interface BranchManagerReport {
  username: string;
  full_name: string;
  branch_name: string;
  delivered_by_count: number;
  inspected_by_count: number;
  total: number;
}

export const getBranchManagerReport = async (
  params: GetUserReportParams
): Promise<BranchManagerReport[]> => {
  const response = await api.get("/reports/branch-reports", { params });
  return response.data;
};
