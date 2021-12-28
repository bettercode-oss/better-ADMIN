import React from 'react';
import LoginInfo from "./LoginInfo";
import {Layout, Menu} from "antd";

import {useLayoutDispatch, useLayoutState} from "./AppLayoutContext";
import NavigationIcon from "./NavigationIcon";
import classNames from "classnames";
import themeConfig from "../../config/theme.config.json";

function Header() {
  const layoutState = useLayoutState();
  const layoutDispatch = useLayoutDispatch();

  const handleGnbMenuClick = ({key}) => layoutDispatch({type: 'CLICK_GNB_MENU', key});

  return (
    <Layout.Header className={classNames('site-layout-header', {dark: themeConfig.dark})}>
      <div className={classNames('login-info', {dark: themeConfig.dark})}>
        <LoginInfo/>
      </div>
      {layoutState.allGnbItems &&
      <Menu
        mode="horizontal"
        selectedKeys={layoutState.navigationState.gnbMenuSelectedKeys}
        onClick={handleGnbMenuClick}
      >
        {layoutState.allGnbItems.map((item, idx) => {
          const GnbIcon = NavigationIcon(item.icon);

          return (
            <Menu.Item key={idx} icon={<GnbIcon/>}>
              {item.title}
            </Menu.Item>
          );
        })}
      </Menu>}
    </Layout.Header>
  );
}

export default Header;
