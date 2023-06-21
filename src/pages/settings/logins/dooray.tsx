import {getDefaultLayout, IDefaultLayoutPage, IPageHeader} from "@/components/layout/default-layout";
import DooraySettingsForm from "@/components/page/settings/logins/dooray-settings-form";

const pageHeader: IPageHeader = {
  title: "설정 - 로그인 - 두레이",
};

const DooraySettingsPage: IDefaultLayoutPage = () => {
  return (
    <>
      <DooraySettingsForm/>
    </>
  );
};

DooraySettingsPage.getLayout = getDefaultLayout;
DooraySettingsPage.pageHeader = pageHeader;

export default DooraySettingsPage;
