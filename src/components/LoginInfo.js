import React from "react";
import {Avatar, Dropdown, Menu} from "antd";
import {LogoutOutlined, UserOutlined} from "@ant-design/icons";
import {useHistory} from "react-router-dom";
import {adminConfig} from "../config/admin.config";
import {MemberContext} from "../auth/member.context";
import {AuthService} from "../auth/auth.service";

const LoginInfo = () => {
  const history = useHistory();
  const logout = () => {
    AuthService.logout().then(() => {
      history.replace(adminConfig.authentication.loginUrl);
    }).catch(() => {
      history.replace(adminConfig.authentication.loginUrl);
    });
  };

  return (
    <Dropdown overlay={() =>
      <Menu>
        <Menu.Item onClick={logout}><LogoutOutlined/>로그아웃</Menu.Item>
      </Menu>}>
      <span style={{paddingBottom: "20px", cursor: "pointer"}}>
        <Avatar icon={<UserOutlined/>}/>
        <span style={{marginLeft: "5px"}}>{MemberContext.memberInformation && MemberContext.memberInformation.name}</span>
      </span>
    </Dropdown>
  )
};

export default LoginInfo;

