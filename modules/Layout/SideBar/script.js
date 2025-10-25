import ControlCenter from '../../../Core/ControlCenter.js';
import Base from '../../../Utils/Base.js';

class SideBar {
    constructor() {
        this.sidebar = document.querySelector('.sidebar');
        this.toggleBtn = document.getElementById('toggleBtn');
        this.menuItems = document.querySelectorAll('.menu li');
        this.logoutBtn = document.getElementById('logoutBtn');
        
        this.isExpanded = true;
        this.currentPath = null;
        
        this.initializeEventListeners();
        this.updateActiveMenuItem();
    }

    initializeEventListeners() {
        // 切換按鈕事件
        this.toggleBtn.addEventListener('click', () => this.toggleSidebar());

        // 選單項目點擊事件
        this.menuItems.forEach(item => {
            item.addEventListener('click', () => {
                const path = item.dataset.path;
                this.handleNavigation(path);
            });
        });

        // 登出按鈕事件
        this.logoutBtn.addEventListener('click', () => this.handleLogout());

        // 監聽視窗大小變化
        window.addEventListener('resize', () => this.handleResize());
    }

    toggleSidebar() {
        this.isExpanded = !this.isExpanded;
        this.sidebar.classList.toggle('expanded', this.isExpanded);
        
        // 發送事件到控制中心
        ControlCenter.emit('sidebar:toggle', {
            expanded: this.isExpanded
        });
    }

    handleNavigation(path) {
        if (this.currentPath === path) return;
        
        this.currentPath = path;
        this.updateActiveMenuItem();
        
        // 發送導航事件
        ControlCenter.emit('navigation:change', { path });
        Base.log(`導航到: ${path}`, 'info');
    }

    updateActiveMenuItem() {
        this.menuItems.forEach(item => {
            const isActive = item.dataset.path === this.currentPath;
            item.classList.toggle('active', isActive);
        });
    }

    handleLogout() {
        // 清除登入狀態
        sessionStorage.clear();
        
        // 發送登出事件
        ControlCenter.emit('auth:logout', {
            timestamp: new Date()
        });

        // 重定向到登入頁
        window.parent.location.href = '../../Auth/index.html';
    }

    handleResize() {
        // 在小螢幕下自動收合側邊欄
        if (window.innerWidth <= 768 && this.isExpanded) {
            this.toggleSidebar();
        }
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    new SideBar();
});