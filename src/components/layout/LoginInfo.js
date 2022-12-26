import React, {useEffect} from "react";
import {LogoutOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";
import {adminConfig} from "../../config/admin.config";
import {MemberContext} from "../../auth/member.context";
import {AuthService} from "../../auth/auth.service";
import {EventBroadcaster, INVALID_ACCESS_TOKEN_TOPIC} from "../../event/event.broadcaster";
import {PageTabStorage} from "./page.tab.storage";
import {Avatar} from "../atoms/avatar";
import {Dropdown} from "../atoms/dropdown";

const LoginInfo = () => {
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

  const generateMenuItems = () => {
    return [{
      label: '로그아웃',
      key: '0',
      icon: <LogoutOutlined/>,
    }];
  }

  const handleMenuClick = (e) => {
    switch (e.key) {
      case '0':
        logout();
        break;
      default:
        console.log('unknown menu item');
    }
  }

  return (
    <>
      <Dropdown
        items={generateMenuItems()}
        onClick={handleMenuClick}
      >
        <Avatar ssrc={MemberContext.memberInformation.picture}
                suffix={MemberContext.memberInformation && MemberContext.memberInformation.name}/>
      </Dropdown>
    </>
  )
};

export default LoginInfo;

