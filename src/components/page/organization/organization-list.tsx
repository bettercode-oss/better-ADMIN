import DefaultTableBtn from "@/components/shared/ui/default-table-btn";
import {
  Alert,
  Button,
  Col,
  Descriptions,
  Dropdown,
  MenuProps,
  message,
  Popconfirm,
  Row,
  Skeleton,
  Tag,
  Tree
} from "antd";
import {useRouter} from "next/router";
import React, {useEffect, useState} from "react";
import {
  changePosition, deleteDepartment,
  IOrganization,
  IOrganizationChangePosition,
  useOrganizations
} from "@/client/organization/organization";
import type {DataNode, TreeProps} from 'antd/es/tree';
import {DeleteOutlined, DownOutlined, EditOutlined, SettingOutlined} from "@ant-design/icons";

interface ITreeOrganization {
  key: number;
  title: string;
  roles?: ITreeOrganizationRole[];
  members?: ITreeOrganizationMember[];
  children?: ITreeOrganization;
}

interface ITreeOrganizationRole {
  key: number;
  title: string;
}

interface ITreeOrganizationMember {
  key: number;
  title: string;
}

const OrganizationList: React.FC = () => {
  const router = useRouter();

  const [treeData, setTreeData] = useState([]);
  const [selectedOrganization, setSelectedOrganization] = useState<IOrganization | null>(null);

  const {data, error, isLoading} = useOrganizations();

  useEffect(() => {
    if (!error && !isLoading) {
      setTreeData(JSON.parse(JSON.stringify(data)
        .replaceAll("\"id\"", "\"key\"")
        .replaceAll("\"name\"", "\"title\"")
        .replaceAll("\"subOrganizations\"", "\"children\"")));
    }
  }, [data, error, isLoading]);

  if (error) {
    return <Alert message="데이터 로딩 중 오류가 발생했습니다." type="warning"/>;
  }

  if (isLoading) {
    return <Skeleton className="my-5"/>;
  }

  const handleTreeNodeSelect: TreeProps['onSelect'] = (selectedKeys, info) => {
    if (info.selected) {
      const nodeOrganization = info.node as ITreeOrganization;
      const roles = nodeOrganization.roles?.map(role => {
        return {
          id: role.key,
          name: role.title,
        };
      });

      const members = nodeOrganization.members?.map(role => {
        return {
          id: role.key,
          name: role.title,
        };
      });

      setSelectedOrganization({
        id: nodeOrganization.key,
        name: nodeOrganization.title,
        roles: roles,
        members: members
      });
    } else {
      setSelectedOrganization(null);
    }
  };

  const onDrop: TreeProps['onDrop'] = (info) => {
    const dropKey = info.node.key as number;
    const dragKey = info.dragNode.key as number;
    const dropPos = info.node.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const loop = (data: DataNode[], key: number, callback: (node: DataNode, i: number, data: DataNode[]) => void,) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
          return callback(data[i], i, data);
        }
        if (data[i].children) {
          loop(data[i].children!, key, callback);
        }
      }
    };
    const data = [...treeData];

    // Find dragObject
    let dragObj: any;
    loop(data, dragKey, (item: any, index: any, arr: any) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      // Drop on the content
      loop(data, dropKey, (item: any) => {
        item.children = item.children || [];
        item.children.unshift(dragObj);
      });
    } else if (
      ((info.node as any).props.children || []).length > 0 && // Has children
      (info.node as any).props.expanded && // Is expanded
      dropPosition === 1 // On the bottom gap
    ) {
      loop(data, dropKey, (item: any) => {
        item.children = item.children || [];
        item.children.unshift(dragObj);
      });
    } else {
      let ar: any;
      let i: any;
      loop(data, dropKey, (item: any, index: any, arr: any) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i!, 0, dragObj!);
      } else {
        ar.splice(i! + 1, 0, dragObj!);
      }
    }

    const findParentNodeLoop = (nodes: any, parentNode: any, key: any, callback: any) => {
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].key === key) {
          return callback(parentNode);
        }
        if (nodes[i].children) {
          findParentNodeLoop(nodes[i].children, nodes[i], key, callback);
        }
      }
    };

    findParentNodeLoop(data, null, dragObj.key, async (parentNode: any) => {
      // 조직도 변경 반영
      const organizationId: number = dragObj.key as number;
      const position: IOrganizationChangePosition = {};
      if (parentNode) {
        position.parentOrganizationId = parentNode.key;
      }
      try {
        await changePosition(organizationId, position);
      } catch (error) {
        console.log(error);
      }
    });
    setTreeData(data);
  };

  const generateActionMenus = (organization: IOrganization) => {
    const actionMenusItems: MenuProps['items'] = [
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

  const handleChangeOrganizationName = (organization: IOrganization) => {
    router.push(`/organization/edit/${organization.id}`);
  }

  const handleChangeRoles = (organization: IOrganization) => {
    router.push(`/organization/change-roles/${organization.id}`);
  }

  const handleChangeMembers = (organization: IOrganization) => {
    router.push(`/organization/change-members/${organization.id}`);
  }

  const handleCreateDepartment = (parentOrganization: IOrganization) => {
    router.push(`/organization/new?parentId=${parentOrganization.id}`);
  }

  const handleDeleteDepartment = async (selectedOrganization: IOrganization) => {
    try {
      if (selectedOrganization && selectedOrganization.id) {
        await deleteDepartment(selectedOrganization.id);
        router.reload();
      } else {
        message.warning("조직도에서 삭제할 조직을 선택해 주세요.")
      }
    } catch (e) {
      message.warning("에러가 발생했습니다.")
    }
  }

  return (
    <>
      <DefaultTableBtn className="justify-between">
        <div>
        </div>

        <div className="flex-item-list">
          <Button className="btn-with-icon" onClick={() => router.push("/organization/new")}>
            최상위 조직 추가
          </Button>
        </div>
      </DefaultTableBtn>
      <Row>
        <Col span={12}>
          {treeData.length > 0 &&
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
    </>
  );
};

export default React.memo(OrganizationList);
