import React from "react";
import {Button, Checkbox, Form, Input, message} from 'antd';
import {LockOutlined, UserOutlined} from '@ant-design/icons';
import "./Login.css";
import Title from "antd/es/typography/Title";
import {config} from "../config/config";
import Cookies from "universal-cookie";
import AuthService from "../auth/auth.service";
import {useHistory} from "react-router-dom";

const cookies = new Cookies();

const Login = () => {
  const history = useHistory();

  const onFinish = (values) => {
    const signId = values.id;
    const password = values.password;

    AuthService.login(signId, password).then(response => {
      cookies.set('token', JSON.stringify(response.data), {domain: "localhost", path: '/', maxAge: 86400});
      history.replace('/');
    }).catch(error => {
      if (error.response && error.response.status === 400) {
        message.warn("아이디 혹시 비밀번호를 확인해 주세요.")
      }
    });
  };

  return (
    <div className="login">
      <Title level={2}>
        <img className="logo" src={config.logo} alt="logo"/>
        {config.siteName}
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
              message: 'Please input your Username!',
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
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>
          <a className="login-form-forgot" href="/#/forgot-password">
            Forgot password
          </a>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button">
            Log in
          </Button>
          Or <a href="/#/sign-up">register now!</a>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
