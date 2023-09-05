import {act, fireEvent, render, screen, waitFor} from '@testing-library/react'
import '@testing-library/jest-dom'
import PermissionListPage from "@/pages/access-control/permission/list";
import {usePermissions} from "@/client/access-control/permission";
import {when} from "jest-when";
import mockRouter from 'next-router-mock';

jest.mock('@/client/access-control/permission');

describe('테이블 랜더링', () => {
  it('URL 파라메터가 없으면 1페이지 10개씩 테이블에 보여준다', async () => {
    // given
    when(usePermissions as jest.Mock).calledWith({
      page: 1,
      pageSize: 10
    }).mockReturnValue({
      data: {
        "result": [
          {
            "id": 1,
            "type": "pre-define",
            "typeName": "사전정의",
            "name": "access-control-permission.all",
            "description": "권한 관리에 관한 모든 권한"
          },
          {
            "id": 2,
            "type": "pre-define",
            "typeName": "사전정의",
            "name": "access-control-permission.create",
            "description": "권한 생성"
          },
          {
            "id": 3,
            "type": "pre-define",
            "typeName": "사전정의",
            "name": "access-control-permission.read",
            "description": "권한 조회"
          },
          {
            "id": 4,
            "type": "pre-define",
            "typeName": "사전정의",
            "name": "access-control-permission.update",
            "description": "권한 수정"
          },
          {
            "id": 5,
            "type": "pre-define",
            "typeName": "사전정의",
            "name": "access-control-permission.delete",
            "description": "권한 삭제"
          },
          {
            "id": 6,
            "type": "pre-define",
            "typeName": "사전정의",
            "name": "access-control-role.all",
            "description": "역할 관리에 관한 모든 권한"
          }
        ],
        "totalCount": 6
      }
    });

    // when
    await mockRouter.push("/access-control/permission/list");
    render(<PermissionListPage/>)

    // then
    await waitFor(() => screen.getByTestId('permission-table'));
    const permissionTable = screen.getByTestId('permission-table');
    expect(permissionTable).toBeInTheDocument();

    // 테이블 헤더 검증
    const header = permissionTable.querySelector('thead > tr');
    expect(header).not.toBeNull();
    const headerColumns = (header as Element).querySelectorAll('th');
    expect(headerColumns).toHaveLength(4);
    expect(headerColumns[0]).toHaveTextContent('유형');
    expect(headerColumns[1]).toHaveTextContent('권한 이름');
    expect(headerColumns[2]).toHaveTextContent('설명');
    expect(headerColumns[3]).toHaveTextContent('Action');

    // 테이블 바디 검증
    const bodyRows = permissionTable.querySelectorAll('tbody > tr');
    expect(bodyRows).toHaveLength(7); // ant table은 컨텐츠이 담기지 않는 TR이 하나 존재하기 때문에 컨텐츠 + 1를 확인한다.

    const bodyRow1Columns = bodyRows[1].querySelectorAll('td');
    expect(bodyRow1Columns).toHaveLength(4);
    expect(bodyRow1Columns[0]).toHaveTextContent('사전정의');
    expect(bodyRow1Columns[1]).toHaveTextContent('access-control-permission.all');
    expect(bodyRow1Columns[2]).toHaveTextContent('권한 관리에 관한 모든 권한');

    const bodyRow2Columns = bodyRows[2].querySelectorAll('td');
    expect(bodyRow2Columns).toHaveLength(4);
    expect(bodyRow2Columns[0]).toHaveTextContent('사전정의');
    expect(bodyRow2Columns[1]).toHaveTextContent('access-control-permission.create');
    expect(bodyRow2Columns[2]).toHaveTextContent('권한 생성');

    const bodyRow3Columns = bodyRows[3].querySelectorAll('td');
    expect(bodyRow3Columns).toHaveLength(4);
    expect(bodyRow3Columns[0]).toHaveTextContent('사전정의');
    expect(bodyRow3Columns[1]).toHaveTextContent('access-control-permission.read');
    expect(bodyRow3Columns[2]).toHaveTextContent('권한 조회');

    const bodyRow4Columns = bodyRows[4].querySelectorAll('td');
    expect(bodyRow4Columns).toHaveLength(4);
    expect(bodyRow4Columns[0]).toHaveTextContent('사전정의');
    expect(bodyRow4Columns[1]).toHaveTextContent('access-control-permission.update');
    expect(bodyRow4Columns[2]).toHaveTextContent('권한 수정');

    const bodyRow5Columns = bodyRows[5].querySelectorAll('td');
    expect(bodyRow5Columns).toHaveLength(4);
    expect(bodyRow5Columns[0]).toHaveTextContent('사전정의');
    expect(bodyRow5Columns[1]).toHaveTextContent('access-control-permission.delete');
    expect(bodyRow5Columns[2]).toHaveTextContent('권한 삭제');

    const bodyRow6Columns = bodyRows[6].querySelectorAll('td');
    expect(bodyRow6Columns).toHaveLength(4);
    expect(bodyRow6Columns[0]).toHaveTextContent('사전정의');
    expect(bodyRow6Columns[1]).toHaveTextContent('access-control-role.all');
    expect(bodyRow6Columns[2]).toHaveTextContent('역할 관리에 관한 모든 권한');
  });

  it('URL 파라메터 page=1 이고 pageSize=3 라면 5개씩 잘라진 1페이지를 테이블에 보여준다', async () => {
    // given
    when(usePermissions as jest.Mock).calledWith({
      page: 1,
      pageSize: 3
    }).mockReturnValue({
      data: {
        "result": [
          {
            "id": 1,
            "type": "pre-define",
            "typeName": "사전정의",
            "name": "access-control-permission.all",
            "description": "권한 관리에 관한 모든 권한"
          },
          {
            "id": 2,
            "type": "pre-define",
            "typeName": "사전정의",
            "name": "access-control-permission.create",
            "description": "권한 생성"
          },
          {
            "id": 3,
            "type": "pre-define",
            "typeName": "사전정의",
            "name": "access-control-permission.read",
            "description": "권한 조회"
          }
        ],
        "totalCount": 6
      }
    });

    // when
    await mockRouter.push("/access-control/permission/list?page=1&pageSize=3");
    render(<PermissionListPage/>)

    // then
    await waitFor(() => screen.getByTestId('permission-table'));
    const permissionTable = screen.getByTestId('permission-table');
    expect(permissionTable).toBeInTheDocument();

    // 테이블 헤더 검증
    const header = permissionTable.querySelector('thead > tr');
    expect(header).not.toBeNull();
    const headerColumns = (header as Element).querySelectorAll('th');
    expect(headerColumns).toHaveLength(4);
    expect(headerColumns[0]).toHaveTextContent('유형');
    expect(headerColumns[1]).toHaveTextContent('권한 이름');
    expect(headerColumns[2]).toHaveTextContent('설명');
    expect(headerColumns[3]).toHaveTextContent('Action');

    // 테이블 바디 검증
    const bodyRows = permissionTable.querySelectorAll('tbody > tr');
    expect(bodyRows).toHaveLength(4); // ant table은 컨텐츠이 담기지 않는 TR이 하나 존재하기 때문에 컨텐츠 + 1를 확인한다.

    const bodyRow1Columns = bodyRows[1].querySelectorAll('td');
    expect(bodyRow1Columns).toHaveLength(4);
    expect(bodyRow1Columns[0]).toHaveTextContent('사전정의');
    expect(bodyRow1Columns[1]).toHaveTextContent('access-control-permission.all');
    expect(bodyRow1Columns[2]).toHaveTextContent('권한 관리에 관한 모든 권한');

    const bodyRow2Columns = bodyRows[2].querySelectorAll('td');
    expect(bodyRow2Columns).toHaveLength(4);
    expect(bodyRow2Columns[0]).toHaveTextContent('사전정의');
    expect(bodyRow2Columns[1]).toHaveTextContent('access-control-permission.create');
    expect(bodyRow2Columns[2]).toHaveTextContent('권한 생성');

    const bodyRow3Columns = bodyRows[3].querySelectorAll('td');
    expect(bodyRow3Columns).toHaveLength(4);
    expect(bodyRow3Columns[0]).toHaveTextContent('사전정의');
    expect(bodyRow3Columns[1]).toHaveTextContent('access-control-permission.read');
    expect(bodyRow3Columns[2]).toHaveTextContent('권한 조회');
  });
})

