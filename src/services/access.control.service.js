import axios from "axios";
import {adminConfig} from "../config/admin.config";

const API_URL = adminConfig.authentication.authAPI();

class AccessControlService {
  getPermissions(params) {
    return axios.get(`${API_URL}/access-control/permissions`, { params: params, loading: true });
  }

  getPermissionById(id) {
    return axios.get(`${API_URL}/access-control/permissions/${id}`);
  }

  createPermission(permission) {
    return axios.post(`${API_URL}/access-control/permissions`, permission, {autoErrorHandling: false})
  }

  deletePermission(permissionId) {
    return axios.delete(`${API_URL}/access-control/permissions/${permissionId}`)
  }

  updatePermission(permissionId, permission) {
    return axios.put(`${API_URL}/access-control/permissions/${permissionId}`, permission, {autoErrorHandling: false})
  }

  createRole(role) {
    return axios.post(`${API_URL}/access-control/roles`, role, {autoErrorHandling: false})
  }

  getRoles(params) {
    return axios.get(`${API_URL}/access-control/roles`, { params: params, loading: true });
  }

  getRoleById(id) {
    return axios.get(`${API_URL}/access-control/roles/${id}`);
  }

  deleteRole(roleId) {
    return axios.delete(`${API_URL}/access-control/roles/${roleId}`)
  }

  updateRole(roleId, role) {
    return axios.put(`${API_URL}/access-control/roles/${roleId}`, role, {autoErrorHandling: false})
  }
}

const instance = new AccessControlService()
export {instance as AccessControlService}
