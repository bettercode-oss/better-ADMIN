/* @see https://authjs.dev/getting-started/typescript#extend-default-interface-properties */
import {DefaultSession, DefaultUser} from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken: string;
    user : {
      id: number;
      type: string;
      typeName: string;
      name: string;
      roles: string[];
      permissions: string[];
      picture: string;
    }
    error?: string;
  }
}

declare module "next-auth" {
  interface User {
    accessToken: string;
    expiresAt: number;
    refreshToken: string;
    refreshTokenExpiresIn: number
        & DefaultSession["user"];
  }
}

declare module "next-auth/jwt/types" {
  interface JWT {
    accessToken: string;
    expiresAt: number;
    refreshToken: string;
    refreshTokenExpiresIn: number;
    error?: string;
  }
}


