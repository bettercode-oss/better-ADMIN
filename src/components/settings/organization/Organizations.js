import React, {useEffect, useState} from "react";
import {Button, Col, Descriptions, Dropdown, Menu, message, PageHeader, Popconfirm, Row, Tag, Tree} from "antd";
import {ApartmentOutlined, DeleteOutlined, DownOutlined, EditOutlined, SettingOutlined} from "@ant-design/icons";
import {OrganizationService} from "./organization.service";

const Organizations = ({
                         onCreateOrganization,
                         onCreateDepartment,
                         onRoleChange,
                         onMemberChange,
                         onChangeOrganizationName
                       }) => {
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
        // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj);
      });
    } else if (
      (info.node.props.children || []).length > 0 && // Has children
      info.node.props.expanded && // Is expanded
      dropPosition === 1 // On the bottom gap
    ) {
      loop(data, dropKey, item => {
        item.children = item.children || [];
        // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj);
        // in previous version, we use item.children.push(dragObj) to insert the
        // item to the tail of the children
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

  const onDeleteDepartment = (selectedOrganization) => {
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

  return (
    <>
      <PageHeader
        title="조직도"
        subTitle="조직을 추가하거나 삭제합니다."
        extra={[
          <Button key="1" type="primary" icon={<ApartmentOutlined/>} onClick={onCreateOrganization}>최상위 조직 추가</Button>,
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
                          extra={
                            <Dropdown overlay={
                              <Menu>
                                <Menu.Item key="0">
                                  <Button type="text" icon={<EditOutlined/>} onClick={() => {
                                    onChangeOrganizationName(selectedOrganization);
                                  }}>조직 이름 변경</Button>
                                </Menu.Item>
                                <Menu.Item key="1">
                                  <Popconfirm
                                    title="하위 조직까지 함께 삭제됩니다. 선택한 조직을 삭제하시겠습니까?"
                                    onConfirm={() => {
                                      onDeleteDepartment(selectedOrganization);
                                    }}
                                    okText="예"
                                    cancelText="아니오"
                                  >
                                    <Button type="text" icon={<DeleteOutlined/>}>조직 삭제</Button>
                                  </Popconfirm>
                                </Menu.Item>
                                <Menu.Divider/>
                                <Menu.Item key="2">
                                  <Button type="text" onClick={() => {
                                    onCreateDepartment(selectedOrganization);
                                  }}>하위 부서 추가</Button>
                                </Menu.Item>
                                <Menu.Item key="3">
                                  <Button type="text" onClick={() => {
                                    onRoleChange(selectedOrganization);
                                  }}>역할 변경</Button>
                                </Menu.Item>
                                <Menu.Item key="4">
                                  <Button type="text" onClick={() => {
                                    onMemberChange(selectedOrganization);
                                  }}>멤버 편집</Button>
                                </Menu.Item>
                              </Menu>} trigger={['click']}>
                              <Button style={{borderRadius: '5px'}} icon={<SettingOutlined/>}>
                                <DownOutlined/>
                              </Button>
                            </Dropdown>
                          }>
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
