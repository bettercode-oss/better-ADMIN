import NavigationConfig from "./navigation.config";
import * as navigation from './navigation';

jest.mock('./navigation', () => ({
  __esModule: true,
  default: null
}));

describe('hasPermissions', () => {
  test('navigationPermissions이 null 인 경우', () => {
    // given
    const memberPermissions = new Set(['MANAGE_SYSTEM_SETTINGS', 'MANAGE_MEMBERS']);
    const navigationPermissions = null;

    // when
    const actual = NavigationConfig.hasPermissions(memberPermissions, navigationPermissions)

    // then
    const expected = true;
    expect(actual).toEqual(expected);
  });

  test('navigationPermissions memberPermissions 둘다 null 인 경우', () => {
    // given
    const memberPermissions = null;
    const navigationPermissions = null;

    // when
    const actual = NavigationConfig.hasPermissions(memberPermissions, navigationPermissions)

    // then
    const expected = true;
    expect(actual).toEqual(expected);
  });

  test('memberPermissions 이 null 이고 navigationPermissions 값이 빈 경우', () => {
    // given
    const memberPermissions = null;
    const navigationPermissions = [];

    // when
    const actual = NavigationConfig.hasPermissions(memberPermissions, navigationPermissions)

    // then
    const expected = true;
    expect(actual).toEqual(expected);
  });

  test('memberPermissions 이 navigationPermissions 값이 있는 경우', () => {
    // given
    const memberPermissions = new Set(['MANAGE_SYSTEM_SETTINGS', 'MANAGE_MEMBERS']);
    const navigationPermissions = ['MANAGE_SYSTEM_SETTINGS'];

    // when
    const actual = NavigationConfig.hasPermissions(memberPermissions, navigationPermissions)

    // then
    const expected = true;
    expect(actual).toEqual(expected);
  });

  test('memberPermissions 이 navigationPermissions 값이 없는 경우', () => {
    // given
    const memberPermissions = new Set(['MANAGE_MEMBERS']);
    const navigationPermissions = ['MANAGE_SYSTEM_SETTINGS'];

    // when
    const actual = NavigationConfig.hasPermissions(memberPermissions, navigationPermissions)

    // then
    const expected = false;
    expect(actual).toEqual(expected);
  });
});

