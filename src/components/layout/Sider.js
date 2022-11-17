import React, {useState} from 'react';
import {Layout, Menu} from "antd";
import {Link} from "react-router-dom";
import {adminConfig} from "../../config/admin.config";
import {useLayoutDispatch, useLayoutState} from "./AppLayoutContext";
import NavigationIcon from "./NavigationIcon";

function Sider() {
  const [collapsed, setCollapsed] = useState(false);
  const layoutState = useLayoutState();
  const layoutDispatch = useLayoutDispatch();

  const toggleCollapsed = () => setCollapsed(!collapsed);
  const handleLevel1MenuClick = ({key}) => layoutDispatch({type: 'CLICK_LEVEL_1_MENU', key});
  const handleLevel2MenuClick = ({key}) => layoutDispatch({type: 'CLICK_LEVEL_2_MENU', key});


  const getItem = (label, key, icon, children, onTitleClick, type) => {
    return {
      key,
      icon,
      children,
      label,
      onTitleClick,
      type,
    };
  }

  const getMenuLink = (label, url) => {
    return <Link to={url}>{label}</Link>;
  }

  const generateMenuItems = () => {
    const menusItems = [];

    if(layoutState.allGnbItems) {
      for(const [level1ItemIndex, level1Item] of layoutState.allGnbItems.entries()) {
        const Level1ItemIcon = NavigationIcon(level1Item.icon);
        if (level1Item.items && level1Item.items.length > 0) {
          const level2MenuItems = [];
          for(const [level2ItemIndex, level2ItemItem] of level1Item.items.entries()) {
            const Level2ItemItemIcon = NavigationIcon(level2ItemItem.icon);
            const level2ItemMenuItemKey = level1ItemIndex + "-" + level2ItemIndex;

            if (level2ItemItem.items && level2ItemItem.items.length > 0) {
              const level3MenuItems = [];
              for(const [level3ItemIndex, level3Item] of level2ItemItem.items.entries()) {
                const Level3ItemIcon = NavigationIcon(level3Item.icon);
                const level3ItemMenuItemKey = level1ItemIndex + "-" + level2ItemIndex + "-" + level3ItemIndex;
                if(level3Item.link) {
                  level3MenuItems.push(getItem(getMenuLink(level3Item.title, level3Item.link), level3ItemMenuItemKey, <Level3ItemIcon/>));
                } else {
                  level3MenuItems.push(getItem(level3Item.title, level3ItemMenuItemKey, <Level3ItemIcon/>));
                }
              }
              level2MenuItems.push(getItem(level2ItemItem.title, level2ItemMenuItemKey, <Level2ItemItemIcon/>, level3MenuItems, handleLevel2MenuClick));
            } else {
              if(level2ItemItem.link) {
                level2MenuItems.push(getItem(getMenuLink(level2ItemItem.title, level2ItemItem.link), level2ItemMenuItemKey, <Level2ItemItemIcon/>));
              } else {
                level2MenuItems.push(getItem(level2ItemItem.title, level2ItemMenuItemKey, <Level2ItemItemIcon/>));
              }
            }
          }
          menusItems.push(getItem(level1Item.title, level1ItemIndex, <Level1ItemIcon/>, level2MenuItems, handleLevel1MenuClick));
        } else {
          if(level1Item.link) {
            menusItems.push(getItem(getMenuLink(level1Item.title, level1Item.link), level1ItemIndex, <Level1ItemIcon/>));
          } else {
            menusItems.push(getItem(level1Item.title, level1ItemIndex, <Level1ItemIcon/>));
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
      collapsedWidth="80"
    >
      <Link to="/">
        <div className="site-logo">
          <img className="logo-image" alt="logo" src={adminConfig.logo}/>
          {collapsed === false && <strong>&nbsp; {adminConfig.siteName}</strong>}
        </div>
      </Link>
      <Menu theme="dark" mode="inline"
            openKeys={collapsed ? undefined : layoutState.navigationState.menuOpenKeys}
            selectedKeys={layoutState.navigationState.menuSelectedKeys}
            items={generateMenuItems()}
      />
    </Layout.Sider>
  )
}

export default Sider;
