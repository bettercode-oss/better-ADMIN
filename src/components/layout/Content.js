import React, {useEffect, useRef} from 'react';
import {Breadcrumb, Layout, Tabs} from "antd";
import {useLocation, useNavigate} from "react-router-dom";
import NavigationIcon from "./NavigationIcon";
import PageRouter from "../../pages/router/PageRouter";
import classNames from "classnames";
import themeConfig from "../../config/theme.config.json";
import {useLayoutContentDispatch, useLayoutContentState} from "./AppLayoutContentContext";
import AutoBackdrop from "../modules/backdrop/AutoBackdrop";

function Content() {
  const renderingCompleted = useRef(false);
  const useEffected = useRef(false);
  const tabRemoved = useRef(false);

  let navigate = useNavigate();
  let location = useLocation();
  const layoutContentDispatch = useLayoutContentDispatch();
  const layoutContentState = useLayoutContentState();

  useEffect(() => {
    useEffected.current = true;
    let pathname = location.pathname;
    if (location.search) {
      pathname += location.search;
    }

    // PATH 가 루트(/) 인 경우 탭에서 제외
    if (pathname !== '/') {
      layoutContentDispatch({
        type: 'SETUP_PAGE_TABS', pathname
      });
    }
  }, [location, layoutContentDispatch]);

  const handlePageHistoryTabClick = (pageTabId) => {
    if (pageTabId !== layoutContentState.pageTab.current.id) {
      const findTab = layoutContentState.pageTab.histories.find(history => history.id === pageTabId);
      if (findTab) {
        navigate(findTab.link);
      }
    }
  }

  const handlePageHistoryTabEdit = (pageTabId, action) => {
    if (action === "remove" && layoutContentState.pageTab.histories.length > 1) {
      const id = pageTabId;
      if (layoutContentState.pageTab.current.id === id) {
        // 현재 페이지를 삭제할 때
        const newHistories = layoutContentState.pageTab.histories.filter(history => history.id !== id);
        const currentPage = newHistories.slice(-1)[0];
        navigate(currentPage.link);
        layoutContentDispatch({
          type: 'REMOVE_TAB', id, currentPage
        });
      } else {
        // 다른 페이지를 삭제할 때
        layoutContentDispatch({
          type: 'REMOVE_TAB', id
        });
      }
      tabRemoved.current = true;
    }
  }

  const generateTabs = () => {
    const tabs = [];
    if (layoutContentState.pageTab.histories) {
      for (const page of layoutContentState.pageTab.histories) {
        let TabIcon = null;
        if (page.icon && page.icon.length > 0) {
          TabIcon = NavigationIcon(page.icon);
        }
        const tab = {
          label: <>{TabIcon && <TabIcon/>}&nbsp;{page.title}</>,
          key: page.id,
        }

        if (layoutContentState.pageTab.current.id === page.id) {
          tab.children = <>
            <div className="site-breadcrumb">
              <Breadcrumb>
                {layoutContentState.pageTab.current.breadcrumbItems && layoutContentState.pageTab.current.breadcrumbItems.map((item, index) => (
                  <Breadcrumb.Item key={index}>{item}</Breadcrumb.Item>
                ))}
              </Breadcrumb>
              <div className="page-title">
                {page.title}
              </div>
            </div>
            <div className={classNames('site-layout-page', {dark: themeConfig.dark})}>
              <PageRouter/>
            </div>
          </>;
        }
        tabs.push(tab)
      }
    }

    return tabs;
  }

  renderingCompleted.current = false;
  return (
    <>
      <Layout.Content className={classNames('site-layout-content', {dark: themeConfig.dark})}>
        <AutoBackdrop>
          { /* 탭 변경에 따른 Page Router에 선언된 컴포넌트의 useEffect가 2번 호출 되는 것을 방지 처리 */
            (renderingCompleted.current || useEffected.current || tabRemoved.current) &&
            <div className="card-container">
              <Tabs
                hideAdd type="editable-card" activeKey={layoutContentState.pageTab.current.id}
                onTabClick={handlePageHistoryTabClick} onEdit={handlePageHistoryTabEdit}
                items={generateTabs()}
              />
            </div>
          }
        </AutoBackdrop>
      </Layout.Content>
      {renderingCompleted.current = true}
      {useEffected.current = false}
      {tabRemoved.current = false}
    </>
  )
}

export default Content;
