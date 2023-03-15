import axios from 'axios';
import { adminConfig } from '../config/admin.config';

const API_URL = adminConfig.authentication.authAPI();

class OrganizationService {
  static getOrganizations() {
    return axios.get(`${API_URL}/organizations`, { loading: true });
  }

  static getOrganizationById(id) {
    return axios.get(`${API_URL}/organizations/${id}`);
  }

  static createOrganization(organization) {
    return axios.post(`${API_URL}/organizations`, organization);
  }

  static changePosition(organizationId, position) {
    return axios.put(`${API_URL}/organizations/${organizationId}/change-position`, position);
  }

  static deleteDepartment(organizationId) {
    return axios.delete(`${API_URL}/organizations/${organizationId}`);
  }

  static assignRoles(organizationId, roles) {
    return axios.put(`${API_URL}/organizations/${organizationId}/assign-roles`, roles);
  }

  static assignMembers(organizationId, members) {
    return axios.put(`${API_URL}/organizations/${organizationId}/assign-members`, members);
  }

  static changeName(organizationId, organization) {
    return axios.put(`${API_URL}/organizations/${organizationId}/name`, organization);
  }
}

export default OrganizationService;
