import ControlCenter from '../../Core/ControlCenter.js';
import Base from '../../Utils/Base.js';

class Home {
    constructor() {
        this.checkAuth();
        this.initializeUI();
        this.bindEvents();
    }

    checkAuth() {
        // 檢查是否已登入
        if (!sessionStorage.getItem('isAuthenticated')) {
            window.location.href = '../Auth/index.html';
            return;
        }
    }

    initializeUI() {
        // 顯示使用者名稱
        const username = document.getElementById('username');
        if (username) {
            username.textContent = sessionStorage.getItem('username') || '使用者';
        }

        // 初始化模組卡片
        this.initializeModules();
    }

    bindEvents() {
        // 綁定登出按鈕
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', this.handleLogout.bind(this));
        }

        // 綁定模組卡片點擊事件
        const moduleCards = document.querySelectorAll('.module-card');
        moduleCards.forEach(card => {
            card.addEventListener('click', () => {
                const moduleType = card.dataset.module;
                this.handleModuleNavigation(moduleType);
            });
        });
    }

    initializeModules() {
        // 這裡可以動態載入可用的模組列表
        // 目前使用靜態方式展示
    }

    handleModuleNavigation(moduleType) {
        switch(moduleType) {
            case 'qrcode':
                window.location.href = '../QRCode/index.html';
                break;
            case 'dialog':
                window.location.href = '../Dialog/index.html';
                break;
            default:
                Base.log(`未知的模組類型: ${moduleType}`, 'warning');
        }
    }

    handleLogout() {
        // 清除登入狀態
        sessionStorage.clear();
        
        // 發送登出事件
        ControlCenter.emit('auth:logout', {
            timestamp: new Date()
        });

        // 重定向到登入頁
        window.location.href = '../Auth/index.html';
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    new Home();
});