describe('getItemsByMemberPermission', () => {

  test('권한이 없는 경우', () => {
    // given
    navigation.default = {
      items: [
        {
          title: '홈',
          link: '/home'
        }
      ]
    };

    const allowedPermissions = [];

    // when
    const actual = NavigationConfig.getItemsByMemberPermission(allowedPermissions)

    // then
    expect(actual).toEqual([
      {
        title: '홈',
        link: '/home'
      }
    ]);
  });

  test('Level 2 메뉴의 권한이 있는 경우', () => {
    // given
    navigation.default = {
      items: [
        {
          title: "홈",
          link: "/home"
        }, {
          title: "접근 제어",
          accessPermissions: ["MANAGE_ACCESS_CONTROL"],
          items: [
            {
              title: "역할",
              link: "/access-control/roles"
            },
            {
              title: "권한",
              link: "/access-control/permissions"
            }
          ]
        }, {
          title: "사용자/조직도",
          accessPermissions: ["MANAGE_MEMBERS", "MANAGE_ORGANIZATION"],
        }, {
          title: "설정",
          accessPermissions: ["MANAGE_SYSTEM_SETTINGS"],
        }
      ]
    };
    const allowedPermissions = ['MANAGE_ACCESS_CONTROL'];

    // when
    const actual = NavigationConfig.getItemsByMemberPermission(allowedPermissions)

    // then
    expect(actual).toEqual([
      {
        title: "홈",
        link: "/home"
      }, {
        title: "접근 제어",
        accessPermissions: ["MANAGE_ACCESS_CONTROL"],
        items: [
          {
            title: "역할",
            link: "/access-control/roles"
          },
          {
            title: "권한",
            link: "/access-control/permissions"
          }
        ]
      }
    ]);
  });

  test('Level 3 메뉴의 권한이 있는 경우', () => {
    // given
    const allowedPermissions = ['MANAGE_SYSTEM_SETTINGS'];

    navigation.default = {
      items: [
        {
          title: "홈",
          link: "/home"
        }, {
          title: "접근 제어",
          accessPermissions: ["MANAGE_ACCESS_CONTROL"],
        }, {
          title: "사용자/조직도",
          accessPermissions: ["MANAGE_MEMBERS", "MANAGE_ORGANIZATION"],
        }, {
          title: "설정",
          accessPermissions: ["MANAGE_SYSTEM_SETTINGS"],
          items: [
            {
              title: "로그인",
              items: [
                {
                  title: "두레이",
                  link: "/settings/login/dooray"
                },
                {
                  title: "구글 워크스페이스",
                  link: "/settings/login/google-workspace"
                }
              ]
            }, {
              title: "웹훅(Webhooks)",
              items: [
                {
                  title: "알림 웹훅",
                  link: "/web-hooks/notifications",
                }
              ]
            }
          ]
        }
      ]
    };

    // when
    const actual = NavigationConfig.getItemsByMemberPermission(allowedPermissions)

    // then
    expect(actual).toEqual([
      {
        title: "홈",
        link: "/home"
      }, {
        title: "설정",
        accessPermissions: ["MANAGE_SYSTEM_SETTINGS"],
        items: [
          {
            title: "로그인",
            items: [
              {
                title: "두레이",
                link: "/settings/login/dooray"
              },
              {
                title: "구글 워크스페이스",
                link: "/settings/login/google-workspace"
              }
            ]
          }, {
            title: "웹훅(Webhooks)",
            items: [
              {
                title: "알림 웹훅",
                link: "/web-hooks/notifications",
              }
            ]
          }
        ]
      }
    ]);
  });

  test('Level 2,3 메뉴의 권한이 있는 경우', () => {
    // given
    navigation.default = {
      items: [
        {
          title: "홈",
          link: "/home"
        }, {
          title: "접근 제어",
          accessPermissions: ["MANAGE_ACCESS_CONTROL"],
          items: [
            {
              title: "역할",
              link: "/access-control/roles"
            },
            {
              title: "권한",
              link: "/access-control/permissions"
            }
          ]
        }, {
          title: "사용자/조직도",
          accessPermissions: ["MANAGE_MEMBERS", "MANAGE_ORGANIZATION"]
        }, {
          title: "설정",
          accessPermissions: ["MANAGE_SYSTEM_SETTINGS"],
          items: [
            {
              title: "로그인",
              items: [
                {
                  title: "두레이",
                  link: "/settings/login/dooray"
                },
                {
                  title: "구글 워크스페이스",
                  link: "/settings/login/google-workspace"
                }
              ]
            }, {
              title: "웹훅(Webhooks)",
              items: [
                {
                  title: "알림 웹훅",
                  link: "/web-hooks/notifications",
                }
              ]
            }
          ]
        }
      ]
    };

    const allowedPermissions = ['MANAGE_SYSTEM_SETTINGS', 'MANAGE_ACCESS_CONTROL'];

    // when
    const actual = NavigationConfig.getItemsByMemberPermission(allowedPermissions)

    // then
    expect(actual).toEqual([
      {
        title: "홈",
        link: "/home"
      }, {
        title: "접근 제어",
        accessPermissions: ["MANAGE_ACCESS_CONTROL"],
        items: [
          {
            title: "역할",
            link: "/access-control/roles"
          },
          {
            title: "권한",
            link: "/access-control/permissions"
          }
        ]
      }, {
        title: "설정",
        accessPermissions: ["MANAGE_SYSTEM_SETTINGS"],
        items: [
          {
            title: "로그인",
            items: [
              {
                title: "두레이",
                link: "/settings/login/dooray"
              },
              {
                title: "구글 워크스페이스",
                link: "/settings/login/google-workspace"
              }
            ]
          }, {
            title: "웹훅(Webhooks)",
            items: [
              {
                title: "알림 웹훅",
                link: "/web-hooks/notifications",
              }
            ]
          }
        ]
      }
    ]);
  });

  test('Navigation이 null 인 경우', () => {
    // given
    navigation.default = null;

    // when
    const actual = NavigationConfig.getItemsByMemberPermission();

    // then
    expect(actual).toEqual([]);
  });

});

