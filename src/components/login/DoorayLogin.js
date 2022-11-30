import React, {useState} from "react";
import {Button, Form, Input, message, Modal} from "antd";
import {LockOutlined, UserOutlined} from "@ant-design/icons";
import {AuthService} from "../../auth/auth.service";
import {EventBroadcaster, SHOW_ERROR_MESSAGE_EVENT_TOPIC} from "../../event/event.broadcaster";
import {adminConfig} from "../../config/admin.config";

const DoorayLogin = ({show, onLoginSuccess, onClose}) => {
  const [loading, setLoading] = useState(false);
  const loginWithDooray = (values) => {
    const signId = values.id;
    const password = values.password;

    setLoading(true);
    AuthService.loginWithDooray(signId, password).then(() => {
      onLoginSuccess();
    }).catch(error => {
      if (error.response && error.response.status === 400) {
        message.warn("아이디 혹은 비밀번호를 확인해 주세요.")
      } else {
        EventBroadcaster.broadcast(SHOW_ERROR_MESSAGE_EVENT_TOPIC, adminConfig.errorMessage.serverInternalError);
      }
    }).finally(() => {
      setLoading(false);
    });
  }

  return (
    <>
      <Modal title={[<div key={1}><img src="/dooray-logo.svg" alt="dooray logo" width={100}/></div>]} open={show}
             onCancel={onClose} footer={null} width={400}>
        <Form
          onFinish={loginWithDooray}
        >
          <Form.Item
            name="id"
            rules={[
              {
                required: true,
                message: '아이디를 입력해 주세요.',
              },
            ]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="ID"/>
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: '비밀번호를 입력해 주세요.',
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon"/>}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button" loading={loading}>
              Dooray Log in
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
export default DoorayLogin;
