import React, {useEffect, useState} from 'react';
import {Layout, Menu, Modal} from 'antd';
import {MonitorOutlined} from "@ant-design/icons";
import "./Monitoring.css";
import themeConfig from "../../config/theme.config.json";
import classNames from "classnames";
import {MonitoringNavigation} from "./monitoring.navigation.config";

const {Content, Sider} = Layout;

const DEFAULT_OPEN_KEY = "0";

export const Monitoring = ({onClose}) => {
  const [selectedKey, setSelectedKey] = useState("0");

  useEffect(() => {
    let defaultSelectedKey = "0";
    const items = MonitoringNavigation.getItems();
    if (items && items.length > 0) {
      if (items[0].items && items.length > 0) {
        defaultSelectedKey += "-0";
      }
    }
    setSelectedKey(defaultSelectedKey);
  }, []);

  const handleMenuClick = ({key}) => {
    setSelectedKey(key);
  };

  const getSettingContent = (key) => {
    const indices = key.split("-");
    if (indices.length === 1) {
      return MonitoringNavigation.getItems()[indices[0]].component;
    } else if (indices.length === 2) {
      return MonitoringNavigation.getItems()[indices[0]].items[indices[1]].component;
    } else {
      return <div></div>;
    }
  }

  return (
    <>
      <Modal title={[<div key={1}><MonitorOutlined/> 사이트 모니터링</div>]} visible={true}
             onCancel={onClose} footer={null} width={1200} bodyStyle={{margin: 0, padding: 0}}>
        <Layout
          style={{
            minHeight: "100%"
          }}>
          <Sider className={classNames('settings-sider', {dark: themeConfig.dark})}>
            <Menu mode="inline" onClick={handleMenuClick} defaultSelectedKeys={[selectedKey]}
                  defaultOpenKeys={[DEFAULT_OPEN_KEY]}>
              {MonitoringNavigation.getItems() &&
                MonitoringNavigation.getItems().map((item, index) => {
                  if (item.items && item.items.length > 0) {
                    return (
                      <Menu.SubMenu key={index} title={item.title}>
                        {item.items.map((subItem, subItemIndex) => {
                          return (
                            <Menu.Item key={index + "-" + subItemIndex}>
                              {subItem.title}
                            </Menu.Item>
                          )
                        })}
                      </Menu.SubMenu>);
                  } else {
                    return (
                      <Menu.Item key={index} title={item.title}>
                        <span>{item.title}</span>
                      </Menu.Item>);
                  }
                })}
            </Menu>
          </Sider>
          <Layout>
            <Content className={classNames('settings-content', {dark: themeConfig.dark})}>
              <div>
                {getSettingContent(selectedKey)}
              </div>
            </Content>
          </Layout>
        </Layout>
      </Modal>
    </>
  );
};
