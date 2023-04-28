import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Profile from './Profile';
import '@testing-library/jest-dom';

jest.mock('../../../auth/member.context', () => ({
  __esModule: true,
  MemberContext: {
    memberInformation: {
      name: '관계자',
      typeName: '시스템',
      picture: 'https://example.com/profile.jpg',
      roles: ['시스템 관리자', '조직/멤버 관리자'],
      permissions: ['MANAGE_SYSTEM_SETTINGS', 'MANAGE_MEMBERS'],
    },
  }
}));

const Member = require('../../../auth/member.context');

describe('프로필 이미지 랜더링', () => {
  test('member context에 picture가 빈 값이면 디폴트 이미지가 나온다.', async () => {
    // given
    Member.MemberContext.memberInformation.picture = '';
    // when
    render(<Profile show onClose={() => {}} />);
    await waitFor(() => screen.getByTestId('profile-image'));
    // then
    const avatarComp = screen.getByTestId('profile-image');
    const profileImage = avatarComp.querySelector('img');

    expect(profileImage).toHaveAttribute('src', '');
  });

  test('member context에 picture가 null 이면 디폴트 이미지가 나온다.', async () => {
    // given
    Member.MemberContext.memberInformation.picture = null;
    // when
    render(<Profile show onClose={() => {}} />);
    await waitFor(() => screen.getByTestId('profile-image'));
    // then
    const avatarComp = screen.getByTestId('profile-image');
    const profileImage = avatarComp.querySelector('svg');

    expect(profileImage).toBeInTheDocument();
    expect(profileImage).toHaveAttribute('data-icon', 'user');
  });

  test('member context에 picture가 undefined 면 디폴트 이미지가 나온다.', async () => {
    // given
    Member.MemberContext.memberInformation.picture = undefined;
    // when
    render(<Profile show onClose={() => {}} />);
    await waitFor(() => screen.getByTestId('profile-image'));
    // then
    const avatarComp = screen.getByTestId('profile-image');
    const profileImage = avatarComp.querySelector('svg');

    expect(profileImage).toBeInTheDocument();
    expect(profileImage).toHaveAttribute('data-icon', 'user');
  });


  test('member context에 picture가 url이 있으면 해당 url의 이미지를 보여 준다.', async () => {
    //given
    Member.MemberContext.memberInformation.picture = 'https://example.com/profile.jpg';
    // when
    render(<Profile show onClose={() => {}} />);
    await waitFor(() => screen.getByTestId('profile-image'));
    // then
    const avatarComp = screen.getByTestId('profile-image');
    const profileImage = avatarComp.querySelector('img');

    expect(profileImage).toHaveAttribute('src', 'https://example.com/profile.jpg');
  });
});

