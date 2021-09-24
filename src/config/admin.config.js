const BetterAdminConfig = {
  siteName: "better ADMIN",
  logo: "/better-admin.png",
  homePage: "/",
  authentication: {
    used: true,
    loginUrl: "/login",
    googleOAuthRedirectLoginUrl: "/google-oauth-login",
    authAPI: () => {
      return "http://localhost:2016/api"
    },
    errorMessagePermissionDenied: "권한이 없습니다. 관리자에게 문의하세요."
  },
  errorMessage: {
    serverInternalError: "오류가 발생 했습니다. 잠시 후 다시 시도해 주세요.",
    networkError: "네트워크 연결이 원활하지 않습니다. 다시 한번 시도해 주세요."
  }
}

export const adminConfig = BetterAdminConfig;
