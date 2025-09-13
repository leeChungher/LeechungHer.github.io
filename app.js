/*
路徑 : /
檔名 : app.js
功能 : 主控制器，動態載入 CSS、mockApi、header、footer、模組內容，保持頁面乾淨與模組穩定性
最後修改時間 : 2025-08-30 09:40
*/

function loadStyle(href) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}

function loadScript(src, callback) {
  const script = document.createElement("script");
  script.src = src;
  script.onload = () => {
    if (typeof callback === "function") callback();
  };
  document.body.appendChild(script);
}

function loadStaticLayout() {
  const root = document.getElementById("root");
  if (!root) {
    console.error("root 容器不存在");
    return;
  }

  // 建立 header、main、footer 容器
  root.innerHTML = `
    <header id="siteHeader"></header>
    <main id="app"></main>
    <div id="footerContainer"></div>
  `;

  // 載入 header.html
  fetch("modules/header.html")
    .then(res => res.text())
    .then(html => {
      document.getElementById("siteHeader").innerHTML = html;
    });

  // 載入 footer.html
  fetch("modules/footer.html")
    .then(res => res.text())
    .then(html => {
      document.getElementById("footerContainer").innerHTML = html;
    });
}

function loadModule(name) {
  fetch(`modules/${name}.html`)
    .then(res => res.text())
    .then(html => {
      const container = document.getElementById("app");
      if (!container) {
        console.error("app 容器不存在");
        return;
      }

      container.innerHTML = html;

      // 根據模組載入對應腳本
      if (name === "content") {
        loadScript("scripts/module.js");
      }

      if (name === "login") {
        loadScript("scripts/login.js");
      }
    });
}

// 初始化：等 DOM 完成後再載入資源與模組
document.addEventListener("DOMContentLoaded", () => {
  loadStyle("style.css");
  loadStyle("extra.css");

  loadScript("scripts/mockApi.js", () => {
    loadStaticLayout();
    loadModule("login");
  });
});