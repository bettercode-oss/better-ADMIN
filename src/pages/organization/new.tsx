import {getDefaultLayout, IDefaultLayoutPage, IPageHeader} from "@/components/layout/default-layout";
import OrganizationForm from "@/components/page/organization/organization-form";

const pageHeader: IPageHeader = {
  title: "조직/부서 추가",
};

const OrganizationNewPage: IDefaultLayoutPage = () => {
  return <OrganizationForm/>;
};

OrganizationNewPage.getLayout = getDefaultLayout;
OrganizationNewPage.pageHeader = pageHeader;

export default OrganizationNewPage;
