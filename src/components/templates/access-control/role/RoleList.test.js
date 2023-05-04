import '@testing-library/jest-dom';
import {
  fireEvent, render, screen, waitFor,
} from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { when } from 'jest-when';
import RoleList from './RoleList';
import AccessControlService from '../../../../services/access.control.service';

jest.mock('../../../../services/access.control.service');

describe('화면 렌더링', () => {
  test('최초 화면 로드 시 url 파라미터가 빈 값이고, 1페이지 최대 10개의 데이터를 보여준다. 이 때 데이터는 파라미터가 page:1, pageSize:10 일 때와 동일하다', async () => {
    when(AccessControlService.getRoles).calledWith({
      page: 1,
      pageSize: 10,
    }).mockResolvedValue({
      data: {
        result: [
          {
            id: 1,
            type: 'pre-define',
            typeName: '사전정의',
            name: '시스템 관리자',
            description: '설명',
            permissions: [
              {
                id: 1,
                name: 'VIEW_MONITORING',
              },
            ],
          },
          {
            id: 2,
            type: 'pre-define',
            typeName: '사전정의',
            name: '조직/멤버 관리자',
            description: '설명',
            permissions: [
              {
                id: 1,
                name: 'VIEW_MONITORING',
              },
              {
                id: 2,
                name: 'NOTE_WEB_HOOKS',
              },
            ],
          },
          {
            id: 3,
            type: 'user-define',
            typeName: '사용자정의',
            name: '테스트 관리자',
            description: '설명',
            permissions: [
              {
                id: 1,
                name: 'VIEW_MONITORING',
              },
              {
                id: 3,
                name: 'MANAGE_ORGANIZATION',
              },
            ],
          },
          {
            id: 4,
            type: 'pre-define',
            typeName: '사전정의',
            name: '시스템 관리자',
            description: '설명',
            permissions: [
              {
                id: 1,
                name: 'VIEW_MONITORING',
              },
              {
                id: 4,
                name: 'MANAGE_ACCESS_CONTROL',
              },
            ],
          },
          {
            id: 5,
            type: 'pre-define',
            typeName: '사전정의',
            name: '시스템 관리자',
            description: '설명',
            permissions: [
              {
                id: 1,
                name: 'VIEW_MONITORING',
              },
              {
                id: 5,
                name: 'MANAGE_MEMBERS',
              },
            ],
          },
          {
            id: 6,
            type: 'pre-define',
            typeName: '사전정의',
            name: '시스템 관리자',
            description: '설명',
            permissions: [
              {
                id: 1,
                name: 'VIEW_MONITORING',
              },
              {
                id: 5,
                name: 'MANAGE_SYSTEMSETTINGS',
              },
            ],
          },
          {
            id: 7,
            type: 'pre-define',
            typeName: '사전정의',
            name: '시스템 관리자',
            description: '설명',
            permissions: [
              {
                id: 1,
                name: 'VIEW_MONITORING',
              },
            ],
          },
          {
            id: 8,
            type: 'pre-define',
            typeName: '사전정의',
            name: '시스템 관리자',
            description: '설명',
            permissions: [
              {
                id: 1,
                name: 'VIEW_MONITORING',
              },
            ],
          },
          {
            id: 9,
            type: 'pre-define',
            typeName: '사전정의',
            name: '시스템 관리자',
            description: '설명',
            permissions: [
              {
                id: 1,
                name: 'VIEW_MONITORING',
              },
            ],
          },
          {
            id: 10,
            type: 'pre-define',
            typeName: '사전정의',
            name: '시스템 관리자',
            description: '설명',
            permissions: [
              {
                id: 1,
                name: 'VIEW_MONITORING',
              },
            ],
          },
        ],
        totalCount: 10,
      },
    });

    const routes = [
      {
        path: '/access.control/roles',
        element: <RoleList />,
      },
    ];
    const router = createMemoryRouter(routes, {
      initialEntries: ['/', '/access.control/roles'],
      initialIndex: 1,
    });

    render(<RouterProvider router={router} />);
    await waitFor(() => screen.getByTestId('role-table'));
    const roleTable = screen.getByTestId('role-table');
    const bodyRows = roleTable.querySelectorAll('tbody > tr');
    const header = roleTable.querySelector('thead > tr');
    const headerColumns = header.querySelectorAll('th');
    const bodyRowColumns = bodyRows[0].querySelectorAll('td');

    expect(headerColumns).toHaveLength(5);
    expect(headerColumns[0]).toHaveTextContent('유형');
    expect(headerColumns[1]).toHaveTextContent('역할 이름');
    expect(headerColumns[2]).toHaveTextContent('할당 권한');
    expect(headerColumns[3]).toHaveTextContent('설명');
    expect(headerColumns[4]).toHaveTextContent('Action');

    expect(bodyRows).toHaveLength(10);
    expect(bodyRowColumns).toHaveLength(5);
    expect(bodyRows[0].querySelectorAll('td')[0]).toHaveTextContent('사전정의');
    expect(bodyRows[0].querySelectorAll('td')[1]).toHaveTextContent('시스템 관리자');
    expect(bodyRows[0].querySelectorAll('td')[2]).toHaveTextContent('펼쳐 보기');
    expect(bodyRows[0].querySelectorAll('td')[3]).toHaveTextContent('설명');
    expect(bodyRows[0].querySelectorAll('td')[4]).toHaveTextContent('');

    expect(bodyRows[1].querySelectorAll('td')[0]).toHaveTextContent('사전정의');
    expect(bodyRows[1].querySelectorAll('td')[1]).toHaveTextContent('조직/멤버 관리자');
    expect(bodyRows[1].querySelectorAll('td')[2]).toHaveTextContent('펼쳐 보기');
    expect(bodyRows[1].querySelectorAll('td')[3]).toHaveTextContent('설명');
    expect(bodyRows[1].querySelectorAll('td')[4]).toHaveTextContent('');

    expect(bodyRows[2].querySelectorAll('td')[0]).toHaveTextContent('사용자정의');
    expect(bodyRows[2].querySelectorAll('td')[1]).toHaveTextContent('테스트 관리자');
    expect(bodyRows[2].querySelectorAll('td')[2]).toHaveTextContent('펼쳐 보기');
    expect(bodyRows[2].querySelectorAll('td')[3]).toHaveTextContent('설명');
    expect(bodyRows[2].querySelectorAll('td')[4]).toHaveTextContent('');

    expect(bodyRows[3].querySelectorAll('td')[0]).toHaveTextContent('사전정의');
    expect(bodyRows[3].querySelectorAll('td')[1]).toHaveTextContent('시스템 관리자');
    expect(bodyRows[3].querySelectorAll('td')[2]).toHaveTextContent('펼쳐 보기');
    expect(bodyRows[3].querySelectorAll('td')[3]).toHaveTextContent('설명');
    expect(bodyRows[3].querySelectorAll('td')[4]).toHaveTextContent('');

    expect(bodyRows[4].querySelectorAll('td')[0]).toHaveTextContent('사전정의');
    expect(bodyRows[4].querySelectorAll('td')[1]).toHaveTextContent('시스템 관리자');
    expect(bodyRows[4].querySelectorAll('td')[2]).toHaveTextContent('펼쳐 보기');
    expect(bodyRows[4].querySelectorAll('td')[3]).toHaveTextContent('설명');
    expect(bodyRows[4].querySelectorAll('td')[4]).toHaveTextContent('');

    expect(bodyRows[5].querySelectorAll('td')[0]).toHaveTextContent('사전정의');
    expect(bodyRows[5].querySelectorAll('td')[1]).toHaveTextContent('시스템 관리자');
    expect(bodyRows[5].querySelectorAll('td')[2]).toHaveTextContent('펼쳐 보기');
    expect(bodyRows[5].querySelectorAll('td')[3]).toHaveTextContent('설명');
    expect(bodyRows[5].querySelectorAll('td')[4]).toHaveTextContent('');

    expect(bodyRows[6].querySelectorAll('td')[0]).toHaveTextContent('사전정의');
    expect(bodyRows[6].querySelectorAll('td')[1]).toHaveTextContent('시스템 관리자');
    expect(bodyRows[6].querySelectorAll('td')[2]).toHaveTextContent('펼쳐 보기');
    expect(bodyRows[6].querySelectorAll('td')[3]).toHaveTextContent('설명');
    expect(bodyRows[6].querySelectorAll('td')[4]).toHaveTextContent('');

    expect(bodyRows[7].querySelectorAll('td')[0]).toHaveTextContent('사전정의');
    expect(bodyRows[7].querySelectorAll('td')[1]).toHaveTextContent('시스템 관리자');
    expect(bodyRows[7].querySelectorAll('td')[2]).toHaveTextContent('펼쳐 보기');
    expect(bodyRows[7].querySelectorAll('td')[3]).toHaveTextContent('설명');
    expect(bodyRows[7].querySelectorAll('td')[4]).toHaveTextContent('');

    expect(bodyRows[8].querySelectorAll('td')[0]).toHaveTextContent('사전정의');
    expect(bodyRows[8].querySelectorAll('td')[1]).toHaveTextContent('시스템 관리자');
    expect(bodyRows[8].querySelectorAll('td')[2]).toHaveTextContent('펼쳐 보기');
    expect(bodyRows[8].querySelectorAll('td')[3]).toHaveTextContent('설명');
    expect(bodyRows[8].querySelectorAll('td')[4]).toHaveTextContent('');

    expect(bodyRows[9].querySelectorAll('td')[0]).toHaveTextContent('사전정의');
    expect(bodyRows[9].querySelectorAll('td')[1]).toHaveTextContent('시스템 관리자');
    expect(bodyRows[9].querySelectorAll('td')[2]).toHaveTextContent('펼쳐 보기');
    expect(bodyRows[9].querySelectorAll('td')[3]).toHaveTextContent('설명');
    expect(bodyRows[9].querySelectorAll('td')[4]).toHaveTextContent('');
  });

  test('url 파라메터가 page=2이고 pageSize=10 이면 2페이지 데이터를 최대 10개까지 보여 준다', async () => {
    when(AccessControlService.getRoles).calledWith({
      page: 2,
      pageSize: 10,
    }).mockResolvedValue({
      data: {
        result: [
          {
            id: 1,
            type: 'user-define',
            typeName: '사용자정의',
            name: '테스트 관리자',
            description: '설명',
            permissions: [
              {
                id: 1,
                name: 'VIEW_MONITORING',
              },
              {
                id: 3,
                name: 'MANAGE_ORGANIZATION',
              },
            ],
          },
          {
            id: 2,
            type: 'pre-define',
            typeName: '사전정의',
            name: '시스템 관리자',
            description: '설명',
            permissions: [
              {
                id: 1,
                name: 'VIEW_MONITORING',
              },
              {
                id: 4,
                name: 'MANAGE_ACCESS_CONTROL',
              },
            ],
          },
        ],
        totalCount: 12,
      },
    });

    const routes = [
      {
        path: '/access.control/roles',
        element: <RoleList />,
      },
    ];
    const router = createMemoryRouter(routes, {
      initialEntries: ['/', '/access.control/roles?page=2&pageSize=10'],
      initialIndex: 1,
    });

    render(<RouterProvider router={router} />);

    await waitFor(() => screen.getByTestId('role-table'));
    const roleTable = screen.getByTestId('role-table');
    const prePageButton = screen.getByRole('listitem', { name: 'Previous Page', disabled: 'false' });
    const firstPage = screen.getByRole('listitem', { name: '1' });
    const secondPage = screen.getByRole('listitem', { name: '2' });
    const nextPageButton = screen.getByRole('listitem', { name: 'Next Page', disabled: 'true' });
    const bodyRows = roleTable.querySelectorAll('tbody > tr');
    const header = roleTable.querySelector('thead > tr');
    const headerColumns = header.querySelectorAll('th');
    const bodyRowColumns = bodyRows[0].querySelectorAll('td');

    expect(headerColumns).toHaveLength(5);

    expect(headerColumns[0]).toHaveTextContent('유형');
    expect(headerColumns[1]).toHaveTextContent('역할 이름');
    expect(headerColumns[2]).toHaveTextContent('할당 권한');
    expect(headerColumns[3]).toHaveTextContent('설명');
    expect(headerColumns[4]).toHaveTextContent('Action');

    expect(bodyRows).toHaveLength(2);
    expect(bodyRows[0].querySelectorAll('td')).toHaveLength(5);

    expect(bodyRows[0].querySelectorAll('td')[0]).toHaveTextContent('사용자정의');
    expect(bodyRows[0].querySelectorAll('td')[1]).toHaveTextContent('테스트 관리자');
    expect(bodyRows[0].querySelectorAll('td')[2]).toHaveTextContent('펼쳐 보기');
    expect(bodyRows[0].querySelectorAll('td')[3]).toHaveTextContent('설명');
    expect(bodyRows[0].querySelectorAll('td')[4]).toHaveTextContent('');

    expect(bodyRows[1].querySelectorAll('td')[0]).toHaveTextContent('사전정의');
    expect(bodyRows[1].querySelectorAll('td')[1]).toHaveTextContent('시스템 관리자');
    expect(bodyRows[1].querySelectorAll('td')[2]).toHaveTextContent('펼쳐 보기');
    expect(bodyRows[1].querySelectorAll('td')[3]).toHaveTextContent('설명');
    expect(bodyRows[1].querySelectorAll('td')[4]).toHaveTextContent('');

    expect(prePageButton).toBeInTheDocument();
    expect(nextPageButton).toBeInTheDocument();
    expect(firstPage).toBeInTheDocument();
    expect(secondPage).toBeInTheDocument();
  });

  test('접근제어>역할 페이지 유형 란이 사용자 정의 일때 Action 란에 버튼이 나타난다.', async () => {
    const resp = {
      data: {
        result: [
          {
            id: 1,
            type: 'user-define',
            typeName: '사용자 정의',
            name: '시스템 관리자',
            description: '설명',
            permissions: [
              {
                id: 1,
                name: 'VIEW_MONITORING',
              },
            ],
          },
        ],
        totalCount: 1,
      },
    };
    AccessControlService.getRoles.mockResolvedValue(resp);

    const routes = [
      {
        path: '/access.control/roles',
        element: <RoleList />,
      },
    ];
    const router = createMemoryRouter(routes, {
      initialEntries: ['/', '/access.control/roles'],
      initialIndex: 1,
    });

    render(<RouterProvider router={router} />);
    await waitFor(() => screen.getByTestId('role-table'));

    const roleTable = screen.getByTestId('role-table');
    const bodyRows = roleTable.querySelectorAll('tbody > tr');
    const bodyRowColumns = bodyRows[0].querySelectorAll('td');
    const actionButton = bodyRowColumns[4].querySelectorAll('button');
    expect(actionButton[0]).toBeInTheDocument();
  });

  test('할당 권한 펼쳐 보기를 클릭하면 부여 된 권한 리스트가 조회 된다.', async () => {
    const resp = {
      data: {
        result: [
          {
            id: 1,
            type: 'pre-define',
            typeName: '사전정의',
            name: '시스템 관리자',
            description: '설명',
            permissions: [
              {
                id: 1,
                name: 'MANAGE_SYSTEM_SETTING',
              },
              {
                id: 6,
                name: 'VIEW_MONITORING',
              },
            ],
          },
        ],
        totalCount: 1,
      },
    };
    AccessControlService.getRoles.mockResolvedValue(resp);

    const routes = [
      {
        path: '/access.control/rolelist',
        element: <RoleList />,
      },
    ];
    const router = createMemoryRouter(routes, {
      initialEntries: ['/', '/access.control/rolelist'],
      initialIndex: 1,
    });

    render(<RouterProvider router={router} />);
    await waitFor(() => screen.getByTestId('role-table'));
    // eslint-disable-next-line max-len
    const permissionButton = document.querySelector('div[aria-disabled="false"][aria-expanded="false"].ant-collapse-header[role="button"][tabindex="0"]');
    fireEvent.click(permissionButton);
    expect(screen.getByText('MANAGE_SYSTEM_SETTING')).toBeInTheDocument();
    expect(screen.getByText('VIEW_MONITORING')).toBeInTheDocument();
  });
});

