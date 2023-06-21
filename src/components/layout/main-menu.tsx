import {Divider, Space} from "antd";
import {Cog, Fingerprint, Home, LogIn, Users, Webhook} from "lucide-react";
import React from "react";
import Menu, {IMenu} from "./nav";

const mainMenuData: IMenu[] = [
  {
    id: "home",
    name: "홈",
    icon: <Home className="w-5 h-5" />,
    link: {
      path: "/",
    },
  },
  {
    id: "access-control",
    name: "접근 제어",
    icon: <Fingerprint className="w-5 h-5" />,
    submenu: [
      {
        id: "roles",
        name: "역할",
        link: {
          path: "/access-control/role/list",
        },
      },
      {
        id: "permissions",
        name: "권한",
        link: {
          path: "/access-control/permission/list",
        },
      }
    ],
  },
  {
    id: "member-and-organization",
    name: "사용자 및 조직도",
    icon: <Users className="w-5 h-5" />,
    submenu: [
      {
        id: "members",
        name: "멤버",
        link: {
          path: "/member/list",
        },
      },
      {
        id: "member-approval",
        name: "멤버 승인",
        link: {
          path: "/member/approval",
        },
      },
      {
        id: "organization",
        name: "조직도",
        link: {
          path: "/organization/list",
        },
      }
    ],
  }
];

const settingsMenuData: IMenu[] = [
  {
    id: "logins",
    name: "로그인",
    icon: <LogIn className="w-5 h-5"/>,
    submenu: [
      {
        id: "login-dooray",
        name: "두레이",
        link: {
          path: "/settings/logins/dooray",
        },
      },
      {
        id: "login-google-workspace",
        name: "구글 워크스페이스",
        link: {
          path: "/settings/logins/google-workspace",
        }
      }
    ]
  },
  {
    id: "webhooks",
    name: "웹훅",
    icon: <Webhook className="w-5 h-5"/>,
    submenu: [
      {
        id: "notification-webhook",
        name: "알림 웹훅",
        link: {
          path: "/settings/webhooks/notification-web-hooks/list",
        },
      }
    ]
  }
]

const MainMenu = () => {
  return (
    <>
      <>
        <Divider orientation="left" plain/>
        <Menu data={mainMenuData} />
      </>
      <>
        <Divider orientation="left" plain>
          <Space>
            <Cog className="w-5 h-5"/> 설정
          </Space>
        </Divider>
        <Menu data={settingsMenuData} />
      </>
    </>
  );
};

export default React.memo(MainMenu);
