import React from "react";
import MemberSetting from "./member/MemberSetting";
import RoleSetting from "./access-control/RoleSetting";
import PermissionSetting from "./access-control/PermissionSetting";
import DooraySetting from "./dooray/DooraySetting";
import {MemberContext} from "../../auth/member.context";

const settingsSideMenuItems = [
  {
    title: "사용자",
    accessPermission: "MANAGE_MEMBERS",
    items: [
      {
        title: "멤버",
        component: <MemberSetting/>,
      }
    ]
  }, {
    title: "접근 제어",
    accessPermission: "MANAGE_ACCESS_CONTROL",
    items: [
      {
        title: "역할",
        component: <RoleSetting/>,
      },
      {
        title: "권한",
        component: <PermissionSetting/>,
      }
    ]
  }, {
    title: "두레이 로그인",
    accessPermission: "MANAGE_SYSTEM_SETTINGS",
    component: <DooraySetting/>,
  }
];

class AppSettingsNavigation {
  getItems() {
    const memberPermissions = new Set(MemberContext.memberInformation.permissions ? MemberContext.memberInformation.permissions : []);
    const accessibleItems = [];
    settingsSideMenuItems.forEach(sideNavigationItem => {
      if(!sideNavigationItem.accessPermission || memberPermissions.has(sideNavigationItem.accessPermission)) {
        accessibleItems.push(sideNavigationItem);
      }
    });

    return accessibleItems;
  }

  getItemAllAccessPermissions() {
    const permissions = [];
    settingsSideMenuItems.forEach(sideNavigationItem => {
      permissions.push(sideNavigationItem.accessPermission);
    });

    return permissions;
  }
}

const instance = new AppSettingsNavigation()
export {instance as AppSettingsNavigation}
