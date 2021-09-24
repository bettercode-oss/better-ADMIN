import React, {useEffect} from 'react';
import {Breadcrumb, Layout, Spin, Tabs} from "antd";
import PageRouter from "../../pages/router/PageRouter";
import {useHistory} from "react-router-dom";
import {useLayoutDispatch, useLayoutState} from "./AppLayoutContext";

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
    });
    return unlisten;
  }, [
    props.location.pathname,
    layoutDispatch,
    history,
  ]);

  const handlePageHistoryTabClick = (pathname) => {
    if (pathname !== layoutState.pageHistory.current.pathname) {
      history.push(pathname);
    }
  }

  const handlePageHistoryTabEdit = (key, action) => {
    if (action === "remove" && layoutState.pageHistory.histories.length > 1) {
      const pathname = key;
      if(props.location.pathname === pathname) {
        const newHistories = layoutState.pageHistory.histories.filter(history => history.pathname !== pathname);
        const currentPage = newHistories.slice(-1)[0];
        history.push(currentPage.pathname);
        layoutDispatch({
          type: 'REMOVE_TAB_PAGE', pathname, currentPage
        });
      } else {
        layoutDispatch({
          type: 'REMOVE_TAB_PAGE', pathname
        });
      }
    }
  }

  return (
    <Layout.Content className="site-layout-content">
      <Tabs hideAdd type="editable-card" activeKey={layoutState.pageHistory.current.pathname}
            onTabClick={handlePageHistoryTabClick} onEdit={handlePageHistoryTabEdit}>
        {layoutState.pageHistory.histories && layoutState.pageHistory.histories.map(page =>
          <TabPane tab={page.title} key={page.pathname}>
            {props.location.pathname !== "/" && (
              <div style={{backgroundColor: "white", padding: "15px"}}>
                <Breadcrumb>
                  {layoutState.breadcrumbItems.map((item, index) => (
                    <Breadcrumb.Item key={index}>{item}</Breadcrumb.Item>
                  ))}
                </Breadcrumb>
                <div className="page-title">
                  {layoutState.breadcrumbItems &&
                  layoutState.breadcrumbItems.length > 0 &&
                  layoutState.breadcrumbItems[layoutState.breadcrumbItems.length - 1]}
                </div>
              </div>
            )}
            <div className="site-layout-page">
              <Spin spinning={layoutState.loading}>
                <PageRouter/>
              </Spin>
            </div>
          </TabPane>
        )}
      </Tabs>
    </Layout.Content>
  )
}

export default Content;
