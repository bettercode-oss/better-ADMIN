import React, {useEffect, useState} from 'react';
import {Route, useHistory} from 'react-router-dom';
import {adminConfig} from "../../config/admin.config";
import {AuthService} from "../../auth/auth.service";
import {
  CHANGE_MEMBER_CONTEXT_EVENT_TOPIC,
  EventBroadcaster,
  MEMBER_CONTEXT_AVAILABLE_EVENT_TOPIC
} from "../../event/event.broadcaster";

export default function AuthRoute({path, exact = false, component}) {
  const [authenticated, setAuthenticated] = useState(false);
  const history = useHistory();
  const [memberContextAvailable, setMemberContextAvailable] = useState(false);

  const checkAuth = () => {
    AuthService.checkAuth().then(() => {
      setAuthenticated(true);
    }).catch(() => {
      const loginUrl = adminConfig.authentication.loginUrl;
      if(window.location.href.endsWith(loginUrl)) {
        history.replace(adminConfig.authentication.loginUrl);
      } else {
        history.replace(loginUrl + "?returnUrl=" + encodeURIComponent(window.location.href));
      }
    })
  };

  useEffect(() => {
    checkAuth();

    EventBroadcaster.on(MEMBER_CONTEXT_AVAILABLE_EVENT_TOPIC, (memberInformation) => {
      setMemberContextAvailable(true);
      EventBroadcaster.broadcast(
        CHANGE_MEMBER_CONTEXT_EVENT_TOPIC,
        memberInformation
      );
    });
  });

  return <Route exact={exact} path={path} component={(authenticated && memberContextAvailable) && component}/>;
}
