import navigationInfo from "./navigation.json";
import {MemberContext} from "../auth/member.context";

export default class NavigationConfig {
  static hasPermissions(memberPermissions, navigationPermissions) {
    for (let i = 0; i < navigationPermissions.length; i++) {
      if (memberPermissions.has(navigationPermissions[i])) {
        return true;
      }
    }

    return false;
  }

  static getItemsByMemberPermission = () => {
    const memberPermissions = new Set(MemberContext.memberInformation.permissions ? MemberContext.memberInformation.permissions : []);
    const accessibleGnbItems = [];
    if (navigationInfo.items) {
      const gnbItems = navigationInfo.items;
      gnbItems.forEach(gnbItem => {
        // GNB
        if (!gnbItem.accessPermissions || this.hasPermissions(memberPermissions, gnbItem.accessPermissions)) {
          if (gnbItem.items) {
            // SNB
            const accessibleSnbItems = [];
            const snbItems = gnbItem.items
            snbItems.forEach(snbItem => {
              if (!snbItem.accessPermissions || this.hasPermissions(memberPermissions, snbItem.accessPermissions)) {
                if (snbItem.items) {
                  // Sub
                  const accessibleSubItems = [];
                  const subItems = snbItem.items
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
      if(firstGnbItem.items.length > 0) {
        const firstSnbItem = firstGnbItem.items[0];
        if (firstSnbItem.link) {
          return firstSnbItem.link;
        } else {
          if(firstSnbItem.items.length > 0) {
            return firstSnbItem.items[0].link;
          }
        }
      }
    }
    return null;
  }

  static getItemsWithoutMemberPermission = () => {
    const accessibleGnbItems = [];
    if (navigationInfo.items) {
      const gnbItems = navigationInfo.items;
      gnbItems.forEach(gnbItem => {
        // GNB
        if (gnbItem.items) {
          // SNB
          const accessibleSnbItems = [];
          const snbItems = gnbItem.items
          snbItems.forEach(snbItem => {
            if (snbItem.items) {
              // Sub
              const accessibleSubItems = [];
              const subItems = snbItem.items
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
