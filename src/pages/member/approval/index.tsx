import {getDefaultLayout, IDefaultLayoutPage, IPageHeader} from "@/components/layout/default-layout";
import MemberApprovalList from "@/components/page/member/member-approval-list";

const pageHeader: IPageHeader = {
  title: "사용자/조직도 - 멤버 승인",
};

const MemberApprovalListPage: IDefaultLayoutPage = () => {
  return (
    <>
      <MemberApprovalList/>
    </>
  );
};

MemberApprovalListPage.getLayout = getDefaultLayout;
MemberApprovalListPage.pageHeader = pageHeader;

export default MemberApprovalListPage;
