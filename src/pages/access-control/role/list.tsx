import {getDefaultLayout, IDefaultLayoutPage, IPageHeader} from "@/components/layout/default-layout";
import RoleSearch from "@/components/page/access-control/role/role-search";
import RoleList from "@/components/page/access-control/role/role-list";

const pageHeader: IPageHeader = {
  title: "접근 제어 - 역할",
};

const PermissionListPage: IDefaultLayoutPage = () => {
  return (
    <>
      <RoleSearch/>
      <RoleList/>
    </>
  );
};

PermissionListPage.getLayout = getDefaultLayout;
PermissionListPage.pageHeader = pageHeader;

export default PermissionListPage;
