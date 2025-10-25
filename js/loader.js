/**
 * 入口頁面邏輯
 * 功能：檢查登入狀態並重定向
 */

class Loader {
    constructor() {
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.checkAuthAndRedirect();
        });
    }

    checkAuthAndRedirect() {
        const isAuthenticated = sessionStorage.getItem('isAuthenticated');
        
        // 設定短暫延遲以顯示載入動畫
        setTimeout(() => {
            if (isAuthenticated) {
                // 已登入，導向首頁
                window.location.href = 'Modules/Home/index.html';
            } else {
                // 未登入，導向登入頁
                window.location.href = 'Modules/Auth/index.html';
            }
        }, 1000);
    }
}

// 初始化載入器
new Loader();