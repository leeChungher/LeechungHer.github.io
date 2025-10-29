import { EventBus } from './utils/eventBus.js';
import { AppController } from './controllers/appController.js';
import { SidebarController } from './controllers/sidebar.js';

console.log('🚀 系統啟動：辛區資訊系統');

document.addEventListener('DOMContentLoaded', async () => {
  console.log('📦 DOM 已載入，開始初始化模組');

  // 初始化主控制器
  const app = new AppController();
  await app.init();

  // 初始化側欄控制器
  const sidebar = new SidebarController();
  sidebar.init();

  // 偵測選單點擊
  EventBus.on('menu:click', ({ id }) => {
    console.log('🖱️ 點擊選單項目：', id);
    EventBus.emit('page:change', { name: id });
  });

  // 頁面切換時更新選單高亮
  EventBus.on('page:change', ({ name }) => {
    console.log('🔄 更新選單高亮：', name);
    sidebar.highlight(name);
  });
});