import React, {useEffect} from "react";
import {HashRouter, Route, Switch} from "react-router-dom";
import './App.less';
import AppLayout from "./components/AppLayout";
import Login from "./components/Login";
import AuthRoute from "./components/AuthRoute";
import {adminConfig} from "./config/admin.config";
import {AuthService} from "./auth/auth.service";

const App = () => {
  useEffect(() => {
    if (adminConfig.authentication.used) {
      AuthService.silentRefresh().then().catch(() => {
        window.location.hash = adminConfig.authentication.loginUrl;
      });
    }
  }, []);

  return (<>
    <HashRouter>
      <Switch>
        <Route path={adminConfig.authentication.loginUrl} component={Login}/>
        {adminConfig.authentication.used ? (
          <AuthRoute path={'/'} component={AppLayout}/>
        ) : (
          <Route path={'/'} component={AppLayout}/>
        )}
      </Switch>
    </HashRouter>
  </>)
};

export default App;
