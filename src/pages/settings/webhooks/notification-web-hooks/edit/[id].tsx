import {getDefaultLayout, IDefaultLayoutPage, IPageHeader} from "@/components/layout/default-layout";
import {Alert, Skeleton} from "antd";
import {useRouter} from "next/router";
import {useWebHook} from "@/client/settings/webhook-settings";
import NotificationWebHookForm
  from "@/components/page/settings/webhooks/notification-web-hooks/notification-web-hook-form";

const pageHeader: IPageHeader = {
  title: "웹훅 수정",
};

const NotificationWebHookEditPage: IDefaultLayoutPage = () => {
  const router = useRouter();
  const {data, error, isLoading, isValidating} = useWebHook(Number(router.query.id));

  if (error) {
    return <Alert message="데이터 로딩 중 오류가 발생했습니다." type="warning" className="my-5"/>;
  }

  if (!data || isLoading || isValidating) {
    return <Skeleton className="my-5"/>;
  }

  return <NotificationWebHookForm id={Number(router.query.id)} initialValues={data}/>;
};

NotificationWebHookEditPage.getLayout = getDefaultLayout;
NotificationWebHookEditPage.pageHeader = pageHeader;

export default NotificationWebHookEditPage;