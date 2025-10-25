import ControlCenter from '../../Core/ControlCenter.js';
import Base from '../../Utils/Base.js';

class Auth {
    constructor() {
        this.form = document.getElementById('loginForm');
        this.accountData = null;
        this.loginAttempts = {};
        this.isLoading = false;
        this.initializeEventListeners();
        this.loadAccountData();
    }

    async loadAccountData() {
        try {
            const response = await fetch('account.json');
            this.accountData = await response.json();
            Base.log('帳號資料載入成功', 'info');
        } catch (error) {
            Base.log('帳號資料載入失敗: ' + error.message, 'error');
        }
    }

    initializeEventListeners() {
        // 表單提交事件
        this.form.addEventListener('submit', this.handleLogin.bind(this));
        
        // 快速登入按鈕事件
        document.querySelectorAll('.quick-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const accountType = e.target.dataset.account;
                this.handleQuickLogin(accountType);
            });
        });

        // 密碼顯示/隱藏切換
        const togglePassword = document.getElementById('togglePassword');
        const passwordInput = document.getElementById('password');
        if (togglePassword && passwordInput) {
            togglePassword.addEventListener('click', () => {
                const type = passwordInput.type === 'password' ? 'text' : 'password';
                passwordInput.type = type;
                togglePassword.textContent = type === 'password' ? '👁' : '👁‍🗨';
            });
        }
    }

    async handleLogin(event) {
        event.preventDefault();
        
        if (this.isLoading) return;
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (!this.accountData) {
            this.showError('系統初始化中，請稍後再試');
            return;
        }

        // 檢查是否被鎖定
        if (this.isAccountLocked(username)) {
            this.showError(`帳號已被鎖定，請等待 ${this.accountData.settings.lockoutDuration} 秒後再試`);
            return;
        }

        try {
            this.setLoading(true);
            const loginResult = await this.authenticate(username, password);
            if (loginResult.success) {
                this.resetLoginAttempts(username);
                this.onLoginSuccess(loginResult.user);
            } else {
                this.handleFailedLogin(username);
            }
        } catch (error) {
            Base.log('登入失敗: ' + error.message, 'error');
            this.showError('系統錯誤，請稍後再試');
        } finally {
            this.setLoading(false);
        }
    }

    async authenticate(username, password) {
        return new Promise((resolve) => {
            const user = this.accountData.users.find(u => 
                u.username === username && u.password === password
            );

            if (user) {
                // 更新最後登入時間
                user.lastLogin = new Date().toISOString();
                resolve({ success: true, user });
            } else {
                resolve({ success: false });
            }
        });
    }

    isAccountLocked(username) {
        const attempts = this.loginAttempts[username];
        if (!attempts) return false;

        const { timestamp, count } = attempts;
        const lockoutDuration = this.accountData.settings.lockoutDuration * 1000; // 轉換為毫秒
        const now = Date.now();

        if (count >= this.accountData.settings.lockoutThreshold && 
            now - timestamp < lockoutDuration) {
            return true;
        }

        // 重設已過期的嘗試記錄
        if (now - timestamp >= lockoutDuration) {
            this.resetLoginAttempts(username);
        }

        return false;
    }

    handleFailedLogin(username) {
        if (!this.loginAttempts[username]) {
            this.loginAttempts[username] = { count: 0, timestamp: Date.now() };
        }

        this.loginAttempts[username].count++;
        this.loginAttempts[username].timestamp = Date.now();

        const remainingAttempts = this.accountData.settings.lockoutThreshold - 
            this.loginAttempts[username].count;

        if (remainingAttempts > 0) {
            this.showError(`帳號或密碼錯誤，還剩 ${remainingAttempts} 次機會`);
        } else {
            this.showError(`帳號已被鎖定，請等待 ${this.accountData.settings.lockoutDuration} 秒後再試`);
        }
    }

    resetLoginAttempts(username) {
        delete this.loginAttempts[username];
    }

    onLoginSuccess(user) {
        // 儲存登入狀態和使用者資訊
        sessionStorage.setItem('isAuthenticated', 'true');
        sessionStorage.setItem('username', user.username);
        sessionStorage.setItem('displayName', user.displayName);
        sessionStorage.setItem('role', user.role);
        sessionStorage.setItem('permissions', JSON.stringify(user.permissions));
        
        // 發送登入成功事件
        ControlCenter.emit('auth:login', {
            timestamp: new Date(),
            username: user.username,
            role: user.role,
            displayName: user.displayName
        });

        Base.log(`使用者 ${user.displayName} (${user.role}) 登入成功`, 'info');

        // 重定向到首頁
        window.location.href = '../Home/index.html';
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;

        // 移除舊的錯誤訊息
        const existingError = this.form.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // 添加新的錯誤訊息
        this.form.appendChild(errorDiv);
    }

    setLoading(isLoading) {
        this.isLoading = isLoading;
        const loginBtn = this.form.querySelector('.login-btn');
        if (loginBtn) {
            loginBtn.classList.toggle('loading', isLoading);
            loginBtn.disabled = isLoading;
        }
        
        // 禁用/啟用快速登入按鈕
        document.querySelectorAll('.quick-btn').forEach(btn => {
            btn.disabled = isLoading;
        });
    }

    async handleQuickLogin(accountType) {
        if (this.isLoading || !this.accountData) return;

        const user = this.accountData.users.find(u => u.username === accountType);
        if (!user) {
            this.showError('找不到指定的帳號');
            return;
        }

        // 填充表單
        document.getElementById('username').value = user.username;
        document.getElementById('password').value = user.password;

        // 觸發表單提交
        const submitEvent = new Event('submit');
        this.form.dispatchEvent(submitEvent);
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    new Auth();
});