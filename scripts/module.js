/*
路徑 : scripts/
檔名 : module.js
功能 : 主畫面互動邏輯（按鈕切換模組）
最後修改時間: 2025-08-30 08:16:00
*/

document.getElementById("aboutBtn").addEventListener("click", () => {
  fetch("modules/about.html")
    .then(res => res.text())
    .then(html => {
      document.getElementById("app").innerHTML = html;
    });
});

document.getElementById("contactBtn").addEventListener("click", () => {
  fetch("modules/contact.html")
    .then(res => res.text())
    .then(html => {
      document.getElementById("app").innerHTML = html;
    });
});