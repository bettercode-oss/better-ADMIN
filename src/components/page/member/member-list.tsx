import DefaultTable from "@/components/shared/ui/default-table";
import DefaultTableBtn from "@/components/shared/ui/default-table-btn";
import {Alert, Button, Collapse, Tag} from "antd";
import {ColumnsType} from "antd/es/table";
import {Download} from "lucide-react";
import {useRouter} from "next/router";
import React, {useCallback} from "react";
import Link from "next/link";
import {IMember, IMemberParams, useMembersApproved} from "@/client/member/member";
import dayjs from "dayjs";
import {ISO8601DateTime} from "@/types/common";

const MemberList: React.FC = () => {
  const router = useRouter();

  const searchParams: IMemberParams = {
    page: router.query.page ? Number(router.query.page) : 1,
    pageSize: router.query.pageSize ? Number(router.query.pageSize) : 10
  };

  if (router.query.name) {
    searchParams.name = String(router.query.name);
  }

  if (router.query.types) {
    searchParams.types = String(router.query.types);
  }

  if (router.query.roles) {
    searchParams.roleIds = String(router.query.roles);
  }

  const {data, error, isLoading} = useMembersApproved(searchParams);

  const handleChangePage = useCallback(
    (pageNumber: number) => {
      router.push({
        pathname: router.pathname,
        query: {...router.query, page: pageNumber},
      });
    },
    [router]
  )

  const columns: ColumnsType<IMember> = [
    {
      title: "ID",
      dataIndex: "id",
      width: "60px"
    },
    {
      title: "이름",
      dataIndex: "name",
      render: (text: string, member: IMember) => <span>{text}({member.candidateId})</span>,
    },
    {
      title: "유형",
      dataIndex: "typeName",
      width: "100px",
      render: (text: string, member: IMember) => <Tag color={member.type === 'site' ? 'magenta' : 'blue'}>{text}</Tag>,
    },
    {
      title: "멤버 역할",
      dataIndex: "roles",
      width: "200px",
      render: (text: string, member: IMember) => <div>
        {member.roles.map((role) => (
          <Tag key={role.id} color="orange">{role.name}</Tag>
        ))}
      </div>,
    },
    {
      title: "소속 조직",
      render: (text: string, member: IMember) => {
        if (member.organizations) {
          return <Collapse ghost>
            {member.organizations.map((organization) => (
              <Collapse.Panel header={organization.name} key={organization.id}>
                {organization.roles && organization.roles.map((role) => (
                  <Tag key={role.id} color="orange">{role.name}</Tag>))}
              </Collapse.Panel>
            ))}
          </Collapse>;
        }
        return <></>
      },
    },
    {
      title: "최근 접속 시간",
      dataIndex: "lastAccessAt",
      render: (value: ISO8601DateTime) => {
        return (
          value ? <div className="text-sm">
            <span className="block">{dayjs(value).format("YYYY/MM/DD hh:mm")}</span>
          </div> : <span>접속 이력 없음</span>
        );
      },
    },
    {
      key: "action",
      width: 120,
      align: "center",
      render: (_value: unknown, member: IMember) => <span className="flex justify-center gap-2">
                      <Link href={`/member/edit/${member.id}`} className="px-2 py-1 text-sm btn">멤버 역할 변경</Link>
              </span>
      ,
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
        </div>
      </DefaultTableBtn>

      <DefaultTable<IMember>
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

export default React.memo(MemberList);
