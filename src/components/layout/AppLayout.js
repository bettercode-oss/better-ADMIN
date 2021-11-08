import React, {useEffect} from "react";
import {Layout} from "antd";
import "./AppLayout.css";
import {
  CHANGE_MEMBER_CONTEXT_EVENT_TOPIC,
  EventBroadcaster,
  SHOW_LOADING_EVENT_TOPIC
} from "../../event/event.broadcaster";
import Sider from "./Sider";
import Header from "./Header";
import Content from "./Content";
import Footer from "./Footer";
import {useLayoutDispatch, useLayoutState} from "./AppLayoutContext";
import {useHistory} from "react-router-dom";
import NavigationConfig from "../../config/navigation.config";
import {MemberContext} from "../../auth/member.context";

const AppLayout = (props) => {
  const layoutDispatch = useLayoutDispatch();
  const layoutState = useLayoutState();
  const history = useHistory();

  useEffect(() => {
    const pathname = props.location.pathname;
    layoutDispatch({
      type: 'INIT_NAVIGATION', pathname
    });

    if (pathname === "/" && MemberContext.available) {
      // PATH 가 루트(/) 인 경우 네비게이션 메뉴 중 가장 첫 번째 메뉴의 화면으로 이동 시킨다.
      const firstNavigationItemLink = NavigationConfig.getFirstItemLink();
      if(firstNavigationItemLink) {
        history.push(firstNavigationItemLink);
      }
    }
  }, [
    props.location.pathname,
    layoutDispatch,
    layoutState.allGnbItems,
    history
  ]);

  useEffect(() => {
    EventBroadcaster.on(CHANGE_MEMBER_CONTEXT_EVENT_TOPIC, () => {
      layoutDispatch({
        type: 'REFRESH_ALL_GNB_ITEMS'
      });
    });

    EventBroadcaster.on(SHOW_LOADING_EVENT_TOPIC, (data) => {
      const show = data.show;
      layoutDispatch({
        type: 'SHOW_LOADING', show
      });
    });
  }, [layoutDispatch]);

  return (
    <Layout
      style={{
        minHeight: "100%"
      }}
    >
      <Sider/>
      <Layout className="site-layout">
        <Header/>
        <Content props={props}/>
        <Footer/>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
