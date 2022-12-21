import React from "react";
import {Route, Routes} from "react-router-dom";
import {PageNotFound} from "../PageNotFound";
import PermissionList from "../templates/access-control/permission/PermissionList";
import PermissionForm from "../templates/access-control/permission/PermissionForm";
import RoleList from "../templates/access-control/role/RoleList";
import RoleForm from "../templates/access-control/role/RoleForm";
import MemberList from "../templates/member/MemberList";
import MemberRoleChange from "../templates/member/MemberRoleChange";
import MemberApproval from "../templates/member/MemberApproval";
import Organizations from "../templates/organization/Organizations";
import OrganizationForm from "../templates/organization/OrganizationForm";
import OrganizationChangeRoles from "../templates/organization/OrganizationChangeRoles";
import OrganizationChangeMembers from "../templates/organization/OrganizationChangeMembers";
import GoogleWorkspaceLoginSetting from "../templates/settings/google/GoogleWorkspaceLoginSetting";
import DoorayLoginSetting from "../templates/settings/dooray/DoorayLoginSetting";
import NotificationWebHookList from "../templates/webhook/notification-web-hooks/NotificationWebHookList";
import NotificationWebHookForm from "../templates/webhook/notification-web-hooks/NotificationWebHookForm";
import NotificationWebHookCallSampleDetails
  from "../templates/webhook/notification-web-hooks/NotificationWebHookCallSampleDetails";
import {Home} from "../templates/Home";

const PageRouter = () => (
  <>
    <Routes>
      <Route path="/home" element={<Home/>}/>
      <Route path="/access-control/permissions">
        <Route index={true} element={<PermissionList />}/>
        <Route path="new" element={<PermissionForm />} />
        <Route path=":permissionId" element={<PermissionForm />} />
      </Route>
      <Route path="/access-control/roles">
        <Route index={true} element={<RoleList />}/>
        <Route path="new" element={<RoleForm />} />
        <Route path=":roleId" element={<RoleForm />} />
      </Route>
      <Route path="/members">
        <Route index={true} element={<MemberList />}/>
        <Route path=":memberId" element={<MemberRoleChange />} />
      </Route>
      <Route path="/member-approval" element={<MemberApproval />} />
      <Route path="/organization">
        <Route index={true} element={<Organizations />}/>
        <Route path="new" element={<OrganizationForm />} />
        <Route path=":organizationId" element={<OrganizationForm />} />
        <Route path=":organizationId/change-roles" element={<OrganizationChangeRoles />} />
        <Route path=":organizationId/change-members" element={<OrganizationChangeMembers />} />
      </Route>
      <Route path="/web-hooks/notifications">
        <Route index={true} element={<NotificationWebHookList />}/>
        <Route path="new" element={<NotificationWebHookForm />} />
        <Route path=":webhookId" element={<NotificationWebHookForm />} />
        <Route path=":webhookId/call-sample-details" element={<NotificationWebHookCallSampleDetails />} />
      </Route>
      <Route path="/settings/login">
        <Route path="dooray" element={<DoorayLoginSetting />} />
        <Route path="google-workspace" element={<GoogleWorkspaceLoginSetting />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  </>
);

export default PageRouter;
