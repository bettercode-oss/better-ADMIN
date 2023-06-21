import {fetchApi, fetchApiWithHeaders} from "@/client/base";

class AuthService {
  static login(id: string, password: string) {
    return fetchApi.post(`auth`, { body: JSON.stringify({id: id, password: password}) });
  }

  static loginWithDoorayAccount(id: string, password: string) {
    return fetchApi.post(`auth/dooray`, { body: JSON.stringify({id: id, password: password}) });
  }

  static refreshAccessToken(refreshToken: string | undefined) {
    return fetchApi.post(`auth/token/refresh`, { body: JSON.stringify({refreshToken: refreshToken}) });
  }

  static getMyInformation(accessToken: string) {
    return fetchApiWithHeaders({
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
    }).get(`members/my`);
  }
}

export default AuthService;