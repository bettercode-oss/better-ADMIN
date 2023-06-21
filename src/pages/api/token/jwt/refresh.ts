import type {NextApiRequest, NextApiResponse} from "next";
import {getToken} from "next-auth/jwt"
import {HTTPError} from "ky/distribution/errors/HTTPError";
import AuthService from "@/pages/api/auth/auth.service";

interface AccessTokenRefreshed {
  accessToken: string;
  expiresAt: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const token = await getToken({ req });
    console.log("Token...", token);

    const newToken: AccessTokenRefreshed = await AuthService.refreshAccessToken(token?.refreshToken).json<AccessTokenRefreshed>();
    console.log("accessToken...", newToken);

    res.status(200).json({
      token: newToken?.accessToken
    });
  } catch(error) {
    console.log("Access Token Refresh error", error);
    const err = error as HTTPError;
    if(err.response?.status === 401) {
      res.status(401);
    }

    res.status(500);
  }
}
