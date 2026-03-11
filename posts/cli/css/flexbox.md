---
title: "Flex 与 Grid 布局"
date: "2026-03-11"
description: "Flexbox 与 Grid 布局详解，含常用示例与对比"
tags:
  - 工程化
---

# Flex 与 Grid 布局详解

## 概要
[Flexbox](https://developer.mozilla.org/zh-CN/docs/Web/CSS/flex) 和 [Grid](https://developer.mozilla.org/zh-CN/docs/Web/CSS/grid) 是前端最常用的两大布局方案。Flexbox擅长**一维布局**（行或列）；Grid擅长**二维布局**（行 + 列）。它们并不是互斥的，很多时候需要结合使用。

## 一、Flex 布局
通过深入学习，我发现 `flex-basis` 是一个非常实用的属性。

### 1. 容器属性
| 属性 | 作用 | 示例 |
| --- | --- | --- |
| **`display`** | 定义弹性容器 | `display: flex;` |
| **`flex-direction`** | 主轴方向 | `row` / `column` |
| **`flex-wrap`** | 是否换行 | `nowrap` / `wrap` |
| **`justify-content`** | 主轴对齐 | `flex-start` / `center` / `space-between` |
| **`align-items`** | 交叉轴对齐 | `stretch` / `center` / `flex-end` |
| **`gap`** | 子项间距 | `gap: 10px;` |

### 2. 子项属性
| 属性 | 作用 | 示例 |
| --- | --- | --- |
| **`flex-grow`** | 占据剩余空间 | `flex-grow: 1;` |
| **`flex-shrink`** | 空间不足时收缩 | `flex-shrink: 0;` |
| **`flex-basis`** | 初始大小 | `flex-basis: 200px;` |
| **`flex`** | 复合属性 | `flex: 1 0 auto;` |
| **`align-self`** | 覆盖单个子项的对齐方式 | `align-self: center;` |

### 3. Flex 示例
![](/img/css_flex.jpg){width=200}

<div style="display: flex;align-items: center;color: #fff;">
  <div style="flex:1;background: #01cfab;padding: 8px;">左侧</div>
  <div style="flex:2;background: #81eccf;padding: 8px;">右侧</div>
</div>

::: code-group
``` scss [二宫格布局]
.gridWrap {
  display: flex;
  flex-wrap: wrap;

  .gridItem {
    flex: 1;
    flex-basis: 50%;
    box-sizing: border-box;

    &:nth-child(2n) {
      padding-left: 24rpx; // 希望两个之间有间隙的做法
    }
  }
}
```
``` scss [三宫格布局-中间居中]
.wrap {
  display: flex;
  flex-wrap: wrap;

  .item {
    width: 32%;
    height: 100px;
    margin-bottom: 10px;
    background-color: #ccc;

    &:nth-child(3n + 2) {
      margin-right: 2%;
      margin-left: 2%;
    }

    &:nth-child(3n + 1) {
      margin-left: 0;
    }

    &:nth-child(3n + 3) {
      margin-right: 0;
    }
  }
}
```
``` scss [四宫格布局-中间居中]
// 使用flex、gap属性来设置间隙
.imgWrap {
  width: 100%;
  max-height: 400px;
  display: flex;
  flex-wrap: wrap;
  padding: 20px 0;
  overflow-y: auto;
  gap: 16px;

  .imgWrap_item {
    width: calc(25% - 12px);
    height: 200px;
  }
}

// 或者使用margin来设置间隙
.imgWrap {
  width: 100%;
  max-height: 400px;
  display: flex;
  flex-wrap: wrap;
  padding: 20px 0;
  overflow-y: auto;
  margin: -8px;

  .imgWrap_item {
    position: relative;
    width: calc(25% - 16px);
    height: 200px;
    margin: 8px;
  }
}
```
``` scss [上述图片效果]
// 实现这个左右效果不需要固定宽
.infoItem {
  display: flex;
  align-items: center;

  .infoKey {
    flex: 1;
  }

  .infoValue {
    flex: 2;
  }
}
```
:::

## 二、Grid 布局
Grid 是一种二维布局系统，可以同时在 **行（rows）** 和 **列（columns）** 方向上精确控制元素的位置。与 **Flexbox** 专注于一维布局不同，Grid 更适合 **整体页面结构** 和 **复杂组件布局**。

### 1. 容器属性
| 属性 | 作用 | 示例 |
| --- | --- | --- |
| **`display: grid`** | 定义为网格容器 | `display: grid;` |
| **`grid-template-columns`** | 定义列数和列宽 | `grid-template-columns: 200px 1fr 2fr;` |
| **`grid-template-rows`** | 定义行数和行高 | `grid-template-rows: 100px auto;` |
| **`gap` / `row-gap` / `column-gap`** | 设置网格间距 | `gap: 10px;` |
| **`justify-items`** | 列方向对齐方式 | `start` / `center` / `end` / `stretch` |
| **`align-items`** | 行方向对齐方式 | `start` / `center` / `end` / `stretch` |
| **`justify-content`** | 整个网格的水平对齐 | `start` / `center` / `space-between` |
| **`align-content`** | 整个网格的垂直对齐 | `start` / `center` / `space-between` |

### 2. 子项属性
| 属性 | 作用 | 示例 |
| --- | --- | --- |
| **`grid-column`** | 设置列的起止位置 | `grid-column: 1 / 3;` |
| **`grid-row`** | 设置行的起止位置 | `grid-row: 2 / 4;` |
| **`justify-self`** | 单个项目的水平对齐 | `center` |
| **`align-self`** | 单个项目的垂直对齐 | `end` |

### 3. 常见布局速查表
| 布局场景 | 代码示例 | 说明 |
| --- | --- | --- |
| **等宽多列布局** | `grid-template-columns: repeat(3, 1fr);` | 三列等分，可改 `3` 为任意列数 |
| **固定宽度 + 自适应列** | `grid-template-columns: 200px 1fr;` | 第一列固定宽度，第二列占剩余空间 |
| **自适应列数（响应式）** | `grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));` | 列宽最小 200px，多余空间自动增加列 |
| **自动填充列（不折叠空列）** | `grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));` | 与 `auto-fit` 类似，但会保留空列 |
| **两列固定 + 中间自适应** | `grid-template-columns: 150px 1fr 150px;` | 左右侧边栏固定，中间内容自适应 |
| **网格间距** | `gap: 10px;` | 同时设置行间距和列间距 |
| **单个元素跨列** | `grid-column: 1 / 3;` | 从第 1 列跨到第 3 列（不含 3） |
| **单个元素跨行** | `grid-row: 1 / 3;` | 从第 1 行跨到第 3 行（不含 3） |
| **垂直 & 水平居中** | `place-items: center;` | 相当于 `align-items` + `justify-items` |
| **命名区域布局** | `grid-template-areas: "header header" "sidebar main" "footer footer";` | 通过区域名控制布局 |

💡 **速记技巧：**
- **`fr`** 表示比例分配，`1fr` = 占剩余空间的 1 份  
- **`repeat(n, …)`** 批量定义重复模式  
- **`minmax(min, max)`** 让列/行在指定范围内伸缩  
- **`auto-fit`** 自动收缩填满空间，**`auto-fill`** 会保留空格子

### 4. Grid 示例
::: code-group
``` scss [等宽三列]
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}
```
```scss [响应式宫格]
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
}
```
``` html [命名区域布局]
<!-- 实现一个 三栏响应式布局，带顶部导航和底部区域。 -->
<style>
.container {
  display: grid;
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: 60px auto 60px;
  grid-template-areas:
    "header header header"
    "sidebar main ads"
    "footer footer footer";
  gap: 10px;
}
.header { grid-area: header; background: #333; color: white; }
.sidebar { grid-area: sidebar; background: #ccc; }
.main { grid-area: main; background: #eee; }
.ads { grid-area: ads; background: #ddd; }
.footer { grid-area: footer; background: #999; color: white; }
</style>

<div class="container">
  <div class="header">Header</div>
  <div class="sidebar">Sidebar</div>
  <div class="main">Main</div>
  <div class="ads">Ads</div>
  <div class="footer">Footer</div>
</div>
```
:::

## 三、Flex vs Grid 对比
| 特性   | Flexbox                           | Grid                            |
| ---- | --------------------------------- | ------------------------------- |
| 布局维度 | 一维（行或列）                           | 二维（行+列）                         |
| 对齐方式 | `justify-content` + `align-items` | `justify-items` + `align-items` |
| 适合场景 | 导航栏、按钮组、居中布局                      | 页面整体布局、宫格、仪表盘                   |
| 灵活性  | 内容驱动                              | 容器驱动                            |
| 学习成本 | 简单                                | 稍复杂                             |

## 四、常用css
::: code-group
``` css [各种机型底部的安全区域]
.item {
  padding-bottom: calc(env(safe-area-inset-bottom) + 20rpx);
}
```
``` scss [常用的css]
.item {
  word-break: break-all; // 纯数字换行
  shape-outside: circle(50% at 50% 50%); // 不规则的文字环绕
  white-space: pre; // 文字两端对齐
}

// 滑动吸附效果--常见于swiper
.wrap {
  scroll-snap-type: x mandatory; // 可更换为proximity 表示为附近吸附

  .item {
    scroll-snap-align: start; // 排列
    scroll-snap-stop: always; // 吸附是否停止
  }
}

// 设置宽高比例
.box {
  width: 90%;
  aspect-ratio: 16/9;
}

// 逻辑属性
.box {
  margin-block: 5px 10px; /* 上边距 5px，下边距 10px */
  margin-inline: 20px 30px; /* 左边距 20px，右边距 30px */

  padding-block: 10px 20px; /* 上下内边距 */
  padding-inline: 15px 25px; /* 左右内边距 */
}

// 平滑滚动
html {
  scroll-behavior: smooth;
}
```
:::

## 五、css好网站

这里是一些优秀的网站资源，可以用于 CSS 相关的开发和设计：

- [毛玻璃](http://tool.mkblog.cn/glassmorphism/) - 一个生成毛玻璃效果的在线工具。
- [毛玻璃](https://glassgenerator.netlify.app/) - 另一个生成毛玻璃效果的在线工具。
- [拟态风风格 CSS 代码](http://tool.mkblog.cn/neumorphism/#e0e0e0) - 提供拟态风格（Neumorphism）的 CSS 代码生成器。
- [不规则图形css](https://csstrick.alipay.com/) - 一个可以生成不规则图形的在线工具。
- [clip-path 在线网站](http://tools.jb51.net/code/css3path) - 用于生成 CSS clip-path 属性的在线工具。
- [雪碧图在线生成](https://www.toptal.com/developers/css/sprite-generator) - 用于生成雪碧图（Sprite）的在线工具。
- [按钮制作](https://cssbuttongenerator.com/) - 一个用于生成自定义按钮样式的在线工具。

以下是一些可以在线绘制 SVG 波浪效果的网站：

- [https://getwaves.io/](https://getwaves.io/)
- [https://fffuel.co/sssurf/](https://fffuel.co/sssurf/)
- [https://svgwave.in/](https://svgwave.in/)

此外，以下是一些与 echarts 相关的网站资源：

- [PPChart](http://www.ppchart.com/#/) - 提供多种样式的图表模板和代码示例。
- [madeapie](https://madeapie.com/#/) - 一个在线生成 echarts 图表的工具。
- [echarts Demo 集](https://www.isqqw.com/) - 包含了丰富的 echarts 示例和演示。
- [MCChart](http://echarts.zhangmuchen.top/#/index) - 提供多种样式的 echarts 图表模板。
- [echart 社区](https://www.makeapie.cn/echarts) - 一个 echarts 资源分享和交流的社区。
