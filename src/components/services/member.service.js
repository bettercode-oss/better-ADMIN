import axios from "axios";
import {adminConfig} from "../../config/admin.config";

const API_URL = adminConfig.authentication.authAPI();

class MemberService {
  getMembersApproved(params) {
    params["status"] = "approved";
    return axios.get(`${API_URL}/members`, { params: params, loading: true });
  }

  getMembersApplied(params) {
    params["status"] = "applied";
    return axios.get(`${API_URL}/members`, { params: params, loading: true });
  }

  assignRoles(memberId, assignRoles) {
    return axios.put(API_URL + `/members/${memberId}/assign-roles`, assignRoles);
  }

  getMember(memberId) {
    return axios.get(API_URL + `/members/${memberId}`);
  }

  signUpMember(signUp) {
    return axios.post(API_URL + `/members`, signUp, {autoErrorHandling: false});
  }

  approveMember(memberId) {
    return axios.put(API_URL + `/members/${memberId}/approved`);
  }

  rejectMember(memberId) {
    return axios.put(API_URL + `/members/${memberId}/rejected`);
  }

  getSearchFilters() {
    return axios.get(`${API_URL}/members/search-filters`);
  }
}

const instance = new MemberService()
export {instance as MemberService}