describe('프로필 사용자 정보 렌더링', () => {
  test('memberInformation이 빈 값이면 공백이 나온다.', async () => {
    // given
    const blankMemberInfo = {
      name: '',
      typeName: '',
      picture: '',
      roles: '',
      permissions: '',
    }
    Member.MemberContext.memberInformation = blankMemberInfo;
    // when
    render(<Profile show onClose={() => {}} />);
    await waitFor(() => screen.getByTestId('profile-data'));
    const memberInfoRender = screen.getByTestId('profile-data');
    const memberInfoHeader = memberInfoRender.querySelectorAll('th');
    const memberInfoBoday = memberInfoRender.querySelectorAll('td');
    // then
    expect(memberInfoRender).toBeInTheDocument();
    // header Test
    expect(memberInfoHeader).toHaveLength(4);
    expect(memberInfoHeader[0]).toHaveTextContent('유형');
    expect(memberInfoHeader[1]).toHaveTextContent('이름');
    expect(memberInfoHeader[2]).toHaveTextContent('역할');
    expect(memberInfoHeader[3]).toHaveTextContent('권한');
    // body Test
    expect(memberInfoBoday[0]).toHaveTextContent('');
    expect(memberInfoBoday[1]).toHaveTextContent('');
    expect(memberInfoBoday[2]).toHaveTextContent('');
    expect(memberInfoBoday[3]).toHaveTextContent('');
  });

  test('memberInformation이 null 값이면 공백이 나온다.', async () => {
    // given
    Member.MemberContext.memberInformation = null;
    // when
    render(<Profile show onClose={() => {}} />);
    await waitFor(() => screen.getByTestId('profile-data'));
    const memberInfoRender = screen.getByTestId('profile-data');
    const memberInfoHeader = memberInfoRender.querySelectorAll('th');
    const memberInfoBoday = memberInfoRender.querySelectorAll('td');

    // then
    expect(memberInfoRender).toBeInTheDocument();
    // header Test
    expect(memberInfoHeader).toHaveLength(4);
    expect(memberInfoHeader[0]).toHaveTextContent('유형');
    expect(memberInfoHeader[1]).toHaveTextContent('이름');
    expect(memberInfoHeader[2]).toHaveTextContent('역할');
    expect(memberInfoHeader[3]).toHaveTextContent('권한');
    // body Test
    expect(memberInfoBoday[0]).toHaveTextContent('');
    expect(memberInfoBoday[1]).toHaveTextContent('');
    expect(memberInfoBoday[2]).toHaveTextContent('');
    expect(memberInfoBoday[3]).toHaveTextContent('');
  });

  test('memberInformation이 undefined 값이면 공백이 나온다.', async () => {
    // given
    Member.MemberContext.memberInformation = undefined;
    // when
    render(<Profile show onClose={() => {}} />);
    await waitFor(() => screen.getByTestId('profile-data'));
    const memberInfoRender = screen.getByTestId('profile-data');
    const memberInfoHeader = memberInfoRender.querySelectorAll('th');
    const memberInfoBoday = memberInfoRender.querySelectorAll('td');

    // then
    expect(memberInfoRender).toBeInTheDocument();
    // header Test
    expect(memberInfoHeader).toHaveLength(4);
    expect(memberInfoHeader[0]).toHaveTextContent('유형');
    expect(memberInfoHeader[1]).toHaveTextContent('이름');
    expect(memberInfoHeader[2]).toHaveTextContent('역할');
    expect(memberInfoHeader[3]).toHaveTextContent('권한');
    // body Test
    expect(memberInfoBoday[0]).toHaveTextContent('');
    expect(memberInfoBoday[1]).toHaveTextContent('');
    expect(memberInfoBoday[2]).toHaveTextContent('');
    expect(memberInfoBoday[3]).toHaveTextContent('');
  });


  test('memberInformation이 데이터가 존재하면 해당 데이터를 보여준다', async () => {
    // given
    const MemberInfo = {
      name: '관계자',
      typeName: '시스템',
      picture: 'https://example.com/profile.jpg',
      roles: ['시스템 관리자', '조직/멤버 관리자'],
      permissions: ['MANAGE_SYSTEM_SETTINGS', 'MANAGE_MEMBERS'],
    };
    Member.MemberContext.memberInformation = MemberInfo;
    // when
    render(<Profile show onClose={() => {}} />);
    await waitFor(() => screen.getByTestId('profile-data'));
    const memberInfoRender = screen.getByTestId('profile-data');
    const memberInfoHeader = memberInfoRender.querySelectorAll('th');
    const memberInfoBoday = memberInfoRender.querySelectorAll('td');

    // then
    expect(memberInfoRender).toBeInTheDocument();
    // header Test
    expect(memberInfoHeader).toHaveLength(4);
    expect(memberInfoHeader[0]).toHaveTextContent('유형');
    expect(memberInfoHeader[1]).toHaveTextContent('이름');
    expect(memberInfoHeader[2]).toHaveTextContent('역할');
    expect(memberInfoHeader[3]).toHaveTextContent('권한');
    // body Test
    expect(memberInfoBoday[0]).toHaveTextContent('시스템');
    expect(memberInfoBoday[1]).toHaveTextContent('관계자');
    expect(memberInfoBoday[2]).toHaveTextContent('시스템 관리자');
    expect(memberInfoBoday[2]).toHaveTextContent('조직/멤버 관리자');
    expect(memberInfoBoday[3]).toHaveTextContent('MANAGE_SYSTEM_SETTINGS');
    expect(memberInfoBoday[3]).toHaveTextContent('MANAGE_MEMBERS');
  });
});

describe('modal 컴포넌트의 이벤트 작동을 확인한다', () => {
  test('Profile Modal 컴포넌트의 X 버튼을 누르면 컴포넌트 프로퍼티로 전달된 onClose 함수가 호출된다',
    async () => {
    // given
      const closeProfile = jest.fn();
      // when
      render(<Profile show onClose={closeProfile} />);
      const closeButton = screen.getByLabelText('Close');
      fireEvent.click(closeButton);
      // then
      expect(closeProfile).toHaveBeenCalledTimes(1);
      expect(screen.queryByTestId('profile-modal')).not.toBeInTheDocument();
    });
});
