import DefaultTable from "@/components/shared/ui/default-table";
import DefaultTableBtn from "@/components/shared/ui/default-table-btn";
import {Alert, Button, message, Popconfirm, Tag} from "antd";
import {ColumnsType} from "antd/es/table";
import {Download} from "lucide-react";
import {useRouter} from "next/router";
import React, {useCallback} from "react";
import {
  deletePermission,
  IPermission,
  IPermissionParams,
  usePermissions
} from "@/client/access-control/permission";
import Link from "next/link";

const PermissionList: React.FC = () => {
  const router = useRouter();

  const searchParams: IPermissionParams = {
    page: router.query.page ? Number(router.query.page) : 1,
    pageSize: router.query.pageSize ? Number(router.query.pageSize) : 10
  };

  if (router.query.name) {
    searchParams.name = String(router.query.name);
  }

  const {data, error, isLoading} = usePermissions(searchParams);

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
      await deletePermission(id);
      router.reload();
    } catch (e) {
      message.error("오류가 발생했습니다");
    }
  }

  const columns: ColumnsType<IPermission> = [
    {
      title: "유형",
      width: 100,
      dataIndex: "typeName",
      render: (text: string, permission: IPermission) => {
        return <Tag color={permission.type === 'pre-define' ? 'magenta' : 'blue'}>{text}</Tag>;
      },
    },
    {
      title: "권한 이름",
      dataIndex: "name",
      render: (text: string, permission: IPermission) => {
        return permission.type === 'user-define' ?
          <Link href={`/access-control/permission/edit/${permission.id}`}>{text}</Link>
          : <span>{text}</span>;
      },
    },
    {
      title: "설명",
      dataIndex: "description",
    },
    {
      key: "action",
      width: 120,
      align: "center",
      render: (_value: unknown, permission: IPermission) => {
        return permission.type === 'user-define' ? (
          <span className="flex justify-center gap-2">
                <Link href={`/access-control/permission/edit/${permission.id}`} className="px-2 py-1 text-sm btn">
                  수정
                </Link>
                <Popconfirm
                  title="권한을 삭제하시겠습니까?"
                  onConfirm={() => handleDelete(permission.id)}
                  okText="예"
                  cancelText="아니오"
                >
                  <a className="px-2 py-1 text-sm btn">삭제</a>
                </Popconfirm>
              </span>
        ) : <span></span>;
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
          <Button type="primary" onClick={() => router.push("/access-control/permission/new")}>
            권한 생성
          </Button>
        </div>
      </DefaultTableBtn>

      <DefaultTable<IPermission>
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

export default React.memo(PermissionList);
