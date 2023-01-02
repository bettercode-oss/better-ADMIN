import React from "react";
import {Layout} from "antd";
import "./AppLayout.css";
import Sider from "./Sider";
import Header from "./Header";
import Content from "./Content";
import Footer from "./Footer";
import {AppVersionChecker} from "@bettercode/react-app-version-checker";
import {adminConfig} from "../../config/admin.config";
import {LayoutContentProvider} from "./AppLayoutContentContext";

const AppLayout = () => {
  return (
    <>
      <AppVersionChecker versionApiEndPoint={`${adminConfig.authentication.authAPI()}/site/settings/app-version`}
                         message="새로운 버전으로 업데이트되었습니다. 최신 버전을 이용하려면 '확인'을 눌러 주세요." minuteInterval={30}
                         okText='확인'/>
      <Layout
        style={{
          minHeight: '100vh'
        }}
      >
        <LayoutContentProvider>
          <Sider/>
          <Layout className="site-layout">
            <Header/>
            <Content/>
            <Footer/>
          </Layout>
        </LayoutContentProvider>
      </Layout>
    </>
  );
};

export default AppLayout;