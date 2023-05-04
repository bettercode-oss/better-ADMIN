/* eslint-disable */
import React, {useEffect, useState} from "react";
import {Button, Col, Collapse, Dropdown, Form, Input, Modal, Row, Table, Tag} from 'antd';
import {PageHeader} from '@ant-design/pro-layout';
import {
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  PlusCircleOutlined,
  SettingOutlined
} from '@ant-design/icons';
import AccessControlService from "../../../../services/access.control.service";
import {Link, useLocation, useNavigate, useSearchParams} from "react-router-dom";
import {SearchForm, SearchResult} from "../../../modules/search-form";

const {confirm} = Modal;
const {Panel} = Collapse;
const {Column} = Table;

const DEFAULT_PAGE_SIZE = 10;

const RoleList = () => {
  let location = useLocation();
  let navigate = useNavigate();
  const [form] = Form.useForm();
  const [searchParams] = useSearchParams();
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE
  });
  const [tableDataSource, setTableDataSource] = useState({
    roles: [],
    totalCount: 0,
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

    if (searchParams.get('name')) {
      params.name = searchParams.get('name');
      form.setFieldsValue({
        name: searchParams.get('name'),
      });
    }

    AccessControlService.getRoles(params).then(response => {
      setTableDataSource({
        roles: response.data.result,
        totalCount: response.data.totalCount,
      })
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

  const deleteConfirm = (roleId) => {
    confirm({
      title: '역할을 삭제하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      icon: <ExclamationCircleOutlined/>,
      onOk() {
        deleteRole(roleId);
      },
    });
  }  

  const deleteRole = (roleId) => {
    AccessControlService.deleteRole(roleId).then(() => {
      window.location.reload();
    });
  }

  const handleCreateRole = () => {
    navigate(`/access-control/roles/new?backUrl=${makeBackUrl()}`);
  }

  const handleEditRole = (record) => {
    navigate(`/access-control/roles/${record.id}?backUrl=${makeBackUrl()}`);
  }

  const makeBackUrl = () => {
    return encodeURIComponent(`${location.pathname}${location.search}`);
  }


  const onFinish = (values) => {
    const baseUrl = location.pathname;
    let searchUrl = `${baseUrl}?page=1&pageSize=${pagination.pageSize}`;

    if (values.name) {
      searchUrl += `&name=${values.name}`;
    }
    navigate(searchUrl);
  }

  return (
    <>
      <PageHeader
        subTitle="역할을 만들고 권한을 할당하거나 삭제 합니다."
        extra={[
          <Button key="1" type="primary" icon={<PlusCircleOutlined/>} onClick={handleCreateRole}>역할 생성</Button>,
        ]}
      >
        <SearchForm >
          <Form
            data-testid="role-search"
            form={form}
            onFinish={onFinish}
          >
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item
                  name="name"
                  label="역할 이름"
                >
                  <Input/>
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
          <Table data-testid="role-table" rowKey="id" dataSource={tableDataSource.roles} locale={{emptyText: "데이터 없음"}} bordered
                 pagination={{
                   current: pagination.page,
                   pageSize: pagination.pageSize,
                   showSizeChanger: true,
                   total: tableDataSource.totalCount
                 }}
                 onChange={handleTableChanged}>
            <Column title="유형" dataIndex="typeName" key="typeName"
                    render={(text, record) => {
                      return <Tag color={record.type === 'pre-define' ? 'magenta' : 'blue'}>{text}</Tag>
                    }}/>
            <Column title="역할 이름" dataIndex="name" key="name"
                    render={(text, record) => {
                      return record.type === 'user-define' ?
                        <Link to={`/access-control/roles/${record.id}?backUrl=${makeBackUrl()}`}>{text}</Link> :
                        <span>{text}</span>;
                    }}/>
            <Column title="할당 권한" width="200px"
                    render={(text, record) => {
                      if (record.permissions) {
                        return (<Collapse ghost>
                          <Panel header={<span style={{color: "#5B71F3"}}>펼쳐 보기</span>}>
                            {record.permissions.map(permission => (
                              <Tag key={permission.id} color="orange">{permission.name}</Tag>
                            ))}
                          </Panel>
                        </Collapse>);
                      } else {
                        return <></>
                      }
                    }}/>
            <Column title="설명" dataIndex="description" key="description"/>
            <Column title="Action"
                    render={(text, record) => {
                      if (record.type === 'user-define') {
                        const actionMenusItems = [{
                          label: <Button type="text" icon={<EditOutlined/>}
                                         onClick={() => handleEditRole(record)}>수정</Button>,
                          key: '0',
                        },{
                          label: <Button type="text" icon={<DeleteOutlined/>}
                                         onClick={() => deleteConfirm(record.id)}>삭제</Button>,
                          key: '1',
                        }];
                        return (
                          <Dropdown menu={{
                            items: actionMenusItems
                          }} trigger={['click']}>
                            <Button style={{borderRadius: '5px'}} icon={<SettingOutlined/>}>
                              <DownOutlined/>
                            </Button>
                          </Dropdown>);
                      }
                    }}/>
          </Table>
        </SearchResult>
      </PageHeader>
    </>
  )
};
export default RoleList;
