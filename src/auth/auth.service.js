import axios from "axios";
import {config} from "../config/config";
const API_URL = config.authentication.authAPI();

class AuthService {
  static login = (id, password) => {
    // TODO 딜레이 시간 추가
    return axios
      .post(API_URL + "/auth", {
        id,
        password
      });
  }
}

export default AuthService
