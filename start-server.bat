@echo off
echo 🎮 启动互动叙事游戏服务器...
echo.

REM 检查Python是否安装
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 未找到Python，请先安装Python 3.x
    echo 💡 下载地址: https://www.python.org/downloads/
    pause
    exit /b 1
)

REM 检查是否在正确目录
if not exist "index.html" (
    echo ❌ 请在项目根目录运行此脚本
    pause
    exit /b 1
)

echo ✅ Python已安装
echo 🚀 正在启动服务器...
echo.

REM 启动Python服务器
python start-server.py

pause