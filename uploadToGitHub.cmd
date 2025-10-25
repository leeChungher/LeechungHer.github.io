@echo off
cd /d C:\Users\ACER\Documents\GitHub\LeechungHer.github.io

:: 取得當前時間並格式化為 yyyy-MM-dd_HH:mm:ss
for /f %%i in ('powershell -command "Get-Date -Format \"yyyy-MM-dd_HH:mm:ss\""') do set msg=%%i

:: 顯示目前目錄
echo 正在切換到 GitHub 專案目錄...

:: 將所有變更加入暫存區
git add .

:: 使用時間作為提交訊息
git commit -m "%msg%"

:: 推送到遠端儲存庫
git push origin main

echo 上傳完成！提交訊息為：%msg%
pause