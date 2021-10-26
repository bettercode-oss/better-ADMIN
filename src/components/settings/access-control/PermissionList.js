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

const { confirm } = Modal;
const PAGE_SIZE = 5;
const PermissionList = ({onCreate, onEdit}) => {
  const [permissions, setPermissions] = useState([]);
  const [permissionTotalCount, setPermissionTotalCount] = useState(0);

  useEffect(() => {
    loadPermissions({
      page: 1
    });
  }, []);

  const loadPermissions = (params) => {
    params.pageSize = PAGE_SIZE;
    AccessControlService.getPermissions(params).then(response => {
      setPermissions(response.data.result);
      setPermissionTotalCount(response.data.totalCount);
    });
  }

  const permissionTableChanged = (e) => {
    const params = {
      page: e.current,
    };

    loadPermissions(params);
  }

  const deletePermission = (permissionId) => {
    AccessControlService.deletePermission(permissionId).then(() => {
      loadPermissions({
        page: 1
      });
    });
  }

  const deleteConfirm = (permissionId) => {
    confirm({
      title: '권한을 삭제하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        deletePermission(permissionId);
      },
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
    title: '권한',
    dataIndex: 'name',
    key: 'name',
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
        title="권한(Permission)"
        subTitle="역할(Role)에 할당할 권한을 관리합니다."
        extra={[
          <Button key="1" type="primary" icon={<PlusCircleOutlined/>} onClick={onCreate}>권한 추가</Button>,
        ]}
      >
        <Table rowKey="id" dataSource={permissions} columns={columns} locale={{emptyText: "데이터 없음"}}
               pagination={{pageSize: PAGE_SIZE, total: permissionTotalCount}}
               onChange={permissionTableChanged}/>
      </PageHeader>
    </>
  )
};
export default PermissionList;
