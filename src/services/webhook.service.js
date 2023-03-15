import axios from 'axios';
import { adminConfig } from '../config/admin.config';

const API_URL = adminConfig.authentication.authAPI();

class WebHookService {
  static getWebHooks(params) {
    return axios.get(`${API_URL}/web-hooks`, { params });
  }

  static getWebHook(webHookId) {
    return axios.get(`${API_URL}/web-hooks/${webHookId}`);
  }

  static createWebHook(webhook) {
    return axios.post(`${API_URL}/web-hooks`, webhook);
  }

  static deleteWebHook(webHookId) {
    return axios.delete(`${API_URL}/web-hooks/${webHookId}`);
  }

  static updateWebHook(webHookId, webhook) {
    return axios.put(`${API_URL}/web-hooks/${webHookId}`, webhook);
  }
}

export default WebHookService;
