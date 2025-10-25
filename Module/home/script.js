/**
 * 路徑: ./Module/home/script.js
 * 檔名: script.js
 * 功能: 首頁相關功能
 * 修改日期: 20251025
 */

import { EventBus } from '/eventBus.js';
import Base from '/Utils/Base.js';
import App from '/app.js';

class Home extends EventBus {
    constructor() {
        super();
        this.initializeEventListeners();
        this.displayUsername();
    }

    initializeEventListeners() {
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }

        const moduleCards = document.querySelectorAll('.module-card');
        moduleCards.forEach(card => {
            card.addEventListener('click', () => {
                const module = card.dataset.module;
                this.handleModuleNavigation(module);
            });
        });
    }

    displayUsername() {
        const usernameSpan = document.getElementById('username');
        const username = sessionStorage.getItem('username');
        if (usernameSpan && username) {
            usernameSpan.textContent = `${username}`;
        }
    }

    handleLogout() {
        // 清除登入狀態
        sessionStorage.removeItem('isAuthenticated');
        sessionStorage.removeItem('username');
        
        // 記錄登出事件
        Base.log('使用者登出', 'info');
        
        // 導向登入頁面
        App.navigateTo('Module/Auth/index.html');
    }

    async handleModuleNavigation(module) {
        try {
            const path = `/Module/${module}/index.html`;
            Base.log(`正在導航到模組: ${module}`, 'info');
            await App.loadModule(path);
            Base.log(`成功載入模組: ${module}`, 'info');
        } catch (error) {
            console.error('模組導航失敗:', error);
            Base.log(`模組導航失敗: ${error.message}`, 'error');
        }
    }
}

// 初始化
new Home();