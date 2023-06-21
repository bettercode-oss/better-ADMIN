import DefaultTable from "@/components/shared/ui/default-table";
import DefaultTableBtn from "@/components/shared/ui/default-table-btn";
import {Alert, Button, Collapse, message, Popconfirm, Tag} from "antd";
import {ColumnsType} from "antd/es/table";
import {Download} from "lucide-react";
import {useRouter} from "next/router";
import React, {useCallback} from "react";
import Link from "next/link";
import {deleteRole, IRole, IRoleParams, useRoles} from "@/client/access-control/role";

const RoleList: React.FC = () => {
  const router = useRouter();

  const searchParams: IRoleParams = {
    page: router.query.page ? Number(router.query.page) : 1,
    pageSize: router.query.pageSize ? Number(router.query.pageSize) : 10
  };

  if (router.query.name) {
    searchParams.name = String(router.query.name);
  }

  const {data, error, isLoading} = useRoles(searchParams);

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
      await deleteRole(id);
      router.reload();
    } catch (e) {
      message.error("오류가 발생했습니다");
    }
  }

  const columns: ColumnsType<IRole> = [
    {
      title: "유형",
      width: 100,
      dataIndex: "typeName",
      render: (text: string, role: IRole) => {
        return <Tag color={role.type === 'pre-define' ? 'magenta' : 'blue'}>{text}</Tag>;
      },
    },
    {
      title: "역할 이름",
      width: 300,
      dataIndex: "name",
      render: (text: string, role: IRole) => {
        return role.type === 'user-define' ?
          <span>{text}</span> : <span>{text}</span>;
      },
    },
    {
      title: "할당 권한",
      render: (text: string, role: IRole) => {
        if (role.permissions) {
          return (<Collapse ghost>
            <Collapse.Panel key={role.id} header={<span style={{color: "#5B71F3"}}>펼쳐 보기</span>}>
              {role.permissions.map(permission => (
                <Tag key={permission.id} color="orange">{permission.name}</Tag>
              ))}
            </Collapse.Panel>
          </Collapse>);
        } else {
          return <></>
        }
      }
    },
    {
      title: "설명",
      dataIndex: "description",
    },
    {
      key: "action",
      width: 120,
      align: "center",
      render: (_value: unknown, role: IRole) => {
        return role.type === 'user-define' ? (
          <span className="flex justify-center gap-2">
                <Link href={`/access-control/role/edit/${role.id}`} className="px-2 py-1 text-sm btn">
                  수정
                </Link>
                <Popconfirm
                  title="역할을 삭제하시겠습니까?"
                  onConfirm={() => handleDelete(role.id)}
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
          <Button type="primary" onClick={() => router.push("/access-control/role/new")}>
            역할 생성
          </Button>
        </div>
      </DefaultTableBtn>

      <DefaultTable<IRole>
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

export default React.memo(RoleList);
