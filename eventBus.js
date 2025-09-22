/**
 * 路徑: ./eventBus.js
 * 檔名: eventBus.js
 * 功能: 提供 delegate / subscribe API
 * 修改日期: 20250922
 */
export class EventBus {
  constructor() {
    this.listeners = {};
  }

  delegate(event, payload) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(handler => handler(payload));
    }
  }

  subscribe(event, handler) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(handler);
  }
}
