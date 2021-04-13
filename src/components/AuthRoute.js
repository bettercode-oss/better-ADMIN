import React, {useEffect, useState} from 'react';
import {Route, useHistory} from 'react-router-dom';
import AuthService from "../auth/auth.service";
import {adminConfig} from "../config/admin.config";

export default function AuthRoute({path, exact = false, component}) {
  const [authenticated, setAuthenticated] = useState(false);
  const history = useHistory();

  const checkAuth = () => {
    AuthService.checkAuth().then(() => {
      setAuthenticated(true);
    }).catch(() => {
      history.replace(adminConfig.authentication.loginUrl);
    })
  };

  useEffect(() => {
    checkAuth();
  });

  return <Route exact={exact} path={path} component={authenticated && component}/>;
}
