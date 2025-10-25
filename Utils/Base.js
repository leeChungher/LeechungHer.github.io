/**
 * 基礎工具類
 * 提供通用功能如日誌記錄、UUID生成等
 */
class Base {
    static log(message, type = 'info') {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] [${type.toUpperCase()}] ${message}`);
    }

    static generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    static formatDate(date) {
        return new Date(date).toLocaleDateString('zh-TW');
    }
}

export default Base;