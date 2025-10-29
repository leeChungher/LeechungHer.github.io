import { SidebarController } from './controllers/sidebar.js';
import { AppController } from './controllers/app.js';

document.addEventListener('DOMContentLoaded', async () => {
  const app = new AppController();
  await app.init();
  await SidebarController.init(app); // ✅ 傳入 app 實例
});