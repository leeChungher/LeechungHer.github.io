/**
 * 路徑: ./Module/Auth/script.js
 * 檔名: script.js
 * 功能: 處理使用者認證
 * 修改日期: 20251025
 */

import ControlCenter from '/Core/ControlCenter.js';
import Base from '/Utils/Base.js';
import App from '/app.js';

class Auth {
    constructor() {
        this.form = document.getElementById('loginForm');
        this.accountData = null;
        this.loginAttempts = {};
        this.isLoading = false;
        this.initializeEventListeners();
        this.loadAccountData();
        this.initializeQuickLogin();
    }

    initializeQuickLogin() {
        const quickLoginButtons = document.querySelectorAll('.quick-login-btn');
        quickLoginButtons.forEach(button => {
            button.addEventListener('click', () => {
                const role = button.dataset.role;
                this.handleQuickLogin(role);
            });
        });
    }

    handleQuickLogin(role) {
        const roleConfig = {
            admin: {
                username: 'admin',
                displayName: '管理員',
                permissions: ['admin']
            },
            user: {
                username: 'user',
                displayName: '一般使用者',
                permissions: ['user']
            },
            visitor: {
                username: 'visitor',
                displayName: '訪客',
                permissions: ['visitor']
            }
        };

        if (roleConfig[role]) {
            const { username, displayName, permissions } = roleConfig[role];
            
            // 設定登入狀態
            sessionStorage.setItem('isAuthenticated', 'true');
            sessionStorage.setItem('username', displayName);
            sessionStorage.setItem('permissions', JSON.stringify(permissions));
            
            // 記錄登入
            Base.log(`${displayName} 登入成功`, 'info');
            
            // 更新路由狀態
            // 使用 App 的載入模組功能導向首頁
            App.loadModule('/Module/home/index.html');
        }
    }

    initializeEventListeners() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleLogin(e));
        }
    }

    async loadAccountData() {
        try {
            const response = await fetch('account.json');
            this.accountData = await response.json();
            Base.log('帳號資料載入成功', 'info');
        } catch (error) {
            Base.log('帳號資料載入失敗: ' + error.message, 'error');
            this.showError('無法載入帳號資料');
        }
    }

    async handleLogin(event) {
        event.preventDefault();
        
        if (this.isLoading) return;
        
        const username = this.form.username.value;
        const password = this.form.password.value;
        
        this.setLoading(true);
        const success = await this.authenticate(username, password);
        this.setLoading(false);
        
        if (success) {
            this.handleSuccessfulLogin(username);
        }
    }

    async authenticate(username, password) {
        try {
            // 在這裡實現實際的驗證邏輯
            return true;
        } catch (error) {
            Base.log('驗證失敗: ' + error.message, 'error');
            this.showError('驗證失敗');
            return false;
        }
    }

    handleSuccessfulLogin(username, displayName = username) {
        sessionStorage.setItem('isAuthenticated', 'true');
        sessionStorage.setItem('username', displayName);
        Base.log(`${displayName} 登入成功`, 'info');
        App.navigateTo('/Module/home/index.html');
    }

    showError(message) {
        const errorBox = document.querySelector('.error-message');
        if (errorBox) {
            errorBox.textContent = message;
            errorBox.style.display = 'block';
        }
    }

    setLoading(loading) {
        this.isLoading = loading;
        const submitButton = this.form.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = loading;
            submitButton.textContent = loading ? '登入中...' : '登入';
        }
    }
}

// 初始化
new Auth();