import axios from "axios";
import {adminConfig} from "../../../config/admin.config";

const API_URL = adminConfig.authentication.authAPI();

class OrganizationService {
  getOrganizations() {
    return axios.get(`${API_URL}/organizations`);
  }

  createOrganization(organization) {
    return axios.post(`${API_URL}/organizations`, organization)
  }

  changePosition(organizationId, position) {
    return axios.put(`${API_URL}/organizations/${organizationId}/change-position`, position)
  }

  deleteDepartment(organizationId) {
    return axios.delete(`${API_URL}/organizations/${organizationId}`)
  }

  assignRoles(organizationId, roles) {
    return axios.put(`${API_URL}/organizations/${organizationId}/assign-roles`, roles)
  }

  assignMembers(organizationId, members) {
    return axios.put(`${API_URL}/organizations/${organizationId}/assign-members`, members)
  }

  changeName(organizationId, organization) {
    return axios.put(`${API_URL}/organizations/${organizationId}/name`, organization)
  }
}

const instance = new OrganizationService()
export {instance as OrganizationService}
