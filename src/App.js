import React from 'react';
import {HashRouter, Route, Switch} from "react-router-dom";
import './App.less';
import AppLayout from "./components/AppLayout";

const App = () => (
  <>
    <HashRouter>
      <Switch>
        <Route path={'/'} component={AppLayout}/>
      </Switch>
    </HashRouter>
  </>
);

export default App;
