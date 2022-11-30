import { BiBluetooth, BiBeer } from "react-icons/bi";
import { SiAccusoft, SiAmazon, SiAmazondynamodb, SiApachenetbeanside } from "react-icons/si";
import { GiAbstract023 } from "react-icons/gi";
import { AiFillSetting, AiOutlineControl } from "react-icons/ai";
import {FiUsers} from "react-icons/fi";

export const Navigation = {
  items: [
    {
      title: "GNB1-22",
      icon: <BiBluetooth/>,
      items: [
        {
          title: "SNB1",
          icon: <BiBeer/>,
          items: [
            {
              title: "Sub1",
              icon: <SiAccusoft/>,
              link: "/sub1"
            },
            {
              title: "Sub2",
              icon: <SiAmazon/>,
              link: "/sub2"
            }
          ]
        },
        {
          title: "SNB2",
          icon: <SiAmazondynamodb/>,
          disabled: true,
          link: "/snb2"
        },
        {
          title: "Sample",
          icon: <SiApachenetbeanside/>,
          link: "/sample-list"
        }
      ]
    },
    {
      title: "GNB2",
      icon: <GiAbstract023/>,
      link: "/gnb2"
    },
    {
      title: "접근 제어",
      accessPermissions: ["MANAGE_ACCESS_CONTROL"],
      icon: <AiOutlineControl/>,
      items: [
        {
          title: "역할",
          link: "/settings/access-control/roles"
        },
        {
          title: "권한",
          link: "/settings/access-control/permissions"
        }
      ]
    },
    {
      title: "사용자/조직도",
      icon: <FiUsers/>,
      accessPermissions: ["MANAGE_MEMBERS", "MANAGE_ORGANIZATION"],
      items: [
        {
          title: "멤버",
          link: "/settings/members",
          accessPermissions: ["MANAGE_MEMBERS"]
        },
        {
          title: "멤버 승인",
          link: "/settings/member-approval",
          accessPermissions: ["MANAGE_MEMBERS"]
        },
        {
          title: "조직도",
          link: "/settings/organization",
          accessPermissions: ["MANAGE_ORGANIZATION"]
        }
      ]
    },
    {
      title: "설정",
      icon: <AiFillSetting/>,
      accessPermissions: ["MANAGE_SYSTEM_SETTINGS"],
      items: []
    }
  ]
};

