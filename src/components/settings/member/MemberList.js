import React, {useEffect, useState} from "react";
import {Button, Collapse, Dropdown, Input, Menu, PageHeader, Space, Table, Tag} from 'antd';
import {MemberService} from "./member.service";
import {DownOutlined, SettingOutlined, SearchOutlined} from "@ant-design/icons";

const { Panel } = Collapse;
const { Column } = Table;
const PAGE_SIZE = 5;

let searchText = null;

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

  const getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            찾기
          </Button>
          <Button onClick={() => handleSearchReset(confirm, clearFilters)} size="small" style={{ width: 90 }}>
            초기화
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    searchText = selectedKeys[0];
    confirm();
  };

  const handleSearchReset = (confirm, clearFilters) => {
    clearFilters();
    searchText = null;
    confirm();
  };

  const memberTableChanged = (pagination, filters) => {
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

    if(searchText && searchText.length > 0) {
      params.name = searchText;
    }

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
          <Column title="이름" dataIndex="name" key="name" render={(text, record) => <span>{text}({record.candidateId})</span>}
                  {...getColumnSearchProps('name')}/>
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
