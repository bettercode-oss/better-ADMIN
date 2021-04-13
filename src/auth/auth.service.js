import axios from "axios";
import {adminConfig} from "../config/admin.config";

const API_URL = adminConfig.authentication.authAPI();

class AuthService {
  static login = (id, password) => {
    // TODO 딜레이 시간 추가
    return axios.post(API_URL + "/auth", {id, password})
      .then((response) => {
        const {accessToken} = response.data;
        axios.defaults.headers['Authorization'] = `Bearer ${accessToken}`;
      }).catch(error => {
        throw error
      });
  }

  static logout = () => {
    return axios.post(API_URL + "/auth/logout").then(()=> {
      delete axios.defaults.headers['Authorization'];
    });
  }

  static checkAuth = () => {
    // TODO 오류를 대비해 Retry 추가해야
    return axios.post(API_URL + "/auth/check");
  }

  static silentRefresh = () => {
    delete axios.defaults.headers['Authorization'];
    return axios.post(API_URL + "/auth/token/refresh")
      .then((response) => {
        const {accessToken} = response.data;
        axios.defaults.headers['Authorization'] = `Bearer ${accessToken}`;
      }).catch(error => {
        throw error
      });
  }
}

export default AuthService
