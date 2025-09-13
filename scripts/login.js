/*
路徑 : scripts/
檔名 : login.js
功能 : 綁定登入事件，處理使用者驗證與錯誤顯示
最後修改時間 : 2025-08-30 09:10
*/

console.log("login.js loaded");

function bindLoginEvent() {
  console.log("bindLoginEvent called");
  const btn = document.getElementById("loginBtn");
  if (!btn) {
    console.warn("loginBtn not found");
    return;
  }

  btn.onclick = function () {
    console.log("Login button clicked");
    const uname = document.getElementById("username").value.trim();
    const pwd = document.getElementById("password").value;
    const errorDiv = document.getElementById("loginError");
    errorDiv.style.display = "none";

    if (typeof mockLoginApi !== "function") {
      console.error("mockLoginApi not loaded");
      errorDiv.textContent = "登入模組載入失敗，請檢查 mockApi.js 路徑";
      errorDiv.style.display = "block";
      return;
    }

    btn.disabled = true;
    btn.textContent = "登入中...";

    mockLoginApi(uname, pwd).then(res => {
      console.log("mockLoginApi result:", res);
      if (res.status === 200) {
        if (typeof window.loadModule === "function") {
          window.loadModule("content");
        } else {
          alert("登入成功！(window.loadModule 未定義)");
        }
      } else {
        errorDiv.textContent = res.error;
        errorDiv.style.display = "block";
      }
    }).catch(err => {
      console.error("mockLoginApi error:", err);
      errorDiv.textContent = "登入服務錯誤：" + err;
      errorDiv.style.display = "block";
    }).finally(() => {
      btn.disabled = false;
      btn.textContent = "登入";
    });
  };
}

bindLoginEvent();