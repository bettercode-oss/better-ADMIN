import React, {createContext, useContext, useReducer} from 'react';

import NavigationConfig from "../../config/navigation.config";
import {EventBroadcaster, SHOW_ERROR_MESSAGE_EVENT_TOPIC} from "../../event/event.broadcaster";
import {adminConfig} from "../../config/admin.config";

let pageTabId = 0;
const initialState = {
  allGnbItems: [],
  gnbItem: null,
  breadcrumbItems: [],
  navigationState: {
    gnbMenuSelectedKeys: [''],
    snbMenuSelectedKeys: [''],
    snbMenuOpenKeys: ['']
  },
  pageTab: {
    current: {
      id: '',
      title: '',
      icon: '',
      navigationPathName: '',
      link: '',
    },
    histories: [],
  },
  loading: false
};

function layoutReducer(state, action) {
  switch (action.type) {
    case 'INIT_NAVIGATION':
      let currentNavigationItem = NavigationConfig.getItemsByLink(action.pathname, state.allGnbItems);
      if (!currentNavigationItem.gnbItem) {
        const foundTab = state.pageTab.histories.filter(page => page.link === action.pathname);
        if (foundTab.length > 0) {
          currentNavigationItem = NavigationConfig.getItemsByLink(foundTab[0].navigationPathName, state.allGnbItems);
        }
      }

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

      const gnbMenuSelectedKeys = currentNavigationItem.gnbItem ? [currentNavigationItem.gnbItem.index] : [''];
      let snbMenuSelectedKeys = currentNavigationItem.snbItem ? [currentNavigationItem.snbItem.index] : [''];
      if (currentNavigationItem.subItem) {
        snbMenuSelectedKeys = currentNavigationItem.snbItem
          ? [
            currentNavigationItem.snbItem.index +
            '-' +
            currentNavigationItem.subItem.index,
          ]
          : [''];
      }
      const snbMenuOpenKeys = currentNavigationItem.snbItem ? [currentNavigationItem.snbItem.index] : [''];
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
          snbMenuSelectedKeys: [''],
          snbMenuOpenKeys: ['']
        },
      };
    case 'CLICK_SNB_MENU':
      const selectedMenuIndices = action.key.split('-');
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
        loading: action.show,
      };
    case 'ADD_TAB_PAGE':
      const currentItem = NavigationConfig.getItemsByLink(action.pathname, NavigationConfig.getItemsWithoutMemberPermission());
      if (!currentItem.gnbItem) {
        if (state.pageTab.histories.length === 0) {
          if (adminConfig.homePage !== action.pathname) {
            EventBroadcaster.broadcast(SHOW_ERROR_MESSAGE_EVENT_TOPIC, adminConfig.errorMessage.badAccessPathError);
            return state;
          }
        }

        const foundTab = state.pageTab.histories.filter(page => page.link === action.pathname);
        if (foundTab.length > 0) {
          return {
            ...state,
            pageTab: {
              ...state.pageTab,
              current: foundTab[0],
            },
          };
        } else {
          return {
            ...state,
            pageTab: {
              histories: state.pageTab.histories.map(history =>
                history.id === state.pageTab.current.id ? {...history, link: action.pathname} : history
              ),
              current: {
                ...state.pageTab.current,
                link: action.pathname,
              },
            },
          };
        }
      }

      const foundTab = state.pageTab.histories.filter(page => page.navigationPathName === action.pathname);
      if (foundTab.length === 0) {
        // 새로운 탭 추가
        let title = '';
        let icon = '';
        if (currentItem.snbItem) {
          title = currentItem.snbItem.title;
          icon = currentItem.snbItem.icon;
        }

        if (currentItem.subItem) {
          title = currentItem.subItem.title;
          icon = currentItem.subItem.icon;
        }

        const page = {
          id: String(++pageTabId),
          navigationPathName: action.pathname,
          title: title,
          link: action.pathname,
          icon: icon,
        }

        return {
          ...state,
          pageTab: {
            current: page,
            histories: state.pageTab.histories.concat(page)
          },
        }
      } else {
        // 기존 탭 전환
        return {
          ...state,
          pageTab: {
            ...state.pageTab,
            current: foundTab[0],
          },
        }
      }
    case 'REMOVE_TAB_PAGE':
      const newHistories = state.pageTab.histories.filter(history => history.id !== action.id);
      if (action.currentPage) {
        return {
          ...state,
          pageTab: {
            current: action.currentPage,
            histories: newHistories,
          },
        }
      } else {
        return {
          ...state,
          pageTab: {
            ...state.pageTab,
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