// describe('검색 기능 테스트', () => {
//   test('검색 란에 검색어 입력 후 검색 된 데이터가 테이블에 조회 된다.', async () => {
//     const resp = {
//       data: {
//         result: [
//           {
//             id: 1,
//             type: 'pre-define',
//             typeName: '사전정의',
//             name: '시스템 관리자',
//             description: '설명',
//             permissions: [
//               {
//                 id: 1,
//                 name: 'MANAGE_SYSTEM_SETTING',
//               },
//               {
//                 id: 6,
//                 name: 'VIEW_MONITORING',
//               },
//             ],
//           },
//           {
//             id: 2,
//             type: 'pre-define',
//             typeName: '사전정의',
//             name: '조직/멤버 관리자',
//             description: '두번째 설명',
//             permissions: [
//               {
//                 id: 1,
//                 name: 'MANAGE_SYSTEM_SETTING',
//               },
//               {
//                 id: 6,
//                 name: 'VIEW_MONITORING',
//               },
//             ],
//           }
//         ],
//         totalCount: 2,
//       },
//     };
//     AccessControlService.getRoles.mockResolvedValue(resp);
//     const routes = [
//       {
//         path: '/access.control/rolelist',
//         element: <RoleList />,
//       },
//     ];
//     const router = createMemoryRouter(routes, {
//       initialEntries: ['/', '/access.control/rolelist'],
//       initialIndex: 1,
//     });

//     const navigate = jest.fn();

//     jest.mock('react-router-dom', () => ({
//       ...jest.requireActual('react-router-dom'),
//       useNavigate: jest.fn(),
//     }))

//     useNavigate.mockReturnValue(navigate);

//     render(<RouterProvider router={router} />);
//     await waitFor(() => screen.getByTestId('role-search'));
//     const onFinish = jest.fn();
//     const roleTable = screen.getByTestId('role-table');
//     const searchForm = screen.getByTestId('role-search');
//     const inputName = screen.getByRole('textbox');
//     const searchButton = screen.getByRole('button', { name: '조회'});
//     const bodyRows = roleTable.querySelectorAll('tbody > tr');
//     expect(bodyRows).toHaveLength(2);
//     //expect(inputName).toBe();
//     fireEvent.change(inputName, {target: {value: '시스템'}});
//     expect(inputName.value).toBe('시스템');
//     fireEvent.submit(searchButton);
//     expect(navigate).toHaveBeenCalledWith('/access-control/roles?page=1&pageSize=10&name=시스템');

//   });
// });
