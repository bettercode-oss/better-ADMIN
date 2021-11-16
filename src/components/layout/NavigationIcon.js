import * as AntDesignIcons from "@ant-design/icons";

const DEFAULT_ICON_NAME = 'FolderOutlined';

export default function NavigationIcon(iconName) {
  const iconComponent = AntDesignIcons[iconName];
  if (iconComponent) {
    return iconComponent;
  }

  return AntDesignIcons[DEFAULT_ICON_NAME];
}
