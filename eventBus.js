/**
 * 路徑: ./eventBus.js
 * 檔名: eventBus.js
 * 功能: 提供事件匯流排功能
 * 修改日期: 20251025
 */

import Base from './Utils/Base.js';

export class EventBus {
    constructor() {
        this.listeners = new Map();
        this.history = [];
        this.maxHistoryLength = 100;
    }

    /**
     * 發送事件
     * @param {string} event - 事件名稱
     * @param {any} payload - 事件資料
     */
    delegate(event, payload) {
        const timestamp = new Date();
        const eventData = { event, payload, timestamp };

        // 記錄事件歷史
        this.logEvent(eventData);

        // 通知監聽器
        if (this.listeners.has(event)) {
            this.listeners.get(event).forEach(listener => {
                try {
                    listener(payload);
                } catch (error) {
                    Base.log(`事件處理器錯誤 [${event}]: ${error.message}`, 'error');
                }
            });
        }
    }

    /**
     * 訂閱事件
     * @param {string} event - 事件名稱
     * @param {Function} handler - 處理函數
     * @returns {Function} - 取消訂閱函數
     */
    subscribe(event, handler) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }

        this.listeners.get(event).add(handler);
        Base.log(`事件訂閱成功: ${event}`, 'info');

        // 返回取消訂閱函數
        return () => {
            this.unsubscribe(event, handler);
        };
    }

    /**
     * 取消訂閱
     * @param {string} event - 事件名稱
     * @param {Function} handler - 處理函數
     */
    unsubscribe(event, handler) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).delete(handler);
            Base.log(`事件取消訂閱: ${event}`, 'info');
        }
    }

    /**
     * 記錄事件歷史
     * @param {Object} eventData - 事件資料
     */
    logEvent(eventData) {
        this.history.push(eventData);

        // 限制歷史記錄長度
        if (this.history.length > this.maxHistoryLength) {
            this.history.shift();
        }
    }

    /**
     * 獲取事件歷史
     * @param {string} [eventName] - 可選的事件名稱過濾
     * @returns {Array} - 事件歷史記錄
     */
    getHistory(eventName = null) {
        if (eventName) {
            return this.history.filter(record => record.event === eventName);
        }
        return [...this.history];
    }

    /**
     * 清除所有監聽器
     */
    clear() {
        this.listeners.clear();
        Base.log('已清除所有事件監聽器', 'info');
    }
}
