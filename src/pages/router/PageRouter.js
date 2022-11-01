import React from "react";
import {Route, Routes} from "react-router-dom";
import Sub1 from "../Sub1";
import Snb2 from "../Snb2";
import Sub2 from "../Sub2";
import SampleList from "../samples/SampleList";
import SampleDetails from "../samples/SampleDetails";
import {PageNotFound} from "../../components/PageNotFound";
import PermissionList from "../../components/templates/settings/access-control/permission/PermissionList";
import PermissionForm from "../../components/templates/settings/access-control/permission/PermissionForm";
import RoleList from "../../components/templates/settings/access-control/role/RoleList";
import RoleForm from "../../components/templates/settings/access-control/role/RoleForm";

const PageRouter = () => (
  <>
    <Routes>
      <Route path="/sub1" element={<Sub1 />} />
      <Route path="/sub2" element={<Sub2 />} />
      <Route path="/snb2" element={<Snb2 />} />
      <Route path="/sample-list" element={<SampleList />} />
      <Route path="/sample-details" element={<SampleDetails />} />
      <Route path="/settings/access-control/permissions">
        <Route index={true} element={<PermissionList />}/>
        <Route path="new" element={<PermissionForm />} />
        <Route path=":permissionId" element={<PermissionForm />} />
      </Route>
      <Route path="/settings/access-control/roles">
        <Route index={true} element={<RoleList />}/>
        <Route path="new" element={<RoleForm />} />
        <Route path=":roleId" element={<RoleForm />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  </>
);

export default PageRouter;
