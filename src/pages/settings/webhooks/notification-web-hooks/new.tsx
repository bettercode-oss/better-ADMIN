import {getDefaultLayout, IDefaultLayoutPage, IPageHeader} from "@/components/layout/default-layout";
import NotificationWebHookForm
  from "@/components/page/settings/webhooks/notification-web-hooks/notification-web-hook-form";

const pageHeader: IPageHeader = {
  title: "웹훅 생성",
};

const NotificationWebHookNewPage: IDefaultLayoutPage = () => {
  return <NotificationWebHookForm/>;
};

NotificationWebHookNewPage.getLayout = getDefaultLayout;
NotificationWebHookNewPage.pageHeader = pageHeader;

export default NotificationWebHookNewPage;
