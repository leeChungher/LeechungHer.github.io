/**
 * 路徑: ./app.js
 * 檔名: app.js
 * 功能: 載入模組樣板、樣式、啟動 eventBus
 * 修改日期: 20250922
 */
import { EventBus } from './eventBus.js';
window.eventBus = new EventBus();

const modules = ['home', 'dialog', 'spec', 'devlog', 'fileBrowser', 'docViewer'];

modules.forEach(name => {
  const path = `./modules/${name}/`;
  Promise.all([
    fetch(`${path}config.json`).then(res => res.json()),
    import(`${path}index.js`)
  ]).then(([config]) => {
    fetch(`${path}${name}.html`).then(res => res.text()).then(html => {
      const container = document.createElement('div');
      container.innerHTML = html;
      document.body.appendChild(container);
    });

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `${path}${name}.css`;
    document.head.appendChild(link);
  });
});
