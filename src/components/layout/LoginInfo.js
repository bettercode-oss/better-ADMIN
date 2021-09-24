import React, {useState} from "react";
import {Avatar, Dropdown, Menu} from "antd";
import {LogoutOutlined, SettingOutlined, UserOutlined} from "@ant-design/icons";
import {useHistory} from "react-router-dom";
import {adminConfig} from "../../config/admin.config";
import {MemberContext} from "../../auth/member.context";
import {AuthService} from "../../auth/auth.service";
import {AppSettings} from "../settings/AppSettings";
import {AppSettingsNavigation} from "../settings/app.settings.navigation.config";

const LoginInfo = () => {
  const [showSettings, setShowSettings] = useState(false);
  const history = useHistory();

  const logout = () => {
    AuthService.logout().then(() => {
      history.replace(adminConfig.authentication.loginUrl);
    }).catch(() => {
      history.replace(adminConfig.authentication.loginUrl);
    });
  };

  const showSiteSettings = () => {
    setShowSettings(true);
  }

  const isSettingsAble = () => {
    let settingAble = false;
    const memberPermissions = MemberContext.memberInformation.permissions;
    const appSettingsAccessPermissions = new Set(AppSettingsNavigation.getItemAllAccessPermissions());

    if(memberPermissions) {
      for (let i = 0; i < memberPermissions.length; i++) {
          if (appSettingsAccessPermissions.has(memberPermissions[i])) {
            settingAble = true;
            break;
          }
      }
    }

    return settingAble;
  }

  return (
    <>
      <Dropdown overlay={() =>
        <Menu>
          {isSettingsAble() &&
          <Menu.Item key="0" onClick={showSiteSettings}>
            <SettingOutlined/>&nbsp;사이트 설정
          </Menu.Item>}
          {isSettingsAble() && <Menu.Divider/>}
          <Menu.Item key="1" onClick={logout}><LogoutOutlined/>&nbsp;로그아웃</Menu.Item>
        </Menu>}>
      <span style={{paddingBottom: "20px", cursor: "pointer"}}>
        <Avatar icon={<UserOutlined/>} src={MemberContext.memberInformation.picture}/>
        <span
          style={{marginLeft: "5px"}}>{MemberContext.memberInformation && MemberContext.memberInformation.name}</span>
      </span>
      </Dropdown>
      {showSettings &&
      <AppSettings onClose={() => {
        setShowSettings(false);
      }}/>}
    </>
  )
};

export default LoginInfo;

