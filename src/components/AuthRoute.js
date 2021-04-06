import React, {useEffect, useState} from 'react';
import {Route, useHistory} from 'react-router-dom';
import Cookies from "universal-cookie";
const cookies = new Cookies();

export default function AuthRoute({path, exact = false, component}) {
  const [authenticated, setAuthenticated] = useState(false);
  const history = useHistory();

  const checkAuth = () => {
    const token = cookies.get('token') || {};
    const logged = token.jwtToken;
    if (logged) {
      setAuthenticated(true);
    } else {
      history.replace('/login');
    }
  };

  useEffect(() => {
    checkAuth();
  });

  return <Route exact={exact} path={path} component={authenticated && component}/>;
}
