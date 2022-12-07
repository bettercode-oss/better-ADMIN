import React, {useEffect, useState} from "react";
import {Button, Dropdown, Modal, PageHeader, Table} from 'antd';
import {
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  PlusCircleOutlined,
  SettingOutlined
} from "@ant-design/icons";
import {WebHookService} from "../../../services/webhook.service";
import {useLocation, useNavigate, useSearchParams} from "react-router-dom";
import {CgDetailsMore} from "react-icons/cg";

const {confirm} = Modal;
const DEFAULT_PAGE_SIZE = 10;
const {Column} = Table;

const NotificationWebHookList = () => {
  let location = useLocation();
  let navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [tableDataSource, setTableDataSource] = useState({
    webhooks: [],
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

    WebHookService.getWebHooks(params).then(response => {
      setTableDataSource({
        webhooks: response.data.result,
        totalCount: response.data.totalCount,
      });
    });
  }, [searchParams]);

  const deleteWebHook = (id) => {
    WebHookService.deleteWebHook(id).then(() => {
      window.location.reload();
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

  const handleCreate = () => {
    navigate(`/web-hooks/notifications/new?backUrl=${makeBackUrl()}`);
  }

  const makeBackUrl = () => {
    return encodeURIComponent(`${location.pathname}${location.search}`);
  }

  const handleTableChanged = (changedPagination) => {
    const baseUrl = location.pathname;
    navigate(`${baseUrl}?page=${changedPagination.current}&pageSize=${changedPagination.pageSize}`);
  }

  const handleShowCallSampleDetails = (webhook) => {
    navigate(`/web-hooks/notifications/${webhook.id}/call-sample-details?backUrl=${makeBackUrl()}`);
  }

  const handleEdit = (webhook) => {
    navigate(`/web-hooks/notifications/${webhook.id}?backUrl=${makeBackUrl()}`);
  }

  return (
    <>
      <PageHeader
        subTitle="알림 웹훅을 등록하고 메시지를 실어 HTTP를 통해 호출하면 로그인한 사용자에게 알림 메시지가 나타납니다."
        extra={[
          <Button key="1" type="primary" icon={<PlusCircleOutlined/>} onClick={handleCreate}>웹훅 생성</Button>,
        ]}
      >
        <Table rowKey="id" dataSource={tableDataSource.webhooks} locale={{emptyText: "데이터 없음"}} bordered
               pagination={{
                 current: pagination.page,
                 pageSize: pagination.pageSize,
                 showSizeChanger: true,
                 total: tableDataSource.totalCount
               }}
               onChange={handleTableChanged}>
          <Column title="ID" dataIndex="id" key="id"/>
          <Column title="이름" dataIndex="name" key="name"/>
          <Column title="설명" dataIndex="description" key="description"/>
          <Column title="Action" render={(text, record) => {
            const actionMenusItems = [{
              label: <Button type="text" icon={<EditOutlined/>} onClick={() => handleEdit(record)}>수정</Button>,
              key: '0',
            }, {
              label: <Button type="text" icon={<DeleteOutlined/>} onClick={() => deleteConfirm(record.id)}>삭제</Button>,
              key: '1',
            }, {type: 'divider'}, {
              label: <Button type="text" icon={<CgDetailsMore/>} onClick={() => handleShowCallSampleDetails(record)}>
                <span style={{marginLeft: "10px"}}>호출 예시 보기</span>
              </Button>,
              key: '2',
            }];
            return (
              <Dropdown menu={{
                items: actionMenusItems
              }} trigger={['click']}>
                <Button style={{borderRadius: '5px'}} icon={<SettingOutlined/>}>
                  <DownOutlined/>
                </Button>
              </Dropdown>);
          }}/>
        </Table>
      </PageHeader>
    </>
  )
};
export default NotificationWebHookList;
