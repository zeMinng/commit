<script setup>
import { computed, ref } from 'vue'
import { data as allPosts } from '../../composables/usePosts.data'

// 按标签聚合：{ tagName: [post, ...] }，按标签名排序
const tagsWithPosts = computed(() => {
  const map = {}
  for (const post of allPosts) {
    const tags = post.tags && post.tags.length ? post.tags : ['未分类']
    for (const tag of tags) {
      if (!map[tag]) map[tag] = []
      map[tag].push(post)
    }
  }
  return Object.entries(map).sort((a, b) => {
    if (a[0] === '未分类') return 1
    if (b[0] === '未分类') return -1
    return a[0].localeCompare(b[0])
  })
})

// 所有 tag（名称 + 数量），用于上方展示
const tagTiles = computed(() =>
  tagsWithPosts.value.map(([tagName, posts]) => ({
    tagName,
    count: posts.length
  }))
)

// 当前选中的 tag，点击后下方才显示该 tag 的文章列表
const selectedTag = ref('')
const currentPosts = computed(() => {
  if (!selectedTag.value) return []
  const found = tagsWithPosts.value.find(([tagName]) => tagName === selectedTag.value)
  return found ? found[1] : []
})
</script>

<template>
  <section class="tags-page">
    <header class="tags-page__header">
      <h1 class="tags-page__title">标签</h1>
      <p v-if="tagsWithPosts.length" class="tags-page__count">
        共 {{ tagsWithPosts.length }} 个标签
      </p>
    </header>

    <div v-if="!tagsWithPosts.length" class="tags-page__empty">
      暂无标签
    </div>

    <template v-else>
      <!-- 上方：展示所有 tag（名称 + 数量） -->
      <div class="tags-page__tiles">
        <button
          v-for="t in tagTiles"
          :key="t.tagName"
          type="button"
          class="tag-tile"
          :class="{ active: selectedTag === t.tagName }"
          @click="selectedTag = selectedTag === t.tagName ? '' : t.tagName"
        >
          <span class="tag-tile__name">{{ t.tagName }}</span>
          <span class="tag-tile__count">{{ t.count }}</span>
        </button>
      </div>

      <!-- 下方：点击 tag 后才显示对应的文章列表 -->
      <div v-if="selectedTag" class="tags-page__detail">
        <p class="tags-page__detail-title">{{ selectedTag }} · 共 {{ currentPosts.length }} 篇</p>
        <ul class="tag-section__posts">
          <li v-for="post in currentPosts" :key="post.url" class="tag-section__item">
            <a :href="post.url" class="tag-section__link">
              {{ post.title }}
            </a>
            <time v-if="post.date && post.date.string" class="tag-section__date">
              {{ post.date.string }}
            </time>
          </li>
        </ul>
      </div>
    </template>
  </section>
</template>

<style scoped lang="scss">
.tags-page {
  max-width: 760px;
  margin: 0 auto;
  padding: 1.5rem 0;

  &__header {
    display: flex;
    align-items: baseline;
    gap: 0.6rem;
    margin-bottom: 1rem;
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

  &__tiles {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
  }

  &__detail {
    margin-top: 0.5rem;
  }

  &__detail-title {
    font-size: 0.9rem;
    color: var(--vp-c-text-2);
    margin: 0 0 0.5rem;
  }
}

.tag-tile {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.85rem;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  cursor: pointer;
  font: inherit;

  &:hover {
    border-color: var(--vp-c-brand-1);
  }

  &.active {
    border-color: var(--vp-c-brand-1);
    color: var(--vp-c-brand-1);
  }

  &__name {
    font-size: 0.9rem;
    font-weight: 500;
  }

  &__count {
    font-size: 0.75rem;
    color: var(--vp-c-text-3);
    padding: 0.1rem 0.4rem;
    border-radius: 999px;
    background: var(--vp-c-bg-soft, rgba(128, 128, 128, 0.1));
  }
}

.tag-section {
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

@media (max-width: 640px) {
  .tags-page {
    padding: 1rem 0.75rem;

    &__header {
      margin-bottom: 0.85rem;
    }

    &__title {
      font-size: 1.35rem;
    }

    &__empty {
      padding: 1.25rem 0;
    }

    &__tiles {
      gap: 0.4rem;
      margin-bottom: 1rem;
    }
  }

  .tag-tile {
    padding: 0.55rem 0.75rem;
    border-radius: 10px;
  }

  .tag-section {
    &__item {
      padding: 0.6rem 0.75rem;
    }

    &__date {
      font-size: 0.72rem;
    }
  }
}
</style>
