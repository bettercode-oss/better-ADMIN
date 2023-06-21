import {getDefaultLayout, IDefaultLayoutPage, IPageHeader} from "@/components/layout/default-layout";
import RoleForm from "@/components/page/access-control/role/role-form";
import {usePermissions} from "@/client/access-control/permission";
import {Alert, Skeleton} from "antd";

const pageHeader: IPageHeader = {
  title: "역할 생성",
};

const RoleNewPage: IDefaultLayoutPage = () => {
  const {data, error, isLoading, isValidating} = usePermissions({page: 0});

  if (error) {
    return <Alert message="데이터 로딩 중 오류가 발생했습니다." type="warning" className="my-5"/>;
  }

  if (!data || isLoading || isValidating) {
    return <Skeleton className="my-5"/>;
  }

  return <RoleForm allPermissions={data.result}/>;
};

RoleNewPage.getLayout = getDefaultLayout;
RoleNewPage.pageHeader = pageHeader;

export default RoleNewPage;
