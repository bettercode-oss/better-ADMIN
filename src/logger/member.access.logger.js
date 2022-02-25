import axios from "axios";
import {adminConfig} from "../config/admin.config";

const API_URL = adminConfig.authentication.authAPI();

class MemberAccessLogger {

  logPageAccess(pageUrl) {
    axios.post(API_URL + `/member-access-logs`, {type: "PAGE_ACCESS", "url": pageUrl}).then();
  }

  logServerAPIAccess(apiUrl, method, parameters, payload) {
    const request = {
      type: "API_ACCESS",
      url: apiUrl,
      method: method
    };

    if(parameters) {
      request.parameters = JSON.stringify(parameters);
    }

    if(payload) {
      request.payload = JSON.stringify(payload);
    }

    axios.post(API_URL + `/member-access-logs`, request).then();
  }

}

const instance = new MemberAccessLogger()
export {instance as MemberAccessLogger}
