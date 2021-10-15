import React, {useEffect, useState} from "react";
import {Button, Form, Input, message} from 'antd';
import {LockOutlined, UserOutlined} from '@ant-design/icons';
import "./Login.css";
import Title from "antd/es/typography/Title";
import {adminConfig} from "../../config/admin.config";
import SiteService from "../settings/site.service";
import DoorayLogin from "./DoorayLogin";
import {AuthService} from "../../auth/auth.service";
import MemberSignUp from "./MemberSignUp";
import * as queryString from "query-string";

const Login = (props) => {
  const [siteSettings, setSiteSettings] = useState({});
  const [showDoorayLogin, setShowDoorayLogin] = useState(false);
  const [showMemberSignUp, setShowMemberSignUp] = useState(false);
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
      goToNextPage();
    }).catch(error => {
      setLoading(false);
      if (error.response && error.response.status === 400) {
        message.warn("아이디 혹시 비밀번호를 확인해 주세요.")
      } else if (error.response && error.response.status === 406) {
        message.warn("신청한 계정은 아직 미승인 상태 입니다. 관리자에게 문의하세요.")
      }
    });
  };

  const handleDoorayLoginSuccess = () => {
    goToNextPage();
  }

  const goToNextPage = () => {
    const query = queryString.parse(props.location.search);
    if (query.returnUrl) {
      window.location.href = query.returnUrl;
      window.location.reload();
    } else {
      window.location = adminConfig.homePage;
    }
  }

  const handleGoogleLoginClick = () => {
    let returnUrl = adminConfig.homePage;
    const query = queryString.parse(props.location.search);
    if (query.returnUrl) {
      returnUrl = query.returnUrl.split("#")[1];
    }

    const googleOAuthRedirectLoginUrl = window.location.origin + "/#" + adminConfig.authentication.oauthLoginResultUrl + "?returnUrl=" + returnUrl
    window.location.href = siteSettings.googleWorkspaceOAuthUri + "&state=" + encodeURIComponent(googleOAuthRedirectLoginUrl)
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
              message: '아이디를 입력해 주세요.',
            },
          ]}
        >
          <Input prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="아이디"/>
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
            placeholder="비밀번호"
          />
        </Form.Item>
        <Form.Item>
          <a className="login-form-forgot" href="/#/forgot-password">
            Forgot password
          </a>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button" loading={loading}>
            로그인
          </Button>
          아직 계정이 없으신가요? <Button type="link" onClick={() => {
          setShowMemberSignUp(true)
        }}>신청하기</Button>
        </Form.Item>
      </Form>
      {(siteSettings.doorayLoginUsed || siteSettings.googleWorkspaceLoginUsed) &&
      <div style={{padding: "15px", border: "1px solid #bcbcbc", borderRadius: "5px"}}>
        <Title level={5}>다른 수단으로 로그인하기</Title>
        {siteSettings.doorayLoginUsed &&
        <img src="/dooray-logo.svg" alt="dooray logo" width={100}
             style={{padding: "10px", borderRadius: "2px", cursor: "pointer", boxShadow: "1px 1px 1px 2px #E1E1E1"}}
             onClick={() => {
               setShowDoorayLogin(true)
             }}/>}
        {siteSettings.googleWorkspaceLoginUsed &&
        <img src="/google-workspace-logo.png" alt="google logo" width={150}
             style={{marginLeft: "10px", padding: "10px", borderRadius: "2px", cursor: "pointer", boxShadow: "1px 1px 1px 2px #E1E1E1"}}
             onClick={handleGoogleLoginClick}/>}
      </div>
      }
      <DoorayLogin show={showDoorayLogin} onLoginSuccess={handleDoorayLoginSuccess} onClose={() => {
        setShowDoorayLogin(false)
      }}/>
      <MemberSignUp show={showMemberSignUp} onClose={() => {
        setShowMemberSignUp(false)
      }}/>
    </div>
  );
};

export default Login;
