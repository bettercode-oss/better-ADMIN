import React, {useEffect, useState} from "react";
import {Button, Dropdown, Menu, Modal, PageHeader, Table, Tag} from 'antd';
import {
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  PlusCircleOutlined,
  SettingOutlined
} from '@ant-design/icons';
import {AccessControlService} from "./access.control.service";

const {confirm} = Modal;

const PAGE_SIZE = 5;
const RoleList = ({onCreate, onEdit}) => {
  const [roles, setRoles] = useState([]);
  const [roleTotalCount, setRoleTotalCount] = useState(0);

  useEffect(() => {
    loadRoles({
      page: 1
    });
  }, []);

  const loadRoles = (params) => {
    params.pageSize = PAGE_SIZE;
    AccessControlService.getRoles(params).then(response => {
      setRoles(response.data.result);
      setRoleTotalCount(response.data.totalCount);
    });
  }

  const roleTableChanged = (e) => {
    const params = {
      page: e.current,
    };

    loadRoles(params);
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
      loadRoles({
        page: 1
      });
    });
  }

  const columns = [{
    title: '유형',
    dataIndex: 'typeName',
    key: 'typeName',
    render: (text, record) => (
      <Tag color={record.type === 'pre-define' ? 'magenta' : 'blue'}>{text}</Tag>
    )
  }, {
    title: '역할',
    dataIndex: 'name',
    key: 'name',
  }, {
    title: '할당 권한',
    width: "200px",
    render: (text, record) => {
      return <div>
        {record.permissions.map(permission => (
          <Tag key={permission.id} color="orange">{permission.name}</Tag>
        ))}
      </div>
    }
  }, {
    title: '설명',
    dataIndex: 'description',
    key: 'description',
  }, {
    title: '',
    align: 'right',
    render: (text, record) => {
      if (record.type === 'user-define') {
        return (
          <Dropdown overlay={
            <Menu>
              <Menu.Item>
                <Button type="text" icon={<EditOutlined/>} onClick={() => onEdit(record)}>수정</Button>
              </Menu.Item>
              <Menu.Item>
                <Button type="text" icon={<DeleteOutlined/>} onClick={() => deleteConfirm(record.id)}>삭제</Button>
              </Menu.Item>
            </Menu>} trigger={['click']}>
            <Button style={{borderRadius: '5px'}} icon={<SettingOutlined/>}>
              <DownOutlined/>
            </Button>
          </Dropdown>);
      }
    }
  }];

  return (
    <>
      <PageHeader
        title="역할(Role)"
        subTitle="역할을 만들고 권한을 할당하거나 삭제 합니다."
        extra={[
          <Button key="1" type="primary" icon={<PlusCircleOutlined/>} onClick={onCreate}>역할 추가</Button>,
        ]}
      >
        <Table rowKey="id" dataSource={roles} columns={columns} locale={{emptyText: "데이터 없음"}}
               pagination={{pageSize: PAGE_SIZE, total: roleTotalCount}}
               onChange={roleTableChanged}/>
      </PageHeader>
    </>
  )
};
export default RoleList;
