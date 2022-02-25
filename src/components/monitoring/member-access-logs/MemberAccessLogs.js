import React, {useEffect, useState} from "react";
import {Button, Input, PageHeader, Space, Table, Tag} from "antd";
import moment from "moment";
import {MemberAccessLogService} from "./member.access.log.service";
import {SearchOutlined} from "@ant-design/icons";

const {Column} = Table;
const PAGE_SIZE = 5;

const MemberAccessLogs = () => {
  const [accessLogs, setAccessLogs] = useState([]);
  const [accessLogTotalCount, setAccessLogTotalCount] = useState(null);
  const [searchCondition, setSearchCondition] = useState({});

  useEffect(() => {
    loadAccessLogs({page: 1, pageSize: PAGE_SIZE});
  }, []);


  const loadAccessLogs = (params) => {
    MemberAccessLogService.getAccessLogs(params).then(response => {
      setAccessLogs(response.data.result);
      setAccessLogTotalCount(response.data.totalCount);
    });
  }

  const tableChanged = (pagination) => {
    const params = {
      page: pagination.current,
      pageSize: PAGE_SIZE
    };

    if(searchCondition) {
      if(searchCondition.searchText && searchCondition.searchText !== "") {
        params.memberId = searchCondition.searchText;
      }
    }

    MemberAccessLogService.getAccessLogs(params).then(response => {
      setAccessLogs(response.data.result);
      setAccessLogTotalCount(response.data.totalCount);
    });
  }

  const getColumnSearchProps = dataIndex => ({
    filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
      <div style={{padding: 8}}>
        <Input
          defaultValue={(searchCondition && searchCondition.searchText) ? searchCondition.searchText : null}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{marginBottom: 8, display: 'block'}}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined/>}
            size="small"
            style={{width: 90}}
          >
            찾기
          </Button>
          <Button onClick={() => handleSearchReset(confirm, clearFilters)} size="small" style={{width: 90}}>
            초기화
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{color: (searchCondition && searchCondition.searchText) ? '#1890ff' : undefined}}/>
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    const searchText = selectedKeys[0];
    setSearchCondition({
      searchText: searchText,
    });

    MemberAccessLogService.getAccessLogs({page: 1, pageSize: PAGE_SIZE, memberId: searchText}).then(response => {
      setAccessLogs(response.data.result);
      setAccessLogTotalCount(response.data.totalCount);
    });
  };

  const handleSearchReset = (confirm, clearFilters) => {
    clearFilters();
    confirm();
    setSearchCondition({
      searchText: null,
    });

    MemberAccessLogService.getAccessLogs({page: 1, pageSize: PAGE_SIZE}).then(response => {
      setAccessLogs(response.data.result);
      setAccessLogTotalCount(response.data.totalCount);
    });
  };

  return (
    <PageHeader
      title="멤버 접근 로그"
      subTitle="멤버가 접근한 화면과 호출한 API 기록을 보여 줍니다."
    >
      <Table rowKey="id" dataSource={accessLogs} locale={{emptyText: "데이터 없음"}}
             scroll={{ x: 1200 }}
             bordered
             size="small"
             pagination={{
               pageSize: PAGE_SIZE,
               total: accessLogTotalCount,
               showSizeChanger: false,
             }}
             onChange={tableChanged}
      >
        <Column title="멤버 ID" dataIndex="memberId" key="memberId" fixed="left" width={80}
                render={(text, record) => <span>{text}</span>}
                {...getColumnSearchProps('id')}/>

        <Column title="유형" dataIndex="typeName" key="types" fixed="left" width={80}
                render={(text, record) => <Tag color={record.type === 'API_ACCESS' ? 'magenta' : 'blue'}>{text}</Tag>}/>
        <Column title="URL" dataIndex="url" key="url"/>
        <Column title="HTTP 정보">
          <Column title="Method" dataIndex="method" key="method"/>
          <Column title="URL Parameters" dataIndex="parameters" key="parameters"/>
          <Column title="Body" dataIndex="payload" key="payload"/>
        </Column>
        <Column title="IP" dataIndex="ipAddress" key="ipAddress"/>
        <Column title="일시" dataIndex="lastAccessAt" key="lastAccessAt" fixed="right" width={150}
                render={(text, record) => {
                  const localDateTime = moment.utc(text).local().format('YYYY-MM-DD HH:mm');
                  return (<span>{localDateTime}</span>)
                }}/>
      </Table>
    </PageHeader>
  );

};


export default MemberAccessLogs;
