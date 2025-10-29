import { EventBus } from '../utils/eventBus.js';

export class SidebarController {
  static sidebar = null;
  static overlay = null;
  static isOpen = false;
  static currentPage = '';
  static touchStartX = 0;
  static touchEndX = 0;
  static mouseDownX = 0;
  static mouseUpX = 0;
  static isMouseDown = false;

  static async init() {
    console.log('🟢 SidebarController 初始化');
    this.loadCSS();
    await this.createSidebar();
    this.bindEvents();
  }

  static loadCSS() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = './controllers/sidebar.css';
    document.head.appendChild(link);
    console.log('🎨 已載入 sidebar.css');
  }

  static async createSidebar() {
    try {
      const res = await fetch('./config/items.json');
      const data = await res.json();
      const items = data.items || data;

      this.sidebar = document.createElement('div');
      this.sidebar.id = 'sidebar';

      const nav = document.createElement('nav');
      const ul = document.createElement('ul');

      items.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `<a href="javascript:void(0)" data-page="${item.page}">${item.label}</a>`;
        ul.appendChild(li);
      });

      nav.appendChild(ul);
      this.sidebar.appendChild(nav);
      document.body.appendChild(this.sidebar);

      this.overlay = document.createElement('div');
      this.overlay.id = 'overlay';
      document.body.appendChild(this.overlay);

      console.log('✅ 側欄選單建立完成');
    } catch (err) {
      console.error('❌ 載入側欄選單失敗：', err);
    }
  }

  static bindEvents() {
    this.overlay.addEventListener('click', () => this.close());

    document.addEventListener('mousedown', (e) => {
      this.isMouseDown = true;
      this.mouseDownX = e.clientX;
    });

    document.addEventListener('mouseup', (e) => {
      if (!this.isMouseDown) return;
      this.isMouseDown = false;
      this.mouseUpX = e.clientX;
      const dragDistance = this.mouseUpX - this.mouseDownX;
      if (!this.isOpen && dragDistance > 60) this.open();
      if (this.isOpen && dragDistance < -60) this.close();
    });

    document.addEventListener('touchstart', (e) => {
      this.touchStartX = e.changedTouches[0].clientX;
    });

    document.addEventListener('touchend', (e) => {
      this.touchEndX = e.changedTouches[0].clientX;
      const swipeDistance = this.touchEndX - this.touchStartX;
      if (!this.isOpen && swipeDistance > 60) this.open();
      if (this.isOpen && swipeDistance < -60) this.close();
    });

    document.addEventListener('click', (e) => {
      const target = e.target.closest('[data-page]');
      if (target) {
        e.preventDefault();
        const page = target.getAttribute('data-page');
        console.log('🖱️ 點擊選單項目：', page);
        this.setActive(page);
        EventBus.emit('page:change', { name: page });
        console.log('📤 發送 page:change 事件：', page);
        this.close();
      }
    });
  }

  static setActive(pageName) {
    this.currentPage = pageName;
    if (!this.sidebar) return;
    const links = this.sidebar.querySelectorAll('a[data-page]');
    links.forEach(link => {
      link.classList.toggle('active', link.getAttribute('data-page') === pageName);
    });
    console.log('🔄 更新選單高亮：', pageName);
  }

  static open() {
    this.sidebar.classList.add('active');
    this.overlay.classList.add('active');
    this.isOpen = true;
    console.log('📂 側欄已開啟');
  }

  static close() {
    this.sidebar.classList.remove('active');
    this.overlay.classList.remove('active');
    this.isOpen = false;
    console.log('📁 側欄已關閉');
  }
}