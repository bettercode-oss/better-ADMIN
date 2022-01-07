import React from 'react';
import LoginInfo from "./LoginInfo";
import {Layout} from "antd";
import classNames from "classnames";
import themeConfig from "../../config/theme.config.json";

function Header() {
  return (
    <Layout.Header className={classNames('site-layout-header', {dark: themeConfig.dark})}>
      <div className={classNames('login-info', {dark: themeConfig.dark})}>
        <LoginInfo/>
      </div>
    </Layout.Header>
  );
}

export default Header;
