import React, {useEffect, useState} from "react";
import {Button, Dropdown, Menu, message, PageHeader, Popconfirm, Table} from 'antd';
import {MemberService} from "./member.service";
import {CheckOutlined, CloseOutlined, DownOutlined, SettingOutlined} from "@ant-design/icons";
import moment from "moment";
import {useLocation, useNavigate, useSearchParams} from "react-router-dom";

const {Column} = Table;
const DEFAULT_PAGE_SIZE = 10;

const MemberApproval = () => {
  const [searchParams] = useSearchParams();
  let location = useLocation();
  let navigate = useNavigate();

  const [tableDataSource, setTableDataSource] = useState({
    members: [],
    totalCount: 0,
  });

  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE
  });

  useEffect(() => {
    const page = searchParams.get('page') ? parseInt(searchParams.get('page')) : 1;
    const pageSize = searchParams.get('pageSize') ? parseInt(searchParams.get('pageSize')) : DEFAULT_PAGE_SIZE;
    setPagination({
      page: page,
      pageSize: pageSize
    });

    const params = {
      page: page,
      pageSize: pageSize,
    };

    MemberService.getMembersApplied(params).then(response => {
      setTableDataSource({
        members: response.data.result,
        totalCount: response.data.totalCount,
      });
    });

  }, [searchParams]);

  const approveMember = (memberId) => {
    MemberService.approveMember(memberId).then(response => {
      message.success("승인 되었습니다.");
      window.location.reload();
    });
  }

  const rejectMember = (memberId) => {
    MemberService.rejectMember(memberId).then(response => {
      message.success("승인 거절 되었습니다.");
      window.location.reload();
    });
  }

  const handleTableChanged = (changedPagination) => {
    const baseUrl = location.pathname;
    let fullUrl = `${baseUrl}?page=${changedPagination.current}&pageSize=${changedPagination.pageSize}`;
    navigate(fullUrl);
  }

  return (
    <>
      <PageHeader
        subTitle="신청한 멤버를 승인하거나 거절 합니다."
      >
        <Table rowKey="id" dataSource={tableDataSource.members} locale={{emptyText: "데이터 없음"}} bordered
               pagination={{
                 current: pagination.page,
                 pageSize: pagination.pageSize,
                 showSizeChanger: true,
                 total: tableDataSource.totalCount
               }}
               onChange={handleTableChanged}>
          <Column title="사용자 아이디" dataIndex="signId" key="signId"/>
          <Column title="이름" dataIndex="name" key="name"/>
          <Column title="신청 일시" dataIndex="createdAt" key="createdAt"
                  render={(text, record) => {
                    const localDateTime = moment.utc(text).local().format('YYYY-MM-DD HH:mm');
                    return (<span>{localDateTime}</span>)
                  }}
          />
          <Column render={(text, record) => {
            return (
              <Dropdown overlay={
                <Menu>
                  <Menu.Item key="0">
                    <Popconfirm
                      title="선택한 사용자를 승인 하시겠습니까?"
                      onConfirm={() => {
                        approveMember(record.id);
                      }}
                      okText="예"
                      cancelText="아니오"
                    >
                      <Button type="text" icon={<CheckOutlined/>}>승인</Button>
                    </Popconfirm>
                  </Menu.Item>
                  <Menu.Item key="1">
                    <Popconfirm
                      title="선택한 사용자를 승인 거절 하시겠습니까?"
                      onConfirm={() => {
                        rejectMember(record.id);
                      }}
                      okText="예"
                      cancelText="아니오"
                    >
                      <Button type="text" icon={<CloseOutlined/>}>거절</Button>
                    </Popconfirm>
                  </Menu.Item>
                </Menu>} trigger={['click']}>
                <Button style={{borderRadius: '5px'}} icon={<SettingOutlined/>}>
                  <DownOutlined/>
                </Button>
              </Dropdown>)
          }}
          />
        </Table>
      </PageHeader>
    </>
  )
};
export default MemberApproval;
