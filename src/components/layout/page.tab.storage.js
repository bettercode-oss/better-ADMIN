const SESSION_STORAGE_KEY_BETTER_ADMIN_PAGE_TAB = "betterAdminPageTab";

class PageTabStorage {
  getPageTab() {
    return window.sessionStorage.getItem(SESSION_STORAGE_KEY_BETTER_ADMIN_PAGE_TAB) ?
      JSON.parse(window.sessionStorage.getItem(SESSION_STORAGE_KEY_BETTER_ADMIN_PAGE_TAB))
      : null;
  }

  setPageTab(pageTab) {
    window.sessionStorage.setItem(SESSION_STORAGE_KEY_BETTER_ADMIN_PAGE_TAB, JSON.stringify(pageTab));
  }

  clear() {
    window.sessionStorage.removeItem(SESSION_STORAGE_KEY_BETTER_ADMIN_PAGE_TAB);
  }
}

const instance = new PageTabStorage()
export {instance as PageTabStorage}