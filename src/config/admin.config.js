const BetterAdminConfig = {
  siteName: "better ADMIN",
  logo: "/better-admin.png",
  userPermissions: () => {
    // FIXME 사이트에 맞게 로그인한 사용자의 권한 목록을 반환한다. 아래는 예시
    return ["USER_MANAGED", "SITE_MANAGED", "USER_MANAGED-A", "USER_MANAGED-C"]
  },
  authentication: {
    used: true,
    loginUrl: "/login",
    authAPI: () => {
      return "http://localhost:2016/api"
    }
  }
}

export const adminConfig = BetterAdminConfig;
