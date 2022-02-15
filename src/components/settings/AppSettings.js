import React, {useEffect, useState} from 'react';
import {Layout, Menu, Modal} from 'antd';
import {SettingOutlined} from "@ant-design/icons";
import "./AppSettings.css";
import {AppSettingsNavigation} from "./app.settings.navigation.config";
import themeConfig from "../../config/theme.config.json";
import classNames from "classnames";

const {Content, Sider} = Layout;

export const CREATE_MODE = "CREATE";
export const EDIT_MODE = "EDIT";
export const VIEW_MODE = "VIEW";
export const VIEW_DETAILS_MODE = "VIEW_DETAILS";

export const FormItemLayout = {
  labelCol: {
    xs: {span: 24},
    sm: {span: 7},
  },
  wrapperCol: {
    xs: {span: 24},
    sm: {span: 12},
    md: {span: 12},
  },
};

export const FormTailItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 10,
      offset: 7,
    }
  },
};


const DEFAULT_OPEN_KEY = "0";

export const AppSettings = ({onClose}) => {
  const [selectedKey, setSelectedKey] = useState("0");

  useEffect(() => {
    let defaultSelectedKey = "0";
    const items = AppSettingsNavigation.getItems();
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
      return AppSettingsNavigation.getItems()[indices[0]].component;
    } else if (indices.length === 2) {
      return AppSettingsNavigation.getItems()[indices[0]].items[indices[1]].component;
    } else {
      return <div></div>;
    }
  }

  return (
    <>
      <Modal title={[<div key={1}><SettingOutlined/> 사이트 설정</div>]} visible={true}
             onCancel={onClose} footer={null} width={1200} bodyStyle={{margin: 0, padding: 0}}>
        <Layout
          style={{
            minHeight: "100%"
          }}>
          <Sider className={classNames('settings-sider', {dark: themeConfig.dark})}>
            <Menu mode="inline" onClick={handleMenuClick} defaultSelectedKeys={[selectedKey]}
                  defaultOpenKeys={[DEFAULT_OPEN_KEY]}>
              {AppSettingsNavigation.getItems() &&
              AppSettingsNavigation.getItems().map((item, index) => {
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
