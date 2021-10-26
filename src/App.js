import React, {useEffect} from "react";
import {HashRouter, Route, Switch} from "react-router-dom";
import './App.less';
import AppLayout from "./components/layout/AppLayout";
import Login from "./components/login/Login";
import AuthRoute from "./components/router/AuthRoute";
import {adminConfig} from "./config/admin.config";
import {AuthService} from "./auth/auth.service";
import {Modal, notification} from "antd";
import {
  EventBroadcaster,
  SHOW_ERROR_MESSAGE_EVENT_TOPIC,
  SHOW_WEB_HOOK_MESSAGE_EVENT_TOPIC
} from "./event/event.broadcaster";
import {ExclamationCircleOutlined, NotificationTwoTone} from "@ant-design/icons";
import {LayoutProvider} from "./components/layout/AppLayoutContext";
import OAuthLoginResult from "./components/login/OAuthLoginResult";

const App = () => {
  useEffect(() => {
    if (adminConfig.authentication.used) {
      AuthService.silentRefresh().then().catch(() => {
        const queryString = getQueryStringInUrl(window.location.href)
        if (queryString) {
          window.location.hash = adminConfig.authentication.loginUrl + "?" + queryString;
        } else {
          window.location.hash = adminConfig.authentication.loginUrl;
        }
      });
    }

    EventBroadcaster.on(SHOW_ERROR_MESSAGE_EVENT_TOPIC, (msg) => {
      Modal.confirm({
        icon: <ExclamationCircleOutlined/>,
        content: msg,
        okText: '확인',
        cancelText: null,
        cancelButtonProps: {style: {display: 'none'}},
      });
    });

    EventBroadcaster.on(SHOW_WEB_HOOK_MESSAGE_EVENT_TOPIC, (msg) => {
      notification.open({
        message: msg.title,
        description: msg.text,
        icon: <NotificationTwoTone />,
      });
    });
  },);

  const existQueryStringInUrl = (url) => {
    return url.split("?")[1] ? true : false;
  }

  const getQueryStringInUrl = (url) => {
    if (existQueryStringInUrl(url)) {
      return url.split("?")[1];
    } else {
      return null;
    }
  }

  return (<>
    <LayoutProvider>
      <HashRouter>
        <Switch>
          <Route path={adminConfig.authentication.loginUrl} component={Login}/>
          <Route path={adminConfig.authentication.oauthLoginResultUrl} component={OAuthLoginResult}/>
          {adminConfig.authentication.used ? (
            <AuthRoute path={'/'} component={AppLayout}/>
          ) : (
            <Route path={'/'} component={AppLayout}/>
          )}
        </Switch>
      </HashRouter>
    </LayoutProvider>
  </>)
};

export default App;
