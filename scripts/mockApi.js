/*
路徑 : scripts/
檔名 : mockApi.js
功能 : 模擬登入 API，從 users.json 驗證帳號密碼
最後修改時間 : 2025-08-30 09:40
*/

console.log("mockApi.js loaded");

window.mockLoginApi = function(username, password) {
  return fetch("users.json")
    .then(res => {
      if (!res.ok) {
        throw new Error("users.json 載入失敗：" + res.status);
      }
      return res.json();
    })
    .then(users => {
      if (!Array.isArray(users)) {
        throw new Error("users.json 格式錯誤，應為陣列");
      }

      const found = users.find(u => u.username === username && u.password === password);
      if (found) {
        return {
          status: 200,
          data: {
            token: "fake-jwt-token",
            user: found.username
          }
        };
      } else {
        return {
          status: 401,
          error: "帳號或密碼錯誤"
        };
      }
    })
    .catch(err => {
      console.error("mockLoginApi 錯誤：", err);
      return {
        status: 500,
        error: "使用者資料載入失敗：" + err.message
      };
    });
};