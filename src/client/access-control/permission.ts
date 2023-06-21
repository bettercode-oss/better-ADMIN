import useSWR from "swr";
import qs from "qs";
import {authFetchApi} from "@/client/base";

export interface IPermission {
  id: number;
  name: string;
  type: string;
  typeName: string;
  description: string;
}

export interface IPermissionFormValue extends Omit<IPermission, "id"> {
}

export interface IPermissionParams {
  page: number;
  pageSize?: number;
  name?: string | null;
}

export interface IPermissionResponse {
  totalCount: number;
  result: IPermission[];
}

export const usePermissions = (params: IPermissionParams) => {
  return useSWR<IPermissionResponse>(`access-control/permissions?${qs.stringify(params)}`);
};

export const usePermission = (id: number) => {
  return useSWR<IPermission>(`access-control/permissions/${id}`);
};

export const createPermission = (value: IPermissionFormValue) => {
  return authFetchApi.post(`access-control/permissions`, {body: JSON.stringify(value)});
};

export const updatePermission = (id: string, value: IPermissionFormValue) => {
  return authFetchApi.put(`access-control/permissions/${id}`, {body: JSON.stringify(value)});
};

export const deletePermission = (id: number) => {
  return authFetchApi.delete(`access-control/permissions/${id}`);
};
