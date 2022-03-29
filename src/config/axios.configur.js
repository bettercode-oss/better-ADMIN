import axios from "axios";
import {adminConfig} from "./admin.config";
import {AuthService} from "../auth/auth.service";
import {EventBroadcaster, SHOW_ERROR_MESSAGE_EVENT_TOPIC} from "../event/event.broadcaster";
import {hideLoading, showLoading} from "../helper/loading.helper";
import {MemberAccessLogger} from "../logger/member.access.logger";

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
    axios.defaults["autoErrorHandling"] = true;
    // Add a response interceptor
    axios.interceptors.response.use(function (response) {
      // Any status code that lie within the range of 2xx cause this function to trigger
      return response;
    }, function (error) {
      // Any status codes that falls outside the range of 2xx cause this function to trigger
      if (error.response && error.response.status && error.config.autoErrorHandling === true) {
        if (error.response.status === 500) {
          EventBroadcaster.broadcast(SHOW_ERROR_MESSAGE_EVENT_TOPIC, adminConfig.errorMessage.serverInternalError);
        } else if(error.response.status === 400) {
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

  static configLoggingInterceptor() {
    axios.interceptors.response.use(
      function (response) {
        const config = response.config;
        AxiosConfigur.loggingWithAxiosConfig(config, response.status);

        return response;
      },
      function (error) {
        // 오류 요청을 보내기전 수행할 일
        const config = error.config;
        AxiosConfigur.loggingWithAxiosConfig(config, error.response.status);

        return Promise.reject(error);
      });
  }

  static loggingWithAxiosConfig(config, statusCode) {
    if(AxiosConfigur.isLoggingTarget(config)) {
      MemberAccessLogger.logServerAPIAccess(config.url, config.method, config.params, config.data, statusCode);
    }
  }

  static isLoggingTarget(config) {
    return (config.headers['Authorization'] && !config.url.endsWith("/auth/check") && !config.url.endsWith("/api/member-access-logs"));
  }
}
