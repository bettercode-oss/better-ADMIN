import React from 'react';
import LoginInfo from "./LoginInfo";
import {Layout} from "antd";

function Header() {
  return (
    <Layout.Header className="site-layout-header">
      <div className="login-info">
        <LoginInfo/>
      </div>
    </Layout.Header>
  );
}

export default Header;
