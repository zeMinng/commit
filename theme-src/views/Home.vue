<template>
  <main class="home">
    <div class="home__bg" aria-hidden="true" />
    <section class="hero">
      <div class="hero__avatar">
        <span class="hero__avatar-ring" />
        <img :src="avatarWithBase" alt="avatar" />
      </div>
      <h1 class="hero__name">{{ heroName }}</h1>
      <p class="hero__tagline">{{ tagline }}</p>
      <p class="hero__desc">{{ description }}</p>
      <nav class="hero__nav">
        <a class="hero__link hero__link--main" href="/posts/">文章</a>
        <a class="hero__link" href="/about/">关于</a>
      </nav>
      <div class="hero__socials" v-if="socials.length">
        <a
          v-for="item in socials"
          :key="item.label"
          class="hero__social"
          :href="item.url"
          target="_blank"
          rel="noreferrer"
        >
          {{ item.label }}
        </a>
      </div>
    </section>
  </main>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { VitePressConfig } from '~/vitepress.config'

const {
  author,
  ogImage,
  themeConfig: { home },
} = VitePressConfig

const heroName = home?.heroName || author
const tagline = home?.tagline || '好奇心驱动的开发者'
const description =
  home?.description ||
  '记录关于前端开发、VitePress 主题设计与日常思考的文字。'

const avatarWithBase = computed(() => withBase(home?.avatar || `/${ogImage}`))
const socials = home?.socials || []
</script>

<style lang="scss" scoped>
$space-sm: 0.5rem;
$space-md: 1rem;
$space-lg: 2rem;
$space-xl: 2.5rem;
$space-2xl: 4rem;

.home {
  position: relative;
  padding: $space-2xl $space-lg $space-2xl;
  max-width: 44rem;
  margin: 0 auto;
  min-height: 100%;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.home__bg {
  position: absolute;
  inset: -20%;
  background: radial-gradient(
    ellipse 80% 50% at 50% -20%,
    rgba(var(--vp-c-brand-rgb, 56 189 248), 0.08),
    transparent
  );
  pointer-events: none;
}

.hero {
  position: relative;
  width: 100%;
  text-align: center;
}

.hero__avatar {
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin-bottom: $space-lg;
}

.hero__avatar-ring {
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    rgba(var(--vp-c-brand-rgb, 56 189 248), 0.4),
    rgba(var(--vp-c-brand-rgb, 56 189 248), 0.05)
  );
  opacity: 0.6;
  animation: pulse 4s ease-in-out infinite;
}

.hero__avatar img {
  position: relative;
  display: block;
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  object-fit: cover;
  object-position: center;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
}

.dark .hero__avatar img {
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
}

@keyframes pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 0.7; }
}

.hero__name {
  font-size: 1.75rem;
  font-weight: 600;
  line-height: 1.25;
  letter-spacing: -0.04em;
  margin: 0 0 $space-md;
  color: var(--vp-c-text-1);
}

.hero__tagline {
  font-size: 1.0625rem;
  font-weight: 500;
  line-height: 1.4;
  letter-spacing: 0.02em;
  margin: 0 0 $space-lg;
  color: var(--vp-c-text-1);
}

.hero__desc {
  font-size: 0.9375rem;
  line-height: 1.75;
  letter-spacing: 0.01em;
  color: var(--vp-c-text-2);
  margin: 0 auto $space-xl;
  max-width: 28rem;
}

.hero__nav {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: $space-md;
  margin-bottom: $space-xl;
}

.hero__link {
  font-size: 0.9375rem;
  font-weight: 500;
  line-height: 1.4;
  color: var(--vp-c-text-2);
  text-decoration: none;
  padding: 0.5rem 1.25rem;
  border-radius: 8px;
  border: 1px solid transparent;
  transition: color 0.2s ease, background 0.2s ease, border-color 0.2s ease;

  &:hover {
    color: var(--vp-c-text-1);
    background: var(--vp-c-bg-soft, rgba(128, 128, 128, 0.06));
    border-color: var(--vp-c-divider, rgba(128, 128, 128, 0.12));
  }

  &--main {
    color: #fff;
    background: var(--vp-c-brand-1);

    &:hover {
      color: #fff;
      background: var(--vp-c-brand-2);
      border-color: transparent;
    }
  }
}

.hero__socials {
  display: flex;
  flex-wrap: wrap;
  gap: $space-lg;
  justify-content: center;
}

.hero__social {
  font-size: 0.8125rem;
  color: var(--vp-c-text-3);
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: var(--vp-c-text-2);
  }
}
</style>
