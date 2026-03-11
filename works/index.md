---
title: 作品
layout: page
works:

  - title: drag-vue-form
    description: Vue 表单可视化编辑器（支持拖拽生成代码）。
    link: https://drag-vue-form.netlify.app/
    image: https://drag-vue-form.netlify.app//logo_w32.svg
    tags:
      - React
      - Vue

  - title: apple-workout-analytics
    description: Apple 健身解析。
    link: https://healthy-analytics.netlify.app/
    image: https://healthy-analytics.netlify.app/assets/logo-1AEPJXuR.png
    tags:
      - React

  - title: health-stream-parser 
    description: Apple 健身解析 - Rust 解析器。
    link: https://github.com/zeMinng/health-stream-parser
    image: https://healthy-analytics.netlify.app/assets/logo-1AEPJXuR.png
    tags:
      - Rust

  - title: create-vite-uniapp
    description: A fast CLI to bootstrap production-ready Uniapp projects.
    link: https://www.npmjs.com/package/create-vite-uniapp
    image: https://cdn.worldvectorlogo.com/logos/npm-2.svg
    tags:
      - Cli
      - Uniapp

  - title: imager
    description: 高性能纯前端图像处理工具箱。支持图片拼接、格式转换与压缩，无需后端，数据不出浏览器。
    link: https://imaager.netlify.app/
    image: /logo.png
    tags:
      - 工具

  - title: vitepress-theme-blog
    description: 一款为 VitePress 设计的极简博客主题，支持文章、标签、归档、资源与作品展示。
    link: https://github.com/zeMinng/vitepress-theme-blog
    image: /logo.png
    tags:
      - VitePress

---

<script setup>
import WorksList from './WorksList/WorksList.vue'
</script>

<WorksList />
