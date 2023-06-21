import {getDefaultLayout, IDefaultLayoutPage, IPageHeader} from "@/components/layout/default-layout";
import MemberSearch from "@/components/page/member/member-search";
import MemberList from "@/components/page/member/member-list";

const pageHeader: IPageHeader = {
  title: "사용자/조직도 - 멤버",
};

const MemberListPage: IDefaultLayoutPage = () => {
  return (
    <>
      <MemberSearch/>
      <MemberList/>
    </>
  );
};

MemberListPage.getLayout = getDefaultLayout;
MemberListPage.pageHeader = pageHeader;

export default MemberListPage;
