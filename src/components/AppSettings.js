import React from 'react';
import {Layout, Menu, Modal} from 'antd';
import DooraySetting from "./settings/DooraySetting";
import {SettingOutlined} from "@ant-design/icons";
import "./AppSettings.css";

const {Content, Sider} = Layout;

export const AppSettings = ({onClose}) => {
  return (
    <>
      <Modal title={[<div key={1}><SettingOutlined/> 설정</div>]} visible={true}
             onCancel={onClose} footer={null} width={1000}
             bodyStyle={{margin: 0, padding: 0}}>
        <Layout>
          <Sider className="settings-sider">
            <Menu mode="inline" defaultSelectedKeys={['1']}>
              <Menu.Item key="1">
                <span>Dooray 로그인</span>
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout>
            <Content className="settings-content">
              <div>
                <DooraySetting/>
              </div>
            </Content>
          </Layout>
        </Layout>
      </Modal>
    </>
  );
};
