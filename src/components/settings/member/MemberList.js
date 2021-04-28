import React, {useEffect, useState} from "react";
import {Button, Dropdown, Menu, message, PageHeader, Table, Tag} from 'antd';
import {MemberService} from "./member.service";
import {DownOutlined, SettingOutlined} from "@ant-design/icons";

const PAGE_SIZE = 5;
const MemberList = ({onRoleChange}) => {
  const [members, setMembers] = useState([]);
  const [memberTotalCount, setMemberTotalCount] = useState(0);

  useEffect(() => {
    loadMembers({
      page: 1
    });
  }, []);

  const loadMembers = (params) => {
    params.pageSize = PAGE_SIZE;
    MemberService.getMembers(params).then(response => {
      setMembers(response.data.result);
      setMemberTotalCount(response.data.totalCount);
    }).catch(error => {
      message.error("조회 오류 입니다. 잠시 후 다시 시도해 주세요.");
    });
  }

  const memberTableChanged = (e) => {
    const params = {
      page: e.current,
    };

    loadMembers(params);
  }

  const columns = [{
    title: '아이디',
    dataIndex: 'id',
    key: 'id',
  }, {
    title: '이름',
    dataIndex: 'name',
    key: 'name',
  }, {
    title: '로그인 유형',
    dataIndex: 'typeName',
    key: 'typeName',
    render: (text, record) => (
      <Tag color={record.type === 'site' ? 'magenta' : 'blue'}>{text}</Tag>
    )
  }, {
    title: '역할',
    width: "200px",
    dataIndex: 'roles',
    key: 'roles',
    render: (text, record) => {
      return <div>
        {record.roles.map(role => (
          <Tag key={role.id} color="orange">{role.name}</Tag>
        ))}
      </div>
    }
  }, {
    title: '',
    align: 'right',
    render: (text, record) => {
      return (
        <Dropdown overlay={
          <Menu>
            <Menu.Item key="0">
              <Button type="text" onClick={() => {onRoleChange(record)}}>역할 변경</Button>
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
        title="멤버"
        subTitle="멤버에 역할을 할당하거나 삭제합니다."
      >
        <Table rowKey="id" dataSource={members} columns={columns} locale={{emptyText: "데이터 없음"}}
               pagination={{pageSize: PAGE_SIZE, total: memberTotalCount}}
               onChange={memberTableChanged}/>
      </PageHeader>
    </>
  )
};
export default MemberList;
