import navigationInfo from "./navigation.json";
import {MemberContext} from "../auth/member.context";

export default class NavigationConfig {
  static getItems = () => {
    const memberPermissions = new Set(MemberContext.memberInformation.permissions ? MemberContext.memberInformation.permissions : []);
    const accessibleGnbItems = [];
    if (navigationInfo.items) {
      const gnbItems = navigationInfo.items;
      gnbItems.forEach(gnbItem => {
        // GNB
        if (!gnbItem.accessPermission || memberPermissions.has(gnbItem.accessPermission)) {
          if (gnbItem.items) {
            // SNB
            const accessibleSnbItems = [];
            const snbItems = gnbItem.items
            snbItems.forEach(snbItem => {
              if (!snbItem.accessPermission || memberPermissions.has(snbItem.accessPermission)) {
                if (snbItem.items) {
                  // Sub
                  const accessibleSubItems = [];
                  const subItems = snbItem.items
                  subItems.forEach(subItem => {
                    if (!snbItem.accessPermission || memberPermissions.has(subItem.accessPermission)) {
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
        }

        if (gnbItem && gnbItem.items) {
          for (let j = 0; j < gnbItem.items.length; j++) {
            const snbItem = gnbItem.items[j];
            const currentSnbItem = {
              title: snbItem.title,
              index: String(j),
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
