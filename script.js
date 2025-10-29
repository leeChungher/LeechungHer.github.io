import { SidebarController } from './controllers/sidebar.js';
import { AppController } from './controllers/app.js';

document.addEventListener('DOMContentLoaded', async () => {
  await SidebarController.init();
  const app = new AppController();
  await app.init();
});