describe('getFirstItemLink', () => {

  test('첫 번째 메뉴가 Level 1 메뉴인 경우', () => {
    // given
    navigation.default = {
      items: [
        {
          title: "홈",
          link: "/home"
        }, {
          title: "접근 제어",
          accessPermissions: ["MANAGE_ACCESS_CONTROL"],
          items: [
            {
              title: "역할",
              link: "/access-control/roles"
            },
            {
              title: "권한",
              link: "/access-control/permissions"
            }
          ]
        }
      ]
    };

    const allowedPermissions = ['MANAGE_SYSTEM_SETTINGS', 'MANAGE_ACCESS_CONTROL'];

    // when
    const actual = NavigationConfig.getFirstItemLink(allowedPermissions)

    // then
    expect(actual).toBe('/home');
  });

  test('첫 번째 메뉴가 Level 2 메뉴인 경우', () => {
    // given
    navigation.default = {
      items: [
        {
          title: "홈",
          items: [
            {
              title: "두번째 홈 1",
              link: "/home2-1"
            },
            {
              title: "두번째 홈 2",
              link: "/home2-2"
            }
          ]
        }, {
          title: "접근 제어",
          accessPermissions: ["MANAGE_ACCESS_CONTROL"],
          items: [
            {
              title: "역할",
              link: "/access-control/roles"
            },
            {
              title: "권한",
              link: "/access-control/permissions"
            }
          ]
        }
      ]
    };

    const allowedPermissions = ['MANAGE_SYSTEM_SETTINGS', 'MANAGE_ACCESS_CONTROL'];

    // when
    const actual = NavigationConfig.getFirstItemLink(allowedPermissions)

    // then
    expect(actual).toBe('/home2-1');
  });

  test('첫 번째 메뉴가 Level 3 메뉴인 경우', () => {
    // given
    navigation.default = {
      items: [
        {
          title: "홈",
          items: [
            {
              title: "두번째 홈 1",
              items: [
                {
                  title: "세번째 홈 1",
                  link: "/home3-1"
                },
                {
                  title: "세번째 홈 2",
                  link: "/home3-2"
                }
              ]
            },
            {
              title: "두번째 홈 2",
              link: "/home2-2"
            }
          ]
        }, {
          title: "접근 제어",
          accessPermissions: ["MANAGE_ACCESS_CONTROL"],
          items: [
            {
              title: "역할",
              link: "/access-control/roles"
            },
            {
              title: "권한",
              link: "/access-control/permissions"
            }
          ]
        }
      ]
    };

    const allowedPermissions = ['MANAGE_SYSTEM_SETTINGS', 'MANAGE_ACCESS_CONTROL'];

    // when
    const actual = NavigationConfig.getFirstItemLink(allowedPermissions)

    // then
    expect(actual).toBe('/home3-1');
  });
});

describe('getItemsWithoutMemberPermission', () => {

  test('Navigation이 null 인 경우', () => {
    // given
    navigation.default = null;

    // when
    const actual = NavigationConfig.getItemsWithoutMemberPermission();

    // then
    expect(actual).toEqual([]);
  });

  test('member permission에 상관없이 모든 메뉴 조회', () => {
    // given
    navigation.default = {
      items: [
        {
          title: "홈",
          link: "/home"
        }, {
          title: "접근 제어",
          accessPermissions: ["MANAGE_ACCESS_CONTROL"],
          items: [
            {
              title: "역할",
              link: "/access-control/roles"
            },
            {
              title: "권한",
              link: "/access-control/permissions"
            }
          ]
        }, {
          title: "사용자/조직도",
          accessPermissions: ["MANAGE_MEMBERS", "MANAGE_ORGANIZATION"]
        }, {
          title: "설정",
          accessPermissions: ["MANAGE_SYSTEM_SETTINGS"],
          items: [
            {
              title: "로그인",
              items: [
                {
                  title: "두레이",
                  link: "/settings/login/dooray"
                },
                {
                  title: "구글 워크스페이스",
                  link: "/settings/login/google-workspace"
                }
              ]
            }, {
              title: "웹훅(Webhooks)",
              items: [
                {
                  title: "알림 웹훅",
                  link: "/web-hooks/notifications",
                }
              ]
            }
          ]
        }
      ]
    };

    // when
    const actual = NavigationConfig.getItemsWithoutMemberPermission();

    // then
    expect(actual).toEqual([
        {
          title: "홈",
          link: "/home"
        }, {
          title: "접근 제어",
          accessPermissions: ["MANAGE_ACCESS_CONTROL"],
          items: [
            {
              title: "역할",
              link: "/access-control/roles"
            },
            {
              title: "권한",
              link: "/access-control/permissions"
            }
          ]
        }, {
          title: "사용자/조직도",
          accessPermissions: ["MANAGE_MEMBERS", "MANAGE_ORGANIZATION"]
        }, {
          title: "설정",
          accessPermissions: ["MANAGE_SYSTEM_SETTINGS"],
          items: [
            {
              title: "로그인",
              items: [
                {
                  title: "두레이",
                  link: "/settings/login/dooray"
                },
                {
                  title: "구글 워크스페이스",
                  link: "/settings/login/google-workspace"
                }
              ]
            }, {
              title: "웹훅(Webhooks)",
              items: [
                {
                  title: "알림 웹훅",
                  link: "/web-hooks/notifications",
                }
              ]
            }
          ]
        }
      ]
    );
  });

});

