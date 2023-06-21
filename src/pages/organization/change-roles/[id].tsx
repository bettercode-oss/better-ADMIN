import {getDefaultLayout, IDefaultLayoutPage, IPageHeader} from "@/components/layout/default-layout";
import {useRouter} from "next/router";
import {useRoles} from "@/client/access-control/role";
import {Alert, Skeleton} from "antd";
import OrganizationRoleChangeForm from "@/components/page/organization/organization-role-change-form";
import {useOrganization} from "@/client/organization/organization";

const pageHeader: IPageHeader = {
  title: "조직 역할 변경",
};

const ChangeRolesPage: IDefaultLayoutPage = () => {
  const router = useRouter();

  const {data: roleData, error: roleError, isLoading: roleLoading, isValidating: roleValidating}
    = useRoles({page: 0});

  const {
    data: organizationData,
    error: organizationError,
    isLoading: organizationLoading,
    isValidating: organizationValidating
  }
    = useOrganization(Number(router.query.id));

  if (roleError || organizationError) {
    return <Alert message="데이터 로딩 중 오류가 발생했습니다." type="warning" className="my-5"/>;
  }

  if (!roleData || roleLoading || roleValidating || !organizationData || organizationLoading || organizationValidating) {
    return <Skeleton className="my-5"/>;
  }

  const formData = {
    roleIds: organizationData.roles?.map(role => role.id)
  }

  return (
    <>
      <OrganizationRoleChangeForm id={Number(router.query.id)} name={organizationData.name} initialValues={formData}
                                  allRoles={roleData.result}/>
    </>
  );
};

ChangeRolesPage.getLayout = getDefaultLayout;
ChangeRolesPage.pageHeader = pageHeader;

export default ChangeRolesPage;
