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
  const handleFirstDepthMenuClick = ({key}) => layoutDispatch({type: 'CLICK_FIRST_DEPTH_MENU', key});
  const handleSecondDepthMenuClick = ({key}) => layoutDispatch({type: 'CLICK_SECOND_DEPTH_SNB_MENU', key});

  return (
    <Layout.Sider
      collapsible
      collapsed={collapsed}
      onCollapse={toggleCollapsed}
      breakpoint="lg"
      collapsedWidth="80"
    >
      <Link to="/">
        <div className="site-logo">
          <img className="logo-image" alt="logo" src={adminConfig.logo}/>
          {collapsed === false && <strong>&nbsp; {adminConfig.siteName}</strong>}
        </div>
      </Link>
      <Menu theme="dark" mode="inline"
            openKeys={collapsed ? undefined : layoutState.navigationState.menuOpenKeys}
            selectedKeys={layoutState.navigationState.menuSelectedKeys}
      >
        {layoutState.allGnbItems && layoutState.allGnbItems.map((gnbItem, idx) => {
          const GnbIcon = NavigationIcon(gnbItem.icon);
          if (gnbItem.items && gnbItem.items.length > 0) {
            return (
              <Menu.SubMenu key={idx} title={gnbItem.title} icon={<GnbIcon/>}
                            onTitleClick={handleFirstDepthMenuClick}
              >
                {gnbItem.items.map((snbItem, snbItemIndex) => {
                  const SnbItemIcon = NavigationIcon(snbItem.icon);
                  if (snbItem.items && snbItem.items.length > 0) {
                    return (
                      <Menu.SubMenu key={idx + "-" + snbItemIndex} title={snbItem.title} icon={<SnbItemIcon/>}
                                    onTitleClick={handleSecondDepthMenuClick}
                      >
                        {snbItem.items.map((subItem, subItemIndex) => {
                          const SubItemIcon = NavigationIcon(subItem.icon);
                          return subItem.link ? (
                            <Menu.Item
                              key={idx + "-" + snbItemIndex + "-" + subItemIndex}
                              icon={<SubItemIcon/>}
                              title={subItem.title}
                            >
                              <Link to={subItem.link}>
                                <span>{subItem.title}</span>
                              </Link>
                            </Menu.Item>
                          ) : (
                            <Menu.Item
                              key={idx + "-" + snbItemIndex + "-" + subItemIndex}
                              icon={<SubItemIcon/>}
                            >
                              {subItem.title}
                            </Menu.Item>
                          );
                        })}
                      </Menu.SubMenu>
                    );
                  } else {
                    return snbItem.link ? (
                      <Menu.Item
                        key={idx + "-" + snbItemIndex}
                        icon={<SnbItemIcon/>}
                        title={snbItem.title}
                      >
                        <Link to={snbItem.link}>
                          <span>{snbItem.title}</span>
                        </Link>
                      </Menu.Item>
                    ) : (
                      <Menu.Item
                        key={idx + "-" + snbItemIndex}
                        icon={<SnbItemIcon/>}
                      >
                        {snbItem.title}
                      </Menu.Item>
                    );
                  }
                })}
              </Menu.SubMenu>
            );
          } else {
            return (
              <Menu.Item key={idx} icon={<GnbIcon/>} title={gnbItem.title}>
                {gnbItem.link ? (
                  <Link to={gnbItem.link}>
                    <span>{gnbItem.title}</span>
                  </Link>
                ) : (
                  <span>{gnbItem.title}</span>
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
