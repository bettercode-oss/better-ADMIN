import React, {useEffect, useState} from "react";
import {Button, Dropdown, Menu, Modal, PageHeader, Table} from 'antd';
import {
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  PlusCircleOutlined,
  SettingOutlined
} from "@ant-design/icons";
import {WebHookService} from "./webhook.service";

const {confirm} = Modal;
const PAGE_SIZE = 5;

const WebHooksList = ({onCreate, onEdit, onShowDetails}) => {
  const [webHooks, setWebHooks] = useState([]);
  const [webHookTotalCount, setWebHookTotalCount] = useState(0);

  useEffect(() => {
    loadWebHooks({
      page: 1
    });
  }, []);

  const loadWebHooks = (params) => {
    params.pageSize = PAGE_SIZE;
    WebHookService.getWebHooks(params).then(response => {
      setWebHooks(response.data.result);
      setWebHookTotalCount(response.data.totalCount);
    });
  }

  const webHookTableChanged = (e) => {
    const params = {
      page: e.current,
    };

    loadWebHooks(params);
  }

  const deleteWebHook = (id) => {
    WebHookService.deleteWebHook(id).then(() => {
      loadWebHooks({
        page: 1
      });
    });
  }

  const deleteConfirm = (id) => {
    confirm({
      title: '웹훅을 삭제하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      icon: <ExclamationCircleOutlined/>,
      onOk() {
        deleteWebHook(id);
      },
    });
  }

  const columns = [
    {
      title: '이름',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '설명',
      dataIndex: 'description',
      key: 'description',
    }, {
      title: '',
      width: "200px",
      render: (text, record) => (
        <Button shape="round" onClick={() => onShowDetails(record)}>호출 예시 보기</Button>
      )
    }, {
      title: '',
      width: "100px",
      align: 'right',
      render: (text, record) => {
        return (
          <Dropdown overlay={
            <Menu>
              <Menu.Item key={1}>
                <Button type="text" icon={<EditOutlined/>} onClick={() => onEdit(record)}>수정</Button>
              </Menu.Item>
              <Menu.Item key={2}>
                <Button type="text" icon={<DeleteOutlined/>} onClick={() => deleteConfirm(record.id)}>삭제</Button>
              </Menu.Item>
            </Menu>} trigger={['click']}>
            <Button style={{borderRadius: '5px'}} icon={<SettingOutlined/>}>
              <DownOutlined/>
            </Button>
          </Dropdown>);
      }
    }
  ];

  return (
    <>
      <PageHeader
        title="알림 웹훅(WebHooks)"
        subTitle="웹훅 목록을 보여주고 등록합니다."
        extra={[
          <Button key="1" type="primary" icon={<PlusCircleOutlined/>} onClick={onCreate}>웹훅 추가</Button>,
        ]}
      >
        <Table rowKey="id" dataSource={webHooks} columns={columns} locale={{emptyText: "데이터 없음"}}
               pagination={{pageSize: PAGE_SIZE, total: webHookTotalCount}}
               onChange={webHookTableChanged}/>
      </PageHeader>
    </>
  )
};
export default WebHooksList;
