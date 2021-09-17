import React, {useEffect, useReducer} from "react";
import {Breadcrumb, Layout, Menu, Spin, Tabs} from "antd";
import "./AppLayout.css";
import PageRouter from "../pages/router/PageRouter";
import {adminConfig} from "../config/admin.config";
import * as AllIcons from "@ant-design/icons";
import LoginInfo from "./LoginInfo";
import {Link, useHistory} from "react-router-dom";
import NavigationConfig from "../config/navigation.config";
import {
  CHANGE_MEMBER_CONTEXT_EVENT_TOPIC,
  EventBroadcaster,
  SHOW_LOADING_EVENT_TOPIC
} from "../event/event.broadcaster";

const {TabPane} = Tabs;

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
  pageHistory: {
    current: "",
    histories: [],
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
          },
          collapsed: !action.collapsed
        }
      } else {
        return {
          ...state,
          navigationState: {
            ...state.navigationState,
          },
          collapsed: !action.collapsed
        }
      }
    case 'ADD_TAB_PAGE':
      const currentItem = NavigationConfig.getItemsByLink(action.pathname, NavigationConfig.getItems());
      let title = "";
      if (currentItem.snbItem) {
        title = currentItem.snbItem.title;
      }

      if (currentItem.subItem) {
        title = currentItem.subItem.title;
      }

      const page = {
        pathname: action.pathname,
        title: title,
      }

      if (state.pageHistory.histories.filter(page => page.pathname === action.pathname).length === 0) {
        return {
          ...state,
          pageHistory: {
            current: page,
            histories: state.pageHistory.histories.concat(page)
          },
        }
      } else {
        return {
          ...state,
          pageHistory: {
            ...state.pageHistory,
            current: page,
          },
        };
      }
    case 'REMOVE_TAB_PAGE':
      const newHistories = state.pageHistory.histories.filter(history => history.pathname !== action.pathname);
      if(action.currentPage) {
        return {
          ...state,
          pageHistory: {
            current: action.currentPage,
            histories: newHistories,
          },
        }
      } else {
        return {
          ...state,
          pageHistory: {
            ...state.pageHistory,
            histories: newHistories,
          },
        }
      }


    default:
      return state;
  }
}

const AppLayout = (props) => {
  const history = useHistory();
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    collapsed,
    allGnbItems,
    gnbItem,
    breadcrumbItems,
    navigationState,
    pageHistory,
    loading
  } = state;

  useEffect(() => {
    const pathname = props.location.pathname;
    dispatch({
      type: 'INIT_NAVIGATION', pathname
    });

    dispatch({
      type: 'ADD_TAB_PAGE', pathname
    });

    const unlisten = history.listen((location) => {
      const pathname = location.pathname;
      dispatch({
        type: 'ADD_TAB_PAGE', pathname
      });
    });
    return unlisten;
  }, [
    props.location.pathname,
    allGnbItems,
    history,
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

  const handlePageHistoryTabClick = (pathname) => {
    if (pathname !== pageHistory.current.pathname) {
      history.push(pathname);
    }
  }

  const handlePageHistoryTabEdit = (key, action) => {
    if (action === "remove" && pageHistory.histories.length > 1) {
      const pathname = key;
      if(props.location.pathname === pathname) {
        const newHistories = pageHistory.histories.filter(history => history.pathname !== pathname);
        const currentPage = newHistories.slice(-1)[0];
        history.push(currentPage.pathname);
        dispatch({
          type: 'REMOVE_TAB_PAGE', pathname, currentPage
        });
      } else {
        dispatch({
          type: 'REMOVE_TAB_PAGE', pathname
        });
      }
    }
  }

  return (
    <Layout
      style={{
        minHeight: "100%"
      }}
    >
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
              openKeys={collapsed ? undefined : navigationState.snbMenuOpenKeys}
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
          <div className="login-info">
            <LoginInfo/>
          </div>
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
        </Layout.Header>
        <Layout.Content className="site-layout-content">
          <Tabs hideAdd type="editable-card" activeKey={pageHistory.current.pathname}
                onTabClick={handlePageHistoryTabClick} onEdit={handlePageHistoryTabEdit}>
            {pageHistory.histories && pageHistory.histories.map(page =>
              <TabPane tab={page.title} key={page.pathname}>
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
                    <PageRouter/>
                  </Spin>
                </div>
              </TabPane>
            )}
          </Tabs>
        </Layout.Content>
        <Layout.Footer style={{textAlign: "center"}}>
          better ADMIN ©2021 Created by bettercode
        </Layout.Footer>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
