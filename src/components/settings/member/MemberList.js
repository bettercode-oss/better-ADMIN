import React, {useEffect, useState} from "react";
import {Button, Collapse, Dropdown, Menu, PageHeader, Table, Tag} from 'antd';
import {MemberService} from "./member.service";
import {DownOutlined, SettingOutlined} from "@ant-design/icons";

const { Panel } = Collapse;
const { Column } = Table;
const PAGE_SIZE = 5;

const MemberList = ({onRoleChange}) => {
  const [members, setMembers] = useState([]);
  const [memberTotalCount, setMemberTotalCount] = useState(0);
  const [searchFilters, setSearchFilters] = useState(null);

  useEffect(() => {
    loadSearchFilters();
    loadMembers({
      page: 1
    });
  }, []);

  const loadMembers = (params) => {
    params.pageSize = PAGE_SIZE;
    MemberService.getMembersApproved(params).then(response => {
      setMembers(response.data.result);
      setMemberTotalCount(response.data.totalCount);
    });
  }

  const loadSearchFilters = () => {
    MemberService.getSearchFilters().then(response => {
      setSearchFilters(response.data);
    });
  }

  const memberTableChanged = (pagination, filters) => {
    console.log('memberTableChanged', pagination, filters);

    const params = {
      page: pagination.current,
    };

    if(filters) {
      if(filters.types) {
        params.types = filters.types.join(",");
      }

      if(filters.roles) {
        params.roleIds = filters.roles.join(",");
      }
    }

    console.log('aaaa', params);


    loadMembers(params);
  }

  return (
    <>
      <PageHeader
        title="멤버"
        subTitle="멤버에 역할을 할당하거나 삭제합니다."
      >
        {searchFilters &&
        <Table rowKey="id" dataSource={members} locale={{emptyText: "데이터 없음"}}
               pagination={{pageSize: PAGE_SIZE, total: memberTotalCount}}
               onChange={memberTableChanged}>
          <Column title="이름" dataIndex="name" key="name" render={(text, record) => <span>{text}({record.candidateId})</span>} />
          <Column title="유형" dataIndex="typeName" key="types"
                  filters={(searchFilters && searchFilters.length > 0) ? searchFilters.filter(s => s.name === 'type')[0].filters : []}
                  render={(text, record) => <Tag color={record.type === 'site' ? 'magenta' : 'blue'}>{text}</Tag>} />
          <Column title="멤버 역할" dataIndex="roles" key="roles" width="200px"
                  filters={(searchFilters && searchFilters.length > 0) ? searchFilters.filter(s => s.name === 'role')[0].filters : []}
                  render={(text, record) => {
            return <div>
              {record.roles.map(role => (
                <Tag key={role.id} color="orange">{role.name}</Tag>
              ))}
            </div>
          }} />
          <Column title="소속 조직" render={(text, record) => {
            if(record.organizations) {
              return <Collapse ghost>
                {record.organizations.map((organization) => {
                  return <Panel header={organization.name} key={organization.id}>
                    {organization.roles && organization.roles.map(role =>
                      (<Tag key={role.id} color="orange">{role.name}</Tag>))}
                  </Panel>
                })
                }</Collapse>
            }
          }} />
          <Column title="" align='right' render={(text, record) => {
            return (
              <Dropdown overlay={
                <Menu>
                  <Menu.Item key="0">
                    <Button type="text" onClick={() => {onRoleChange(record)}}>멤버 역할 변경</Button>
                  </Menu.Item>
                </Menu>} trigger={['click']}>
                <Button style={{borderRadius: '5px'}} icon={<SettingOutlined/>}>
                  <DownOutlined/>
                </Button>
              </Dropdown>)
          }} />
        </Table>}
      </PageHeader>
    </>
  )
};
export default MemberList;
