# 校园社团活动中心 —— 自主实践（期末大作业原型）

课堂作业八 · 自主实践基本要求：个人技术整合练习，作为期末大作业的原型。

选题：校园社团活动报名登记（真实场景归一：活动登记）。

## 简介

整合了页面、样式、交互、数据、可视化五个模块的校园社团活动中心：浏览活动、按类别/关键词筛选、报名登记（localStorage 持久化）、查看活动统计图表、三维校园导览。

## 运行方法

需要本地 HTTP 服务器（fetch 加载本地 JSON 及 localStorage 需在 http 环境下运行，直接双击打开会被浏览器禁掉本地资源读取）。

```bash
# 方式 A：Python
python -m http.server 8080
# 打开 http://127.0.0.1:8080/activity-center/

# 方式 B：Node
npx serve .
```

## 目录结构

```
activity-center/
├── index.html            统一入口（首页/活动列表/我的报名/统计/三维导览）
├── css/style.css         自定义样式（在 Bootstrap 之后引入）
├── js/app.js             自己的交互逻辑（筛选、报名、图表）
├── data/activities.json  活动数据
├── libs/                 本地依赖库（Bootstrap/jQuery/ECharts）
└── three-d/scene.html    A-Frame 校园三维导览（独立子页面）
```

## 功能模块

| 模块 | 技术要点 | 对应课堂 |
|------|----------|----------|
| 页面结构 | 语义化 + Bootstrap 导航，统一入口 | 课堂一、二 |
| 样式与响应式 | 自定义 CSS、三档适配 | 课堂二、三 |
| 交互 | 原生 JS 事件委托（筛选即时刷新、报名/取消） | 课堂四、五 |
| 数据 | fetch 加载 JSON + localStorage 本地保存 | 课堂五、六 |
| 可视化 | ECharts（柱状图 + 折线图双轴） | 课堂六 |
| 三维 | A-Frame 校园导览（进阶模块） | 课堂七 |

## 各模块间衔接

活动数据（data/activities.json）贯穿全部模块：筛选影响活动卡片 → 报名写入 localStorage → 统计图表基于同一份活动数据绘制，实现“数据共享、主题统一”，不是孤立页面拼盘。

## 资源和数据来源

- 依赖库：Bootstrap 5、jQuery 3.7.1、Apache ECharts，均固定版本，本地存放在 libs/。
- 活动数据：`data/activities.json`，为演示用示例数据（场景取材于校园公开社团活动信息）。
- A-Frame：aframe.io 官方 1.4.2（CDN）。