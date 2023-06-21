import useSWR from "swr";
import {authFetchApi} from "@/client/base";

export interface IOrganization {
  id: number;
  name: string;
  roles?: IOrganizationRole[];
  members?: IOrganizationMember[];
  subOrganizations?: IOrganization;
}

interface IOrganizationRole {
  id: number;
  name: string;
}

interface IOrganizationMember {
  id: number;
  name: string;
}

export interface IOrganizationChangePosition {
  parentOrganizationId?: number;
}

export interface IOrganizationFormValue {
  name: string;
  parentOrganizationId?: number;
}

export interface IOrganizationRoleChangeFormValue {
  roleIds: number[]
}

export interface IOrganizationMemberChangeFormValue {
  memberIds: number[]
}

export const useOrganizations = () => {
  return useSWR<IOrganization[]>(`organizations`);
};

export const useOrganization = (id: number) => {
  return useSWR<IOrganization>(`organizations/${id}`);
};

export const changePosition = (organizationId: number, value: IOrganizationChangePosition) => {
  return authFetchApi.put(`organizations/${organizationId}/change-position`, {body: JSON.stringify(value)});
};

export const createOrganization = (value: IOrganizationFormValue) => {
  return authFetchApi.post(`organizations`, {body: JSON.stringify(value)});
};

export const changeName = (organizationId: number, value: IOrganizationFormValue) => {
  return authFetchApi.put(`organizations/${organizationId}/name`, {body: JSON.stringify(value)});
};

export const assignRoles = (organizationId: number, value: IOrganizationRoleChangeFormValue) => {
  return authFetchApi.put(`organizations/${organizationId}/assign-roles`, {body: JSON.stringify(value)});
};

export const assignMembers = (organizationId: number, value: IOrganizationMemberChangeFormValue) => {
  return authFetchApi.put(`organizations/${organizationId}/assign-members`, {body: JSON.stringify(value)});
};

export const deleteDepartment = (organizationId: number) => {
  return authFetchApi.delete(`organizations/${organizationId}`);
};