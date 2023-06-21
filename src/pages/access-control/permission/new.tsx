import {getDefaultLayout, IDefaultLayoutPage, IPageHeader} from "@/components/layout/default-layout";
import PermissionForm from "@/components/page/access-control/permission/permission-form";

const pageHeader: IPageHeader = {
  title: "권한 생성",
};

const PermissionNewPage: IDefaultLayoutPage = () => {
  return <PermissionForm/>;
};

PermissionNewPage.getLayout = getDefaultLayout;
PermissionNewPage.pageHeader = pageHeader;

export default PermissionNewPage;
