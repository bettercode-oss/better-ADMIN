import ky from "ky-universal";
import {getSession, signOut} from "next-auth/react";
import {KyHeadersInit} from "ky/distribution/types/options";

const memoryTokenStore: Map<string, string> = new Map();

interface AccessToken {
  token: string;
}

const fetchApiWithAuthorizationHeader = (prefixUrl?: string, headers?: KyHeadersInit) => ky.extend({
  prefixUrl: prefixUrl,
  headers: headers,
  hooks: {
    beforeRequest: [
      async request => {
        try {
          if (memoryTokenStore.get("accessToken")) {
            request.headers.set('Authorization', `Bearer ${memoryTokenStore.get("accessToken")}`);
          } else {
            const session = await getSession()
            console.log("fetcher session", session);
            if (session?.error === "RefreshAccessTokenError") {
              signOut();
            }
            if (session?.accessToken) {
              memoryTokenStore.set("accessToken", session.accessToken);
              request.headers.set('Authorization', `Bearer ${session.accessToken}`);
            } else {
              request.headers.delete('Authorization');
            }
          }
        } catch (e) {
          console.log("fetcher beforeRequest error", e);
          signOut();
        }
      }
    ],
    afterResponse: [
      async (request, options, response) => {
        if (response.status === 401) {
          try {
            const accessToken = await ky(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/token/jwt/refresh`).json<AccessToken>();
            memoryTokenStore.set("accessToken", accessToken.token);
            request.headers.set('Authorization', `Bearer ${accessToken.token}`);
            return ky(request);
          } catch (error) {
            // TODO 사용자에게 에러 알림
            signOut();
          }
        }
      }
    ]
  }
});

export const fetcher = (input: URL | RequestInfo, init?: RequestInit | undefined) => {
  const api = fetchApiWithAuthorizationHeader();
  return api(`${process.env.NEXT_PUBLIC_BETTER_ADMIN_API_ENDPOINT}/${input}`, init).then((res) => res.json());
}

export const fetchApi = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_BETTER_ADMIN_API_ENDPOINT,
  headers: {
    "Content-Type": "application/json",
  }
});

export const fetchApiWithHeaders = (headers: Record<string, string | undefined>) => ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_BETTER_ADMIN_API_ENDPOINT,
  headers: headers
});


export const authFetchApi = fetchApiWithAuthorizationHeader(String(process.env.NEXT_PUBLIC_BETTER_ADMIN_API_ENDPOINT), {
  "Content-Type": "application/json"
});