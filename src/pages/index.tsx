import {getDefaultLayout, IDefaultLayoutPage, IPageHeader} from "@/components/layout/default-layout";
import {useAuth} from "@/lib/auth/auth-provider";

const pageHeader: IPageHeader = {
  title: "Welcome Better Admin",
};

const IndexPage: IDefaultLayoutPage = () => {
  const { session } = useAuth();

  return (
    <>
      <h2 className="title">👋 {session.user?.name || "관리자"}님 안녕하세요!</h2>

      {/*<div className="my-5">*/}
      {/*  {data ? (*/}
      {/*    <StatisticSample data={data} />*/}
      {/*  ) : error ? (*/}
      {/*    <Alert message="대시보드 API 호출 중 오류가 발생했습니다." type="warning" />*/}
      {/*  ) : (*/}
      {/*    <Skeleton />*/}
      {/*  )}*/}
      {/*</div>*/}

      {/*<Divider />*/}

      {/*<h3 className="title">달력</h3>*/}

      {/*<CalendarSample />*/}
    </>
  );
};

IndexPage.getLayout = getDefaultLayout;
IndexPage.pageHeader = pageHeader;

export default IndexPage;
