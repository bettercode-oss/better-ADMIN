import axios from "axios";
import {adminConfig} from "../../config/admin.config";

const API_URL = adminConfig.authentication.authAPI();

class SiteService {
  static getSettings = () => {
    return axios.get(API_URL + `/site/settings`);
  }

  static getSetting = (key) => {
    return axios.get(API_URL + `/site/settings/${key}`);
  }

  static saveSetting = (key, setting) => {
    return axios.put(API_URL + `/site/settings/${key}`, setting);
  }
}

export default SiteService
