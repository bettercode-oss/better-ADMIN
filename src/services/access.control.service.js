import axios from 'axios';
import { adminConfig } from '../config/admin.config';

const API_URL = adminConfig.authentication.authAPI();

class AccessControlService {
  static getPermissions(params) {
    return axios.get(`${API_URL}/access-control/permissions`, { params, loading: true });
  }

  static getPermissionById(id) {
    return axios.get(`${API_URL}/access-control/permissions/${id}`);
  }

  static createPermission(permission) {
    return axios.post(`${API_URL}/access-control/permissions`, permission, { autoErrorHandling: false });
  }

  static deletePermission(permissionId) {
    return axios.delete(`${API_URL}/access-control/permissions/${permissionId}`);
  }

  static updatePermission(permissionId, permission) {
    return axios.put(`${API_URL}/access-control/permissions/${permissionId}`, permission, { autoErrorHandling: false });
  }

  static createRole(role) {
    return axios.post(`${API_URL}/access-control/roles`, role, { autoErrorHandling: false });
  }

  static getRoles(params) {
    return axios.get(`${API_URL}/access-control/roles`, { params, loading: true });
  }

  static getRoleById(id) {
    return axios.get(`${API_URL}/access-control/roles/${id}`);
  }

  static deleteRole(roleId) {
    return axios.delete(`${API_URL}/access-control/roles/${roleId}`);
  }

  static updateRole(roleId, role) {
    return axios.put(`${API_URL}/access-control/roles/${roleId}`, role, { autoErrorHandling: false });
  }
}

export default AccessControlService;
