import React, {useEffect, useState} from "react";
import {Button, Form, Input, message} from 'antd';
import {LockOutlined, UserOutlined} from '@ant-design/icons';
import "./Login.css";
import Title from "antd/es/typography/Title";
import {adminConfig} from "../config/admin.config";
import {useHistory} from "react-router-dom";
import SiteService from "./settings/site.service";
import DoorayLogin from "./DoorayLogin";
import {AuthService} from "../auth/auth.service";

const Login = () => {
  const history = useHistory();
  const [siteSettings, setSiteSettings] = useState({});
  const [showDoorayLogin, setShowDoorayLogin] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    SiteService.getSettings().then(response => {
      setSiteSettings(response.data);
    }).catch(error => {
      console.log(error);
    });
  }, []);

  const onFinish = (values) => {
    const signId = values.id;
    const password = values.password;

    setLoading(true);
    AuthService.login(signId, password).then(() => {
      setLoading(false);
      history.replace('/');
    }).catch(error => {
      setLoading(false);
      if (error.response && error.response.status === 400) {
        message.warn("아이디 혹시 비밀번호를 확인해 주세요.")
      }
    });
  };

  const handleDoorayLoginSuccess = () => {
    history.replace('/');
  }

  return (
    <div className="login">
      <Title level={2}>
        <img className="logo" src={adminConfig.logo} alt="logo"/>
        {adminConfig.siteName}
      </Title>

      <Form
        name="normal_login"
        className="login-form"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
      >
        <Form.Item
          name="id"
          rules={[
            {
              required: true,
              message: 'Please input your ID!',
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
              message: 'Please input your Password!',
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
          <a className="login-form-forgot" href="/#/forgot-password">
            Forgot password
          </a>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button" loading={loading}>
            Log in
          </Button>
          Don't have an account yet? <a href="/#/sign-up">register now!</a>
        </Form.Item>
      </Form>
      {siteSettings.doorayLoginUsed &&
      <div style={{padding: "15px", border: "1px solid #bcbcbc", borderRadius: "5px"}}>
        <Title level={5}>Sign in with</Title>
        <img src="/dooray-logo.svg" alt="dooray logo" width={100}
             style={{padding: "10px", border: "1px solid #bcbcbc", borderRadius: "5px", cursor: "pointer"}}
             onClick={() => {setShowDoorayLogin(true)}}/>
      </div>}
      <DoorayLogin show={showDoorayLogin} onLoginSuccess={handleDoorayLoginSuccess} onClose={() => {setShowDoorayLogin(false)}}/>
    </div>
  );
};

export default Login;
