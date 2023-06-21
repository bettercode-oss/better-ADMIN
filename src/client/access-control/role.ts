import useSWR from "swr";
import qs from "qs";
import {authFetchApi} from "@/client/base";

export interface IRole {
  id: number;
  name: string;
  type: string;
  typeName: string;
  description: string;
  permissions?: IAllowedPermission[];
}

export interface IAllowedPermission {
  id: number;
  name: string;
}

export interface IRoleFormValue extends Omit<IRole, "id" | "typeName" | "allowedPermissions"> {
  allowedPermissionIds?: number[]
}

export interface IRoleParams {
  page: number;
  pageSize?: number;
  name?: string | null;
}

export interface IRoleResponse {
  totalCount: number;
  result: IRole[];
}

export const useRoles = (params: IRoleParams) => {
  return useSWR<IRoleResponse>(`access-control/roles?${qs.stringify(params)}`);
};

export const useRole = (id: number) => {
  return useSWR<IRole>(`access-control/roles/${id}`);
};

export const createRole = (value: IRoleFormValue) => {
  return authFetchApi.post(`access-control/roles`, {body: JSON.stringify(value)});
};

export const updateRole = (id: string, value: IRoleFormValue) => {
  return authFetchApi.put(`access-control/roles/${id}`, {body: JSON.stringify(value)});
};

export const deleteRole = (id: number) => {
  return authFetchApi.delete(`access-control/roles/${id}`);
};