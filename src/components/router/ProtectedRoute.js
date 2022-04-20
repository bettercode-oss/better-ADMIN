import {Navigate, useLocation} from 'react-router-dom';
import {adminConfig} from "../../config/admin.config";
import React, {useEffect, useState} from "react";
import {AuthService} from "../../auth/auth.service";

const ProtectedRoute = ({children, silentRefreshCompleted}) => {
  const location = useLocation();
  const [authenticated, setAuthenticated] = useState(null);

  useEffect(() => {
    if (silentRefreshCompleted) {
      AuthService.checkAuth().then(() => {
        setAuthenticated(true);
      }).catch(() => {
        setAuthenticated(false);
      });
    }
  }, [silentRefreshCompleted]);

  if (authenticated === null) return null;

  if (authenticated) {
    return children;
  } else {
    let loginUrl = adminConfig.authentication.loginUrl;
    if(window.location.href.endsWith(loginUrl) === false) {
      loginUrl = loginUrl + "?returnUrl=" + encodeURIComponent(window.location.href)
    }

    return <Navigate to={loginUrl} replace state={{from: location}}/>;
  }
};

export default ProtectedRoute;