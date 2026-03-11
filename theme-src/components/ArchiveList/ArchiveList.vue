<script setup>
import { computed } from 'vue'
import { data as allPosts } from '../../composables/usePosts.data'

// 按年月聚合：[[ "2026年3月", [post, ...] ], ...]，时间倒序
const archivesWithPosts = computed(() => {
  const map = {}
  for (const post of allPosts) {
    if (!post.date || !post.date.string) {
      const key = '未归档'
      if (!map[key]) map[key] = []
      map[key].push(post)
      continue
    }
    // post.date.string 形如 "2026/03/06"
    const [y, m] = post.date.string.replace(/\//g, ' ').trim().split(/\s+/)
    const key = y && m ? `${y}年${m}月` : '未归档'
    if (!map[key]) map[key] = []
    map[key].push(post)
  }
  const entries = Object.entries(map)
  // 未归档放最后；其余按时间倒序（年份大、月份大在前）
  entries.sort((a, b) => {
    if (a[0] === '未归档') return 1
    if (b[0] === '未归档') return -1
    const [yA, mA] = a[0].replace('年', ' ').replace('月', '').trim().split(/\s+/)
    const [yB, mB] = b[0].replace('年', ' ').replace('月', '').trim().split(/\s+/)
    if (yA !== yB) return Number(yB) - Number(yA)
    return Number(mB) - Number(mA)
  })
  return entries
})
</script>

<template>
  <section class="archive-page">
    <header class="archive-page__header">
      <h1 class="archive-page__title">归档</h1>
      <p v-if="archivesWithPosts.length" class="archive-page__count">
        共 {{ archivesWithPosts.length }} 个时间段
      </p>
    </header>

    <div v-if="!archivesWithPosts.length" class="archive-page__empty">
      暂无归档
    </div>

    <div v-else class="archive-page__list">
      <section
        v-for="[label, posts] in archivesWithPosts"
        :key="label"
        class="archive-section"
      >
        <h2 class="archive-section__name">
          {{ label }}
          <span class="archive-section__count">{{ posts.length }}</span>
        </h2>
        <ul class="archive-section__posts">
          <li v-for="post in posts" :key="post.url" class="archive-section__item">
            <a :href="post.url" class="archive-section__link">
              {{ post.title }}
            </a>
            <time
              v-if="post.date && post.date.string"
              class="archive-section__date"
            >
              {{ post.date.string }}
            </time>
          </li>
        </ul>
      </section>
    </div>
  </section>
</template>

<style scoped lang="scss">
.archive-page {
  max-width: 760px;
  margin: 0 auto;
  padding: 1.5rem 0;

  &__header {
    display: flex;
    align-items: baseline;
    gap: 0.6rem;
    margin-bottom: 1.4rem;
  }

  &__title {
    font-size: 1.6rem;
    font-weight: 600;
    margin: 0;
  }

  &__count {
    font-size: 0.8rem;
    color: var(--vp-c-text-3);
    margin: 0;
  }

  &__empty {
    padding: 2rem;
    color: var(--vp-c-text-2);
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }
}

.archive-section {
  &__name {
    font-size: 1rem;
    font-weight: 600;
    margin: 0 0 0.5rem;
    color: var(--vp-c-text-1);
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }

  &__count {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--vp-c-text-3);
    padding: 0.1rem 0.4rem;
    border-radius: 999px;
    background: var(--vp-c-bg-soft, rgba(128, 128, 128, 0.1));
  }

  &__posts {
    list-style: none;
    padding: 0;
    margin: 0;
    border-radius: 8px;
    border: 1px solid var(--vp-c-divider);
    overflow: hidden;
  }

  &__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 0.5rem 0.85rem;
    border-bottom: 1px solid var(--vp-c-divider);

    &:last-child {
      border-bottom: none;
    }
  }

  &__link {
    font-size: 0.9rem;
    color: var(--vp-c-text-1);
    text-decoration: none;
    flex: 1;
    min-width: 0;

    &:hover {
      color: var(--vp-c-brand-1);
    }
  }

  &__date {
    font-size: 0.75rem;
    color: var(--vp-c-text-3);
    flex-shrink: 0;
  }
}
</style>
