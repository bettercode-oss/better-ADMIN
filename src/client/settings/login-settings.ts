import useSWR from "swr";
import {authFetchApi} from "@/client/base";

export interface IDooraySetting {
  authorizationToken: string;
  domain: string;
  used: boolean;
}

export interface IGoogleWorkspaceSetting {
  used: boolean;
  domain: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export const useDooraySetting = () => {
  return useSWR<IDooraySetting>(`site/settings/dooray-login`);
};

export const updateDooraySetting = (value: IDooraySetting) => {
  return authFetchApi.put(`site/settings/dooray-login`, {body: JSON.stringify(value)});
};

export const useGoogleWorkspaceSetting = () => {
  return useSWR<IGoogleWorkspaceSetting>(`site/settings/google-workspace-login`);
};

export const updateGoogleWorkspaceSetting = (value: IGoogleWorkspaceSetting) => {
  return authFetchApi.put(`site/settings/google-workspace-login`, {body: JSON.stringify(value)});
};