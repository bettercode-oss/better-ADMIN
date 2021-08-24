import React from "react";
import {Switch} from "react-router-dom";
import Home from "../Home";
import Sample from "../Home";
import Sub1 from "../Sub1";
import Snb2 from "../Snb2";
import Sub2 from "../Sub2";
import PageLoadingRoute from "../../components/router/PageLoadingRoute";

const PageRouter = () => (
  <>
    <Switch>
      <PageLoadingRoute exact path="/" component={Home} />
      <PageLoadingRoute path="/sub1" component={Sub1} />
      <PageLoadingRoute path="/sub2" component={Sub2} />
      <PageLoadingRoute path="/snb2" component={Snb2} />
      <PageLoadingRoute path="/sample" component={Sample} />
    </Switch>
  </>
);

export default PageRouter;
