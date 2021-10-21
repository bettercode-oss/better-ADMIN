import axios from "axios";
import {adminConfig} from "./admin.config";
import {AuthService} from "../auth/auth.service";
import {EventBroadcaster, SHOW_ERROR_MESSAGE_EVENT_TOPIC} from "../event/event.broadcaster";
import {hideLoading, showLoading} from "../helper/loading.helper";

const DEFAULT_PERMISSION_DENIED_ERROR_MESSAGE = "권한이 없습니다. 관리자에게 문의하세요.";

export class AxiosConfigur {
  static configAuthInterceptor() {
    axios.defaults.withCredentials = true;

    axios.interceptors.request.use(
      function (config) {
        if (config.url.startsWith(adminConfig.authentication.authAPI())) {
          config.withCredentials = true;
        } else {
          config.withCredentials = false;
        }

        return config;
      },
      function (error) {
        // 오류 요청을 보내기전 수행할 일
        return Promise.reject(error);
      });

    // Add a response interceptor
    axios.interceptors.response.use(function (response) {
      // Any status code that lie within the range of 2xx cause this function to trigger
      return response;
    }, function (error) {
      // Any status codes that falls outside the range of 2xx cause this function to trigger
      if (error.response && error.response.status === 401) {
        if (error.response.data && error.response.data.message
          && error.response.data.message === "access token expired") {
          // access token expired
          // Access Token 이 만료 되었기 때문에 Http Only 쿠키에 담긴 Refresh 토큰을 사용하여 Access Token을 재 발급
          return new Promise((resolve, reject) => {
            AuthService.silentRefresh().then(() => {
              // 기존 요청을 다시 요청
              const config = error.config;
              config.headers['Authorization'] = axios.defaults.headers['Authorization'];
              axios.request(config).then(response => {
                resolve(response);
              });
            }).catch((err) => {
              console.log("silent refresh error ", err);
              reject(error);
            });
          });
        } else {
          // invalid access token
          delete axios.defaults.headers['Authorization'];
          AuthService.logout().then().catch((error) => {
            console.log("logout error", error);
          }).finally(() => {
            window.location.hash = adminConfig.authentication.loginUrl;
          });
        }
      } else if (error.response && error.response.status === 403) {
        EventBroadcaster.broadcast(SHOW_ERROR_MESSAGE_EVENT_TOPIC,
          adminConfig.authentication.errorMessagePermissionDenied
            ? adminConfig.authentication.errorMessagePermissionDenied
            : DEFAULT_PERMISSION_DENIED_ERROR_MESSAGE);
      }
      return Promise.reject(error);
    });

  }

  static configServerErrorInterceptor() {
    // Add a response interceptor
    axios.interceptors.response.use(function (response) {
      // Any status code that lie within the range of 2xx cause this function to trigger
      return response;
    }, function (error) {
      // Any status codes that falls outside the range of 2xx cause this function to trigger
      if (error.response && error.response.status) {
        if (error.response.status === 500) {
          EventBroadcaster.broadcast(SHOW_ERROR_MESSAGE_EVENT_TOPIC, adminConfig.errorMessage.serverInternalError);
        } else if(error.response.status === 400) {
          if(adminConfig.serverErrorHandlingExcludeUrl && adminConfig.serverErrorHandlingExcludeUrl.badRequest) {
            const excludeUrls = adminConfig.serverErrorHandlingExcludeUrl.badRequest;
            const find = excludeUrls.filter((url) => error.response.config.url.endsWith(url));
            if(find.length > 0) {
              return Promise.reject(error);
            }
          }
          EventBroadcaster.broadcast(SHOW_ERROR_MESSAGE_EVENT_TOPIC, adminConfig.errorMessage.badRequestError);
        } else if(error.response.status === 404) {
          EventBroadcaster.broadcast(SHOW_ERROR_MESSAGE_EVENT_TOPIC, adminConfig.errorMessage.pageNotFoundError);
        }
      }
      return Promise.reject(error);
    });
  }

  static configServerNetworkErrorInterceptor() {
    axios.interceptors.response.use(function (response) {
      return response;
    }, function (error) {
      if (!error.response) {
        EventBroadcaster.broadcast(SHOW_ERROR_MESSAGE_EVENT_TOPIC, adminConfig.errorMessage.networkError);
      }
      return Promise.reject(error);
    });
  }

  static configLoadingInterceptor() {
    axios.interceptors.request.use(
      function (config) {
        if (config.loading) {
          showLoading();
        }
        return config;
      },
      function (error) {
        // 오류 요청을 보내기전 수행할 일
        return Promise.reject(error);
      });

    axios.interceptors.response.use(
      function (response) {
        // 응답 데이터를 가공
        if (response.config.loading) {
          hideLoading();
        }

        return response;
      },
      function (error) {
        // 오류 응답을 처리
        if (error.config.loading) {
          hideLoading();
        }
        return Promise.reject(error);
      });
  }
}
