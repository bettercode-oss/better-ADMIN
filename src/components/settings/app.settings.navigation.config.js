import React from "react";
import {MemberContext} from "../../auth/member.context";
import WebHooksSetting from "./notification-web-hooks/WebHooksSetting";
import MemberAccessLogSetting from "./member-access-logs/MemberAccessLogSetting";

const settingsSideMenuItems = [{
    title: "알림 웹훅(WebHooks)",
    accessPermission: "MANAGE_SYSTEM_SETTINGS",
    component: <WebHooksSetting/>
  }, {
    title: "멤버 접근 로그 설정",
    accessPermission: "MANAGE_SYSTEM_SETTINGS",
    component: <MemberAccessLogSetting/>
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
