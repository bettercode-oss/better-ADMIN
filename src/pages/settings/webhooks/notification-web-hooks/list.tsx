import {getDefaultLayout, IDefaultLayoutPage, IPageHeader} from "@/components/layout/default-layout";
import NotificationWebHookList
  from "@/components/page/settings/webhooks/notification-web-hooks/notification-web-hook-list";

const pageHeader: IPageHeader = {
  title: "설정 - 웹훅 - 알림 웹훅",
};

const NotificationWebHookListPage: IDefaultLayoutPage = () => {
  return (
    <>
      <NotificationWebHookList/>
    </>
  );
};

NotificationWebHookListPage.getLayout = getDefaultLayout;
NotificationWebHookListPage.pageHeader = pageHeader;

export default NotificationWebHookListPage;
