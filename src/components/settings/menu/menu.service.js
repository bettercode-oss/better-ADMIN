import axios from "axios";
import {adminConfig} from "../../../config/admin.config";

const API_URL = adminConfig.authentication.authAPI();

class MenuService {
  getMenus() {
    return axios.get(`${API_URL}/menus`);
  }

  createMenu(menu) {
    return axios.post(`${API_URL}/menus`, menu)
  }

  changePosition(menuId, position) {
    return axios.put(`${API_URL}/menus/${menuId}/change-position`, position)
  }

  deleteMenu(menuId) {
    return axios.delete(`${API_URL}/menus/${menuId}`)
  }

  updateMenu(menuId, menu) {
    return axios.put(`${API_URL}/menus/${menuId}`, menu)
  }
}

const instance = new MenuService()
export {instance as MenuService}
