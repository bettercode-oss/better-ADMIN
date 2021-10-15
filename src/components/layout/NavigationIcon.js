import React from 'react';

import * as AiIcons from "react-icons/ai";
import * as BsIcons from "react-icons/bs";
import * as BiIcons from "react-icons/bi";
import * as DiIcons from "react-icons/di";
import * as FiIcons from "react-icons/fi";
import * as FcIcons from "react-icons/fc";
import * as FaIcons from "react-icons/fa";
import * as GiIcons from "react-icons/gi";
import * as GoIcons from "react-icons/go";
import * as GrIcons from "react-icons/gr";
import * as HiIcons from "react-icons/hi";
import * as ImIcons from "react-icons/im";
import * as IoIcons from "react-icons/io";
import * as Io5Icons from "react-icons/io5";
import * as MdIcons from "react-icons/md";
import * as RiIcons from "react-icons/ri";
import * as SiIcons from "react-icons/si";
import * as TiIcons from "react-icons/ti";
import * as VscIcons from "react-icons/vsc";
import * as WiIcons from "react-icons/wi";
import * as CgIcons from "react-icons/cg";

export default function NavigationIcon(iconName) {
  let iconComponent;
  const iconPrefix = iconName.split(/(?=[A-Z0-9])/)[0].toLowerCase();
  switch (iconPrefix) {
    case 'ai':
      iconComponent = AiIcons[iconName];
      break;
    case 'bs':
      iconComponent = BsIcons[iconName];
      break;
    case 'bi':
      iconComponent = BiIcons[iconName];
      break;
    case 'di':
      iconComponent = DiIcons[iconName];
      break;
    case 'fi':
      iconComponent = FiIcons[iconName];
      break;
    case 'fc':
      iconComponent = FcIcons[iconName];
      break;
    case 'fa':
      iconComponent = FaIcons[iconName];
      break;
    case 'gi':
      iconComponent = GiIcons[iconName];
      break;
    case 'go':
      iconComponent = GoIcons[iconName];
      break;
    case 'gr':
      iconComponent = GrIcons[iconName];
      break;
    case 'hi':
      iconComponent = HiIcons[iconName];
      break;
    case 'im':
      iconComponent = ImIcons[iconName];
      break;
    case 'io':
      const iconSecondPrefix = iconName.split(/(?=[A-Z0-9])/)[1].toLowerCase();
      if(iconSecondPrefix === 'ios') {
        iconComponent = IoIcons[iconName];
      } else {
        iconComponent = Io5Icons[iconName];
      }
      break;
    case 'md':
      iconComponent = MdIcons[iconName];
      break;
    case 'ri':
      iconComponent = RiIcons[iconName];
      break;
    case 'si':
      iconComponent = SiIcons[iconName];
      break;
    case 'ti':
      iconComponent = TiIcons[iconName];
      break;
    case 'vsc':
      iconComponent = VscIcons[iconName];
      break;
    case 'wi':
      iconComponent = WiIcons[iconName];
      break;
    case 'cg':
      iconComponent = CgIcons[iconName];
      break;
    default:
      iconComponent = <></>;
  }

  return iconComponent;
}
