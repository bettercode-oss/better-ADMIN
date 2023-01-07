import React, {useCallback, useEffect, useState} from 'react';
import {Layout, Menu, Space} from "antd";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {adminConfig} from "../../config/admin.config";
import NavigationConfig from "../../config/navigation.config";
import {MemberContext} from "../../auth/member.context";
import {EventBroadcaster, SELECTED_TAB_NOT_CONTAINS_NAVIGATION_TOPIC} from "../../event/event.broadcaster";
import {SwapRightOutlined} from "@ant-design/icons";

function Sider() {
  let location = useLocation();
  let navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  const [menuDataSource, setMenuDataSource] = useState({
    menuItems: [],
    navigationState: {
      menuOpenKeys: [''],
      menuSelectedKeys: [''],
    }
  });

  const toggleCollapsed = () => setCollapsed(!collapsed);

  const loadMenuItems = useCallback((pathname) => {
    const menuItems = NavigationConfig.getItemsByMemberPermission(MemberContext.memberInformation.permissions);
    let currentNavigationItem = NavigationConfig.getItemByLink(pathname, menuItems);

    if (currentNavigationItem.level1Item) {
      const menuOpenKeys = [];
      let menuSelectedKey = "";

      if (currentNavigationItem.level1Item) {
        menuOpenKeys.push(currentNavigationItem.level1Item.index)
        menuSelectedKey = currentNavigationItem.level1Item.index;
      }

      if (currentNavigationItem.level2Item) {
        menuOpenKeys.push(currentNavigationItem.level1Item.index + '-' + currentNavigationItem.level2Item.index)
        menuSelectedKey = currentNavigationItem.level1Item.index + '-' + currentNavigationItem.level2Item.index;
      }

      if (currentNavigationItem.level3Item) {
        menuSelectedKey = currentNavigationItem.level1Item.index + '-' + currentNavigationItem.level2Item.index + '-' + currentNavigationItem.level3Item.index;
      }

      setMenuDataSource((menuDataSource) => {
        return {
          ...menuDataSource,
          menuItems: menuItems,
          navigationState: {
            menuOpenKeys: [...new Set([...menuDataSource.navigationState.menuOpenKeys, ...menuOpenKeys])],
            menuSelectedKeys: [menuSelectedKey],
          }
        }
      });
    } else {
      setMenuDataSource((menuDataSource) => {
        return {
          ...menuDataSource,
          menuItems: menuItems,
        }
      });
    }
  }, []);

  useEffect(() => {
    const pathname = location.pathname;
    loadMenuItems(pathname);
  }, [loadMenuItems, location.pathname]);

  useEffect(() => {
    EventBroadcaster.on(SELECTED_TAB_NOT_CONTAINS_NAVIGATION_TOPIC, (pathname) => {
      loadMenuItems(pathname);
    });
  }, [loadMenuItems]);

  useEffect(() => {
    const pathname = location.pathname;

    if (pathname === "/" && MemberContext.available) {
      // PATH 가 루트(/) 인 경우 네비게이션 메뉴 중 가장 첫 번째 메뉴의 화면으로 이동 시킨다.
      const firstNavigationItemLink = NavigationConfig.getFirstItemLink(MemberContext.memberInformation.permissions);
      if (firstNavigationItemLink) {
        navigate(firstNavigationItemLink);
      }
    }

  }, [location.pathname, navigate]);

  const getItem = (label, key, icon, children, onTitleClick) => {
    return onTitleClick ? {
      key,
      icon,
      children,
      label,
      onTitleClick
    } : {
      key,
      icon,
      children,
      label
    };
  }

  const getMenuLink = (label, url) => {
    return <Link to={url}>{label}</Link>;
  }

  const handleSubMenuClick = ({key}) => {
    setMenuDataSource({
      ...menuDataSource,
      navigationState: {
        menuOpenKeys: menuDataSource.navigationState.menuOpenKeys.find(openKey => openKey === key) ?
          menuDataSource.navigationState.menuOpenKeys.filter(openKey => openKey !== key) :
          menuDataSource.navigationState.menuOpenKeys.concat([key]),
        menuSelectedKeys: menuDataSource.navigationState.menuSelectedKeys.find(selectedKey => selectedKey === key) ?
          menuDataSource.navigationState.menuSelectedKeys.filter(selectedKey => selectedKey !== key) :
          menuDataSource.navigationState.menuSelectedKeys.concat([key]),
      }
    });
  }

  const getNavigationIcon = (icon) => {
    if (icon) {
      return icon;
    } else {
      return <SwapRightOutlined/>
    }
  }

  const generateMenuItems = () => {
    const menusItems = [];
    if (menuDataSource.menuItems) {
      for (const [level1ItemIndex, level1Item] of menuDataSource.menuItems.entries()) {
        if (level1Item.items && level1Item.items.length > 0) {
          const level2MenuItems = [];
          for (const [level2ItemIndex, level2Item] of level1Item.items.entries()) {
            const level2ItemMenuItemKey = level1ItemIndex + "-" + level2ItemIndex;

            if (level2Item.items && level2Item.items.length > 0) {
              const level3MenuItems = [];
              for (const [level3ItemIndex, level3Item] of level2Item.items.entries()) {
                const level3ItemMenuItemKey = level1ItemIndex + "-" + level2ItemIndex + "-" + level3ItemIndex;
                if (level3Item.link) {
                  level3MenuItems.push(getItem(getMenuLink(level3Item.title, level3Item.link), level3ItemMenuItemKey,
                    getNavigationIcon(level3Item.icon)));
                } else {
                  level3MenuItems.push(getItem(level3Item.title, level3ItemMenuItemKey, getNavigationIcon(level3Item.icon)));
                }
              }
              level2MenuItems.push(getItem(level2Item.title, level2ItemMenuItemKey,
                getNavigationIcon(level2Item.icon), level3MenuItems, handleSubMenuClick));
            } else {
              if (level2Item.link) {
                level2MenuItems.push(getItem(getMenuLink(level2Item.title, level2Item.link), level2ItemMenuItemKey,
                  getNavigationIcon(level2Item.icon)));
              } else {
                level2MenuItems.push(getItem(level2Item.title, level2ItemMenuItemKey, getNavigationIcon(level2Item.icon)));
              }
            }
          }
          menusItems.push(getItem(level1Item.title, level1ItemIndex,
            getNavigationIcon(level1Item.icon), level2MenuItems, handleSubMenuClick));
        } else {
          if (level1Item.link) {
            menusItems.push(getItem(getMenuLink(level1Item.title, level1Item.link), level1ItemIndex,
              getNavigationIcon(level1Item.icon)));
          } else {
            menusItems.push(getItem(level1Item.title, level1ItemIndex, getNavigationIcon(level1Item.icon)));
          }
        }
      }
    }
    return menusItems;
  }

  return (
    <Layout.Sider
      collapsible
      collapsed={collapsed}
      onCollapse={toggleCollapsed}
      breakpoint="lg"
      width={220}
    >
      <Link to="/">
        <div className="site-logo">
          <Space>
            <img className="logo-image" alt="logo" src={adminConfig.logo}/>
            {collapsed === false && <strong>&nbsp; {adminConfig.siteName}</strong>}
          </Space>
        </div>
      </Link>
      <Menu theme="dark" mode="inline"
            openKeys={collapsed ? undefined : menuDataSource.navigationState.menuOpenKeys}
            selectedKeys={menuDataSource.navigationState.menuSelectedKeys}
            items={generateMenuItems()}
      />
    </Layout.Sider>
  )
}

export default Sider;
