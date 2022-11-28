import React, {useEffect, useState} from "react";
import {message} from 'antd';
import {LockOutlined, UserOutlined} from '@ant-design/icons';
import {useNavigate, useSearchParams} from "react-router-dom";
import SiteService from "../../settings/site.service";
import {AuthService} from "../../../auth/auth.service";
import {EventBroadcaster, SHOW_ERROR_MESSAGE_EVENT_TOPIC} from "../../../event/event.broadcaster";
import {adminConfig} from "../../../config/admin.config";
import {Title} from "../../atoms/typography/title";
import DoorayLogin from "../../login/DoorayLogin";
import MemberSignUp from "../../login/MemberSignUp";
import {TextInput} from "../../atoms/text-input";
import {Button} from "../../atoms/button";
import {Text} from "../../atoms/typography/text";
import {Card} from "../../atoms/card";
import {Image} from "../../atoms/image";
import {Form} from "../../atoms/form";
import {FormItem} from "../../atoms/form/form-item";
import styled from "styled-components";

const LoginWrapper = styled.div`
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  display: inline-block;
`
const SiteLogo = styled.span`
  margin-right: 10px;
`;

const Login = () => {
  const [siteSettings, setSiteSettings] = useState({});
  const [showDoorayLogin, setShowDoorayLogin] = useState(false);
  const [showMemberSignUp, setShowMemberSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  let navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    SiteService.getSettings().then(response => {
      setSiteSettings(response.data);
    }).catch(error => {
      console.log(error);
    });
    return () => setSiteSettings(null);
  }, []);

  const onFinish = (values) => {
    const signId = values.id;
    const password = values.password;

    setLoading(true);
    AuthService.login(signId, password).then(() => {
      goToNextPage();
    }).catch(error => {
      if (error.response && error.response.status === 400) {
        message.warn("아이디 혹은 비밀번호를 확인해 주세요.")
      } else if (error.response && error.response.status === 406) {
        message.warn("신청한 계정은 아직 미승인 상태 입니다. 관리자에게 문의하세요.")
      } else {
        EventBroadcaster.broadcast(SHOW_ERROR_MESSAGE_EVENT_TOPIC, adminConfig.errorMessage.serverInternalError);
      }
    }).finally(() => {
      setLoading(false);
    });
  };

  const handleDoorayLoginSuccess = () => {
    goToNextPage();
  }

  const goToNextPage = () => {
    if (searchParams.get('returnUrl')) {
      window.location.href = searchParams.get('returnUrl');
    } else {
      navigate("/");
    }
  }

  const handleGoogleLoginClick = () => {
    let returnUrl = adminConfig.homePage;
    if (searchParams.get('returnUrl')) {
      returnUrl = searchParams.get('returnUrl').replace(window.location.origin, '');
    }
    const googleOAuthRedirectLoginUrl = window.location.origin + adminConfig.authentication.oauthLoginResultUrl + "?returnUrl=" + returnUrl;
    window.location.href = siteSettings.googleWorkspaceOAuthUri + "&state=" + encodeURIComponent(googleOAuthRedirectLoginUrl);
  }

  return (
    <LoginWrapper>
      <Title level={2}>
        <SiteLogo>
          <Image src={adminConfig.logo} alt="site-logo" width={30} borderRadius="20%"/>
        </SiteLogo>
        {adminConfig.siteName}
      </Title>
      <Form onFinish={onFinish}>
        <FormItem
          name="id"
          rules={[
            {
              required: true,
              message: '아이디를 입력해 주세요.',
            },
          ]}
        >
          <TextInput prefix={<UserOutlined/>} placeholder="아이디"/>
        </FormItem>
        <FormItem
          name="password"
          rules={[
            {
              required: true,
              message: '비밀번호를 입력해 주세요.',
            },
          ]}
        >
          <TextInput
            prefix={<LockOutlined/>}
            type="password"
            placeholder="비밀번호"
          />
        </FormItem>
        <FormItem>
          <Button label="로그인" type="primary" htmlType="submit" block={true} loading={loading}/>
          <Text>아직 계정이 없으신가요?</Text>
          <Button label="신청하기" type="link" onClick={() => { setShowMemberSignUp(true) }}/>
        </FormItem>
      </Form>
      {(siteSettings && (siteSettings.doorayLoginUsed || siteSettings.googleWorkspaceLoginUsed)) &&
        <Card>
          <Title level={5}>다른 수단으로 로그인하기</Title>
          {siteSettings.doorayLoginUsed &&
            <Image alt="dooray logo" src='/dooray-logo.svg' width={100} onClick={() => {
              setShowDoorayLogin(true)
            }}/>}
          {siteSettings.googleWorkspaceLoginUsed &&
            <Image src="/google-workspace-logo.png" alt="google logo" width={150} onClick={handleGoogleLoginClick}/>
          }
        </Card>
      }
      <DoorayLogin show={showDoorayLogin} onLoginSuccess={handleDoorayLoginSuccess} onClose={() => {
        setShowDoorayLogin(false)
      }}/>
      <MemberSignUp show={showMemberSignUp} onClose={() => {
        setShowMemberSignUp(false)
      }}/>
    </LoginWrapper>
  );
};

export default Login;
