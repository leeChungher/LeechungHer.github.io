/**
 * 事件調度中心
 * 負責管理所有模組間的事件通訊
 */
class ControlCenter {
    constructor() {
        this.events = {};
    }

    // 註冊事件監聽
    on(eventName, callback) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(callback);
    }

    // 觸發事件
    emit(eventName, data) {
        if (this.events[eventName]) {
            this.events[eventName].forEach(callback => {
                callback(data);
            });
        }
    }

    // 移除事件監聽
    off(eventName, callback) {
        if (this.events[eventName]) {
            this.events[eventName] = this.events[eventName].filter(cb => cb !== callback);
        }
    }
}

export default new ControlCenter();