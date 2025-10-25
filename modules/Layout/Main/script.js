import ControlCenter from '../../../Core/ControlCenter.js';
import Base from '../../../Utils/Base.js';

class Main {
    constructor() {
        this.contentWrapper = document.querySelector('.content-wrapper');
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // 監聽導航事件
        ControlCenter.on('navigation:change', (data) => {
            this.loadContent(data.path);
        });
    }

    loadContent(path) {
        // 清空現有內容
        this.contentWrapper.innerHTML = '';
        
        // 建立內容框架
        const contentFrame = document.createElement('iframe');
        contentFrame.style.width = '100%';
        contentFrame.style.height = '100%';
        contentFrame.style.border = 'none';
        contentFrame.src = path;

        this.contentWrapper.appendChild(contentFrame);
        
        Base.log(`載入內容: ${path}`, 'info');
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    new Main();
});