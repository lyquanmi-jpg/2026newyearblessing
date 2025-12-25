# 互动叙事游戏

一个纯静态的互动叙事游戏，无需任何框架或打包工具，可直接在浏览器中运行。

## 功能特性

- **HubView**: 自动读取角色数据生成角色列表入口
- **SceneView**: 显示故事文本与选项，支持分支剧情
- **CardView**: 章节结尾卡片页，可收集角色卡片
- **存档系统**: 使用localStorage保存游戏进度和收集的卡片
- **数据驱动**: 通过JSON文件配置角色和故事，易于扩展
- **内容验证**: 启动时自动验证数据完整性，显示清晰错误信息

## 项目结构

```
├── index.html              # 游戏入口文件
├── css/                    # 样式文件
│   ├── tokens.css          # 设计令牌
│   ├── base.css           # 基础样式
│   ├── theme-paper.css    # 纸质主题
│   └── theme-cartoon.css  # 卡通主题
├── js/                     # JavaScript文件
│   ├── engine/            # 游戏引擎
│   │   ├── storage.js     # 存储引擎
│   │   ├── validator.js   # 内容验证器
│   │   └── game-engine.js # 游戏核心引擎
│   ├── ui/                # 用户界面
│   │   ├── hub-view.js    # 角色选择界面
│   │   ├── scene-view.js  # 场景显示界面
│   │   └── card-view.js   # 卡片收集界面
│   ├── content/           # 内容加载
│   │   └── content-loader.js
│   └── main.js            # 主应用控制器
├── content/               # 游戏内容数据
│   ├── characters.json    # 角色定义
│   └── stories/          # 故事数据
│       ├── alice/        # 爱丽丝的故事
│       ├── wizard/       # 智者梅林的故事
│       └── knight/       # 骑士亚瑟的故事
└── assets/               # 资源文件
    └── images/
        └── characters/   # 角色头像
```

## 如何运行

### 方法1: 使用提供的启动脚本 (最简单)

**Windows用户:**
```bash
# 双击运行
start-server.bat

# 或在命令行中运行
start-server.bat
```

**Mac/Linux用户:**
```bash
# 运行Python脚本
python3 start-server.py

# 或者给脚本执行权限后直接运行
chmod +x start-server.py
./start-server.py
```

### 方法2: 使用Live Server (VS Code用户推荐)

1. 安装VS Code的Live Server扩展
2. 在VS Code中打开项目文件夹
3. 右键点击`index.html`，选择"Open with Live Server"
4. 浏览器会自动打开游戏

### 方法3: 使用Python内置服务器

```bash
# Python 3
python -m http.server 8000

# Python 2 (不推荐)
python -m SimpleHTTPServer 8000
```

然后在浏览器中访问 `http://localhost:8000`

### 方法4: 使用Node.js服务器

```bash
# 安装http-server
npm install -g http-server

# 启动服务器
http-server

# 或指定端口
http-server -p 8080
```

### ⚠️ 重要提示

由于浏览器的安全限制，**不能直接双击index.html文件打开**，必须通过HTTP服务器运行。推荐使用方法1的启动脚本，它会自动处理所有设置并打开浏览器。

## 游戏玩法

1. **选择角色**: 在主界面选择你想体验的角色故事
2. **做出选择**: 在故事中根据情况做出不同的选择
3. **收集卡片**: 完成故事后可以收集角色卡片
4. **查看收藏**: 点击"查看收集的卡片"按钮查看已收集的卡片

## 添加新角色

要添加新角色，只需：

1. 在`content/characters.json`中添加角色信息
2. 在`content/stories/`下创建对应的文件夹
3. 添加`events.json`文件定义故事事件
4. 可选：添加`meta.json`文件定义故事元数据
5. 在`assets/images/characters/`中添加角色头像

代码会自动读取新角色，无需修改任何JavaScript代码。

## 存档功能

- 游戏进度自动保存到浏览器的localStorage
- 支持版本迁移，确保存档兼容性
- 可以清除存档重新开始游戏
- 收集的卡片会永久保存

## 浏览器兼容性

支持所有现代浏览器，包括：
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 技术特点

- 纯静态HTML/CSS/JavaScript，无需构建工具
- 响应式设计，支持移动设备
- 模块化架构，易于维护和扩展
- 完整的错误处理和用户反馈
- 优雅的加载和过渡动画