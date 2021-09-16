import React, {useEffect, useState} from 'react';
import {Route, useHistory} from 'react-router-dom';
import {adminConfig} from "../../config/admin.config";
import {AuthService} from "../../auth/auth.service";

export default function AuthRoute({path, exact = false, component}) {
  const [authenticated, setAuthenticated] = useState(false);
  const history = useHistory();

  const checkAuth = () => {
    AuthService.checkAuth().then(() => {
      setAuthenticated(true);
    }).catch(() => {
      history.replace(adminConfig.authentication.loginUrl + "?returnUrl=" + encodeURIComponent(window.location.href));
    })
  };

  useEffect(() => {
    checkAuth();
  });

  return <Route exact={exact} path={path} component={authenticated && component}/>;
}
