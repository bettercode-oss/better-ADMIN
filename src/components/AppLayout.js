import React, {useEffect, useReducer} from "react";
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

const initialState = {
  collapsed: false,
  allGnbItems: [],
  gnbItem: null,
  breadcrumbItems: [],
  navigationState: {
    gnbMenuSelectedKeys: [""],
    snbMenuSelectedKeys: [""],
    snbMenuOpenKeys: [""]
  },
  loading: false
};

function reducer(state, action) {
  switch (action.type) {
    case 'INIT_NAVIGATION':
      const currentNavigationItem = NavigationConfig.getItemsByLink(action.pathname, state.allGnbItems);
      if (action.pathname !== "/") {
        if (currentNavigationItem.gnbItem) {
          const gnbNavigationItem = state.allGnbItems[currentNavigationItem.gnbItem.index];
          const breadcrumbNavigationItems = [];
          breadcrumbNavigationItems.push(currentNavigationItem.gnbItem.title);

          if (currentNavigationItem.snbItem) {
            breadcrumbNavigationItems.push(currentNavigationItem.snbItem.title);
          }

          if (currentNavigationItem.subItem) {
            breadcrumbNavigationItems.push(currentNavigationItem.subItem.title);
          }

          state = {
            ...state,
            gnbItem: gnbNavigationItem,
            breadcrumbItems: breadcrumbNavigationItems,
          };
        }
      }
      const gnbMenuSelectedKeys = currentNavigationItem.gnbItem ? [currentNavigationItem.gnbItem.index] : [""];
      let snbMenuSelectedKeys = currentNavigationItem.snbItem ? [currentNavigationItem.snbItem.index] : [""];
      if (currentNavigationItem.subItem) {
        snbMenuSelectedKeys = currentNavigationItem.snbItem
          ? [
            currentNavigationItem.snbItem.index +
            "-" +
            currentNavigationItem.subItem.index,
          ]
          : [""];
      }
      const snbMenuOpenKeys = currentNavigationItem.snbItem ? [currentNavigationItem.snbItem.index] : [""];

      return {
        ...state,
        navigationState: {
          gnbMenuSelectedKeys: gnbMenuSelectedKeys,
          snbMenuSelectedKeys: snbMenuSelectedKeys,
          snbMenuOpenKeys: snbMenuOpenKeys
        },
      };
    case 'CLICK_GNB_MENU':
      const gnbIndex = action.key;
      return {
        ...state,
        gnbItem: state.allGnbItems[gnbIndex],
        navigationState: {
          gnbMenuSelectedKeys: [gnbIndex],
          snbMenuSelectedKeys: [""],
          snbMenuOpenKeys: [""]
        },
      };
    case 'CLICK_SNB_MENU':
      const selectedMenuIndices = action.key.split("-");
      if (selectedMenuIndices && state.gnbItem) {
        const breadcrumbNavigationItems = [];
        breadcrumbNavigationItems.push(state.gnbItem.title);
        let selectedSnbItem = {};

        selectedMenuIndices.forEach((menuIndex, arrayIndex) => {
          if (arrayIndex === 0) {
            selectedSnbItem = state.gnbItem.items[menuIndex];
            breadcrumbNavigationItems.push(selectedSnbItem.title);
          } else if (arrayIndex === 1) {
            const selectedSubItem = selectedSnbItem.items[menuIndex];
            breadcrumbNavigationItems.push(selectedSubItem.title);
          }
        });
        return {
          ...state,
          breadcrumbNavigationItems: breadcrumbNavigationItems,
          navigationState: {
            ...state.navigationState,
            snbMenuSelectedKeys: [action.key],
          }
        };
      } else {
        return {
          ...state,
          navigationState: {
            ...state.navigationState,
            snbMenuSelectedKeys: [action.key],
          }
        };
      }
    case 'CLICK_SUB_MENU':
      return {
        ...state,
        navigationState: {
          ...state.navigationState,
          snbMenuOpenKeys: [action.key],
        }
      };
    case 'REFRESH_ALL_GNB_ITEMS':
      return {
        ...state,
        allGnbItems: NavigationConfig.getItems(),
      };
    case 'SHOW_LOADING':
      return {
        ...state,
        loading: action.loading,
      };
    case 'TOGGLE_COLLAPSED':
      if (action.collapsed) {
        return {
          ...state,
          navigationState: {
            ...state.navigationState,
            snbMenuOpenKeys: state.navigationState.snbMenuOpenKeys.map(key => OPEN_KEY_NONE_CHAR + key),
          },
          collapsed: !action.collapsed
        }
      } else {
        return {
          ...state,
          navigationState: {
            ...state.navigationState,
            snbMenuOpenKeys: state.navigationState.snbMenuOpenKeys.map(key => key.startsWith(OPEN_KEY_NONE_CHAR) ? key.split(OPEN_KEY_NONE_CHAR)[1] : key),
          },
          collapsed: !action.collapsed
        }
      }
    default:
      return state;
  }
}

const AppLayout = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {collapsed, allGnbItems, gnbItem, breadcrumbItems, navigationState, loading} = state;

  useEffect(() => {
    const pathname = props.location.pathname;
    dispatch({
      type: 'INIT_NAVIGATION', pathname
    });
  }, [
    props.location.pathname,
    allGnbItems,
  ]);

  useEffect(() => {
    EventBroadcaster.on(CHANGE_MEMBER_CONTEXT_EVENT_TOPIC, () => {
      dispatch({
        type: 'REFRESH_ALL_GNB_ITEMS'
      });
    });

    EventBroadcaster.on(SHOW_LOADING_EVENT_TOPIC, (data) => {
      const show = data.show;
      dispatch({
        type: 'SHOW_LOADING', show
      });
    });
  }, []);

  const handleGnbMenuClick = ({key}) => {
    dispatch({
      type: 'CLICK_GNB_MENU', key
    });
  };

  const handleSnbMenuClick = ({key}) => {
    dispatch({
      type: 'CLICK_SNB_MENU', key
    });
  };

  const toggleCollapsed = () => {
    dispatch({
      type: 'TOGGLE_COLLAPSED', collapsed
    });
  };

  const handleSubMenuClick = ({key}) => {
    dispatch({
      type: 'CLICK_SUB_MENU', key
    });
  }

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
                <Menu.SubMenu key={index} title={item.title} icon={<SnbIcon/>} onTitleClick={handleSubMenuClick}>
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
