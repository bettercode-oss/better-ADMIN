import navigationInfo from "./navigation.json";
import {MemberContext} from "../auth/member.context";

export default class NavigationConfig {
  static hasPermissions(memberPermissions, navigationPermissions) {
    if(navigationPermissions) {
      for(const permission of navigationPermissions) {
        if (memberPermissions.has(permission)) {
          return true;
        }
      }

      return false;
    }

    return true;
  }

  static getItemsByMemberPermission = () => {
    const memberPermissions = new Set(MemberContext.memberInformation.permissions ? MemberContext.memberInformation.permissions : []);
    const accessibleLevel1Items = [];
    if (navigationInfo.items) {
      const level1Items = navigationInfo.items;
      level1Items.forEach(level1Item => {
        if (!level1Item.accessPermissions || this.hasPermissions(memberPermissions, level1Item.accessPermissions)) {
          if (level1Item.items) {
            const accessibleLevel2Items = [];
            const level2Items = level1Item.items
            level2Items.forEach(level2Item => {
              if (!level2Item.accessPermissions || this.hasPermissions(memberPermissions, level2Item.accessPermissions)) {
                if (level2Item.items) {
                  const accessibleLevel3Items = [];
                  const level3Items = level2Item.items
                  level3Items.forEach(level3Item => {
                    if (!level2Item.accessPermissions || this.hasPermissions(memberPermissions, level3Item.accessPermissions)) {
                      accessibleLevel3Items.push(level3Item);
                    }
                  });
                  level2Item.items = accessibleLevel3Items;
                }

                accessibleLevel2Items.push(level2Item);
              }
            });
            level1Item.items = accessibleLevel2Items;
          }
          accessibleLevel1Items.push(level1Item);
        }
      });
    }
    return accessibleLevel1Items;
  }

  static getFirstItemLink = () => {
    const items = this.getItemsByMemberPermission();
    if (items && items.length > 0) {
      const firstLevel1Item = items[0];
      if(firstLevel1Item.link) {
        return firstLevel1Item.link;
      }

      if(firstLevel1Item.items && firstLevel1Item.items.length > 0) {
        const firstLevel2Item = firstLevel1Item.items[0];
        if (firstLevel2Item.link) {
          return firstLevel2Item.link;
        }

        if(firstLevel2Item.items && firstLevel2Item.items.length > 0 && firstLevel2Item.items[0].link) {
          return firstLevel2Item.items[0].link;
        }
      }
    }
    return null;
  }

  static getItemsWithoutMemberPermission = () => {
    const accessibleItems = [];
    if (navigationInfo.items) {
      const level1Items = navigationInfo.items;
      level1Items.forEach(level1Item => {
        if (level1Item.items) {
          const accessibleLevel2Items = [];
          const level2Items = level1Item.items
          level2Items.forEach(level2Item => {
            if (level2Item.items) {
              const accessibleLevel3Items = [];
              const level3Items = level2Item.items
              level3Items.forEach(level3Item => {
                accessibleLevel3Items.push(level3Item);
              });
              level2Item.items = accessibleLevel3Items;
            }

            accessibleLevel2Items.push(level2Item);
          });
          level1Item.items = accessibleLevel2Items;
        }
        accessibleItems.push(level1Item);
      });
    }
    return accessibleItems;
  }

  static getItemByLink = (pathName, navigationItems) => {
    const result = {
      level1Item: null,
      level2Item: null,
      level3Item: null
    }

    if (navigationItems) {
      for(const [i, level1Item] of navigationItems.entries()) {
        const currentLevel1Item = {
          title: level1Item.title,
          index: String(i),
          icon: level1Item.icon,
        }

        if (level1Item.link && level1Item.link === pathName) {
          result.level1Item = currentLevel1Item;
          return result;
        }

        if (level1Item && level1Item.items) {
          for(const [j, level2Item] of level1Item.items.entries()) {
            const currentLevel2Item = {
              title: level2Item.title,
              index: String(j),
              icon: level2Item.icon,
            }

            if (level2Item.link && level2Item.link === pathName) {
              result.level1Item = currentLevel1Item;
              result.level2Item = currentLevel2Item;

              return result;
            }

            if (level2Item && level2Item.items) {
              for(const [k, level3Item] of level2Item.items.entries()) {
                const currentLevel3Item = {
                  title: level3Item.title,
                  index: String(k),
                  icon: level3Item.icon,
                }

                if (level3Item.link && level3Item.link === pathName) {
                  result.level1Item = currentLevel1Item;
                  result.level2Item = currentLevel2Item;
                  result.level3Item = currentLevel3Item;

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

  static isEmptyItem = (item) => {
    return !item.level1Item;
  }
}
