import React from "react";
import {Route, Switch} from "react-router-dom";
import Home from "../pages/Home";
import Sub1 from "../pages/Sub1";
import Snb2 from "../pages/Snb2";
import Sub2 from "../pages/Sub2";
import Sample from "../pages/Home";

const PageRouting = () => (
  <>
    <Switch>
      <Route exact path="/" component={Home}/>
      <Route path="/sub1" component={Sub1}/>
      <Route path="/sub2" component={Sub2}/>
      <Route path="/snb2" component={Snb2}/>
      <Route path="/sample" component={Sample}/>
    </Switch>
  </>
);

export default PageRouting;
