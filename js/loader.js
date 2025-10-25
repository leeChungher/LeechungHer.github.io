/**
 * 入口頁面邏輯
 * 功能：檢查登入狀態並載入對應模組
 */

import App from '/app.js';

class Loader {
    constructor() {
        this.app = App;
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.checkAuthAndRedirect();
        });
    }

    async checkAuthAndRedirect() {
        const isAuthenticated = sessionStorage.getItem('isAuthenticated');
        
        // 設定短暫延遲以顯示載入動畫
        setTimeout(async () => {
            try {
                if (isAuthenticated) {
                    // 已登入，載入首頁內容
                    await this.app.loadModule('/Module/home/index.html');
                } else {
                    // 未登入，載入登入頁內容
                    await this.app.loadModule('/Module/Auth/index.html');
                }
            } catch (error) {
                console.error('導航失敗:', error);
                const mainContainer = document.getElementById('app');
                mainContainer.innerHTML = '<div class="error-message">載入失敗</div>';
            }
        }, 1000);
    }
}

// 初始化載入器
const loader = new Loader();