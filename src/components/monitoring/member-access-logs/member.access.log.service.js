import axios from "axios";
import {adminConfig} from "../../../config/admin.config";

const API_URL = adminConfig.authentication.authAPI();

class MemberAccessLogService {
  getAccessLogs(params) {
    return axios.get(`${API_URL}/member-access-logs`, { params: params });
  }
}

const instance = new MemberAccessLogService()
export {instance as MemberAccessLogService}
