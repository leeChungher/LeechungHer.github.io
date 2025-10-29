/**
 * 檔案：layout.js
 * 功能：建立頁面結構（header + main）
 * 作者：李
 * 日期：2025-10-28
 */

export function createLayout() {
  console.log('[Layout] 建立 header 和 main 區域');

  // 建立 header
  const header = document.createElement('header');
  header.id = 'header';
  document.body.prepend(header);

  // 建立 main
  const main = document.createElement('main');
  main.id = 'main';
  document.body.appendChild(main);
}