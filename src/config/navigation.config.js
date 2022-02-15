import {MemberContext} from "../auth/member.context";
import {MenuService} from "../components/settings/menu/menu.service";

export default class NavigationConfig {
  static hasPermissions(memberPermissions, navigationPermissions) {
    for (let i = 0; i < navigationPermissions.length; i++) {
      if (memberPermissions.has(navigationPermissions[i].name)) {
        return true;
      }
    }

    return false;
  }

  static isInitNavigationInfo() {
    return window.sessionStorage.getItem("navigationInfo") ? true : false;
  }

  static loadNavigationInfo() {
    return JSON.parse(window.sessionStorage.getItem("navigationInfo"));
  }

  static async reloadNavigationInfo() {
    const response = await MenuService.getMenus();
    window.sessionStorage.setItem("navigationInfo", JSON.stringify(response.data));
  }

  static getItemsByMemberPermission = () => {
    const memberPermissions = new Set(MemberContext.memberInformation.permissions ? MemberContext.memberInformation.permissions : []);
    const accessibleGnbItems = [];

    const navigationInfo = NavigationConfig.loadNavigationInfo();
    if (navigationInfo) {
      navigationInfo.forEach(gnbItem => {
        // 1 Depth Menu
        if (!gnbItem.accessPermissions || this.hasPermissions(memberPermissions, gnbItem.accessPermissions)) {
          if (gnbItem.subMenus) {
            // 2 Depth Menu
            const accessibleSnbItems = [];
            const snbItems = gnbItem.subMenus
            snbItems.forEach(snbItem => {
              if (!snbItem.accessPermissions || this.hasPermissions(memberPermissions, snbItem.accessPermissions)) {
                if (snbItem.subMenus) {
                  // 3 Depth Menu
                  const accessibleSubItems = [];
                  const subItems = snbItem.subMenus
                  subItems.forEach(subItem => {
                    if (!snbItem.accessPermissions || this.hasPermissions(memberPermissions, subItem.accessPermissions)) {
                      accessibleSubItems.push(subItem);
                    }
                  });
                  snbItem.items = accessibleSubItems;
                }

                accessibleSnbItems.push(snbItem);
              }
            });
            gnbItem.items = accessibleSnbItems;
          }
          accessibleGnbItems.push(gnbItem);
        }
      });
    }
    return accessibleGnbItems;
  }

  static getFirstItemLink = () => {
    const gnbItems = this.getItemsByMemberPermission();
    if (gnbItems && gnbItems.length > 0) {
      const firstGnbItem = gnbItems[0];
      if (firstGnbItem.items.length > 0) {
        const firstSnbItem = firstGnbItem.items[0];
        if (firstSnbItem.link) {
          return firstSnbItem.link;
        } else {
          if (firstSnbItem.items.length > 0) {
            return firstSnbItem.items[0].link;
          }
        }
      }
    }
    return null;
  }

  static getItemsWithoutMemberPermission = () => {
    const accessibleGnbItems = [];
    const navigationInfo = NavigationConfig.loadNavigationInfo();
    if (navigationInfo) {
      navigationInfo.forEach(gnbItem => {
        // GNB
        if (gnbItem.subMenus) {
          // SNB
          const accessibleSnbItems = [];
          const snbItems = gnbItem.subMenus
          snbItems.forEach(snbItem => {
            if (snbItem.subMenus) {
              // Sub
              const accessibleSubItems = [];
              const subItems = snbItem.subMenus
              subItems.forEach(subItem => {
                accessibleSubItems.push(subItem);
              });
              snbItem.items = accessibleSubItems;
            }

            accessibleSnbItems.push(snbItem);
          });
          gnbItem.items = accessibleSnbItems;
        }
        accessibleGnbItems.push(gnbItem);
      });
    }
    return accessibleGnbItems;
  }

  static getItemsByLink = (pathName, navigationItems) => {
    const result = {
      gnbItem: null,
      snbItem: null,
      subItem: null
    }

    if (navigationItems) {
      for (let i = 0; i < navigationItems.length; i++) {
        const gnbItem = navigationItems[i];

        const currentGnbItem = {
          title: gnbItem.title,
          index: String(i),
          icon: gnbItem.icon,
        }

        if (gnbItem && gnbItem.items) {
          for (let j = 0; j < gnbItem.items.length; j++) {
            const snbItem = gnbItem.items[j];
            const currentSnbItem = {
              title: snbItem.title,
              index: String(j),
              icon: snbItem.icon,
            }

            if (snbItem.link && snbItem.link === pathName) {
              result.gnbItem = currentGnbItem;
              result.snbItem = currentSnbItem;

              return result;
            }

            if (snbItem && snbItem.items) {
              for (let k = 0; k < snbItem.items.length; k++) {
                const subItem = snbItem.items[k];
                const currentSubItem = {
                  title: subItem.title,
                  index: String(k),
                  icon: subItem.icon,
                }

                if (subItem.link && subItem.link === pathName) {
                  result.gnbItem = currentGnbItem;
                  result.snbItem = currentSnbItem;
                  result.subItem = currentSubItem;

                  return result;
                }
              }
            }
          }
        }
      }
    }

    return result;
  }


}
