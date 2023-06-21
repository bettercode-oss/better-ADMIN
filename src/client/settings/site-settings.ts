import useSWR from "swr";

export interface ISiteSettings {
  doorayLoginUsed: boolean;
  googleWorkspaceLoginUsed: boolean;
  googleWorkspaceOAuthUri: string;
}

export const useSiteSettings = () => {
  return useSWR<ISiteSettings>(`site/settings`);
};