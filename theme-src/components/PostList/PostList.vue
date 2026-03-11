<script setup>
import { ref, computed } from 'vue'
import { data as allPosts } from '../../composables/usePosts.data'

const pageSize = 5
const currentPage = ref(1)

const total = computed(() => allPosts.length)
const totalPages = computed(() =>
  total.value === 0 ? 1 : Math.ceil(total.value / pageSize),
)

const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return allPosts.slice(start, start + pageSize)
})

const pages = computed(() => {
  const arr = []
  for (let i = 1; i <= totalPages.value; i++) arr.push(i)
  return arr
})

function goToPage(page) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
</script>

<template>
  <section class="posts">
    <header class="posts__header">
      <h1 class="posts__title">文章</h1>
      <span v-if="total > 0" class="posts__count">
        {{ total }} 篇
      </span>
    </header>
    <div v-if="total === 0" class="posts__empty">
      暂时还没有文章
    </div>
    <ol v-else class="posts__list">
      <li
        v-for="post in paginatedPosts"
        :key="post.url"
        class="post-card"
      >
        <a :href="post.url" class="post-card__link">
          <div class="post-card__main">
            <div class="post-card__head">
              <h2 class="post-card__title">
                {{ post.title }}
              </h2>
              <span
                v-if="post.tags && post.tags.length"
                class="post-card__tag"
              >
                {{ post.tags[0] }}
              </span>
            </div>
            <p
              v-if="post.excerpt"
              class="post-card__excerpt"
            >
              {{ post.excerpt }}
            </p>
          </div>
          <footer class="post-card__footer">
            <time
              v-if="post.date && post.date.string"
              class="post-card__date"
            >
              {{ post.date.string }}
            </time>
          </footer>
        </a>
      </li>
    </ol>

    <nav
      v-if="totalPages > 1"
      class="posts__pagination"
      aria-label="文章分页"
    >
      <button
        type="button"
        class="pagination-btn pagination-btn--prev"
        :disabled="currentPage === 1"
        aria-label="上一页"
        @click="goToPage(currentPage - 1)"
      >
        上一页
      </button>
      <span class="posts__pagination-pages">
        <button
          v-for="page in pages"
          :key="page"
          type="button"
          class="pagination-btn pagination-btn--num"
          :class="{ 'pagination-btn--active': page === currentPage }"
          :aria-current="page === currentPage ? 'page' : undefined"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>
      </span>
      <button
        type="button"
        class="pagination-btn pagination-btn--next"
        :disabled="currentPage === totalPages"
        aria-label="下一页"
        @click="goToPage(currentPage + 1)"
      >
        下一页
      </button>
    </nav>
  </section>
</template>

<style scoped lang="scss">
.posts {
  max-width: 60rem;
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

  &__pagination {
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--vp-c-divider);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  &__pagination-pages {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
}

.post-card {
  list-style: none;

  &__link {
    display: block;
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
  }

  &__main {
    min-width: 0;
  }

  &__head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 0.75rem;
  }

  &__title {
    margin: 0;
    font-size: 1.05rem;
    font-weight: 600;
    line-height: 1.4;
    color: var(--vp-c-text-1);
    flex: 1;
    min-width: 0;

    .post-card__link:hover & {
      color: var(--vp-c-brand-1);
    }
  }

  &__tag {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    padding: 0.2rem 0.5rem;
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--vp-c-text-3);
    background: var(--vp-c-bg-soft, rgba(128, 128, 128, 0.08));
    border-radius: 6px;
    white-space: nowrap;
  }

  &__excerpt {
    font-size: 0.875rem;
    color: var(--vp-c-text-2);
    margin: 0.4rem 0 0;
    line-height: 1.55;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__footer {
    margin-top: 0.85rem;
    padding-top: 0.75rem;
    border-top: 1px solid var(--vp-c-divider);
  }

  &__date {
    font-size: 0.75rem;
    color: var(--vp-c-text-3);
    font-family: var(--vp-font-family-mono, monospace);
  }
}

.pagination-btn {
  min-width: 2.25rem;
  height: 2.25rem;
  padding: 0 0.6rem;
  font-size: 0.8rem;
  font-weight: 500;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  cursor: pointer;
  transition: border-color 0.2s ease, color 0.2s ease, background 0.2s ease;

  &:hover:not(:disabled) {
    border-color: var(--vp-c-brand-1);
    color: var(--vp-c-brand-1);
  }

  &--num {
    min-width: 2.25rem;
  }

  &--active {
    background: var(--vp-c-brand-1);
    border-color: var(--vp-c-brand-1);
    color: #fff;

    &:hover {
      color: #fff;
    }
  }

  &--prev,
  &--next {
    padding: 0 0.75rem;
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
}
</style>