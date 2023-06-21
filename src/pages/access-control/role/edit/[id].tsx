import {getDefaultLayout, IDefaultLayoutPage, IPageHeader} from "@/components/layout/default-layout";
import {Alert, Skeleton} from "antd";
import {useRouter} from "next/router";
import {IRoleFormValue, useRole} from "@/client/access-control/role";
import {usePermissions} from "@/client/access-control/permission";
import RoleForm from "@/components/page/access-control/role/role-form";

const pageHeader: IPageHeader = {
  title: "역할 수정",
};

const RoleEditPage: IDefaultLayoutPage = () => {
  const router = useRouter();
  const {data: roleData, error: roleError, isLoading: roleLoading, isValidating: roleValidating}
    = useRole(Number(router.query.id));
  const {data: permissionData, error: permissionError, isLoading: permissionLoading, isValidating: permissionValidating}
    = usePermissions({page: 0});

  if (roleError || permissionError) {
    return <Alert message="데이터 로딩 중 오류가 발생했습니다." type="warning" className="my-5"/>;
  }

  if (!roleData || roleLoading || roleValidating || !permissionData || permissionLoading || permissionValidating) {
    return <Skeleton className="my-5"/>;
  }

  const roleFormValue = roleData as IRoleFormValue;
  roleFormValue.allowedPermissionIds = roleData.permissions?.map(permission => permission.id);
  return <RoleForm id={router.query.id as string} initialValues={roleData} allPermissions={permissionData.result}/>;
};

RoleEditPage.getLayout = getDefaultLayout;
RoleEditPage.pageHeader = pageHeader;

export default RoleEditPage;