import '@testing-library/jest-dom';
import {
  render, screen, waitFor, fireEvent,
} from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { when } from 'jest-when';
import PermissionList from './PermissionList';
import AccessControlService from '../../../../services/access.control.service';

jest.mock('../../../../services/access.control.service');

test('테이블 렌더링', async () => {
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

describe('url parameter 에 따라 테이블 렌더링', () => {
  test('url parameter 가 없을 때 기본적으로 1페이지에 10개를 렌더링 한다.', async () => {
    // given
    const testData = {
      data: {
        result: [
          {
            id: 0,
            type: 'pre-define',
            typeName: '사전정의',
            name: 'MANAGE_SYSTEM_SETTINGS',
            description: '시스템 설정 권한',
          },
          {
            id: 1,
            type: 'pre-define',
            typeName: '사전정의',
            name: 'ACCESS_MEMBERS',
            description: '멤버 접근 권한',
          },
          {
            id: 2,
            type: 'pre-define',
            typeName: '사전정의',
            name: 'MAKE_MEMBERS',
            description: '멤버 생성 권한',
          },
          {
            id: 3,
            type: 'pre-define',
            typeName: '사전정의',
            name: 'CHANGE_MEMBERS',
            description: '멤버 변경 권한',
          },
          {
            id: 4,
            type: 'pre-define',
            typeName: '사전정의',
            name: 'DELETE_MEMBERS',
            description: '멤버 삭제 권한',
          },
          {
            id: 5,
            type: 'user-define',
            typeName: '사용자정의',
            name: 'ACCESS_STOCK',
            description: '재고 접근 권한',
          },
          {
            id: 6,
            type: 'user-define',
            typeName: '사용자정의',
            name: 'MAKE_STOCK',
            description: '재고 생성 권한',
          },
          {
            id: 7,
            type: 'user-define',
            typeName: '사용자정의',
            name: 'CHANGE_STOCK',
            description: '재고 변경 권한',
          },
          {
            id: 8,
            type: 'user-define',
            typeName: '사용자정의',
            name: 'DELETE_STOCK',
            description: '재고 삭제 권한',
          },
          {
            id: 9,
            type: 'user-define',
            typeName: '사용자정의',
            name: 'ADD_STOCK_AMOUNT',
            description: '재고 수량 추가 권한',
          },
          {
            id: 10,
            type: 'user-define',
            typeName: '사용자정의',
            name: 'CATEGORIZE_STOCK',
            description: '재고 분류 권한',
          },
        ],
        totalCount: 11,
      },
    };
    AccessControlService.getPermissions.mockResolvedValue(testData);

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

    // 테이블 바디 검증
    const bodyRows = permissionTable.querySelectorAll('tbody > tr');
    expect(bodyRows).toHaveLength(10);
    expect(bodyRows[0].querySelectorAll('td')[2].textContent).toEqual('시스템 설정 권한');
    expect(bodyRows[1].querySelectorAll('td')[2].textContent).toEqual('멤버 접근 권한');
    expect(bodyRows[2].querySelectorAll('td')[2].textContent).toEqual('멤버 생성 권한');
    expect(bodyRows[3].querySelectorAll('td')[2].textContent).toEqual('멤버 변경 권한');
    expect(bodyRows[4].querySelectorAll('td')[2].textContent).toEqual('멤버 삭제 권한');
    expect(bodyRows[5].querySelectorAll('td')[2].textContent).toEqual('재고 접근 권한');
    expect(bodyRows[6].querySelectorAll('td')[2].textContent).toEqual('재고 생성 권한');
    expect(bodyRows[7].querySelectorAll('td')[2].textContent).toEqual('재고 변경 권한');
    expect(bodyRows[8].querySelectorAll('td')[2].textContent).toEqual('재고 삭제 권한');
    expect(bodyRows[9].querySelectorAll('td')[2].textContent).toEqual('재고 수량 추가 권한');
  });

  test('url parameter 에 page 2와 size 2를 명기한 경우에 2페이지에 2개를 렌더링 한다.', async () => {
    // given
    when(AccessControlService.getPermissions).calledWith({
      page: 2,
      pageSize: 2,
    }).mockResolvedValue({
      data: {
        result: [
          {
            id: 2,
            type: 'pre-define',
            typeName: '사전정의',
            name: 'MAKE_MEMBERS',
            description: '멤버 생성 권한',
          },
          {
            id: 3,
            type: 'pre-define',
            typeName: '사전정의',
            name: 'CHANGE_MEMBERS',
            description: '멤버 변경 권한',
          },
        ],
        totalCount: 4,
      },
    });

    const routes = [
      {
        path: '/access-control/permissions',
        element: <PermissionList />,
      },
    ];
    const router = createMemoryRouter(routes, {
      initialEntries: ['/', '/access-control/permissions?page=2&pageSize=2'],
      initialIndex: 1,
    });

    // when
    render(<RouterProvider router={router} />);
    await waitFor(() => screen.getByTestId('permission-table'));

    // then
    const permissionTable = screen.getByTestId('permission-table');
    expect(permissionTable).toBeInTheDocument();

    // 테이블 바디 검증
    const bodyRows = permissionTable.querySelectorAll('tbody > tr');
    expect(bodyRows).toHaveLength(2);
    expect(bodyRows[0].querySelectorAll('td')[2].textContent).toEqual('멤버 생성 권한');
    expect(bodyRows[1].querySelectorAll('td')[2].textContent).toEqual('멤버 변경 권한');
  });
});

describe('권한 유형에 따라 테이블 렌더링', () => {
  test('권한 유형이 사용자 정의일 때 Action 버튼을 노출 한다.', async () => {
    // given
    const testData = {
      data: {
        result: [
          {
            id: 0,
            type: 'user-define',
            typeName: '사용자정의',
            name: 'ACCESS_STOCK',
            description: '재고 접근 권한',
          },
          {
            id: 1,
            type: 'user-define',
            typeName: '사용자정의',
            name: 'MAKE_STOCK',
            description: '재고 생성 권한',
          },
        ],
        totalCount: 2,
      },
    };
    AccessControlService.getPermissions.mockResolvedValue(testData);

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

    // 테이블 바디 검증
    const bodyRows = permissionTable.querySelectorAll('tbody > tr');
    expect(bodyRows).toHaveLength(2);
    for (let i = 0; i < bodyRows.length; i++) {
      const bodyRowColumns = bodyRows[i].querySelectorAll('td');
      expect(bodyRowColumns[0]).toHaveTextContent('사용자정의');
      const dropDownButton = bodyRowColumns[3].querySelector('button');
      expect(dropDownButton).toBeInTheDocument();
    }
  });

  test('권한 유형이 사전 정의일 때 Action 버튼을 노출하지 않는다.', async () => {
    // given
    const testData = {
      data: {
        result: [
          {
            id: 0,
            type: 'pre-define',
            typeName: '사전정의',
            name: 'MANAGE_SYSTEM_SETTINGS',
            description: '시스템 설정 권한',
          },
          {
            id: 1,
            type: 'pre-define',
            typeName: '사전정의',
            name: 'ACCESS_MEMBERS',
            description: '멤버 접근 권한',
          },
        ],
        totalCount: 2,
      },
    };
    AccessControlService.getPermissions.mockResolvedValue(testData);

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

    // 테이블 바디 검증
    const bodyRows = permissionTable.querySelectorAll('tbody > tr');
    expect(bodyRows).toHaveLength(2);
    for (let i = 0; i < bodyRows.length; i++) {
      const bodyRowColumns = bodyRows[i].querySelectorAll('td');
      expect(bodyRowColumns[0]).toHaveTextContent('사전정의');
      const dropDownButton = bodyRowColumns[3].querySelector('button');
      expect(dropDownButton).not.toBeInTheDocument();
    }
  });
});

describe('pagination에 따라 테이블 렌더링', () => {
  test('권한이 총 3개이고 2개씩 페이징 할 때 최초에는 1페이지의 2개를 노출하고 2페이지를 클릭 하면 나머지 1개의 권한을 노출한다.', async () => {
    // given
    // 1페이지 mocking
    when(AccessControlService.getPermissions).calledWith({
      page: 1,
      pageSize: 2,
    }).mockResolvedValue({
      data: {
        result: [
          {
            id: 0,
            type: 'pre-define',
            typeName: '사전정의',
            name: 'MANAGE_SYSTEM_SETTINGS',
            description: '시스템 설정 권한',
          },
          {
            id: 1,
            type: 'pre-define',
            typeName: '사전정의',
            name: 'ACCESS_MEMBERS',
            description: '멤버 접근 권한',
          },
        ],
        totalCount: 3,
      },
    });
    // 2페이지 mocking
    when(AccessControlService.getPermissions).calledWith({
      page: 2,
      pageSize: 2,
    }).mockResolvedValue({
      data: {
        result: [
          {
            id: 2,
            type: 'pre-define',
            typeName: '사전정의',
            name: 'MAKE_MEMBERS',
            description: '멤버 생성 권한',
          },
        ],
        totalCount: 3,
      },
    });

    const routes = [
      {
        path: '/access-control/permissions',
        element: <PermissionList />,
      },
    ];
    const router = createMemoryRouter(routes, {
      initialEntries: ['/', '/access-control/permissions?page=1&pageSize=2'],
      initialIndex: 1,
    });

    // when
    render(<RouterProvider router={router} />);
    await waitFor(() => screen.getByTestId('permission-table'));

    // then
    const permissionTable = screen.getByTestId('permission-table');
    expect(permissionTable).toBeInTheDocument();

    // 1페이지 바디 검증
    let bodyRows = permissionTable.querySelectorAll('tbody > tr');
    expect(bodyRows).toHaveLength(2);
    expect(bodyRows[0].querySelectorAll('td')[2].textContent).toEqual('시스템 설정 권한');
    expect(bodyRows[1].querySelectorAll('td')[2].textContent).toEqual('멤버 접근 권한');

    // 2페이지로 이동
    const paginationBtn = screen.getByTitle('2');
    fireEvent.click(paginationBtn);
    await waitFor(() => {
      // 2페이지 바디 검증
      bodyRows = permissionTable.querySelectorAll('tbody > tr');
      expect(bodyRows).toHaveLength(1);
      expect(bodyRows[0].querySelectorAll('td')[2].textContent).toEqual('멤버 생성 권한');
    });
  });
});

describe('검색 영역에 대한 검색 및 결과 확인', () => {
  test('권한이 총 3개로 최초에는 3개를 노출하고 권한 이름을 검색하면 해당하는 1개의 권한을 노출한다.', async () => {
    // given
    // 첫 페이지 mocking
    when(AccessControlService.getPermissions).mockResolvedValue({
      data: {
        result: [
          {
            id: 0,
            type: 'pre-define',
            typeName: '사전정의',
            name: 'MANAGE_SYSTEM_SETTINGS',
            description: '시스템 설정 권한',
          },
          {
            id: 1,
            type: 'pre-define',
            typeName: '사전정의',
            name: 'ACCESS_MEMBERS',
            description: '멤버 접근 권한',
          },
          {
            id: 2,
            type: 'pre-define',
            typeName: '사전정의',
            name: 'MAKE_MEMBERS',
            description: '멤버 생성 권한',
          },
        ],
        totalCount: 3,
      },
    });
    // 검색 결과 mocking
    when(AccessControlService.getPermissions).calledWith({
      page: 1,
      pageSize: 10,
      name: 'MAKE_MEMBERS',
    }).mockResolvedValue({
      data: {
        result: [
          {
            id: 2,
            type: 'pre-define',
            typeName: '사전정의',
            name: 'MAKE_MEMBERS',
            description: '멤버 생성 권한',
          },
        ],
        totalCount: 1,
      },
    });

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

    render(<RouterProvider router={router} />);
    await waitFor(() => screen.getByTestId('permission-table'));

    const permissionTable = screen.getByTestId('permission-table');
    expect(permissionTable).toBeInTheDocument();

    // 최초 테이블 바디 검증
    let bodyRows = permissionTable.querySelectorAll('tbody > tr');
    expect(bodyRows).toHaveLength(3);
    expect(bodyRows[0].querySelectorAll('td')[2].textContent).toEqual('시스템 설정 권한');
    expect(bodyRows[1].querySelectorAll('td')[2].textContent).toEqual('멤버 접근 권한');
    expect(bodyRows[2].querySelectorAll('td')[2].textContent).toEqual('멤버 생성 권한');

    // when
    // 권한 이름에 MAKE_MEMBERS를 입력 후, 조회 버튼 클릭
    fireEvent.change(screen.getByLabelText('권한 이름'), { target: { value: 'MAKE_MEMBERS' } });
    const input = screen.getByDisplayValue('MAKE_MEMBERS');
    expect(input.value).toEqual('MAKE_MEMBERS');
    const searchBtn = screen.getByText('조회');
    fireEvent.click(searchBtn);

    // then
    await waitFor(() => {
      // 검색 결과 바디 검증
      bodyRows = permissionTable.querySelectorAll('tbody > tr');
      expect(bodyRows).toHaveLength(1);
      expect(bodyRows[0].querySelectorAll('td')[2].textContent).toEqual('멤버 생성 권한');
    });
  });

  test('권한이 총 3개로 최초에는 3개를 노출하고 특정 문구를 검색하면 권한 이름에 특정 문구가 포함된 권한을 모두 노출한다.', async () => {
    // given
    // 첫 페이지 mocking
    when(AccessControlService.getPermissions).mockResolvedValue({
      data: {
        result: [
          {
            id: 0,
            type: 'pre-define',
            typeName: '사전정의',
            name: 'MANAGE_SYSTEM_SETTINGS',
            description: '시스템 설정 권한',
          },
          {
            id: 1,
            type: 'pre-define',
            typeName: '사전정의',
            name: 'ACCESS_MEMBERS',
            description: '멤버 접근 권한',
          },
          {
            id: 2,
            type: 'pre-define',
            typeName: '사전정의',
            name: 'MAKE_MEMBERS',
            description: '멤버 생성 권한',
          },
        ],
        totalCount: 3,
      },
    });
    // 검색 결과 mocking
    when(AccessControlService.getPermissions).calledWith({
      page: 1,
      pageSize: 10,
      name: 'MEMBERS',
    }).mockResolvedValue({
      data: {
        result: [
          {
            id: 1,
            type: 'pre-define',
            typeName: '사전정의',
            name: 'ACCESS_MEMBERS',
            description: '멤버 접근 권한',
          },
          {
            id: 2,
            type: 'pre-define',
            typeName: '사전정의',
            name: 'MAKE_MEMBERS',
            description: '멤버 생성 권한',
          },
        ],
        totalCount: 2,
      },
    });

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

    render(<RouterProvider router={router} />);
    await waitFor(() => screen.getByTestId('permission-table'));

    const permissionTable = screen.getByTestId('permission-table');
    expect(permissionTable).toBeInTheDocument();

    // 최초 테이블 바디 검증
    let bodyRows = permissionTable.querySelectorAll('tbody > tr');
    expect(bodyRows).toHaveLength(3);
    expect(bodyRows[0].querySelectorAll('td')[2].textContent).toEqual('시스템 설정 권한');
    expect(bodyRows[1].querySelectorAll('td')[2].textContent).toEqual('멤버 접근 권한');
    expect(bodyRows[2].querySelectorAll('td')[2].textContent).toEqual('멤버 생성 권한');

    // when
    // 권한 이름에 MEMBERS를 입력 후, 조회 버튼 클릭
    fireEvent.change(screen.getByLabelText('권한 이름'), { target: { value: 'MEMBERS' } });
    const input = screen.getByDisplayValue('MEMBERS');
    expect(input.value).toEqual('MEMBERS');
    const searchBtn = screen.getByText('조회');
    fireEvent.click(searchBtn);

    // then
    await waitFor(() => {
      // 검색 결과 바디 검증
      bodyRows = permissionTable.querySelectorAll('tbody > tr');
      expect(bodyRows).toHaveLength(2);
      expect(bodyRows[0].querySelectorAll('td')[2].textContent).toEqual('멤버 접근 권한');
      expect(bodyRows[1].querySelectorAll('td')[2].textContent).toEqual('멤버 생성 권한');
    });
  });

  test('3개의 권한 중, 최초에는 1개의 특정 권한을 검색하고 초기화 버튼을 누르면 권한 3개를 노출한다.',async () => {
    // given
    // 최초 검색 결과 mocking
    when(AccessControlService.getPermissions).calledWith({
      page: 1,
      pageSize: 10,
      name: 'MAKE_MEMBERS',
    }).mockResolvedValue({
      data: {
        result: [
          {
            id: 2,
            type: 'pre-define',
            typeName: '사전정의',
            name: 'MAKE_MEMBERS',
            description: '멤버 생성 권한',
          },
        ],
        totalCount: 1,
      },
    });
    // 초기화 결과 mocking
    when(AccessControlService.getPermissions).mockResolvedValue({
      data: {
        result: [
          {
            id: 0,
            type: 'pre-define',
            typeName: '사전정의',
            name: 'MANAGE_SYSTEM_SETTINGS',
            description: '시스템 설정 권한',
          },
          {
            id: 1,
            type: 'pre-define',
            typeName: '사전정의',
            name: 'ACCESS_MEMBERS',
            description: '멤버 접근 권한',
          },
          {
            id: 2,
            type: 'pre-define',
            typeName: '사전정의',
            name: 'MAKE_MEMBERS',
            description: '멤버 생성 권한',
          },
        ],
        totalCount: 3,
      },
    });

    const routes = [
      {
        path: '/access-control/permissions',
        element: <PermissionList />,
      },
    ];
    const router = createMemoryRouter(routes, {
      initialEntries: ['/', '/access-control/permissions?name=MAKE_MEMBERS'],
      initialIndex: 1,
    });

    render(<RouterProvider router={router} />);
    await waitFor(() => screen.getByTestId('permission-table'));

    const permissionTable = screen.getByTestId('permission-table');
    expect(permissionTable).toBeInTheDocument();

    // 최초 테이블 바디 검증
    let bodyRows = permissionTable.querySelectorAll('tbody > tr');
    bodyRows = permissionTable.querySelectorAll('tbody > tr');
    expect(bodyRows).toHaveLength(1);
    expect(bodyRows[0].querySelectorAll('td')[2].textContent).toEqual('멤버 생성 권한');

    // when
    // 초기화 버튼 클릭
    const searchBtn = screen.getByText('초기화');
    fireEvent.click(searchBtn);

    // then
    await waitFor(() => {
      // 검색 결과 바디 검증
      bodyRows = permissionTable.querySelectorAll('tbody > tr');
      expect(bodyRows).toHaveLength(3);
      expect(bodyRows[0].querySelectorAll('td')[2].textContent).toEqual('시스템 설정 권한');
      expect(bodyRows[1].querySelectorAll('td')[2].textContent).toEqual('멤버 접근 권한');
      expect(bodyRows[2].querySelectorAll('td')[2].textContent).toEqual('멤버 생성 권한');
    });
  });
});
