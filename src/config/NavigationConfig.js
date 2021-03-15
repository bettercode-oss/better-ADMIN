import navigationInfo from "./navigation.json";

export default class NavigationConfig {

  static getItems = () => {
    return navigationInfo.items;
  }

  static getItemsByLink = (pathName) => {
    let result = {
      gnbItem: null,
      snbItem: null,
      subItem: null
    }

    if(navigationInfo.items) {
      for (let i = 0; i < navigationInfo.items.length; i++) {
        const gnbItem = navigationInfo.items[i];

        const currentGnbItem = {
          title: gnbItem.title,
          index: String(i),
        }

        if(gnbItem && gnbItem.items) {
          for (let j = 0; j < gnbItem.items.length; j++) {
            const snbItem = gnbItem.items[j];
            const currentSnbItem = {
              title: snbItem.title,
              index: String(j),
            }

            if(snbItem.link && snbItem.link === pathName) {
              result.gnbItem = currentGnbItem;
              result.snbItem = currentSnbItem;

              return result;
            }

            if(snbItem && snbItem.items) {
              for (let k = 0; k < snbItem.items.length; k++) {
                const subItem = snbItem.items[k];
                const currentSubItem = {
                  title: subItem.title,
                  index: String(k),
                }

                if(subItem.link && subItem.link === pathName) {
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
