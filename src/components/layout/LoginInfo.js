import React, { useEffect, useState } from 'react';
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from 'react-router-dom';
import { adminConfig } from '../../config/admin.config';
import { MemberContext } from '../../auth/member.context';
import { AuthService } from '../../auth/auth.service';
import { EventBroadcaster, INVALID_ACCESS_TOKEN_TOPIC } from '../../event/event.broadcaster';
import { PageTabStorage } from './page.tab.storage';
import { Avatar } from '../atoms/avatar';
import { Dropdown } from '../atoms/dropdown';
import Profile from '../templates/profile/Profile';

function LoginInfo() {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    EventBroadcaster.on(INVALID_ACCESS_TOKEN_TOPIC, () => {
      PageTabStorage.clear();
      AuthService.logout().then().finally(() => {
        navigate(adminConfig.authentication.loginUrl);
      });
    });
  }, [navigate]);

  const logout = () => {
    PageTabStorage.clear();
    AuthService.logout().then().finally(() => {
      navigate(adminConfig.authentication.loginUrl);
    });
  };

  const showProfile = () => {
    setShowProfileModal(true);
  };

  const closeProfile = () => {
    setShowProfileModal(false);
  }

  const generateMenuItems = () => [{
    label: '로그아웃',
    key: '0',
    icon: <LogoutOutlined />,
  },
  {
    label: '프로필',
    key: '1',
    icon: <UserOutlined />,
  },
  ];

  const handleMenuClick = (e) => {
    switch (e.key) {
      case '0':
        logout();
        break;
      case '1':
        showProfile();
        break;
      default:
        console.log('unknown menu item');
    }
  };

  return (
    <>
      <Dropdown
        items={generateMenuItems()}
        onClick={handleMenuClick}
      >
        <Avatar
          ssrc={MemberContext.memberInformation.picture}
          suffix={MemberContext.memberInformation && MemberContext.memberInformation.name} />
      </Dropdown>
      <Profile
        show={showProfileModal}
        onClose={closeProfile}
      />
    </>
  );
}

export default LoginInfo;
