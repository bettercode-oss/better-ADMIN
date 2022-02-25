import React, {useEffect} from 'react';
import {Breadcrumb, Layout, Spin, Tabs} from "antd";
import {useHistory} from "react-router-dom";
import {useLayoutDispatch, useLayoutState} from "./AppLayoutContext";
import NavigationIcon from "./NavigationIcon";
import PageRouter from "../../pages/router/PageRouter";
import classNames from "classnames";
import themeConfig from "../../config/theme.config.json";
import {MemberAccessLogger} from "../../logger/member.access.logger";

const {TabPane} = Tabs;

function Content({props}) {
  const history = useHistory();
  const layoutState = useLayoutState();
  const layoutDispatch = useLayoutDispatch();

  useEffect(() => {
    const pathname = props.location.pathname;
    layoutDispatch({
      type: 'ADD_TAB_PAGE', pathname
    });

    const unlisten = history.listen((location) => {
      const pathname = location.pathname;
      layoutDispatch({
        type: 'ADD_TAB_PAGE', pathname
      });
      MemberAccessLogger.logPageAccess(location.pathname)
    });
    return unlisten;
  }, [
    props.location.pathname,
    layoutDispatch,
    history,
  ]);

  const handlePageHistoryTabClick = (pageTabId) => {
    if (pageTabId !== layoutState.pageTab.current.id) {
      const find = layoutState.pageTab.histories.filter(history => history.id === pageTabId);
      if (find.length === 1) {
        history.push(find[0].link);
      }
    }
  }

  const handlePageHistoryTabEdit = (pageTabId, action) => {
    if (action === "remove" && layoutState.pageTab.histories.length > 1) {
      const id = pageTabId;
      if (layoutState.pageTab.current.id === id) {
        // 현재 페이지를 삭제할 때
        const newHistories = layoutState.pageTab.histories.filter(history => history.id !== id);
        const currentPage = newHistories.slice(-1)[0];
        history.push(currentPage.link);
        layoutDispatch({
          type: 'REMOVE_TAB_PAGE', id, currentPage
        });
      } else {
        // 다른 페이지를 삭제할 때
        layoutDispatch({
          type: 'REMOVE_TAB_PAGE', id
        });
      }
    }
  }

  return (
    <Layout.Content className={classNames('site-layout-content', {dark: themeConfig.dark})}>
      <Tabs hideAdd type="editable-card" activeKey={layoutState.pageTab.current.id}
            onTabClick={handlePageHistoryTabClick} onEdit={handlePageHistoryTabEdit}>
        {layoutState.pageTab.histories && layoutState.pageTab.histories.map(page => {
            let TabIcon = null;
            if (page.icon && page.icon.length > 0) {
              TabIcon = NavigationIcon(page.icon);
            }
            return (
              <TabPane tab={<>{TabIcon && <TabIcon/>}&nbsp;{page.title}</>} key={page.id}>
                {layoutState.pageTab.current.id === page.id &&
                <>
                  <div className="site-breadcrumb">
                    <Breadcrumb>
                      {layoutState.breadcrumbItems.map((item, index) => (
                        <Breadcrumb.Item key={index}>{item}</Breadcrumb.Item>
                      ))}
                    </Breadcrumb>
                    <div className="page-title">
                      {page.title}
                    </div>
                  </div>
                  <div className={classNames('site-layout-page', {dark: themeConfig.dark})}>
                    <Spin spinning={layoutState.loading}>
                      <PageRouter/>
                    </Spin>
                  </div>
                </>}
              </TabPane>
            )
          }
        )}
      </Tabs>
    </Layout.Content>
  )
}

export default Content;
