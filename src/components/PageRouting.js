import React from "react";
import {Switch} from "react-router-dom";
import Home from "../pages/Home";
import Sample from "../pages/Home";
import Sub1 from "../pages/Sub1";
import Snb2 from "../pages/Snb2";
import Sub2 from "../pages/Sub2";
import PageRoute from "./router/PageRoute";

const PageRouting = () => (
  <>
    <Switch>
      <PageRoute exact path="/" component={Home} />
      <PageRoute path="/sub1" component={Sub1} />
      <PageRoute path="/sub2" component={Sub2} />
      <PageRoute path="/snb2" component={Snb2} />
      <PageRoute path="/sample" component={Sample} />
    </Switch>
  </>
);

export default PageRouting;
