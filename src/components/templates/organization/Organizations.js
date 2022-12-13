import React, {useEffect, useState} from "react";
import {Button, Col, Descriptions, Dropdown, message, PageHeader, Popconfirm, Row, Tag, Tree} from "antd";
import {ApartmentOutlined, DeleteOutlined, DownOutlined, EditOutlined, SettingOutlined} from "@ant-design/icons";
import {OrganizationService} from "../../../services/organization.service";
import {useLocation, useNavigate} from "react-router-dom";

const Organizations = () => {
  let location = useLocation();
  const navigate = useNavigate();

  const [treeData, setTreeData] = useState([]);
  const [selectedOrganization, setSelectedOrganization] = useState(null);

  useEffect(() => {
    OrganizationService.getOrganizations().then(response => {
      setTreeData(convertToTreeData(response.data));
    });
  }, []);

  const convertToTreeData = (organizations) => {
    const data = JSON.parse(JSON.stringify(organizations)
      .replaceAll("\"id\"", "\"key\"")
      .replaceAll("\"name\"", "\"title\"")
      .replaceAll("\"subOrganizations\"", "\"children\""));
    return data;
  }

  const onDrop = info => {
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const loop = (data, key, callback) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
          return callback(data[i], i, data);
        }
        if (data[i].children) {
          loop(data[i].children, key, callback);
        }
      }
    };
    const data = [...treeData];

    // Find dragObject
    let dragObj;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      // Drop on the content
      loop(data, dropKey, item => {
        item.children = item.children || [];
        item.children.unshift(dragObj);
      });
    } else if (
      (info.node.props.children || []).length > 0 && // Has children
      info.node.props.expanded && // Is expanded
      dropPosition === 1 // On the bottom gap
    ) {
      loop(data, dropKey, item => {
        item.children = item.children || [];
        item.children.unshift(dragObj);
      });
    } else {
      let ar;
      let i;
      loop(data, dropKey, (item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj);
      } else {
        ar.splice(i + 1, 0, dragObj);
      }
    }

    const findParentNodeLoop = (nodes, parentNode, key, callback) => {
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].key === key) {
          return callback(parentNode);
        }
        if (nodes[i].children) {
          findParentNodeLoop(nodes[i].children, nodes[i], key, callback);
        }
      }
    };

    findParentNodeLoop(data, null, dragObj.key, (parentNode) => {
      // 조직도 변경 반영
      const organizationId = dragObj.key;
      const position = {};
      if (parentNode) {
        position.parentOrganizationId = parentNode.key;
      }
      OrganizationService.changePosition(organizationId, position).then(() => {
      });
    });
    setTreeData(data);
  };

  const handleTreeNodeSelect = (selectedKeys, e) => {
    if (e.selected) {
      let roles = null;
      if (e.node.roles) {
        roles = e.node.roles.map(role => {
          return {
            id: role.key,
            name: role.title,
          };
        });
      }
      let members = null;
      if (e.node.members) {
        members = e.node.members.map(role => {
          return {
            id: role.key,
            name: role.title,
          };
        });
      }
      setSelectedOrganization({
        id: e.node.key,
        name: e.node.title,
        roles: roles,
        members: members
      });
    } else {
      setSelectedOrganization(null);
    }
  }

  const handleDeleteDepartment = (selectedOrganization) => {
    if (selectedOrganization && selectedOrganization.id) {
      OrganizationService.deleteDepartment(selectedOrganization.id).then(() => {
        OrganizationService.getOrganizations().then(response => {
          setTreeData(convertToTreeData(response.data));
        });
        setSelectedOrganization(null);
      });
    } else {
      message.warn("조직도에서 삭제할 조직을 선택해 주세요.")
    }
  }

  const handleCreateOrganization = () => {
    navigate(`/organization/new?backUrl=${makeBackUrl()}`);
  }

  const handleCreateDepartment = (parentOrganization) => {
    navigate(`/organization/new?parentId=${parentOrganization.id}&backUrl=${makeBackUrl()}`);
  }

  const handleChangeOrganizationName = (organization) => {
    navigate(`/organization/${organization.id}?backUrl=${makeBackUrl()}`);
  }

  const handleChangeRoles = (organization) => {
    navigate(`/organization/${organization.id}/change-roles?backUrl=${makeBackUrl()}`);
  }

  const handleChangeMembers = (organization) => {
    navigate(`/organization/${organization.id}/change-members?backUrl=${makeBackUrl()}`);
  }

  const makeBackUrl = () => {
    return encodeURIComponent(`${location.pathname}${location.search}`);
  }


  const generateActionMenus = (organization) => {
    const actionMenusItems = [
      {
        label:
          <Button type="text" icon={<EditOutlined/>} onClick={() => {
            handleChangeOrganizationName(organization);
          }}>조직 이름 변경</Button>,
        key: '0',
      }, {
        label:
          <Popconfirm
            title="하위 조직까지 함께 삭제됩니다. 선택한 조직을 삭제하시겠습니까?"
            onConfirm={() => {
              handleDeleteDepartment(organization);
            }}
            okText="예"
            cancelText="아니오"
          >
            <Button type="text" icon={<DeleteOutlined/>}>조직 삭제</Button>
          </Popconfirm>,
        key: '1',
      },
      {type: 'divider'}, {
        label:
          <Button type="text" onClick={() => {
            handleCreateDepartment(organization);
          }}>하위 부서 추가</Button>,
        key: '2',
      }, {
        label:
          <Button type="text" onClick={() => {
            handleChangeRoles(organization);
          }}>역할 변경</Button>,
        key: '3',
      }, {
        label:
          <Button type="text" onClick={() => {
            handleChangeMembers(organization);
          }}>멤버 변경</Button>,
        key: '4',
      }
    ];

    return <Dropdown menu={{
      items: actionMenusItems
    }} trigger={['click']}>
      <Button style={{borderRadius: '5px'}} icon={<SettingOutlined/>}>
        <DownOutlined/>
      </Button>
    </Dropdown>;
  };

  return (
    <>
      <PageHeader
        subTitle="조직을 추가하거나 삭제합니다."
        extra={[
          <Button key="1" type="primary" icon={<ApartmentOutlined/>} onClick={handleCreateOrganization}>최상위 조직
            추가</Button>,
        ]}
      >
        <Row>
          <Col span={12}>
            {treeData && treeData.length > 0 &&
              <Tree
                className="draggable-tree"
                draggable
                blockNode
                onDrop={onDrop}
                treeData={treeData}
                onSelect={handleTreeNodeSelect}
                defaultExpandAll={true}
              />}
          </Col>
          {selectedOrganization &&
            <Col span={12} style={{border: "solid 1px", padding: "10px", borderRadius: "5px", borderColor: "#808080"}}>
              <Descriptions title={selectedOrganization.name} bordered
                            extra={generateActionMenus(selectedOrganization)}>
                <Descriptions.Item label="역할" span={3}>
                  {selectedOrganization.roles && selectedOrganization.roles.map(role =>
                    <Tag key={role.id} color="orange">{role.name}</Tag>
                  )}
                  {(selectedOrganization.roles === null || selectedOrganization.roles === undefined) &&
                    <Tag color="gray">없음</Tag>
                  }
                </Descriptions.Item>
                <Descriptions.Item label="구성원" span={3}>
                  {selectedOrganization.members && selectedOrganization.members.map(member =>
                    <Tag key={member.id} color="purple">{member.name}</Tag>
                  )}
                  {(selectedOrganization.members === null || selectedOrganization.members === undefined) &&
                    <Tag color="gray">없음</Tag>
                  }
                </Descriptions.Item>
              </Descriptions>
            </Col>}
        </Row>
      </PageHeader>
    </>
  )
};
export default Organizations;
