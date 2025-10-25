/**
 * 路徑: ./app.js
 * 檔名: app.js
 * 功能: 應用程式主要邏輯
 * 修改日期: 20251025
 */

import { Router } from '/Core/Router.js';
import { EventBus } from '/eventBus.js';
import Base from '/Utils/Base.js';

class App extends EventBus {
    constructor() {
        super();
        this.router = new Router();
        this.moduleContainer = document.getElementById('app');
        this.initialize();
    }

    initialize() {
        // 初始化路由器
        this.router.initialize(this.loadModule.bind(this));

        // 註冊事件監聽
        this.subscribe('module:navigate', (data) => {
            this.router.navigate(data.path);
        });
    }

    async loadModule(path) {
        try {
            const response = await fetch(path, {
                headers: {
                    'Accept-Charset': 'UTF-8',
                    'Content-Type': 'text/html; charset=UTF-8'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const content = await response.text();
            this.moduleContainer.innerHTML = content;

            // 檢查並載入相應的腳本
            const modulePath = path.replace('/index.html', '');
            const scriptPath = `${modulePath}/script.js`;
            
            // 移除舊的腳本
            const oldScript = this.moduleContainer.querySelector(`script[src="${scriptPath}"]`);
            if (oldScript) {
                oldScript.remove();
            }

            // 載入新的腳本
            const script = document.createElement('script');
            script.type = 'module';
            script.src = scriptPath;
            this.moduleContainer.appendChild(script);

            this.delegate('module:loaded', { path });
            Base.log(`模組載入成功: ${path}`, 'info');
        } catch (error) {
            console.error('Module loading failed:', error);
            this.moduleContainer.innerHTML = '<div class="error-message">載入失敗</div>';
            this.delegate('module:error', { path, error });
            Base.log(`模組載入失敗: ${path}`, 'error');
        }
    }

    // 取得當前路徑
    getCurrentPath() {
        return this.router.currentPath;
    }

    // 導航到指定路徑
    navigateTo(path) {
        this.router.navigate(path);
    }
}

// 導出單例
export default new App();