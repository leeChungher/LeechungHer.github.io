/**
 * 入口頁面邏輯
 * 功能：檢查登入狀態並載入對應模組
 */

import App from '../app.js';

class Loader {
    constructor() {
        this.app = App;
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.loadStyles();
            this.checkAuthAndRedirect();
        });
    }

    loadStyles() {
        // 載入全局樣式
        const styles = [
            './css/style.css',  // 改用相對路徑
            // 可以在這裡添加更多需要的樣式文件
        ];

        styles.forEach(href => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = href;
            
            // 監聽樣式載入狀態
            link.onload = () => {
                console.log(`樣式載入成功: ${href}`);
            };
            
            link.onerror = () => {
                console.error(`樣式載入失敗: ${href}`);
                this.showError(`樣式載入失敗: ${href}`);
            };
            
            document.head.appendChild(link);
        });
    }

    showError(message) {
        const container = document.querySelector('.loading-container');
        let errorDiv = container.querySelector('.error-message');
        
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            container.appendChild(errorDiv);
        }

        const timestamp = new Date().toLocaleTimeString();
        const errorHtml = `
            <div class="error-item">
                <span class="error-time">[${timestamp}]</span>
                <span class="error-text">${message}</span>
            </div>
        `;

        errorDiv.innerHTML += errorHtml;
    }

    async checkAuthAndRedirect() {
        const isAuthenticated = sessionStorage.getItem('isAuthenticated');
        
        // 設定短暫延遲以顯示載入動畫
        setTimeout(async () => {
            try {
                if (isAuthenticated) {
                    // 已登入，載入首頁內容
                    await this.app.loadModule('./Module/home/index.html');
                } else {
                    // 未登入，載入登入頁內容
                    await this.app.loadModule('./Module/auth/index.html');
                }
            } catch (error) {
                console.error('導航失敗:', error);
                this.showError(`導航失敗: ${error.message}`);
                this.showError(`失敗路徑: ${error.path || '未知路徑'}`);
            }
        }, 1000);
    }
}

// 初始化載入器
const loader = new Loader();