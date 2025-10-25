import ControlCenter from '../../Core/ControlCenter.js';
import Base from '../../Utils/Base.js';

class Layout {
    constructor() {
        this.sidebar = document.getElementById('sidebar');
        this.main = document.getElementById('main');
        
        this.initializeLayout();
        this.initializeEventListeners();
    }

    async initializeLayout() {
        // 初始載入側邊欄和主內容
        await this.loadContent('SideBar/index.html', this.sidebar);
        await this.loadContent('Main/index.html', this.main);
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
            this.sidebar.classList.add('expanded');
        } else {
            this.sidebar.classList.remove('expanded');
        }
    }

    async handleNavigation(path) {
        if (!path) return;
        await this.loadContent(path, this.main);
    }

    async loadContent(path, container) {
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
            container.innerHTML = content;

            // 執行載入的腳本
            container.querySelectorAll('script').forEach(script => {
                const newScript = document.createElement('script');
                Array.from(script.attributes).forEach(attr => {
                    newScript.setAttribute(attr.name, attr.value);
                });
                newScript.textContent = script.textContent;
                script.parentNode.replaceChild(newScript, script);
            });

            Base.log(`內容載入成功: ${path}`, 'info');
        } catch (error) {
            console.error('載入失敗:', error);
            Base.log(`內容載入失敗: ${path}`, 'error');
            container.innerHTML = `<div class="error-message">載入失敗</div>`;
        }
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    new Layout();
});
