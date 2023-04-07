import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import PermissionList from './PermissionList';
import AccessControlService from '../../../../services/access.control.service';

jest.mock('../../../../services/access.control.service');

test('테이블 렌더링 테스트', async () => {
  // given
  const resp = {
    data: {
      result: [
        {
          id: 3,
          type: 'user-define',
          typeName: '사용자정의',
          name: 'ACCESS_STOCK',
          description: '재고 접근 권한',
        },
      ],
      totalCount: 1,
    },
  };
  AccessControlService.getPermissions.mockResolvedValue(resp);

  const routes = [
    {
      path: '/access-control/permissions',
      element: <PermissionList />,
    },
  ];
  const router = createMemoryRouter(routes, {
    initialEntries: ['/', '/access-control/permissions'],
    initialIndex: 1,
  });

  // when
  render(<RouterProvider router={router} />);
  await waitFor(() => screen.getByTestId('permission-table'));

  // then
  const permissionTable = screen.getByTestId('permission-table');
  expect(permissionTable).toBeInTheDocument();

  // 테이블 헤더 검증
  const header = permissionTable.querySelector('thead > tr');
  const headerColumns = header.querySelectorAll('th');
  expect(headerColumns).toHaveLength(4);
  expect(headerColumns[0]).toHaveTextContent('유형');
  expect(headerColumns[1]).toHaveTextContent('권한 이름');
  expect(headerColumns[2]).toHaveTextContent('설명');
  expect(headerColumns[3]).toHaveTextContent('Action');

  // 테이블 바디 검증
  const bodyRows = permissionTable.querySelectorAll('tbody > tr');
  expect(bodyRows).toHaveLength(1);
  const bodyRowColumns = bodyRows[0].querySelectorAll('td');
  expect(bodyRowColumns).toHaveLength(4);
  expect(bodyRowColumns[0]).toHaveTextContent('사용자정의');
  expect(bodyRowColumns[1]).toHaveTextContent('ACCESS_STOCK');
  expect(bodyRowColumns[2]).toHaveTextContent('재고 접근 권한');
});
