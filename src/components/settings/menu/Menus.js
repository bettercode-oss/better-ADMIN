import React, {useEffect, useState} from "react";
import {Button, Col, Descriptions, Dropdown, Menu, message, PageHeader, Popconfirm, Row, Tag, Tree} from "antd";
import {ApartmentOutlined, DeleteOutlined, DownOutlined, EditOutlined, SettingOutlined} from "@ant-design/icons";
import {MenuService} from "./menu.service";
import {CHANGE_MENU_SETTING_EVENT_TOPIC, EventBroadcaster} from "../../../event/event.broadcaster";
import {MENU_TYPE_URL} from "./MenuSetting";

const Menus = ({
                 onCreateMenu,
                 onCreateSubMenu,
                 onChangeMenu
               }) => {
  const [treeData, setTreeData] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState(null);

  useEffect(() => {
    MenuService.getMenus().then(response => {
      setTreeData(convertToTreeData(response.data));
    });
  }, []);

  const convertToTreeData = (organizations) => {
    const data = JSON.parse(JSON.stringify(organizations)
      .replaceAll("\"id\"", "\"key\"")
      .replaceAll("\"name\"", "\"title\"")
      .replaceAll("\"disabled\"", "\"unused\"")
      .replaceAll("\"subMenus\"", "\"children\""));
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
      // 변경 반영
      const menuId = dragObj.key;
      const position = {};
      const menusSequence = [];
      if (parentNode) {
        position.parentMenuId = parentNode.key;
        parentNode.children.forEach((child) => {
          menusSequence.push(child.key);
        })
      } else {
        data.forEach((topMenu) => {
          menusSequence.push(topMenu.key);
        })
      }
      position.sameDepthMenusSequence = menusSequence;

      MenuService.changePosition(menuId, position).then(() => {
        EventBroadcaster.broadcast(CHANGE_MENU_SETTING_EVENT_TOPIC);
      });
    });
    setTreeData(data);
  };

  const handleTreeNodeSelect = (selectedKeys, e) => {
    if (e.selected) {
      let accessPermissions = null;
      if (e.node.accessPermissions) {
        accessPermissions = e.node.accessPermissions.map(permission => {
          return {
            id: permission.key,
            name: permission.title,
          };
        });
      }
      setSelectedMenu({
        id: e.node.key,
        type: e.node.type,
        name: e.node.title,
        link: e.node.link,
        icon: e.node.icon,
        accessPermissions: accessPermissions,
        disabled: e.node.unused,
      });
    } else {
      setSelectedMenu(null);
    }
  }

  const onDeleteMenu = (selectedMenu) => {
    if (selectedMenu && selectedMenu.id) {
      MenuService.deleteMenu(selectedMenu.id).then(() => {
        MenuService.getMenus().then(response => {
          setTreeData(convertToTreeData(response.data));
        });
        setSelectedMenu(null);
        EventBroadcaster.broadcast(CHANGE_MENU_SETTING_EVENT_TOPIC);
      });
    } else {
      message.warn("삭제할 메뉴를 선택해 주세요.")
    }
  }

  return (
    <>
      <PageHeader
        title="메뉴 관리"
        subTitle="메뉴를 추가하거나 삭제합니다."
        extra={[
          <Button key="1" type="primary" icon={<ApartmentOutlined/>} onClick={onCreateMenu}>최상위 메뉴 추가</Button>,
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
          {selectedMenu &&
            <Col span={12} style={{border: "solid 1px", padding: "10px", borderRadius: "5px", borderColor: "#808080"}}>
              <Descriptions title={selectedMenu.name} bordered
                            extra={
                              <Dropdown overlay={
                                <Menu>
                                  <Menu.Item key="0">
                                    <Button type="text" icon={<EditOutlined/>} onClick={() => {
                                      onChangeMenu(selectedMenu);
                                    }}>메뉴 수정</Button>
                                  </Menu.Item>
                                  <Menu.Item key="1">
                                    <Popconfirm
                                      title="하위 메뉴까지 함께 삭제됩니다. 선택한 메뉴를 삭제하시겠습니까?"
                                      onConfirm={() => {
                                        onDeleteMenu(selectedMenu);
                                      }}
                                      okText="예"
                                      cancelText="아니오"
                                    >
                                      <Button type="text" icon={<DeleteOutlined/>}>메뉴 삭제</Button>
                                    </Popconfirm>
                                  </Menu.Item>
                                  <Menu.Divider/>
                                  <Menu.Item key="2">
                                    <Button type="text" onClick={() => {
                                      onCreateSubMenu(selectedMenu);
                                    }}>하위 메뉴 추가</Button>
                                  </Menu.Item>
                                </Menu>} trigger={['click']}>
                                <Button style={{borderRadius: '5px'}} icon={<SettingOutlined/>}>
                                  <DownOutlined/>
                                </Button>
                              </Dropdown>
                            }>
                <Descriptions.Item label="유형" span={3}>
                  {selectedMenu.type === MENU_TYPE_URL ? "화면 메뉴" : "상위 메뉴"}
                </Descriptions.Item>

                {selectedMenu.type === MENU_TYPE_URL &&
                  <Descriptions.Item label="화면 URL" span={3}>
                    {selectedMenu.link}
                  </Descriptions.Item>
                }

                <Descriptions.Item label="접근 권한" span={3}>
                  {selectedMenu.accessPermissions && selectedMenu.accessPermissions.map(permission =>
                    <Tag key={permission.id} color="purple">{permission.name}</Tag>
                  )}
                  {(selectedMenu.accessPermissions === null || selectedMenu.accessPermissions === undefined) &&
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
export default Menus;
