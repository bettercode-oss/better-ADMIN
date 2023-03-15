import axios from 'axios';
import { adminConfig } from '../config/admin.config';

const API_URL = adminConfig.authentication.authAPI();

class MemberService {
  static getMembersApproved(params) {
    const newParams = { ...params, status: 'approved' };
    return axios.get(`${API_URL}/members`, { params: newParams, loading: true });
  }

  static getMembersApplied(params) {
    const newParams = { ...params, status: 'applied' };
    return axios.get(`${API_URL}/members`, { newParams, loading: true });
  }

  static assignRoles(memberId, assignRoles) {
    return axios.put(`${API_URL}/members/${memberId}/assign-roles`, assignRoles);
  }

  static getMember(memberId) {
    return axios.get(`${API_URL}/members/${memberId}`);
  }

  static signUpMember(signUp) {
    return axios.post(`${API_URL}/members`, signUp, { autoErrorHandling: false });
  }

  static approveMember(memberId) {
    return axios.put(`${API_URL}/members/${memberId}/approved`);
  }

  static rejectMember(memberId) {
    return axios.put(`${API_URL}/members/${memberId}/rejected`);
  }

  static getSearchFilters() {
    return axios.get(`${API_URL}/members/search-filters`);
  }
}

export default MemberService;
