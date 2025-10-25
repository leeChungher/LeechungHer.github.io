/**
 * 路徑: ./app.js
 * 檔名: app.js
 * 功能: 應用程式核心邏輯
 * 修改日期: 20251025
 */
import { EventBus } from './eventBus.js';
import ControlCenter from './Core/ControlCenter.js';
import Base from './Utils/Base.js';

// 全局事件匯流排
window.eventBus = new EventBus();

// 模組配置
const AppConfig = {
    version: '1.0.0',
    modules: [
        {
            name: 'auth',
            path: './Modules/Auth/',
            required: true
        },
        {
            name: 'home',
            path: './Modules/Home/',
            required: true
        },
        {
            name: 'dialog',
            path: './Modules/Dialog/',
            required: false
        },
        {
            name: 'qrcode',
            path: './Modules/QRCode/',
            required: false
        }
    ]
};

class App {
    constructor() {
        this.config = AppConfig;
        this.loadedModules = new Set();
        this.init();
    }

    async init() {
        try {
            // 初始化核心組件
            await this.initializeCore();
            
            // 載入必要模組
            await this.loadRequiredModules();
            
            // 設定全局錯誤處理
            this.setupErrorHandling();
            
            Base.log('應用程式初始化完成', 'info');
        } catch (error) {
            Base.log('應用程式初始化失敗: ' + error.message, 'error');
        }
    }

    async initializeCore() {
        // 註冊核心事件監聽器
        ControlCenter.on('module:loaded', (data) => {
            this.loadedModules.add(data.name);
            Base.log(`模組載入完成: ${data.name}`, 'info');
        });

        // 監聽驗證狀態
        ControlCenter.on('auth:logout', () => {
            sessionStorage.clear();
            window.location.href = '/Modules/Auth/index.html';
        });
    }

    async loadRequiredModules() {
        const requiredModules = this.config.modules.filter(m => m.required);
        
        for (const module of requiredModules) {
            try {
                await this.loadModule(module);
            } catch (error) {
                Base.log(`模組載入失敗 ${module.name}: ${error.message}`, 'error');
                throw error;
            }
        }
    }

    async loadModule({ name, path }) {
        try {
            // 載入模組設定
            const config = await fetch(`${path}config.json`).then(res => res.json());
            
            // 載入模組腳本
            await import(`${path}index.js`);
            
            // 發送模組載入完成事件
            ControlCenter.emit('module:loaded', { name, config });
            
        } catch (error) {
            throw new Error(`模組載入失敗 ${name}: ${error.message}`);
        }
    }

    setupErrorHandling() {
        window.onerror = (msg, url, lineNo, columnNo, error) => {
            Base.log('全局錯誤:', {
                message: msg,
                url: url,
                line: lineNo,
                column: columnNo,
                error: error
            }, 'error');
            return false;
        };

        window.addEventListener('unhandledrejection', (event) => {
            Base.log('未處理的 Promise 拒絕:', event.reason, 'error');
        });
    }
}

// 啟動應用程式
window.app = new App();
