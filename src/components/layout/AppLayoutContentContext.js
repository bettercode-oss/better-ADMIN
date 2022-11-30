import React, {createContext, useContext, useEffect, useReducer} from 'react';
import {v4 as uuidv4} from 'uuid';

import NavigationConfig from "../../config/navigation.config";
import {PageTabStorage} from "./page.tab.storage";
import {EventBroadcaster, SELECTED_TAB_NOT_CONTAINS_NAVIGATION_TOPIC} from "../../event/event.broadcaster";

const initialState = {
  pageTab: PageTabStorage.getPageTab() === null ? {
    current: {
      id: '',
      title: '',
      navigationPathName: '',
      link: '',
      breadcrumbItems: [],
    },
    histories: [],
  } : PageTabStorage.getPageTab(),
};

function getNextPageTabId() {
  return uuidv4();
}

function layoutReducer(state, action) {
  const isEmptyTabHistories = () => {
    return state.pageTab.histories.length === 0;
  }

  const addNewBlankTab = (pathname) => {
    // navigation.json에 등록되지 않은 URL로 바로 접근하는 경우
    // 네비게이션을 추정할 수 없기 때문에 빈 탭을 만들어 반환
    const newPathName = pathname + "/"; // 다른 탭에서 같은 URL을 여는 경우 탭의 URL 중복을 방지 하기 위해 Slash 를 추가함.
    const blankTab = {
      id: getNextPageTabId(),
      navigationPathName: newPathName,
      name: '',
      link: newPathName,
    }

    return {
      ...state,
      pageTab: {
        ...state.pageTab,
        current: blankTab,
        histories: state.pageTab.histories.concat(blankTab)
      }
    };
  }

  const findTabByLink = (pathname) => {
    return state.pageTab.histories.find(page => page.link === pathname);
  }

  const findTabByNavigationPathName = (pathname) => {
    return state.pageTab.histories.find(page => page.navigationPathName === pathname);
  }

  const setCurrentTab = (tab) => {
    return {
      ...state,
      pageTab: {
        ...state.pageTab,
        current: tab
      }
    };
  }

  const changeCurrentTabLink = (pathname) => {
    return {
      ...state,
      pageTab: {
        ...state.pageTab,
        current: {
          ...state.pageTab.current,
          link: pathname,
        },
        histories: state.pageTab.histories.map(history =>
          history.id === state.pageTab.current.id ? {...history, link: pathname} : history
        ),
      }
    };
  }

  const addNewTab = (pathname, currentItem) => {
    let title = '';
    const breadcrumbItems = [];

    if (currentItem.level1Item) {
      title = currentItem.level1Item.title;
      breadcrumbItems.push(currentItem.level1Item.title);
    }

    if (currentItem.level2Item) {
      title = currentItem.level2Item.title;
      breadcrumbItems.push(currentItem.level2Item.title);
    }

    if (currentItem.level3Item) {
      title = currentItem.level3Item.title;
      breadcrumbItems.push(currentItem.level3Item.title);
    }

    const newTab = {
      id: getNextPageTabId(),
      navigationPathName: pathname,
      title: title,
      link: pathname,
      breadcrumbItems: breadcrumbItems,
    }

    return {
      ...state,
      pageTab: {
        ...state.pageTab,
        current: newTab,
        histories: state.pageTab.histories.concat(newTab)
      }
    };
  }

  switch (action.type) {
    case 'SETUP_PAGE_TABS':
      const pathname = action.pathname;
      const allMenuItems = NavigationConfig.getItemsWithoutMemberPermission();
      const currentItem = NavigationConfig.getItemByLink(pathname, allMenuItems);
      if (NavigationConfig.isEmptyItem(currentItem)) {
        if(isEmptyTabHistories()) {
          return addNewBlankTab(pathname);
        } else {
          const foundTab = findTabByLink(pathname);
          if (foundTab) {
            EventBroadcaster.broadcast(SELECTED_TAB_NOT_CONTAINS_NAVIGATION_TOPIC, foundTab.navigationPathName);
            return setCurrentTab(foundTab);
          } else {
            // 메뉴에 연결된 페이지의 탭이 활성된 상태에서 메뉴에 연결되지 않는 다른 페이지로 이동하는 경우
            // 기존 탭의 link 를 새로운 페이지의 link로 변경한다.
            return changeCurrentTabLink(pathname);
          }
        }
      } else {
        const foundTab = findTabByNavigationPathName(pathname);
        if (foundTab) {
          foundTab.link = pathname;
          return setCurrentTab(foundTab);
        } else {
          return addNewTab(pathname, currentItem);
        }
      }
    case 'REMOVE_TAB':
      const id = action.id;
      const newHistories = state.pageTab.histories.filter(history => history.id !== id);
      const currentPage = action.currentPage;
      if (currentPage) {
        return {
          ...state,
          pageTab: {
            ...state.pageTab,
            current: currentPage,
            histories: newHistories,
          }
        }
      } else {
        return {
          ...state,
          pageTab: {
            ...state.pageTab,
            histories: newHistories,
          }
        }
      }
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

const LayoutContentStateContext = createContext();
const LayoutContentDispatchContext = createContext();

export function LayoutContentProvider({children}) {
  const [state, dispatch] = useReducer(layoutReducer, initialState);

  useEffect(() => {
    PageTabStorage.setPageTab(state.pageTab);
  }, [state.pageTab]);

  return (
    <LayoutContentStateContext.Provider value={state}>
      <LayoutContentDispatchContext.Provider value={dispatch}>
        {children}
      </LayoutContentDispatchContext.Provider>
    </LayoutContentStateContext.Provider>
  )
}

export function useLayoutContentState() {
  const context = useContext(LayoutContentStateContext);
  if (!context) {
    throw new Error('Cannot find LayoutContentStateContext')
  }
  return context;
}

export function useLayoutContentDispatch() {
  const context = useContext(LayoutContentDispatchContext);
  if (!context) {
    throw new Error('Cannot find LayoutContentDispatchContext')
  }
  return context;
}
