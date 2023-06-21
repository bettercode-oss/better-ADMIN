import {getDefaultLayout, IDefaultLayoutPage, IPageHeader} from "@/components/layout/default-layout";
import PermissionSearch from "@/components/page/access-control/permission/permission-search";
import PermissionList from "@/components/page/access-control/permission/permission-list";

const pageHeader: IPageHeader = {
  title: "접근 제어 - 권한",
};

const PermissionListPage: IDefaultLayoutPage = () => {
  return (
    <>
      <PermissionSearch/>
      <PermissionList/>
    </>
  );
};

PermissionListPage.getLayout = getDefaultLayout;
PermissionListPage.pageHeader = pageHeader;

export default PermissionListPage;