describe('버튼 이벤트', () => {
  it('권한 생성 버튼을 클릭하면 권한 생성 페이지로 이동한다', async () => {
    // given
    when(usePermissions as jest.Mock).calledWith({
      page: 1,
      pageSize: 10
    }).mockReturnValue({
      data: {
        "result": [
          {
            "id": 1,
            "type": "pre-define",
            "typeName": "사전정의",
            "name": "access-control-permission.all",
            "description": "권한 관리에 관한 모든 권한"
          }
        ],
        "totalCount": 1
      }
    });

    await mockRouter.push("/access-control/permission/list");
    render(<PermissionListPage/>)
    await waitFor(() => screen.getByTestId('permission-table'));

    // when
    const button = screen.getByTestId('create-permission-btn');
    fireEvent.click(button);

    // then
    expect(mockRouter).toMatchObject({
      pathname: "/access-control/permission/new",
      query: {},
    });
  });
});

describe('검색 영역', () => {
  it('권한 이름에 all 입력하면 권한 이름 중에 all이 들어간 권한 목록을 보여 준다', async () => {
    // given
    // 최초 페이지 랜더링시 데이터
    when(usePermissions as jest.Mock).calledWith({
      page: 1,
      pageSize: 10
    }).mockReturnValue({
      data: {
        "result": [
          {
            "id": 1,
            "type": "pre-define",
            "typeName": "사전정의",
            "name": "access-control-permission.all",
            "description": "권한 관리에 관한 모든 권한"
          },
          {
            "id": 5,
            "type": "pre-define",
            "typeName": "사전정의",
            "name": "access-control-permission.delete",
            "description": "권한 삭제"
          },
          {
            "id": 6,
            "type": "pre-define",
            "typeName": "사전정의",
            "name": "access-control-role.all",
            "description": "역할 관리에 관한 모든 권한"
          }
        ],
        "totalCount": 3
      }
    });

    // name에 all이라는 이름이 들어간 랜더링 데이터
    when(usePermissions as jest.Mock).calledWith({
      page: 1,
      pageSize: 10,
      name: "all"
    }).mockReturnValue({
      data: {
        "result": [
          {
            "id": 1,
            "type": "pre-define",
            "typeName": "사전정의",
            "name": "access-control-permission.all",
            "description": "권한 관리에 관한 모든 권한"
          },
          {
            "id": 6,
            "type": "pre-define",
            "typeName": "사전정의",
            "name": "access-control-role.all",
            "description": "역할 관리에 관한 모든 권한"
          }
        ],
        "totalCount": 2
      }
    });

    await mockRouter.push("/access-control/permission/list");
    render(<PermissionListPage/>)

    await waitFor(() => screen.getByTestId('permission-table'));

    // when
    const searchNameInput = screen.getByTestId('search-name-input');
    fireEvent.change(searchNameInput, { target: { value: 'all' } });

    const searchButton = screen.getByTestId('search-btn');
    await act(() => {
      fireEvent.click(searchButton);
    });

    // then
    expect(mockRouter).toMatchObject({
      asPath: "/access-control/permission/list?name=all",
      pathname: "/access-control/permission/list",
      query: {name: "all"},
    });
  });
});