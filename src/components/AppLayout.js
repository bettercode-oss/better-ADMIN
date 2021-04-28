import React, {useEffect, useState} from "react";
import {Breadcrumb, Layout, Menu, Space, Spin} from "antd";
import "./AppLayout.css";
import PageRouting from "./PageRouting";
import {adminConfig} from "../config/admin.config";
import * as AllIcons from "@ant-design/icons";
import LoginInfo from "./LoginInfo";
import {Link} from "react-router-dom";
import NavigationConfig from "../config/navigation.config";
import {
  CHANGE_MEMBER_CONTEXT_EVENT_TOPIC,
  EventBroadcaster,
  SHOW_LOADING_EVENT_TOPIC
} from "../event/event.broadcaster";

const OPEN_KEY_NONE_CHAR = "!";

const AppLayout = (props) => {
  const [collapsed, setCollapsed] = useState(false);
  const [allGnbItems, setAllGnbItems] = useState(NavigationConfig.getItems());
  const [gnbItem, setGnbItem] = useState(null);
  const [breadcrumbItems, setBreadcrumbItems] = useState([]);

  const [navigationState, setNavigationState] = useState({
    gnbMenuSelectedKeys: [""],
    snbMenuSelectedKeys: [""],
    snbMenuOpenKeys: [""]
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const currentNavigationItem = NavigationConfig.getItemsByLink(props.location.pathname, allGnbItems);
    if (props.location.pathname !== "/") {
      if (currentNavigationItem.gnbItem) {
        const gnbNavigationItem = allGnbItems[currentNavigationItem.gnbItem.index];
        setGnbItem(gnbNavigationItem);

        const breadcrumbNavigationItems = [];
        breadcrumbNavigationItems.push(currentNavigationItem.gnbItem.title);

        if (currentNavigationItem.snbItem) {
          breadcrumbNavigationItems.push(currentNavigationItem.snbItem.title);
        }

        if (currentNavigationItem.subItem) {
          breadcrumbNavigationItems.push(currentNavigationItem.subItem.title);
        }

        setBreadcrumbItems(breadcrumbNavigationItems);
      }
    }

    updateNavigationStatus(currentNavigationItem);

    EventBroadcaster.on(CHANGE_MEMBER_CONTEXT_EVENT_TOPIC, () => {
      setAllGnbItems(NavigationConfig.getItems());
    });

    EventBroadcaster.on(SHOW_LOADING_EVENT_TOPIC, (data) => {
      setLoading(data.show);
    });
  }, [
    props.location.pathname,
    allGnbItems,
  ]);

  const updateNavigationStatus = (navigationItem) => {
    const gnbMenuSelectedKeys = navigationItem.gnbItem ? [navigationItem.gnbItem.index] : [""];
    let snbMenuSelectedKeys = navigationItem.snbItem ? [navigationItem.snbItem.index] : [""];
    if (navigationItem.subItem) {
      snbMenuSelectedKeys = navigationItem.snbItem
        ? [
          navigationItem.snbItem.index +
          "-" +
          navigationItem.subItem.index,
        ]
        : [""];
    }
    const snbMenuOpenKeys = navigationItem.snbItem ? [navigationItem.snbItem.index] : [""];

    setNavigationState({
      gnbMenuSelectedKeys: gnbMenuSelectedKeys,
      snbMenuSelectedKeys: snbMenuSelectedKeys,
      snbMenuOpenKeys: snbMenuOpenKeys
    });
  }

  const handleGnbMenuClick = ({key}) => {
    const gnbIndex = key;
    setGnbItem(allGnbItems[gnbIndex]);
    setNavigationState({
      gnbMenuSelectedKeys: [gnbIndex],
      snbMenuSelectedKeys: [""],
      snbMenuOpenKeys: [""]
    });
  };

  const handleSnbMenuClick = ({key}) => {
    const selectedMenuIndices = key.split("-");
    if (selectedMenuIndices && gnbItem) {
      const breadcrumbNavigationItems = [];
      breadcrumbNavigationItems.push(gnbItem.title);
      let selectedSnbItem = {};

      selectedMenuIndices.forEach((menuIndex, arrayIndex) => {
        if (arrayIndex === 0) {
          selectedSnbItem = gnbItem.items[menuIndex];
          breadcrumbNavigationItems.push(selectedSnbItem.title);
        } else if (arrayIndex === 1) {
          const selectedSubItem = selectedSnbItem.items[menuIndex];
          breadcrumbNavigationItems.push(selectedSubItem.title);
        }
      });
      setBreadcrumbItems(breadcrumbNavigationItems);
    }
    setNavigationState({
      ...navigationState,
      snbMenuSelectedKeys: [key],
    });
  };

  const toggleCollapsed = () => {
    if (!collapsed) {
      setNavigationState({
        ...navigationState,
        snbMenuOpenKeys: navigationState.snbMenuOpenKeys.map(key => OPEN_KEY_NONE_CHAR + key),
      });
    } else {
      setNavigationState({
        ...navigationState,
        snbMenuOpenKeys: navigationState.snbMenuOpenKeys.map(key => key.startsWith(OPEN_KEY_NONE_CHAR) ? key.split(OPEN_KEY_NONE_CHAR)[1] : key),
      });
    }
    setCollapsed(!collapsed);
  };

  return (
    <Layout
      style={{
        minHeight: "100%"
      }}
    >
      <Layout.Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
      >
        <Link to="/">
          <div className="site-logo">
            <img className="logo-image" alt="logo" src={adminConfig.logo}/>
            {collapsed === false && <strong>&nbsp; {adminConfig.siteName}</strong>}
          </div>
        </Link>
        <Menu theme="dark" mode="inline" openKeys={navigationState.snbMenuOpenKeys}
              selectedKeys={navigationState.snbMenuSelectedKeys}
              onClick={handleSnbMenuClick}
        >
          {gnbItem && gnbItem.items &&
          gnbItem.items.map((item, index) => {
            const SnbIcon = AllIcons[item.icon];
            if (item.items && item.items.length > 0) {
              return (
                <Menu.SubMenu key={index} title={item.title} icon={<SnbIcon/>}
                              onTitleClick={(event) => {
                                setNavigationState({
                                  ...navigationState,
                                  snbMenuOpenKeys: [event.key],
                                });
                              }}
                >
                  {item.items.map((subItem, subItemIndex) => {
                    const SubItemIcon = AllIcons[subItem.icon];
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
      <Layout className="site-layout">
        <Layout.Header className="site-layout-header">
          <Space>
            {React.createElement(
              collapsed
                ? AllIcons.MenuUnfoldOutlined
                : AllIcons.MenuFoldOutlined,
              {
                className: "trigger",
                onClick: toggleCollapsed,
              }
            )}
            {allGnbItems &&
            <Menu
              mode="horizontal"
              selectedKeys={navigationState.gnbMenuSelectedKeys}
              onClick={handleGnbMenuClick}
            >
              {allGnbItems.map((item, idx) => {
                const GnbIcon = AllIcons[item.icon];
                return (
                  <Menu.Item key={idx} icon={<GnbIcon/>}>
                    {item.title}
                  </Menu.Item>
                );
              })}
            </Menu>}
          </Space>
          <div className="login-info">
            <LoginInfo/>
          </div>
        </Layout.Header>
        <Layout.Content className="site-layout-content">
          {props.location.pathname !== "/" && (
            <div style={{backgroundColor: "white", padding: "15px"}}>
              <Breadcrumb>
                {breadcrumbItems.map((item, index) => (
                  <Breadcrumb.Item key={index}>{item}</Breadcrumb.Item>
                ))}
              </Breadcrumb>
              <div className="page-title">
                {breadcrumbItems &&
                breadcrumbItems.length > 0 &&
                breadcrumbItems[breadcrumbItems.length - 1]}
              </div>
            </div>
          )}
          <div className="site-layout-page">
            <Spin spinning={loading}>
              <PageRouting/>
            </Spin>
          </div>
        </Layout.Content>
        <Layout.Footer style={{textAlign: "center"}}>
          better ADMIN ©2021 Created by bettercode
        </Layout.Footer>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
