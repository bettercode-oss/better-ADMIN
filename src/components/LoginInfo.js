import React from "react";
import {Avatar, Dropdown, Menu} from "antd";
import {LogoutOutlined, UserOutlined} from "@ant-design/icons";

const LoginInfo = () => (
  <Dropdown overlay={() =>
    <Menu>
      <Menu.Item><LogoutOutlined/>로그아웃</Menu.Item>
    </Menu>}>
      <span style={{paddingBottom: "20px", cursor: "pointer"}}>
        <Avatar icon={<UserOutlined/>}/>
        <span style={{marginLeft: "5px"}}>홍길동</span>
      </span>
  </Dropdown>
);

export default LoginInfo;

