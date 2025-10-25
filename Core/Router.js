/**
 * 路徑: ./Core/Router.js
 * 檔名: Router.js
 * 功能: 提供 SPA 路由功能
 * 修改日期: 20251025
 */

import { EventBus } from '/eventBus.js';
import Base from '/Utils/Base.js';

export class Router extends EventBus {
    constructor() {
        super();
        this.currentPath = null;
        this.moduleLoader = null;
    }

    /**
     * 初始化路由器
     * @param {Function} moduleLoader - 載入模組的函數
     */
    initialize(moduleLoader) {
        this.moduleLoader = moduleLoader;
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.path) {
                this.navigate(e.state.path, true);
            }
        });
    }

    /**
     * 導航到指定路徑
     * @param {string} path - 目標路徑
     * @param {boolean} isPopState - 是否由 popstate 事件觸發
     */
    async navigate(path, isPopState = false) {
        if (path === this.currentPath) return;

        try {
            await this.moduleLoader(path);
            this.currentPath = path;
            
            if (!isPopState) {
                window.history.pushState({ path }, '', window.location.pathname);
            }

            this.delegate('navigation:complete', { path });
            Base.log(`導航完成: ${path}`, 'info');
        } catch (error) {
            Base.log(`導航失敗: ${path}`, 'error');
            console.error('Navigation failed:', error);
        }
    }
}