import React, {useState} from 'react';
import {Layout, Menu} from "antd";
import {Link} from "react-router-dom";
import {adminConfig} from "../../config/admin.config";
import {useLayoutDispatch, useLayoutState} from "./AppLayoutContext";
import NavigationIcon from "./NavigationIcon";

function Sider() {
  const [collapsed, setCollapsed] = useState(false);
  const layoutState = useLayoutState();
  const layoutDispatch = useLayoutDispatch();

  const toggleCollapsed = () => setCollapsed(!collapsed);
  const handleSnbMenuClick = ({key}) => layoutDispatch({type: 'CLICK_SNB_MENU', key});
  const handleSubMenuClick = ({key}) => layoutDispatch({type: 'CLICK_SUB_MENU', key});

  return (
    <Layout.Sider
      collapsible
      collapsed={collapsed}
      onCollapse={toggleCollapsed}
    >
      <Link to="/">
        <div className="site-logo">
          <img className="logo-image" alt="logo" src={adminConfig.logo}/>
          {collapsed === false && <strong>&nbsp; {adminConfig.siteName}</strong>}
        </div>
      </Link>
      <Menu theme="dark" mode="inline"
            openKeys={collapsed ? undefined : layoutState.navigationState.snbMenuOpenKeys}
            selectedKeys={layoutState.navigationState.snbMenuSelectedKeys}
            onClick={handleSnbMenuClick}
      >
        {layoutState.gnbItem && layoutState.gnbItem.items &&
        layoutState.gnbItem.items.map((item, index) => {
          const SnbIcon = NavigationIcon(item.icon);
          if (item.items && item.items.length > 0) {
            return (
              <Menu.SubMenu key={index} title={item.title} icon={<SnbIcon/>} onTitleClick={handleSubMenuClick}>
                {item.items.map((subItem, subItemIndex) => {
                  const SubItemIcon = NavigationIcon(subItem.icon);
                  return subItem.link ? (
                    <Menu.Item
                      key={index + "-" + subItemIndex}
                      icon={<SubItemIcon/>}
                      title={subItem.title}
                    >
                      <Link to={subItem.link}>
                        <span>{subItem.title}</span>
                      </Link>
                    </Menu.Item>
                  ) : (
                    <Menu.Item
                      key={index + "-" + subItemIndex}
                      icon={<SubItemIcon/>}
                    >
                      {subItem.title}
                    </Menu.Item>
                  );
                })}
              </Menu.SubMenu>
            );
          } else {
            return (
              <Menu.Item key={index} icon={<SnbIcon/>} title={item.title}>
                {item.link ? (
                  <Link to={item.link}>
                    <span>{item.title}</span>
                  </Link>
                ) : (
                  <span>{item.title}</span>
                )}
              </Menu.Item>
            );
          }
        })}
      </Menu>
    </Layout.Sider>
  )
}

export default Sider;
