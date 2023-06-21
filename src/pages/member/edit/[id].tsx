import {getDefaultLayout, IDefaultLayoutPage, IPageHeader} from "@/components/layout/default-layout";
import {Alert, Skeleton} from "antd";
import {useRouter} from "next/router";
import MemberRoleChangeForm from "@/components/page/member/member-role-change-form";
import {useRoles} from "@/client/access-control/role";
import {useMember} from "@/client/member/member";

const pageHeader: IPageHeader = {
  title: "역할 변경",
};

const MemberRoleChangePage: IDefaultLayoutPage = () => {
  const router = useRouter();

  const {data: roleData, error: roleError, isLoading: roleLoading, isValidating: roleValidating}
    = useRoles({page: 0});

  const {data: memberData, error: memberError, isLoading: memberLoading, isValidating: memberValidating}
    = useMember(Number(router.query.id));

  if (roleError || memberError) {
    return <Alert message="데이터 로딩 중 오류가 발생했습니다." type="warning" className="my-5"/>;
  }

  if (!roleData || roleLoading || roleValidating || !memberData || memberLoading || memberValidating) {
    return <Skeleton className="my-5"/>;
  }

  const formData = {
    roleIds: memberData.roles.map(role => role.id)
  }

  return <MemberRoleChangeForm id={router.query.id as string} initialValues={formData} allRoles={roleData.result}/>;
};

MemberRoleChangePage.getLayout = getDefaultLayout;
MemberRoleChangePage.pageHeader = pageHeader;

export default MemberRoleChangePage;