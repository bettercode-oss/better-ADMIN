import DefaultTable from "@/components/shared/ui/default-table";
import DefaultTableBtn from "@/components/shared/ui/default-table-btn";
import {Alert, Button, message, Popconfirm} from "antd";
import {ColumnsType} from "antd/es/table";
import {Download} from "lucide-react";
import {useRouter} from "next/router";
import React, {useCallback} from "react";
import {approveMember, IMember, IMemberParams, rejectMember, useMembersApplied} from "@/client/member/member";
import dayjs from "dayjs";
import {ISO8601DateTime} from "@/types/common";

const MemberApprovalList: React.FC = () => {
  const router = useRouter();

  const searchParams: IMemberParams = {
    page: router.query.page ? Number(router.query.page) : 1,
    pageSize: router.query.pageSize ? Number(router.query.pageSize) : 10
  };

  const {data, error, isLoading} = useMembersApplied(searchParams);

  const handleChangePage = useCallback(
    (pageNumber: number) => {
      router.push({
        pathname: router.pathname,
        query: {...router.query, page: pageNumber},
      });
    },
    [router]
  )

  const handleApproveMember = async (memberId: number) => {
    try {
      await approveMember(memberId);
      message.success("승인 되었습니다");
      setTimeout(() => router.reload(), 500);
    } catch (e) {
      message.error("오류가 발생했습니다");
    }
  }

  const handleRejectMember = async (memberId: number) => {
    try {
      await rejectMember(memberId);
      message.success("승인 거절 되었습니다");
      setTimeout(() => router.reload(), 500);
    } catch (e) {
      message.error("오류가 발생했습니다");
    }
  }

  const columns: ColumnsType<IMember> = [
    {
      title: "사용자 아이디",
      dataIndex: "signId"
    },
    {
      title: "이름",
      dataIndex: "name"
    },
    {
      title: "신청 일시",
      dataIndex: "createdAt",
      render: (value: ISO8601DateTime) => {
        return (
          <div className="text-sm">
            <span className="block">{dayjs(value).format("YYYY/MM/DD hh:mm")}</span>
          </div>
        );
      },
    },
    {
      key: "action",
      width: 120,
      align: "center",
      render: (_value: unknown, member: IMember) => <span className="flex justify-center gap-2">
              <Popconfirm
                title={`${member.signId} 를 승인 하시겠습니까?`}
                onConfirm={() => handleApproveMember(member.id)}
                okText="예"
                cancelText="아니오"
              >
                <a className="px-2 py-1 text-sm btn">승인</a>
              </Popconfirm>
              <Popconfirm
                title={`${member.signId} 를 거절 하시겠습니까?`}
                onConfirm={() => handleRejectMember(member.id)}
                okText="예"
                cancelText="아니오"
              >
                <a className="px-2 py-1 text-sm btn">거절</a>
              </Popconfirm>
          </span>,
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

export default React.memo(MemberApprovalList);
