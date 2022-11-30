import React, {useEffect, useState} from "react";
import {Avatar, Dropdown} from "antd";
import {LogoutOutlined, MonitorOutlined, SettingOutlined, UserOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";
import {adminConfig} from "../../config/admin.config";
import {MemberContext} from "../../auth/member.context";
import {AuthService} from "../../auth/auth.service";
import {AppSettings} from "../settings/AppSettings";
import {AppSettingsNavigation} from "../settings/app.settings.navigation.config";
import {MonitoringNavigation} from "../monitoring/monitoring.navigation.config";
import {Monitoring} from "../monitoring/Monitoring";
import {EventBroadcaster, INVALID_ACCESS_TOKEN_TOPIC} from "../../event/event.broadcaster";
import {PageTabStorage} from "./page.tab.storage";

const LoginInfo = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [showMonitoring, setShowMonitoring] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    EventBroadcaster.on(INVALID_ACCESS_TOKEN_TOPIC, () => {
      PageTabStorage.clear();
      AuthService.logout().then().finally(() => {
        navigate(adminConfig.authentication.loginUrl);
      });
    });
  }, [navigate]);

  const logout = () => {
    PageTabStorage.clear();
    AuthService.logout().then().finally(() => {
      navigate(adminConfig.authentication.loginUrl);
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

  const generateMenuItems = () => {
    const menusItems = [];
    if (settingAble()) {
      menusItems.push({
        label: '사이트 설정',
        key: '0',
        icon: <SettingOutlined/>,
      });
    }

    if (monitoringAble()) {
      menusItems.push({
        label: '모니터링',
        key: '1',
        icon: <MonitorOutlined/>,
      });
    }

    menusItems.push({
      label: '로그아웃',
      key: '2',
      icon: <LogoutOutlined/>,
    });
    return menusItems;
  }

  const handleMenuClick = (e) => {
    switch (e.key) {
      case '0':
        setShowSettings(true);
        break;
      case '1':
        setShowMonitoring(true)
        break;
      case '2':
        logout();
        break;
      default:
        console.log('unknown menu item');
    }
  }

  return (
    <>
      <Dropdown
        menu={{
          items: generateMenuItems(),
          onClick: handleMenuClick,
        }}
      >
        <span style={{paddingBottom: "20px", cursor: "pointer"}}>
          <Avatar icon={<UserOutlined/>} src={MemberContext.memberInformation.picture}/>
          <span style={{marginLeft: "5px"}}>{MemberContext.memberInformation && MemberContext.memberInformation.name}</span>
        </span>
      </Dropdown>
      {showSettings &&
        <AppSettings onClose={() => {
          setShowSettings(false)
        }}/>}
      {showMonitoring &&
        <Monitoring onClose={() => {
          setShowMonitoring(false)
        }}/>}
    </>
  )
};

export default LoginInfo;

