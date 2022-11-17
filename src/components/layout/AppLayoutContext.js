import React, {createContext, useContext, useEffect, useReducer} from 'react';
import {v4 as uuidv4} from 'uuid';

import NavigationConfig from "../../config/navigation.config";
import {adminConfig} from "../../config/admin.config";

const SESSION_STORAGE_KEY_BETTER_ADMIN_PAGE_TAB = "betterAdminPageTab";

const initialState = {
  allGnbItems: [],
  gnbItem: null,
  breadcrumbItems: [],
  navigationState: {
    menuOpenKeys: [''],
    menuSelectedKeys: [''],
  },
  pageTab: window.sessionStorage.getItem(SESSION_STORAGE_KEY_BETTER_ADMIN_PAGE_TAB) == null ? {
    current: {
      id: '',
      title: '',
      icon: '',
      navigationPathName: '',
      link: '',
    },
    histories: [],
  } : JSON.parse(window.sessionStorage.getItem(SESSION_STORAGE_KEY_BETTER_ADMIN_PAGE_TAB)),
  loading: false
};

function getNextPageTabId() {
  return uuidv4();
}

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

      const menuOpenKeys = [];
      let menuSelectedKey = "";

      if (currentNavigationItem.gnbItem) {
        menuOpenKeys.push(currentNavigationItem.gnbItem.index)
        menuSelectedKey = currentNavigationItem.gnbItem.index;
      }

      if (currentNavigationItem.snbItem) {
        menuOpenKeys.push(currentNavigationItem.gnbItem.index + '-' + currentNavigationItem.snbItem.index)
        menuSelectedKey = currentNavigationItem.gnbItem.index + '-' + currentNavigationItem.snbItem.index;
      }

      if(currentNavigationItem.subItem) {
        menuSelectedKey = currentNavigationItem.gnbItem.index + '-' + currentNavigationItem.snbItem.index + '-' + currentNavigationItem.subItem.index;
      }

      return {
        ...state,
        navigationState: {
          menuOpenKeys: menuOpenKeys,
          menuSelectedKeys: [menuSelectedKey],
        },
      };
    case 'CLICK_LEVEL_1_MENU':
      const gnbIndex = action.key;
      return {
        ...state,
        gnbItem: state.allGnbItems[gnbIndex],
        navigationState: {
          menuOpenKeys: [gnbIndex],
          menuSelectedKeys: [gnbIndex],
        },
      };
    case 'CLICK_LEVEL_2_MENU':
      const selectedMenuIndices = action.key.split('-');
      return {
        ...state,
        navigationState: {
          menuOpenKeys: [selectedMenuIndices[0], action.key],
          menuSelectedKeys: [action.key],
        }
      };
    case 'REFRESH_ALL_MENU_ITEMS':
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
            // navigation.json에 등록되지 않은 URL로 바로 접근하는 경우
            // 네비게이션을 추정할 수 없기 때문에 빈 탭을 만들어 반환
            const newPathName = action.pathname + "/"; // 다른 탭에서 같은 URL을 여는 경우 탭의 URL 중복을 방지 하기 위해 Slash 를 추가함.
            const page = {
              id: getNextPageTabId(),
              navigationPathName: newPathName,
              name: '',
              link: newPathName,
              icon: '',
            }

            return {
              ...state,
              pageTab: {
                current: page,
                histories: state.pageTab.histories.concat(page)
              },
            }
          }
        }

        const foundTab = state.pageTab.histories.find(page => page.link === action.pathname);
        if(foundTab) {
          return {
            ...state,
            pageTab: {
              ...state.pageTab,
              current: foundTab,
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

      const foundTab = state.pageTab.histories.find(page => page.navigationPathName === action.pathname);
      if(foundTab) {
        // 기존 탭 전환
        return {
          ...state,
          pageTab: {
            ...state.pageTab,
            current: foundTab,
          },
        }
      } else {
        // 새로운 탭 추가
        let title = '';
        let icon = '';

        if (currentItem.gnbItem) {
          title = currentItem.gnbItem.title;
          icon = currentItem.gnbItem.icon;
        }

        if (currentItem.snbItem) {
          title = currentItem.snbItem.title;
          icon = currentItem.snbItem.icon;
        }

        if (currentItem.subItem) {
          title = currentItem.subItem.title;
          icon = currentItem.subItem.icon;
        }

        const page = {
          id: getNextPageTabId(),
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

  useEffect(() => {
    window.sessionStorage.setItem(SESSION_STORAGE_KEY_BETTER_ADMIN_PAGE_TAB, JSON.stringify(state.pageTab));
  }, [state.pageTab]);

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

export function cleanUpAppLayoutContextResource() {
  window.sessionStorage.removeItem(SESSION_STORAGE_KEY_BETTER_ADMIN_PAGE_TAB);
}
