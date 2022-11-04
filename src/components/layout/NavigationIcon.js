import * as AntDesignIcons from "@ant-design/icons";

const DEFAULT_ICON_NAME = 'SwapRightOutlined';

export default function NavigationIcon(iconName) {
  const iconComponent = AntDesignIcons[iconName];
  if (iconComponent) {
    return iconComponent;
  }

  return AntDesignIcons[DEFAULT_ICON_NAME];
}
