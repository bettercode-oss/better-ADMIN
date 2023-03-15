import React, {useEffect, useState} from "react";
import {Button, Col, Collapse, Dropdown, Form, Input, Row, Select, Table, Tag} from 'antd';
import {PageHeader} from '@ant-design/pro-layout';
import {DownOutlined, SettingOutlined} from "@ant-design/icons";
import {useLocation, useNavigate, useSearchParams} from "react-router-dom";
import MemberService from "../../../services/member.service";
import {SearchForm, SearchResult} from "../../modules/search-form";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc)

const {Panel} = Collapse;
const {Column} = Table;
const {Option} = Select;
const DEFAULT_PAGE_SIZE = 10;

const MemberList = () => {
  let location = useLocation();
  let navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form] = Form.useForm();

  const [tableDataSource, setTableDataSource] = useState({
    members: [],
    totalCount: 0,
  });

  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE
  });

  const [searchFilters, setSearchFilters] = useState(null);

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

    if (searchParams.get('name')) {
      params.name = searchParams.get('name');
      form.setFieldsValue({
        name: searchParams.get('name'),
      });
    }

    if (searchParams.get('types')) {
      const searchTypes = searchParams.get('types');
      params.types = searchTypes;
      form.setFieldsValue({
        types: searchTypes.split(',')
      });
    }

    if (searchParams.get('roles')) {
      const searchRoles = searchParams.get('roles');
      params.roleIds = searchRoles;
      form.setFieldsValue({
        roles: searchRoles.split(',')
      });
    }

    MemberService.getSearchFilters().then(response => {
      setSearchFilters(response.data);
    });

    MemberService.getMembersApproved(params).then(response => {
      setTableDataSource({
        members: response.data.result,
        totalCount: response.data.totalCount,
      });
    });
  }, [searchParams, form]);

  const handleTableChanged = (changedPagination) => {
    const baseUrl = location.pathname;
    let fullUrl = `${baseUrl}?page=${changedPagination.current}&pageSize=${changedPagination.pageSize}`;
    if (searchParams.get('name')) {
      fullUrl += `&name=${searchParams.get('name')}`;
    }

    navigate(fullUrl);
  }

  const onFinish = (values) => {
    const baseUrl = location.pathname;
    let searchUrl = `${baseUrl}?page=1&pageSize=${pagination.pageSize}`;

    if (values.name) {
      searchUrl += `&name=${values.name}`;
    }

    if (values.types && values.types.length > 0) {
      searchUrl += `&types=${values.types.join(",")}`;
    }

    if (values.roles && values.roles.length > 0) {
      searchUrl += `&roles=${values.roles.join(",")}`;
    }

    navigate(searchUrl);
  }

  const handleEditMemberRoles = (record) => {
    navigate(`/members/${record.id}?backUrl=${makeBackUrl()}`);
  }

  const makeBackUrl = () => {
    return encodeURIComponent(`${location.pathname}${location.search}`);
  }

  return (
    <>
      <PageHeader
        subTitle="멤버에 역할을 할당하거나 삭제합니다."
      >
        <SearchForm>
          <Form
            form={form}
            onFinish={onFinish}
          >
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item
                  name="name"
                  label="이름"
                >
                  <Input/>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="types"
                  label="유형"
                >
                  <Select
                    allowClear
                    mode="multiple"
                    showArrow
                    placeholder="모두"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {searchFilters && searchFilters.find(searchFilter => searchFilter.name === 'type') &&
                      searchFilters.find(searchFilter => searchFilter.name === 'type').filters.map(filter => (
                      <Option key={filter.value}>{filter.text}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="roles"
                  label="멤버 역할"
                >
                  <Select
                    allowClear
                    mode="multiple"
                    showArrow
                    placeholder="모두"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {searchFilters && searchFilters.find(searchFilter => searchFilter.name === 'role') &&
                      searchFilters.find(searchFilter => searchFilter.name === 'role').filters.map(filter => (
                        <Option key={filter.value}>{filter.text}</Option>
                      ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col
                span={24}
                style={{
                  textAlign: 'right',
                }}
              >
                <Button type="primary" htmlType="submit">
                  조회
                </Button>
                <Button
                  style={{
                    margin: '0 8px',
                  }}
                  onClick={() => {
                    form.resetFields();
                    onFinish({});
                  }}
                >
                  초기화
                </Button>
              </Col>
            </Row>
          </Form>
        </SearchForm>
        <SearchResult>
          <Table rowKey="id" dataSource={tableDataSource.members} locale={{emptyText: "데이터 없음"}} bordered
                 pagination={{
                   current: pagination.page,
                   pageSize: pagination.pageSize,
                   showSizeChanger: true,
                   total: tableDataSource.totalCount
                 }}
                 onChange={handleTableChanged}>
            <Column title="ID" dataIndex="id" key="id"/>
            <Column title="이름" dataIndex="name" key="name"
                    render={(text, record) => <span>{text}({record.candidateId})</span>}
            />
            <Column title="유형" dataIndex="typeName" key="types"
                    render={(text, record) => <Tag color={record.type === 'site' ? 'magenta' : 'blue'}>{text}</Tag>}
            />
            <Column title="멤버 역할" dataIndex="roles" key="roles" width="200px"
                    render={(text, record) => {
                      return <div>
                        {record.roles.map(role => (
                          <Tag key={role.id} color="orange">{role.name}</Tag>
                        ))}
                      </div>
                    }}
            />
            <Column title="소속 조직" render={(text, record) => {
              if (record.organizations) {
                return <Collapse ghost>
                  {record.organizations.map((organization) => {
                    return <Panel header={organization.name} key={organization.id}>
                      {organization.roles && organization.roles.map(role =>
                        (<Tag key={role.id} color="orange">{role.name}</Tag>))}
                    </Panel>
                  })
                  }</Collapse>
              }
            }}/>
            <Column title="최근 접속 시간" dataIndex="lastAccessAt" key="lastAccessAt"
                    render={(text, record) => {
                      if (text) {
                        const localDateTime = dayjs.utc(text).local().format('YYYY-MM-DD HH:mm');
                        return (<span>{localDateTime}</span>)
                      } else {
                        return (<span>접속 이력 없음</span>)
                      }
                    }}/>
            <Column title="" align='right' render={(text, record) => {
              const actionMenusItems = [{
                label:
                  <Button type="text" onClick={() => {
                    handleEditMemberRoles(record)
                  }}>멤버 역할 변경</Button>,
                key: '0',
              }];
              return (
                <Dropdown menu={{
                  items: actionMenusItems
                }} trigger={['click']}>
                  <Button style={{borderRadius: '5px'}} icon={<SettingOutlined/>}>
                    <DownOutlined/>
                  </Button>
                </Dropdown>)
            }}/>
          </Table>
        </SearchResult>
      </PageHeader>
    </>
  )
};
export default MemberList;
