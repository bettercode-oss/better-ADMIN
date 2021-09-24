import React, {createContext, useContext, useReducer} from 'react';

import NavigationConfig from "../../config/navigation.config";

const initialState = {
  allGnbItems: [],
  gnbItem: null,
  breadcrumbItems: [],
  navigationState: {
    gnbMenuSelectedKeys: [""],
    snbMenuSelectedKeys: [""],
    snbMenuOpenKeys: [""]
  },
  pageHistory: {
    current: "",
    histories: [],
  },
  loading: false
};

function layoutReducer(state, action) {
  switch (action.type) {
    case 'INIT_NAVIGATION':
      const currentNavigationItem = NavigationConfig.getItemsByLink(action.pathname, state.allGnbItems);
      if (action.pathname !== "/") {
        if (currentNavigationItem.gnbItem) {
          const gnbNavigationItem = state.allGnbItems[currentNavigationItem.gnbItem.index];
          const breadcrumbNavigationItems = [];
          breadcrumbNavigationItems.push(currentNavigationItem.gnbItem.title);

          if (currentNavigationItem.snbItem) {
            breadcrumbNavigationItems.push(currentNavigationItem.snbItem.title);
          }

          if (currentNavigationItem.subItem) {
            breadcrumbNavigationItems.push(currentNavigationItem.subItem.title);
          }

          state = {
            ...state,
            gnbItem: gnbNavigationItem,
            breadcrumbItems: breadcrumbNavigationItems,
          };
        }
      }
      const gnbMenuSelectedKeys = currentNavigationItem.gnbItem ? [currentNavigationItem.gnbItem.index] : [""];
      let snbMenuSelectedKeys = currentNavigationItem.snbItem ? [currentNavigationItem.snbItem.index] : [""];
      if (currentNavigationItem.subItem) {
        snbMenuSelectedKeys = currentNavigationItem.snbItem
          ? [
            currentNavigationItem.snbItem.index +
            "-" +
            currentNavigationItem.subItem.index,
          ]
          : [""];
      }
      const snbMenuOpenKeys = currentNavigationItem.snbItem ? [currentNavigationItem.snbItem.index] : [""];
      return {
        ...state,
        navigationState: {
          gnbMenuSelectedKeys: gnbMenuSelectedKeys,
          snbMenuSelectedKeys: snbMenuSelectedKeys,
          snbMenuOpenKeys: snbMenuOpenKeys
        },
      };
    case 'CLICK_GNB_MENU':
      const gnbIndex = action.key;
      return {
        ...state,
        gnbItem: state.allGnbItems[gnbIndex],
        navigationState: {
          gnbMenuSelectedKeys: [gnbIndex],
          snbMenuSelectedKeys: [""],
          snbMenuOpenKeys: [""]
        },
      };
    case 'CLICK_SNB_MENU':
      const selectedMenuIndices = action.key.split("-");
      if (selectedMenuIndices && state.gnbItem) {
        const breadcrumbNavigationItems = [];
        breadcrumbNavigationItems.push(state.gnbItem.title);
        let selectedSnbItem = {};

        selectedMenuIndices.forEach((menuIndex, arrayIndex) => {
          if (arrayIndex === 0) {
            selectedSnbItem = state.gnbItem.items[menuIndex];
            breadcrumbNavigationItems.push(selectedSnbItem.title);
          } else if (arrayIndex === 1) {
            const selectedSubItem = selectedSnbItem.items[menuIndex];
            breadcrumbNavigationItems.push(selectedSubItem.title);
          }
        });
        return {
          ...state,
          breadcrumbNavigationItems: breadcrumbNavigationItems,
          navigationState: {
            ...state.navigationState,
            snbMenuSelectedKeys: [action.key],
          }
        };
      } else {
        return {
          ...state,
          navigationState: {
            ...state.navigationState,
            snbMenuSelectedKeys: [action.key],
          }
        };
      }
    case 'CLICK_SUB_MENU':
      return {
        ...state,
        navigationState: {
          ...state.navigationState,
          snbMenuOpenKeys: [action.key],
        }
      };
    case 'REFRESH_ALL_GNB_ITEMS':
      return {
        ...state,
        allGnbItems: NavigationConfig.getItemsByMemberPermission(),
      };
    case 'SHOW_LOADING':
      return {
        ...state,
        loading: action.loading,
      };
    case 'ADD_TAB_PAGE':
      const currentItem = NavigationConfig.getItemsByLink(action.pathname, NavigationConfig.getItemsWithoutMemberPermission());
      let title = "";
      if (currentItem.snbItem) {
        title = currentItem.snbItem.title;
      }

      if (currentItem.subItem) {
        title = currentItem.subItem.title;
      }

      const page = {
        pathname: action.pathname,
        title: title,
      }

      if (state.pageHistory.histories.filter(page => page.pathname === action.pathname).length === 0) {
        return {
          ...state,
          pageHistory: {
            current: page,
            histories: state.pageHistory.histories.concat(page)
          },
        }
      } else {
        return {
          ...state,
          pageHistory: {
            ...state.pageHistory,
            current: page,
          },
        };
      }
    case 'REMOVE_TAB_PAGE':
      const newHistories = state.pageHistory.histories.filter(history => history.pathname !== action.pathname);
      if (action.currentPage) {
        return {
          ...state,
          pageHistory: {
            current: action.currentPage,
            histories: newHistories,
          },
        }
      } else {
        return {
          ...state,
          pageHistory: {
            ...state.pageHistory,
            histories: newHistories,
          },
        }
      }
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

const LayoutStateContext = createContext();
const LayoutDispatchContext = createContext();

export function LayoutProvider({children}) {
  const [state, dispatch] = useReducer(layoutReducer, initialState);

  return (
    <LayoutStateContext.Provider value={state}>
      <LayoutDispatchContext.Provider value={dispatch}>
        {children}
      </LayoutDispatchContext.Provider>
    </LayoutStateContext.Provider>
  )
}

export function useLayoutState() {
  const context = useContext(LayoutStateContext);
  if (!context) {
    throw new Error('Cannot find LayoutStateContext')
  }
  return context;
}

export function useLayoutDispatch() {
  const context = useContext(LayoutDispatchContext);
  if (!context) {
    throw new Error('Cannot find LayoutDispatchContext')
  }
  return context;
}
