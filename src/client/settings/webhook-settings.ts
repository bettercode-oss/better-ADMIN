import useSWR from "swr";
import qs from "qs";
import {authFetchApi} from "@/client/base";

export interface IWebHookParams {
  page: number;
  pageSize: number;
}

export interface IWebHook {
  id: number;
  name: string;
  description: string;
  webHookCallSpec: IWebHookCallSpec;
}

export interface IWebHookCallSpec {
  httpRequestMethod: string;
  url: string;
  accessToken: string;
  sampleRequest: string;
}

export interface IWebHookResponse {
  totalCount: number;
  result: IWebHook[];
}

export interface IWebHookFormValue extends Omit<IWebHook, "id" | "webHookCallSpec"> {
}

export const useWebHooks = (params: IWebHookParams) => {
  return useSWR<IWebHookResponse>(`web-hooks?${qs.stringify(params)}`);
};

export const useWebHook = (id: number) => {
  return useSWR<IWebHook>(`web-hooks/${id}`);
};

export const createWebHook = (value: IWebHookFormValue) => {
  return authFetchApi.post(`web-hooks`, {body: JSON.stringify(value)});
};

export const updateWebHook = (id: number, value: IWebHookFormValue) => {
  return authFetchApi.put(`web-hooks/${id}`, {body: JSON.stringify(value)});
};

export const deleteWebHook = (id: number) => {
  return authFetchApi.delete(`web-hooks/${id}`);
};