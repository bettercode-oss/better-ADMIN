import axios from "axios";
import {adminConfig} from "../../../config/admin.config";

const API_URL = adminConfig.authentication.authAPI();

class MemberService {
  getMembers(params) {
    let apiPath = `${API_URL}/members?`;
    apiPath += Object.keys(params).map(key => {
      return key + "=" + params[key]
    }).join("&")

    return axios.get(apiPath);
  }

  assignRoles(memberId, assignRoles) {
    return axios.put(API_URL + `/members/${memberId}/assign-roles`, assignRoles);
  }

  getMember(memberId) {
    return axios.get(API_URL + `/members/${memberId}`);
  }

  signUpMember(signUp) {
    return axios.post(API_URL + `/members`, signUp);
  }

  approveMember(memberId) {
    return axios.put(API_URL + `/members/${memberId}/approved`);
  }
}

const instance = new MemberService()
export {instance as MemberService}
