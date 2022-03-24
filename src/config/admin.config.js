const BetterAdminConfig = {
  siteName: 'better ADMIN',
  logo: '/better-admin.png',
  homePage: '/',
  authentication: {
    used: true,
    loginUrl: '/login',
    oauthLoginResultUrl: '/oauth-login-result',
    authAPI: () => {
      return 'http://localhost:2016/api'
    },
    errorMessagePermissionDenied: '권한이 없습니다. 관리자에게 문의하세요.'
  },
  webSocketUrl: () => {
    return '//localhost:2016/ws'
  },
  errorMessage: {
    serverInternalError: '오류가 발생 했습니다. 잠시 후 다시 시도해 주세요.',
    badRequestError: '잘못된 요청입니다.',
    pageNotFoundError: '페이지를 찾을 수 없습니다.',
    networkError: '네트워크 연결이 원활하지 않습니다. 다시 한번 시도해 주세요.',
    badAccessPathError: '잘못된 경로 입니다. 메뉴를 통해 접근해 주세요.'
  },
  serverErrorHandlingExcludeUrl: {
    badRequest: [
      "/api/auth/token/refresh",
      "/api/auth",
      "/api/auth/dooray",
      "/api/members",
      "/api/access-control/permissions",
      "/api/member-access-logs"
    ],
    serverInternal: [
      "/api/member-access-logs"
    ]
  }
}

export const adminConfig = BetterAdminConfig;
