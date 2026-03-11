<template>
  <DefaultTheme.Layout>
    <!-- 自定义首页：替换默认 Home Hero -->
    <!-- <template #home-hero-before>
      <Home />
    </template> -->

    <template #layout-bottom>
      <ClientOnly>
        <Watermark
          v-if="enable"
          fullscreen
          fixed
          :content="text"
          :zIndex="0"
          :textStyle="{ color, fontSize }"
        />
      </ClientOnly>
    </template>
  </DefaultTheme.Layout>
</template>

<script setup lang="ts">
import { computed, shallowRef, onMounted, onBeforeUnmount } from 'vue'
import DefaultTheme from 'vitepress/theme'
import { VitePressConfig } from '~/vitepress.config'
import Watermark from '../components/Watermark'
// import Home from '../views/Home.vue'

const {
  watermarkConfig: { enable, text, lightColor, darkColor, fontSize },
} = VitePressConfig

const isDark = shallowRef(false)
let observer: MutationObserver | null = null

onMounted(() => {
  const html = document.documentElement
  const update = () => {
    isDark.value = html.classList.contains('dark')
  }
  update()
  observer = new MutationObserver(update)
  observer.observe(html, { attributes: true, attributeFilter: ['class'] })
})

onBeforeUnmount(() => {
  if (observer) {
    observer.disconnect()
    observer = null
  }
})

const color = computed(() => (isDark.value ? darkColor : lightColor))
</script>

<style>
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: -webkit-linear-gradient(120deg, #bd34fe, #41d1ff);
}
</style>

