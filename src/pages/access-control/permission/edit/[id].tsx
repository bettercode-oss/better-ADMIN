import {getDefaultLayout, IDefaultLayoutPage, IPageHeader} from "@/components/layout/default-layout";
import {Alert, Skeleton} from "antd";
import {useRouter} from "next/router";
import PermissionForm from "@/components/page/access-control/permission/permission-form";
import {usePermission} from "@/client/access-control/permission";

const pageHeader: IPageHeader = {
  title: "권한 수정",
};

const PermissionEditPage: IDefaultLayoutPage = () => {
  const router = useRouter();
  const {data, error, isLoading, isValidating} = usePermission(Number(router.query.id));

  if (error) {
    return <Alert message="데이터 로딩 중 오류가 발생했습니다." type="warning" className="my-5"/>;
  }

  if (!data || isLoading || isValidating) {
    return <Skeleton className="my-5"/>;
  }

  return <PermissionForm id={router.query.id as string} initialValues={data}/>;
};

PermissionEditPage.getLayout = getDefaultLayout;
PermissionEditPage.pageHeader = pageHeader;

export default PermissionEditPage;