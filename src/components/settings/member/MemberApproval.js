import React, {useEffect, useState} from "react";
import {Button, Dropdown, Menu, message, PageHeader, Popconfirm, Table} from 'antd';
import {MemberService} from "./member.service";
import {DownOutlined, SettingOutlined} from "@ant-design/icons";

const PAGE_SIZE = 5;
const MemberApproval = ({onRoleChange}) => {
  const [members, setMembers] = useState([]);
  const [memberTotalCount, setMemberTotalCount] = useState(0);

  useEffect(() => {
    loadMembers({
      page: 1
    });
  }, []);

  const loadMembers = (params) => {
    params.pageSize = PAGE_SIZE;
    MemberService.getMembersApplied(params).then(response => {
      setMembers(response.data.result);
      setMemberTotalCount(response.data.totalCount);
    });
  }

  const memberTableChanged = (e) => {
    const params = {
      page: e.current,
    };

    loadMembers(params);
  }

  const approveMember =(memberId) => {
    MemberService.approveMember(memberId).then(response => {
      message.success("승인 되었습니다.");
      loadMembers({
        page: 1
      });
    });
  }

  const columns = [{
    title: '사용자 아이디',
    dataIndex: 'signId',
    key: 'signId',
  }, {
    title: '이름',
    dataIndex: 'name',
    key: 'name',
  }, {
    title: '',
    align: 'right',
    render: (text, record) => {
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
                <Button type="text">멤버 승인</Button>
              </Popconfirm>
            </Menu.Item>
          </Menu>} trigger={['click']}>
          <Button style={{borderRadius: '5px'}} icon={<SettingOutlined/>}>
            <DownOutlined/>
          </Button>
        </Dropdown>)
    }
  }];

  return (
    <>
      <PageHeader
        title="멤버 승인"
        subTitle="신청한 멤버를 승인 합니다."
      >
        <Table rowKey="id" dataSource={members} columns={columns} locale={{emptyText: "데이터 없음"}}
               pagination={{pageSize: PAGE_SIZE, total: memberTotalCount}}
               onChange={memberTableChanged}/>
      </PageHeader>
    </>
  )
};
export default MemberApproval;
