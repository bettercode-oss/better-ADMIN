import React, {useEffect, useMemo, useState} from 'react';
import {Breadcrumb, Layout, Menu, Space} from 'antd';
import './AppLayout.css';
import PageRouting from "./PageRouting";
import {config} from "../config/config";
import * as AllIcons from "@ant-design/icons";
import LoginInfo from "./LoginInfo";
import {Link} from "react-router-dom";
import NavigationConfig from "../config/NavigationConfig";

const AppLayout = (props) => {
  const [collapsed, setCollapsed] = useState(false);
  const [gnbItem, setGnbItem] = useState(null);
  const [breadcrumbItems, setBreadcrumbItems] = useState([]);
  let defaultNavigationItem = {};

  useMemo(() => {
    // componentWillMount events
    defaultNavigationItem = NavigationConfig.getItemsByLink(props.location.pathname);
  }, []);

  useEffect(() => {
    if (defaultNavigationItem.gnbItem) {
      const gnbNavigationItem = NavigationConfig.getItems()[defaultNavigationItem.gnbItem.index]
      setGnbItem(gnbNavigationItem);


      const breadcrumbNavigationItems = []
      breadcrumbNavigationItems.push(defaultNavigationItem.gnbItem.title);

      if(defaultNavigationItem.snbItem) {
        breadcrumbNavigationItems.push(defaultNavigationItem.snbItem.title);
      }

      if(defaultNavigationItem.subItem) {
        breadcrumbNavigationItems.push(defaultNavigationItem.subItem.title);
      }

      setBreadcrumbItems(breadcrumbNavigationItems);
    }
  }, []);

  const handleGnbMenuClick = ({item, key, keyPath, domEvent}) => {
    const gnbIndex = key;
    setGnbItem(NavigationConfig.getItems()[gnbIndex]);
  };

  const handleSnbMenuClick = ({item, key, keyPath, domEvent}) => {
    const selectedMenuIndices = key.split("-");
    if (selectedMenuIndices && gnbItem) {
      const breadcrumbNavigationItems = []
      breadcrumbNavigationItems.push(gnbItem.title);
      let selectedSnbItem = {};

      selectedMenuIndices.map((menuIndex, arrayIndex) => {
        if(arrayIndex == 0) {
          selectedSnbItem = gnbItem.items[menuIndex];
          breadcrumbNavigationItems.push(selectedSnbItem.title);
        } else if(arrayIndex == 1) {
          const selectedSubItem = selectedSnbItem.items[menuIndex];
          breadcrumbNavigationItems.push(selectedSubItem.title);
        }
      });

      setBreadcrumbItems(breadcrumbNavigationItems);
    }
  };

  const toggleCollapsed = () => {
    setCollapsed(!collapsed)
  };

  const getSnbMenuDefaultOpenKeys = () => {
    return defaultNavigationItem.snbItem ? [defaultNavigationItem.snbItem.index] : [""];
  }

  const getSnbMenuDefaultSelectedKeys = () => {
    if (defaultNavigationItem.subItem) {
      return defaultNavigationItem.snbItem ? [defaultNavigationItem.snbItem.index + "-" + defaultNavigationItem.subItem.index] : [""];
    } else {
      return defaultNavigationItem.snbItem ? [defaultNavigationItem.snbItem.index] : [""];
    }
  }

  const getGnbMenuDefaultSelectedKeys = () => {
    return defaultNavigationItem.gnbItem ? [defaultNavigationItem.gnbItem.index] : [""];
  }

  return (
    <Layout style={{
      height: "100%",
      overflow: "hidden",
    }}>
      <Layout.Sider width={200} style={{background: '#041527'}} trigger={null} collapsible collapsed={collapsed}>
        <div style={{color: 'white', margin: "5px", marginLeft: "5px", marginTop: "20px", marginBottom: "20px"}}>
          <img alt="logo" src={config.logo} width="30px" style={{borderRadius: "50%", marginLeft: "20px"}}/>
          {collapsed === false && <strong>&nbsp; {config.siteName}</strong>}
        </div>
        <Menu theme="dark" mode="inline" defaultOpenKeys={getSnbMenuDefaultOpenKeys()}
              defaultSelectedKeys={getSnbMenuDefaultSelectedKeys()} onClick={handleSnbMenuClick}>
          {gnbItem && gnbItem.items && gnbItem.items.map((item, index) => {
            const SnbIcon = AllIcons[item.icon];
            if (item.items && item.items.length > 0) {
              return (
                <Menu.SubMenu key={index} title={item.title} icon={<SnbIcon/>}>
                  {item.items.map((subItem, subItemIndex) => {
                    const SubItemIcon = AllIcons[subItem.icon];
                    return (
                      subItem.link ?
                        <Menu.Item key={index + "-" + subItemIndex} icon={<SubItemIcon/>} title={subItem.title}>
                          <Link to={subItem.link}><span>{subItem.title}</span></Link>
                        </Menu.Item> :
                        <Menu.Item key={index + "-" + subItemIndex} icon={<SubItemIcon/>}>{subItem.title}</Menu.Item>
                    );
                  })}
                </Menu.SubMenu>
              );
            } else {
              return (
                <Menu.Item key={index} icon={<SnbIcon/>} title={item.title}>
                  {
                    item.link ?
                      <Link to={item.link}><span>{item.title}</span></Link> :
                      <span>{item.title}</span>
                  }
                </Menu.Item>
              )
            }
          })}
        </Menu>
      </Layout.Sider>
      <Layout className="site-layout">
        <Layout.Header className="site-layout-background" style={{padding: 0}}>
          <Space>
            {React.createElement(collapsed ? AllIcons.MenuUnfoldOutlined : AllIcons.MenuFoldOutlined, {
              className: 'trigger',
              onClick: toggleCollapsed,
            })}
            <Menu mode="horizontal" defaultSelectedKeys={getGnbMenuDefaultSelectedKeys()} onClick={handleGnbMenuClick}>
              {
                NavigationConfig.getItems().map((item, idx) => {
                  const GnbIcon = AllIcons[item.icon];
                  return <Menu.Item key={idx} icon={<GnbIcon/>}>{item.title}</Menu.Item>
                })
              }
            </Menu>
          </Space>
          <div style={{float: "right", marginRight: "10px"}}>
            <LoginInfo/>
          </div>
        </Layout.Header>
        <Layout.Content
          className="site-layout-background"
          style={{
            margin: '24px 16px',
            padding: 24,
          }}
        >
          <div style={{"backgroundColor": "white", padding: "15px"}}>
            <Breadcrumb>
              {
                breadcrumbItems.map((item, index) => (
                  <Breadcrumb.Item key={index}>
                    <a>{item}</a>
                  </Breadcrumb.Item>
                ))
              }
            </Breadcrumb>
            <div className="page-title" style={{padding: 0}}>
              {breadcrumbItems && breadcrumbItems.length > 0 && breadcrumbItems[breadcrumbItems.length - 1]}
            </div>
          </div>
          <div className="site-layout-background" style={{padding: 24}}>
            <PageRouting/>
          </div>
        </Layout.Content>
        <Layout.Footer style={{textAlign: 'center'}}>> better ADMIN ©2021 Created by bettercode</Layout.Footer>
      </Layout>
    </Layout>
  );
}

export default AppLayout;
