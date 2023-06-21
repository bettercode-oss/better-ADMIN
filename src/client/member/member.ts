import useSWR from "swr";
import qs from "qs";
import {authFetchApi} from "@/client/base";
import {ISO8601DateTime} from "@/types/common";

export interface ISearchFilter {
  name: string;
  filters: IMemberSearchFilter[];
}

export interface IMemberSearchFilter {
  text: string;
  value: string;
}

export interface IMember {
  id: number;
  signId: string;
  type: string;
  typeName: string;
  candidateId: string;
  name: string;
  roles: IMemberRoleAssigned[]
  organizations: IMemberOrganizations[]
  createdAt: ISO8601DateTime;
  lastAccessAt: ISO8601DateTime;
}

export interface IMemberRoleAssigned {
  id: number;
  name: string;
}

export interface IMemberOrganizations {
  id: number;
  name: string;
  roles: IMemberOrganizationRole[];
}

export interface IMemberOrganizationRole {
  id: number;
  name: string;
}

export interface IMemberParams {
  page: number;
  pageSize?: number;
  types?: string;
  name?: string;
  roleIds?: string;
  status?: string;
}

export interface IMemberResponse {
  totalCount: number;
  result: IMember[];
}

export interface IMemberRoleChangeFormValue {
  roleIds: number[]
}

export interface ISignUpMember {
  signId: string;
  name: string;
  password : string;
}

export const useSearchFilters = () => {
  return useSWR<ISearchFilter[]>(`members/search-filters`);
};

export const useMembersApproved = (params: IMemberParams) => {
  params.status = "approved";
  return useSWR<IMemberResponse>(`members?${qs.stringify(params)}`);
};

export const useMembersApplied = (params: IMemberParams) => {
  params.status = "applied";
  return useSWR<IMemberResponse>(`members?${qs.stringify(params)}`);
};

export const useMember = (id: number) => {
  return useSWR<IMember>(`members/${id}`);
};

export const assignRoles = (id: string, value: IMemberRoleChangeFormValue) => {
  return authFetchApi.put(`members/${id}/assign-roles`, {body: JSON.stringify(value)});
};

export const approveMember = (id: number) => {
  return authFetchApi.put(`members/${id}/approved`);
};

export const rejectMember = (id: number) => {
  return authFetchApi.put(`members/${id}/rejected`);
};


export const signUpMember = (signUpMember: ISignUpMember) => {
  return authFetchApi.post(`members`, {body: JSON.stringify(signUpMember)});
};