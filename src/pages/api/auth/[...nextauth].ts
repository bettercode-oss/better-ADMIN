import NextAuth from "next-auth";
import CredentialsProvider, {CredentialsConfig} from "next-auth/providers/credentials";
import {JWT} from "next-auth/jwt";
import {HTTPError} from "ky/distribution/errors/HTTPError";
import AuthService from "@/pages/api/auth/auth.service";

interface LoginResult {
  accessToken: string;
  expiresAt: number;
  refreshToken: string;
  refreshTokenExpiresIn: number
}

const credentialsProviderOption: CredentialsConfig<{}> = {
  type: "credentials",
  id: "login-credentials",
  name: "login-credentials",
  credentials: {
    id: { label: "ID", type: "text" },
    password: { label: "Password", type: "password" },
  },
  async authorize(credentials: Record<string, string> | undefined) {
    if (credentials) {
      try {
        const result: LoginResult = await AuthService.login(credentials.id, credentials.password).json<LoginResult>();
        return {
          id: credentials.id,
          accessToken: result.accessToken,
          expiresAt: result.expiresAt,
          refreshToken: result.refreshToken,
          refreshTokenExpiresIn: result.refreshTokenExpiresIn,
        };
      } catch (error) {
        console.log("NextAuth authorize error", error);
        const err = error as HTTPError;
        if(err.response?.status === 400) {
          throw new Error('CredentialsSignInBadRequest');
        }

        if(err.response?.status === 406) {
          throw new Error('CredentialsSignInUnapproved');
        }
        throw new Error('CredentialsSignInInternalError');
      }
    } else {
      return null;
    }
  },
};

const doorayCredentialsProviderOption: CredentialsConfig<{}> = {
  type: "credentials",
  id: "login-with-dooray-credentials",
  name: "login-with-dooray-credentials",
  credentials: {
    id: { label: "ID", type: "text" },
    password: { label: "Password", type: "password" },
  },
  async authorize(credentials: Record<string, string> | undefined) {
    if (credentials) {
      try {
        const result: LoginResult = await AuthService.loginWithDoorayAccount(credentials.id, credentials.password).json<LoginResult>();
        return {
          id: credentials.id,
          accessToken: result.accessToken,
          expiresAt: result.expiresAt,
          refreshToken: result.refreshToken,
          refreshTokenExpiresIn: result.refreshTokenExpiresIn,
        };
      } catch (error) {
        console.log("NextAuth authorize error", error);
        const err = error as HTTPError;
        if(err.response?.status === 400) {
          throw new Error('CredentialsSignInBadRequest');
        }

        if(err.response?.status === 406) {
          throw new Error('CredentialsSignInUnapproved');
        }
        throw new Error('CredentialsSignInInternalError');
      }
    } else {
      return null;
    }
  },
};

interface AccessTokenRefreshed {
  accessToken: string;
  expiresAt: number;
}

export interface MyInformation {
  id: number;
  type: string;
  typeName: string;
  name: string;
  roles: string[];
  permissions: string[];
  picture: string;
}

export default NextAuth({
  pages: {
    signIn: "/login",
    verifyRequest: "/login?verify=1",
    error: "/login",
  },
  providers: [
    CredentialsProvider(credentialsProviderOption),
    CredentialsProvider(doorayCredentialsProviderOption)
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {...user}
      } else if(Date.now() < (token as JWT).expiresAt * 1000) {
        return token;
      } else {
        // refresh 토큰으로 엑세스 토큰을 재발급
        // 재발급된 토큰으로 재설정
        try {
          const newToken: AccessTokenRefreshed = await AuthService.refreshAccessToken(token?.refreshToken).json<AccessTokenRefreshed>();
          return {
            ...token,
            accessToken: newToken.accessToken,
            expiresAt: newToken.expiresAt,
          }
        } catch (error) {
          console.error("Error refreshing access token", error)
          throw new Error('LoginExpired');
        }
      }
    },
    async session({ session, token }) {
      const myInformation = await AuthService.getMyInformation(token.accessToken).json<MyInformation>();
      session = {
        ...session,
        accessToken: token.accessToken,
        user: {
          ...myInformation
        }
      };

      if(token.error) {
        session.error = token.error;
      }

      return session;
    },
  },
});
