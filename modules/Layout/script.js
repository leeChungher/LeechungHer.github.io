import ControlCenter from '../../Core/ControlCenter.js';
import Base from '../../Utils/Base.js';

class Layout {
    constructor() {
        this.sidebarFrame = document.getElementById('sidebarFrame');
        this.mainFrame = document.getElementById('mainFrame');
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // 監聽側邊欄的展開/收合事件
        ControlCenter.on('sidebar:toggle', (data) => {
            this.handleSidebarToggle(data.expanded);
        });

        // 監聽頁面導航事件
        ControlCenter.on('navigation:change', (data) => {
            this.handleNavigation(data.path);
        });
    }

    handleSidebarToggle(expanded) {
        if (expanded) {
            this.sidebarFrame.classList.add('expanded');
        } else {
            this.sidebarFrame.classList.remove('expanded');
        }
    }

    handleNavigation(path) {
        // 在主框架中載入新頁面
        this.mainFrame.src = path;
        Base.log(`導航到: ${path}`, 'info');
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    new Layout();
});