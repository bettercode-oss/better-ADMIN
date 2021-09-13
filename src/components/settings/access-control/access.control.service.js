import axios from "axios";
import {adminConfig} from "../../../config/admin.config";

const API_URL = adminConfig.authentication.authAPI();

class AccessControlService {
  getPermissions(params) {
    return axios.get(`${API_URL}/access-control/permissions`, { params: params });
  }

  createPermission(permission) {
    return axios.post(`${API_URL}/access-control/permissions`, permission)
  }

  deletePermission(permissionId) {
    return axios.delete(`${API_URL}/access-control/permissions/${permissionId}`)
  }

  updatePermission(permissionId, permission) {
    return axios.put(`${API_URL}/access-control/permissions/${permissionId}`, permission)
  }

  createRole(role) {
    return axios.post(`${API_URL}/access-control/roles`, role)
  }

  getRoles(params) {
    return axios.get(`${API_URL}/access-control/roles`, { params: params });
  }

  deleteRole(roleId) {
    return axios.delete(`${API_URL}/access-control/roles/${roleId}`)
  }

  updateRole(roleId, role) {
    return axios.put(`${API_URL}/access-control/roles/${roleId}`, role)
  }
}

const instance = new AccessControlService()
export {instance as AccessControlService}
