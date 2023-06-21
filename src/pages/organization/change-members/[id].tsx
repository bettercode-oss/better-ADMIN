import {getDefaultLayout, IDefaultLayoutPage, IPageHeader} from "@/components/layout/default-layout";
import {useRouter} from "next/router";
import {Alert, Skeleton} from "antd";
import {useOrganization} from "@/client/organization/organization";
import OrganizationMemberChangeForm from "@/components/page/organization/organization-member-change-form";
import {useMembersApproved} from "@/client/member/member";

const pageHeader: IPageHeader = {
  title: "조직 멤버 변경",
};

const ChangeMemberPage: IDefaultLayoutPage = () => {
  const router = useRouter();

  const {data: memberData, error: memberError, isLoading: memberLoading, isValidating: memberValidating}
    = useMembersApproved({page: 0});

  const {
    data: organizationData,
    error: organizationError,
    isLoading: organizationLoading,
    isValidating: organizationValidating
  }
    = useOrganization(Number(router.query.id));

  if (memberError || organizationError) {
    return <Alert message="데이터 로딩 중 오류가 발생했습니다." type="warning" className="my-5"/>;
  }

  if (!memberData || memberLoading || memberValidating || !organizationData || organizationLoading || organizationValidating) {
    return <Skeleton className="my-5"/>;
  }

  const formData = {
    memberIds: organizationData.members?.map(member => member.id)
  }

  return (
    <>
      <OrganizationMemberChangeForm id={Number(router.query.id)} name={organizationData.name} initialValues={formData}
                                    allMembers={memberData.result}/>
    </>
  );
};

ChangeMemberPage.getLayout = getDefaultLayout;
ChangeMemberPage.pageHeader = pageHeader;

export default ChangeMemberPage;
