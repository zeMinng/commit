<script setup>
import { unref, computed } from 'vue'
import { withBase, useData } from 'vitepress'

const { frontmatter } = useData()
const works = computed(() => {
  const w = unref(frontmatter).works
  return Array.isArray(w) ? w : []
})
</script>

<template>
  <section class="works-page">
    <header class="works-page__header">
      <h1 class="works-page__title">作品</h1>
      <p v-if="works.length" class="works-page__count">
        共 {{ works.length }} 个作品
      </p>
    </header>

    <div v-if="!works.length" class="works-page__empty">
      暂无作品
    </div>

    <ul v-else class="works-page__list">
      <li v-for="(item, index) in works" :key="index" class="work-card">
        <a
          v-if="item.link"
          :href="item.link"
          target="_blank"
          rel="noopener noreferrer"
          class="work-card__link"
        >
          <div v-if="item.image" class="work-card__thumb">
            <img :src="withBase(item.image)" :alt="item.title" />
          </div>
          <div class="work-card__main">
            <h2 class="work-card__title">{{ item.title }}</h2>
            <p v-if="item.description" class="work-card__desc">
              {{ item.description }}
            </p>
            <div v-if="item.tags && item.tags.length" class="work-card__tags">
              <span
                v-for="tag in item.tags"
                :key="tag"
                class="work-card__tag"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </a>
        <div v-else class="work-card__link work-card__link--no-href">
          <div v-if="item.image" class="work-card__thumb">
            <img :src="withBase(item.image)" :alt="item.title" />
          </div>
          <div class="work-card__main">
            <h2 class="work-card__title">{{ item.title }}</h2>
            <p v-if="item.description" class="work-card__desc">
              {{ item.description }}
            </p>
            <div v-if="item.tags && item.tags.length" class="work-card__tags">
              <span
                v-for="tag in item.tags"
                :key="tag"
                class="work-card__tag"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </section>
</template>

<style scoped lang="scss">
.works-page {
  max-width: 760px;
  margin: 0 auto;
  padding: 1.5rem 0;

  &__header {
    display: flex;
    align-items: baseline;
    gap: 0.6rem;
    margin-bottom: 1.5rem;
  }

  &__title {
    font-size: 1.6rem;
    font-weight: 600;
    margin: 0;
    color: var(--vp-c-text-1);
  }

  &__count {
    font-size: 0.8rem;
    color: var(--vp-c-text-3);
    margin: 0;
  }

  &__empty {
    padding: 2rem 0;
    color: var(--vp-c-text-2);
    font-size: 0.95rem;
  }

  &__list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
}

.work-card {
  list-style: none;

  &__link {
    display: flex;
    gap: 1rem;
    padding: 1rem 1.1rem;
    border-radius: 10px;
    border: 1px solid var(--vp-c-divider);
    text-decoration: none;
    color: inherit;
    background: var(--vp-c-bg);
    transition: border-color 0.2s ease, box-shadow 0.2s ease;

    &:hover {
      border-color: var(--vp-c-brand-1);
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
    }

    &--no-href {
      cursor: default;
      pointer-events: none;

      &:hover {
        border-color: var(--vp-c-divider);
        box-shadow: none;
      }
    }
  }

  &__thumb {
    flex-shrink: 0;
    width: 88px;
    height: 88px;
    border-radius: 8px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: fill;
    }
  }

  &__main {
    flex: 1;
    min-width: 0;
  }

  &__title {
    margin: 0;
    font-size: 1.05rem;
    font-weight: 600;
    line-height: 1.4;
    color: var(--vp-c-text-1);

    .work-card__link:not(.work-card__link--no-href):hover & {
      color: var(--vp-c-brand-1);
    }
  }

  &__desc {
    font-size: 0.875rem;
    color: var(--vp-c-text-2);
    margin: 0.35rem 0 0;
    line-height: 1.55;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
    margin-top: 0.5rem;
  }

  &__tag {
    font-size: 0.72rem;
    padding: 0.15rem 0.45rem;
    color: var(--vp-c-text-3);
    background: var(--vp-c-bg-soft, rgba(128, 128, 128, 0.08));
    border-radius: 6px;
  }
}

@media (max-width: 640px) {
  .works-page {
    padding: 1rem 0.75rem;

    &__header {
      margin-bottom: 1rem;
    }

    &__title {
      font-size: 1.35rem;
    }

    &__empty {
      padding: 1.25rem 0;
    }
  }

  .work-card {
    &__link {
      padding: 0.85rem 0.85rem;
      gap: 0.75rem;
      align-items: flex-start;
    }

    &__thumb {
      width: 64px;
      height: 64px;
      border-radius: 10px;
    }

    &__title {
      font-size: 1rem;
    }

    &__desc {
      font-size: 0.85rem;
    }
  }
}
</style>
