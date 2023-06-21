import {getDefaultLayout, IDefaultLayoutPage, IPageHeader} from "@/components/layout/default-layout";
import OrganizationList from "@/components/page/organization/organization-list";

const pageHeader: IPageHeader = {
  title: "사용자/조직도 - 조직도",
};

const OrganizationListPage: IDefaultLayoutPage = () => {
  return (
    <>
      <OrganizationList/>
    </>
  );
};

OrganizationListPage.getLayout = getDefaultLayout;
OrganizationListPage.pageHeader = pageHeader;

export default OrganizationListPage;
