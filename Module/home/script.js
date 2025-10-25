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

    handleModuleNavigation(module) {
        const path = `/Module/${module}/index.html`;
        App.loadModule(path);
    }
}

// 初始化
new Home();