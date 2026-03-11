<script setup>
import { computed, ref } from 'vue'
import { data as allResources } from '../../composables/useResources.data'

const grouped = computed(() => {
  const map = {}
  for (const item of allResources) {
    const cat = item.category || '其他'
    if (!map[cat]) map[cat] = []
    map[cat].push(item)
  }
  return Object.entries(map).sort((a, b) => a[0].localeCompare(b[0]))
})

function toAnchorId(category) {
  return 'cat-' + category.replace(/\s+/g, '-')
}

// 折叠状态：默认全部折叠，便于快速扫分类再展开
const expanded = ref({})
function toggle(category) {
  expanded.value[category] = !expanded.value[category]
}
function isExpanded(category) {
  return !!expanded.value[category]
}
</script>

<template>
  <section class="resource-page">
    <header class="resource-page__header">
      <h1 class="resource-page__title">资源汇总</h1>
      <p v-if="grouped.length" class="resource-page__count">
        共 {{ allResources.length }} 个资源
      </p>
    </header>

    <div v-if="!grouped.length" class="resource-page__empty">
      暂无资源
    </div>

    <template v-else>
      <!-- 分类锚点导航，便于快速跳转 -->
      <nav class="resource-page__nav" aria-label="分类导航">
        <a
          v-for="[category] in grouped"
          :key="category"
          :href="'#' + toAnchorId(category)"
          class="resource-page__nav-link"
        >
          {{ category }}
        </a>
      </nav>

      <div class="resource-page__list">
        <section
          v-for="[category, items] in grouped"
          :key="category"
          :id="toAnchorId(category)"
          class="resource-section"
        >
          <button
            type="button"
            class="resource-section__head"
            @click="toggle(category)"
            :aria-expanded="isExpanded(category)"
          >
            <span class="resource-section__name">
              {{ category }}
              <span class="resource-section__count">{{ items.length }}</span>
            </span>
            <span class="resource-section__chevron" :class="{ open: isExpanded(category) }">▼</span>
          </button>
          <div v-show="isExpanded(category)" class="resource-section__body">
            <ul class="resource-section__items">
              <li v-for="item in items" :key="item.url" class="resource-item">
                <div class="resource-item__row">
                  <span class="resource-item__title">{{ item.title }}</span>
                  <span class="resource-item__actions">
                    <a
                      v-if="item.link"
                      :href="item.link"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="resource-item__btn resource-item__btn--link"
                    >链接</a>
                    <a
                      v-if="item.download"
                      :href="item.download"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="resource-item__btn resource-item__btn--download"
                    >下载</a>
                  </span>
                </div>
                <p v-if="item.description" class="resource-item__desc">
                  {{ item.description }}
                </p>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </template>
  </section>
</template>

<style scoped lang="scss">
.resource-page {
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

  &__nav {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin-bottom: 1rem;
    padding: 0.5rem 0;
    position: sticky;
    top: 0;
    z-index: 2;
    background: var(--vp-c-bg);
  }

  &__nav-link {
    font-size: 0.8rem;
    padding: 0.2rem 0.5rem;
    border-radius: 6px;
    text-decoration: none;
    color: var(--vp-c-text-2);
    border: 1px solid var(--vp-c-divider);
    background: transparent;

    &:hover {
      color: var(--vp-c-brand-1);
      border-color: var(--vp-c-brand-1);
    }
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
}

.resource-section {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;

  &__head {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 0.75rem;
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--vp-c-text-1);
    background: var(--vp-c-bg-soft, rgba(128, 128, 128, 0.06));
    border: none;
    cursor: pointer;
    text-align: left;

    &:hover {
      background: var(--vp-c-bg-soft);
    }
  }

  &__name {
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }

  &__count {
    font-size: 0.7rem;
    font-weight: 500;
    color: var(--vp-c-text-3);
    padding: 0.1rem 0.35rem;
    border-radius: 999px;
    background: var(--vp-c-bg);
  }

  &__chevron {
    font-size: 0.6rem;
    opacity: 0.7;
    transition: transform 0.2s;

    &.open {
      transform: rotate(180deg);
    }
  }

  &__body {
    border-top: 1px solid var(--vp-c-divider);
  }

  &__items {
    list-style: none;
    padding: 0;
    margin: 0;
  }
}

.resource-item {
  padding: 0.4rem 0.75rem;
  border-bottom: 1px solid var(--vp-c-divider);

  &:last-child {
    border-bottom: none;
  }

  &__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
  }

  &__title {
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--vp-c-text-1);
    flex: 1;
    min-width: 0;
  }

  &__actions {
    display: flex;
    gap: 0.35rem;
    flex-shrink: 0;
  }

  &__desc {
    font-size: 0.8rem;
    color: var(--vp-c-text-2);
    margin: 0.2rem 0 0;
    padding-left: 0;
    line-height: 1.45;
  }

  &__btn {
    font-size: 0.75rem;
    padding: 0.2rem 0.45rem;
    border-radius: 4px;
    text-decoration: none;
    border: 1px solid var(--vp-c-divider);
    background: transparent;
    color: var(--vp-c-text-2);

    &:hover {
      color: var(--vp-c-brand-1);
      border-color: var(--vp-c-brand-1);
    }

    &--download {
      color: var(--vp-c-brand-1);
      border-color: var(--vp-c-brand-1);

      &:hover {
        background: var(--vp-c-brand-1);
        color: #fff;
      }
    }
  }
}
</style>
