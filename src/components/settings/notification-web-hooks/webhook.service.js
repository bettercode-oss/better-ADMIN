import axios from "axios";
import {adminConfig} from "../../../config/admin.config";

const API_URL = adminConfig.authentication.authAPI();

class WebHookService {
  getWebHooks(params) {
    return axios.get(`${API_URL}/web-hooks`, { params: params });
  }

  getWebHook(webHookId) {
    return axios.get(`${API_URL}/web-hooks/${webHookId}`);
  }

  createWebHook(webhook) {
    return axios.post(`${API_URL}/web-hooks`, webhook)
  }

  deleteWebHook(webHookId) {
    return axios.delete(`${API_URL}/web-hooks/${webHookId}`)
  }

  updateWebHook(webHookId, webhook) {
    return axios.put(`${API_URL}/web-hooks/${webHookId}`, webhook)
  }
}

const instance = new WebHookService()
export {instance as WebHookService}
