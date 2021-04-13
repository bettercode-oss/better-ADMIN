import axios from "axios";
import {adminConfig} from "./admin.config";
import AuthService from "../auth/auth.service";

export const initAxios = () => {
  axios.defaults.withCredentials = true;

  // Add a response interceptor
  axios.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    return response;
  }, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    if (error.response.status === 401) {
      if (error.response.data && error.response.data.message
        && error.response.data.message === "access token expired") {
        // access token expired
        // Access Token 이 만료 되었기 때문에 Http Only 쿠키에 담긴 Refresh 토큰을 사용하여 Access Token을 재 발급
        AuthService.silentRefresh().then(() => {
          // 기존 요청을 다시 요청
          const config = error.config;
          config.headers['Authorization'] = axios.defaults.headers['Authorization'];
          return new Promise((resolve, reject) => {
            axios.request(config).then(response => {
              resolve(response);
            }).catch((error) => {
              reject(error);
            });
          });
        }).catch((err) => {
          console.log("silent refresh error ", err);
        });
      } else {
        // invalid access token
        delete axios.defaults.headers['Authorization'];
        window.location.hash = adminConfig.authentication.loginUrl;
      }
    }
    return Promise.reject(error);
  });
}
