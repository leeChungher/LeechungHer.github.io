export class EventBus {
  static events = {};

  static on(event, handler) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(handler);
    console.log(`📌 EventBus.on('${event}') → 已註冊 handler`);
  }

  static off(event, handler) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(fn => fn !== handler);
    console.log(`🗑️ EventBus.off('${event}') → 已移除 handler`);
  }

  static emit(event, payload) {
    console.log(`📡 EventBus.emit('${event}')`, payload);
    if (!this.events[event]) {
      console.warn(`⚠️ EventBus.emit('${event}') → 無任何監聽者`);
      return;
    }
    this.events[event].forEach(fn => fn(payload));
  }

  static once(event, handler) {
    const wrapper = (payload) => {
      handler(payload);
      this.off(event, wrapper);
    };
    this.on(event, wrapper);
    console.log(`🎯 EventBus.once('${event}') → 註冊一次性 handler`);
  }
}