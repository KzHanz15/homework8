# 校园信息中心（迷你版）—— 案例复现

课堂作业八 · 案例复现：迷你版校园信息中心。

## 简介

集成页面、样式、交互、数据与可视化、三维五个模块的校园公共信息展示原型，作为期末大作业的组装示范。

## 运行方法

需要本地 HTTP 服务器运行（不能直接双击 index.html，否则 fetch 加载本地 JSON 会被浏览器拦截）。

任选其一：

```bash
# 方式 A：Python
python -m http.server 8080
# 打开 http://127.0.0.1:8080/integration/

# 方式 B：Node
npx serve .
```

## 目录结构

```
integration/
├── index.html            统一入口（首页/自习室/统计/三维导航）
├── css/style.css         自定义样式（在 Bootstrap 之后引入）
├── js/app.js             自己的交互逻辑（筛选、渲染、图表）
├── data/data.json        自习室使用数据
├── libs/                 本地依赖库（Bootstrap/jQuery/ECharts）
└── three-d/scene.html    A-Frame 校园三维导览（独立子页面）
```

## 功能模块

| 模块 | 技术 | 说明 |
|------|------|------|
| 页面结构 | HTML5 语义化 + Bootstrap 导航 | 四入口统一导航，当前项高亮 |
| 样式与响应式 | 自定义 CSS + Bootstrap 栅格 | 375/768/1200 三档适配，无横向滚动 |
| 交互 | 原生 JS 事件委托 | 按楼层/开放状态筛选自习室 |
| 数据 | fetch 加载 data.json | 断网/空数据/格式错均有提示 |
| 可视化 | ECharts | 各自习室使用量柱状图 |
| 三维 | A-Frame | 校园三维导览子页面 |

## 资源和数据来源

- 依赖库：Bootstrap 5（bootcdn）、jQuery 3.7.1（官方）、ECharts（Apache ECharts 官方 CDN），均使用固定版本号。
- 自习室数据：`data/data.json`，为课堂演示用的示例数据（来源于学校图书馆公开统计，已脱敏）。
- A-Frame：aframe.io 官方 1.4.2 版本，通过 CDN 引入。