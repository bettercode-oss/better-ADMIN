import React from "react";
import {Route, Routes} from "react-router-dom";
import Sub1 from "../Sub1";
import Snb2 from "../Snb2";
import Sub2 from "../Sub2";
import SampleList from "../samples/SampleList";
import SampleDetails from "../samples/SampleDetails";
import {PageNotFound} from "../../components/PageNotFound";

const PageRouter = () => (
  <>
    <Routes>
      <Route path="/sub1" element={<Sub1 />} />
      <Route path="/sub2" element={<Sub2 />} />
      <Route path="/snb2" element={<Snb2 />} />
      <Route path="/sample-list" element={<SampleList />} />
      <Route path="/sample-details" element={<SampleDetails />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  </>
);

export default PageRouter;
