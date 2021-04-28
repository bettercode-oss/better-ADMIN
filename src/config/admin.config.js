const BetterAdminConfig = {
  siteName: "better ADMIN",
  logo: "/better-admin.png",
  authentication: {
    used: false,
    loginUrl: "/login",
    authAPI: () => {
      return "http://localhost:2016/api"
    }
  }
}

export const adminConfig = BetterAdminConfig;