describe('getItemByLink', () => {
  test('navigationItems 이 null 인 경우', () => {
    // given
    const navigationItems = null;

    // when
    const actual = NavigationConfig.getItemByLink('/test', navigationItems);

    // then
    expect(actual).toEqual({
      level1Item: null,
      level2Item: null,
      level3Item: null
    });
  });

  test('navigationItems 이 array 가 아닌 경우', () => {
    // given
    const navigationItems = {
      title: "홈",
      link: "/home"
    };

    // when
    const actual = NavigationConfig.getItemByLink('/home', navigationItems);

    // then
    expect(actual).toEqual({
      level1Item: null,
      level2Item: null,
      level3Item: null
    });
  });

  test('level1 메뉴가 존재하는 경우', () => {
    // given
    const navigationItems = [{
      title: "홈",
      link: "/home"
    }];

    // when
    const actual = NavigationConfig.getItemByLink('/home', navigationItems);

    // then
    expect(actual).toEqual({
      "level1Item": {
        "index": "0",
        "title": "홈"
      },
      "level2Item": null,
      "level3Item": null
    });
  });

  test('level2 메뉴가 존재하는 경우', () => {
    // given
    const navigationItems = [{
      title: "홈",
      items: [
        {
          title: "두번째 홈 1",
          link: "/home2-1"
        },
        {
          title: "두번째 홈 2",
          link: "/home2-2"
        }
      ]
    }];

    // when
    const actual = NavigationConfig.getItemByLink('/home2-2', navigationItems);

    // then
    expect(actual).toEqual({
      "level1Item": {
        "index": "0",
        "title": "홈"
      },
      "level2Item": {
        "index": "1",
        "title": "두번째 홈 2"
      },
      "level3Item": null
    });
  });

  test('level3 메뉴가 존재하는 경우', () => {
    // given
    const navigationItems = [{
      title: "홈",
      items: [
        {
          title: "두번째 홈 1",
          items: [
            {
              title: "세번째 홈 1",
              link: "/home3-1"
            },
            {
              title: "세번째 홈 2",
              link: "/home3-2"
            }
          ]
        },
        {
          title: "두번째 홈 2",
          link: "/home2-2"
        }
      ]
    }];

    // when
    const actual = NavigationConfig.getItemByLink('/home3-2', navigationItems);

    // then
    expect(actual).toEqual({
      "level1Item": {
        "index": "0",
        "title": "홈"
      },
      "level2Item": {
        "index": "0",
        "title": "두번째 홈 1"
      },
      "level3Item": {
        "index": "1",
        "title": "세번째 홈 2"
      }
    });
  });
});

describe('isEmptyItem', () => {
  test('null 인 경우', () => {
    // given
    const item = null;

    // when
    const actual = NavigationConfig.isEmptyItem(item)

    // then
    expect(actual).toBeTruthy()
  });

  test('빈 객체인 경우', () => {
    // given
    const item = {
    };

    // when
    const actual = NavigationConfig.isEmptyItem(item)

    // then
    expect(actual).toBeTruthy()
  });

  test('level 1 메뉴가 null 인 경우', () => {
    // given
    const item = {
      level1Item: null
    };

    // when
    const actual = NavigationConfig.isEmptyItem(item)

    // then
    expect(actual).toBeTruthy()
  });

  test('level 1 메뉴가 비어 있는 경우', () => {
    // given
    const item = {
      level1Item: {}
    };

    // when
    const actual = NavigationConfig.isEmptyItem(item)

    // then
    expect(actual).toBeTruthy()
  });
});




