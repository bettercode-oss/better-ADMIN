import {getDefaultLayout, IDefaultLayoutPage, IPageHeader} from "@/components/layout/default-layout";
import {Alert, Skeleton} from "antd";
import {useRouter} from "next/router";
import OrganizationForm from "@/components/page/organization/organization-form";
import {useOrganization} from "@/client/organization/organization";

const pageHeader: IPageHeader = {
  title: "조직 수정",
};

const OrganizationEditPage: IDefaultLayoutPage = () => {
  const router = useRouter();
  const {data, error, isLoading, isValidating} = useOrganization(Number(router.query.id));

  if (error) {
    return <Alert message="데이터 로딩 중 오류가 발생했습니다." type="warning" className="my-5"/>;
  }

  if (!data || isLoading || isValidating) {
    return <Skeleton className="my-5"/>;
  }

  return <OrganizationForm id={Number(router.query.id)} initialValues={data}/>;
};

OrganizationEditPage.getLayout = getDefaultLayout;
OrganizationEditPage.pageHeader = pageHeader;

export default OrganizationEditPage;