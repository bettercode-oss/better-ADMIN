import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Profile from './Profile';
import '@testing-library/jest-dom';

jest.mock('../../../auth/member.context', () => ({
  MemberContext: {
    memberInformation: {
      name: '관계자',
      typeName: '시스템',
      picture: 'https://example.com/profile.jpg',
      roles: ['시스템 관리자', '조직/멤버 관리자'],
      permissions: ['MANAGE_SYSTEM_SETTINGS', 'MANAGE_MEMBERS'],
    },
  },
}));

describe('Profile', () => {
  test('renders the member information', async () => {
    render(<Profile show={true} onClose={() => {}} />);
    await waitFor(() => screen.getByTestId('profile-data'));
    const profileDescriptions = screen.getByTestId('profile-data');
    expect(profileDescriptions).toBeInTheDocument();

    const header = profileDescriptions.querySelector('tbody');
    const headerColumns = header.querySelectorAll('th');
    expect(headerColumns).toHaveLength(4);
    expect(headerColumns[0]).toHaveTextContent('유형');
    expect(headerColumns[1]).toHaveTextContent('이름');
    expect(headerColumns[2]).toHaveTextContent('역할');
    expect(headerColumns[3]).toHaveTextContent('권한');

    const bodyRows = profileDescriptions.querySelectorAll('tbody');
    expect(bodyRows).toHaveLength(1);
    const bodyRowColumns = bodyRows[0].querySelectorAll('td');

    expect(bodyRowColumns[0]).toHaveTextContent('시스템');
    expect(bodyRowColumns[1]).toHaveTextContent('관계자');
    expect(bodyRowColumns[2]).toHaveTextContent('시스템 관리자');
    expect(bodyRowColumns[2]).toHaveTextContent('조직/멤버 관리자');
    expect(bodyRowColumns[3]).toHaveTextContent('MANAGE_SYSTEM_SETTINGS');
    expect(bodyRowColumns[3]).toHaveTextContent('MANAGE_MEMBERS');
  });
});