import React from "react";
import {Switch} from "react-router-dom";
import Sub1 from "../Sub1";
import Snb2 from "../Snb2";
import Sub2 from "../Sub2";
import PageLoadingRoute from "../../components/router/PageLoadingRoute";
import SampleList from "../samples/SampleList";
import SampleDetails from "../samples/SampleDetails";

const PageRouter = () => (
  <>
    <Switch>
      <PageLoadingRoute path="/sub1" component={Sub1} />
      <PageLoadingRoute path="/sub2" component={Sub2} />
      <PageLoadingRoute path="/snb2" component={Snb2} />
      <PageLoadingRoute path="/sample-list" component={SampleList} />
      <PageLoadingRoute path="/sample-details" component={SampleDetails} />
    </Switch>
  </>
);

export default PageRouter;
