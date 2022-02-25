import React from "react";

import {MemberContext} from "../../auth/member.context";
import MemberAccessLogs from "./member-access-logs/MemberAccessLogs";

const settingsSideMenuItems = [
  {
    title: "멤버 접근 로그",
    accessPermission: "VIEW_MONITORING",
    component: <MemberAccessLogs/>
  }
];

class MonitoringNavigation {
  getItems() {
    const memberPermissions = new Set(MemberContext.memberInformation.permissions ? MemberContext.memberInformation.permissions : []);
    const accessibleItems = [];
    settingsSideMenuItems.forEach(sideNavigationItem => {
      if (!sideNavigationItem.accessPermission || memberPermissions.has(sideNavigationItem.accessPermission)) {
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

const instance = new MonitoringNavigation()
export {instance as MonitoringNavigation}
