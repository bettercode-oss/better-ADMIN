import React from 'react';
import {HashRouter, Route, Switch} from "react-router-dom";
import './App.less';
import AppLayout from "./components/AppLayout";
import Login from "./components/Login";
import AuthRoute from "./components/AuthRoute";
import {config} from "./config/config";

const App = () => (
  <>
    <HashRouter>
      <Switch>
        <Route path={'/login'} component={Login}/>
        {
          config.authentication.used ?
            <AuthRoute path={'/'} component={AppLayout} /> : <Route path={'/'} component={AppLayout}/>
        }
      </Switch>
    </HashRouter>
  </>
);

export default App;
