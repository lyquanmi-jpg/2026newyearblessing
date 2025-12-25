#!/usr/bin/env python3
"""
简单的HTTP服务器启动脚本
用于运行互动叙事游戏
"""

import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 8000

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # 添加CORS头部，避免本地文件访问问题
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

def main():
    # 确保在项目根目录运行
    if not os.path.exists('index.html'):
        print("错误: 请在项目根目录运行此脚本")
        sys.exit(1)
    
    try:
        with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
            print(f"🎮 互动叙事游戏服务器启动成功!")
            print(f"📍 服务器地址: http://localhost:{PORT}")
            print(f"🌐 正在自动打开浏览器...")
            print(f"⏹️  按 Ctrl+C 停止服务器")
            
            # 自动打开浏览器
            webbrowser.open(f'http://localhost:{PORT}')
            
            # 启动服务器
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n🛑 服务器已停止")
    except OSError as e:
        if e.errno == 48:  # Address already in use
            print(f"❌ 端口 {PORT} 已被占用，请尝试其他端口")
            print(f"💡 或者运行: python start-server.py {PORT + 1}")
        else:
            print(f"❌ 启动服务器失败: {e}")

if __name__ == "__main__":
    main()