import DefaultTable from "@/components/shared/ui/default-table";
import DefaultTableBtn from "@/components/shared/ui/default-table-btn";
import {Alert, Button, message, Popconfirm} from "antd";
import {ColumnsType} from "antd/es/table";
import {Download} from "lucide-react";
import {useRouter} from "next/router";
import React, {useCallback} from "react";
import Link from "next/link";
import {deleteWebHook, IWebHook, IWebHookParams, useWebHooks} from "@/client/settings/webhook-settings";

const NotificationWebHookList = () => {
  const router = useRouter();

  const searchParams: IWebHookParams = {
    page: router.query.page ? Number(router.query.page) : 1,
    pageSize: router.query.pageSize ? Number(router.query.pageSize) : 10
  };

  const {data, error, isLoading} = useWebHooks(searchParams);

  const handleChangePage = useCallback(
    (pageNumber: number) => {
      router.push({
        pathname: router.pathname,
        query: {...router.query, page: pageNumber},
      });
    },
    [router]
  )

  const handleDelete = async (id: number) => {
    try {
      await deleteWebHook(id);
      router.reload();
    } catch (e) {
      message.error("오류가 발생했습니다");
    }
  }

  const columns: ColumnsType<IWebHook> = [
    {
      title: "ID",
      dataIndex: "id",
      width: "100px"
    },
    {
      title: "이름",
      dataIndex: "name",
      width: "200px"
    },
    {
      title: "설명",
      dataIndex: "description",
      width: "500px"
    },
    {
      key: "action",
      width: 120,
      align: "center",
      render: (_value: unknown, webHook: IWebHook) => {
        return <span className="flex justify-center gap-2">
                <Link href={`/settings/webhooks/notification-web-hooks/edit/${webHook.id}`}
                      className="px-2 py-1 text-sm btn">
                  수정
                </Link>
                <Popconfirm
                  title="권한을 삭제하시겠습니까?"
                  onConfirm={() => handleDelete(webHook.id)}
                  okText="예"
                  cancelText="아니오"
                >
                  <a className="px-2 py-1 text-sm btn">삭제</a>
                </Popconfirm>
                <Link href={`/settings/webhooks/notification-web-hooks/spec/${webHook.id}`}
                      className="px-2 py-1 text-sm btn">
                  호출예시
                </Link>
              </span>;
      },
    },
  ];

  if (error) {
    return <Alert message="데이터 로딩 중 오류가 발생했습니다." type="warning"/>;
  }

  return (
    <>
      <DefaultTableBtn className="justify-between">
        <div>
        </div>

        <div className="flex-item-list">
          <Button className="btn-with-icon" icon={<Download/>}>
            엑셀 다운로드
          </Button>
          <Button type="primary" onClick={() => router.push("/settings/webhooks/notification-web-hooks/new")}>
            웹훅 생성
          </Button>
        </div>
      </DefaultTableBtn>

      <DefaultTable<IWebHook>
        columns={columns}
        dataSource={data?.result || []}
        loading={isLoading}
        pagination={{
          current: Number(router.query.page || 1),
          defaultPageSize: 10,
          total: data?.totalCount || 0,
          showSizeChanger: false,
          onChange: handleChangePage,
        }}
        className="mt-3"
        countLabel={data?.totalCount}
      />
    </>
  );
};

export default React.memo(NotificationWebHookList);