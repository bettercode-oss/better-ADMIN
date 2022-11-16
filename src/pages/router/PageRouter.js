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
import MemberList from "../../components/templates/member/MemberList";
import MemberRoleChange from "../../components/templates/member/MemberRoleChange";
import MemberApproval from "../../components/templates/member/MemberApproval";
import Organizations from "../../components/templates/organization/Organizations";
import OrganizationForm from "../../components/templates/organization/OrganizationForm";
import OrganizationChangeRoles from "../../components/templates/organization/OrganizationChangeRoles";
import OrganizationChangeMembers from "../../components/templates/organization/OrganizationChangeMembers";

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
      <Route path="/settings/members">
        <Route index={true} element={<MemberList />}/>
        <Route path=":memberId" element={<MemberRoleChange />} />
      </Route>
      <Route path="/settings/member-approval" element={<MemberApproval />} />
      <Route path="/settings/organization">
        <Route index={true} element={<Organizations />}/>
        <Route path="new" element={<OrganizationForm />} />
        <Route path=":organizationId" element={<OrganizationForm />} />
        <Route path=":organizationId/change-roles" element={<OrganizationChangeRoles />} />
        <Route path=":organizationId/change-members" element={<OrganizationChangeMembers />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  </>
);

export default PageRouter;
