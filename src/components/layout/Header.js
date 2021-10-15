import React from 'react';
import LoginInfo from "./LoginInfo";
import {Layout, Menu} from "antd";

import {useLayoutDispatch, useLayoutState} from "./AppLayoutContext";
import NavigationIcon from "./NavigationIcon";

function Header() {
  const layoutState = useLayoutState();
  const layoutDispatch = useLayoutDispatch();

  const handleGnbMenuClick = ({key}) => layoutDispatch({type: 'CLICK_GNB_MENU', key});

  return (
    <Layout.Header className="site-layout-header">
      <div className="login-info">
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
