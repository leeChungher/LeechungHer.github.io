/**
 * 檔案：app.js
 * 功能：主程式，建立 main 容器、載入全域樣式與模組
 * 作者：李
 * 日期：2025-10-28
 */
import { createLayout } from './layout.js';
import { ModuleLoader } from './loadModules.js';

console.log('[App] 載入 style.css');
const globalStyle = document.createElement('link');
globalStyle.rel = 'stylesheet';
globalStyle.href = './style.css';
document.head.appendChild(globalStyle);

console.log('[App] 建立頁面結構');
createLayout();

// ToolBar 插入 header（只載入一次）
console.log('[App] 載入 toolbar 到 header');
const headerLoader = new ModuleLoader('#header');
headerLoader.load('./modules/toolbar.json');

// 初始化 main 模組載入器
console.log('[App] 初始化 main 模組載入器');
const mainLoader = new ModuleLoader('#main');
mainLoader.loadToMain('./modules/home.json');

// 綁定 ToolBar 按鈕事件
document.addEventListener('click', (e) => {
  if (e.target.id === 'homeBtn') {
    console.log('[ToolBar] 點擊首頁');
    mainLoader.loadToMain('./modules/home.json');
  }
  if (e.target.id === 'aboutBtn') {
    console.log('[ToolBar] 點擊關於');
    mainLoader.loadToMain('./modules/about.json');
  }
  if (e.target.id === 'copilotBtn') {
    console.log('[ToolBar] 點擊 Copilot 聊天');
    mainLoader.loadToMain('./modules/copilot.json');
  }
});