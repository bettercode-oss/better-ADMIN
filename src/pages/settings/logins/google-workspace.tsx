import {getDefaultLayout, IDefaultLayoutPage, IPageHeader} from "@/components/layout/default-layout";
import GoogleWorkspaceSettingsForm from "@/components/page/settings/logins/google-workspace-settings-form";

const pageHeader: IPageHeader = {
  title: "설정 - 로그인 - 구글 워크스페이스",
};

const GoogleWorkspaceSettingsPage: IDefaultLayoutPage = () => {
  return (
    <>
      <GoogleWorkspaceSettingsForm/>
    </>
  );
};

GoogleWorkspaceSettingsPage.getLayout = getDefaultLayout;
GoogleWorkspaceSettingsPage.pageHeader = pageHeader;

export default GoogleWorkspaceSettingsPage;
