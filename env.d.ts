declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '*.data.ts' {
  interface PostData {
    title: string
    url: string
    date: { time: number; string: string }
    excerpt: string
    tags: string[]
  }
  export const data: PostData[]
}