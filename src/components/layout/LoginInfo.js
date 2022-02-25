import React, {useState} from "react";
import {Avatar, Dropdown, Menu} from "antd";
import {LogoutOutlined, MonitorOutlined, SettingOutlined, UserOutlined} from "@ant-design/icons";
import {useHistory} from "react-router-dom";
import {adminConfig} from "../../config/admin.config";
import {MemberContext} from "../../auth/member.context";
import {AuthService} from "../../auth/auth.service";
import {AppSettings} from "../settings/AppSettings";
import {AppSettingsNavigation} from "../settings/app.settings.navigation.config";
import {cleanUpAppLayoutContextResource} from "./AppLayoutContext";
import {MonitoringNavigation} from "../monitoring/monitoring.navigation.config";
import {Monitoring} from "../monitoring/Monitoring";

const LoginInfo = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [showMonitoring, setShowMonitoring] = useState(false);
  const history = useHistory();

  const logout = () => {
    AuthService.logout().then(() => {
      history.replace(adminConfig.authentication.loginUrl);
    }).catch(() => {
      history.replace(adminConfig.authentication.loginUrl);
    }).finally(() => {
      cleanUpAppLayoutContextResource();
    });
  };

  const settingAble = () => {
    let settingable = false;
    const memberPermissions = MemberContext.memberInformation.permissions;
    const appSettingsAccessPermissions = new Set(AppSettingsNavigation.getItemAllAccessPermissions());

    if (memberPermissions) {
      for (let i = 0; i < memberPermissions.length; i++) {
        if (appSettingsAccessPermissions.has(memberPermissions[i])) {
          settingable = true;
          break;
        }
      }
    }

    return settingable;
  }

  const monitoringAble = () => {
    let monitoringable = false;
    const memberPermissions = MemberContext.memberInformation.permissions;
    const monitoringAccessPermissions = new Set(MonitoringNavigation.getItemAllAccessPermissions());

    if (memberPermissions) {
      for (let i = 0; i < memberPermissions.length; i++) {
        if (monitoringAccessPermissions.has(memberPermissions[i])) {
          monitoringable = true;
          break;
        }
      }
    }

    return monitoringable;
  }

  return (
    <>
      <Dropdown overlay={() =>
        <Menu>
          {settingAble() &&
            <Menu.Item key="0" onClick={() => setShowSettings(true)}>
              <SettingOutlined/>&nbsp;사이트 설정
            </Menu.Item>}
          {monitoringAble() &&
            <Menu.Item key="1" onClick={() => setShowMonitoring(true)}>
              <MonitorOutlined/>&nbsp;모니터링
            </Menu.Item>}
          {(settingAble() || monitoringAble()) && <Menu.Divider/>}
          <Menu.Item key="2" onClick={logout}><LogoutOutlined/>&nbsp;로그아웃</Menu.Item>
        </Menu>}>
      <span style={{paddingBottom: "20px", cursor: "pointer"}}>
        <Avatar icon={<UserOutlined/>} src={MemberContext.memberInformation.picture}/>
        <span
          style={{marginLeft: "5px"}}>{MemberContext.memberInformation && MemberContext.memberInformation.name}</span>
      </span>
      </Dropdown>
      {showSettings &&
        <AppSettings onClose={() => {setShowSettings(false)}}/>}
      {showMonitoring &&
        <Monitoring onClose={() => {setShowMonitoring(false)}}/>}
    </>
  )
};

export default LoginInfo;

