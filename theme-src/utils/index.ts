import {
  ref,
  getCurrentInstance,
  onMounted,
  toValue,
  computed,
  watch,
  onBeforeUnmount,
} from 'vue'
import type { Ref, ComputedRef } from 'vue'

export function useMounted(): Ref<boolean> {
  const isMounted = ref(false)
  const instance = getCurrentInstance()
  if (instance) {
    onMounted(() => {
      isMounted.value = true
    }, instance)
  }
  return isMounted
}

export function useSupported(callback: () => unknown): ComputedRef<boolean> {
  const isMounted = useMounted()
  return computed(() => {
    void isMounted.value
    return Boolean(callback())
  })
}

export function useMutationObserver(
  target: Ref | Ref[] | HTMLElement | HTMLElement[],
  callback: MutationCallback,
  options: MutationObserverInit = {},
): { start: () => void; stop: () => void } {
  const isSupported = useSupported(() => typeof window !== 'undefined' && 'MutationObserver' in window)
  const stopObservation = ref(false)
  let observer: MutationObserver | undefined

  const targets = computed(() => {
    const targetsValue = toValue(target)
    if (!targetsValue) return []
    if (Array.isArray(targetsValue)) {
      return targetsValue.map((el: any) => toValue(el)).filter((el: any) => el)
    }
    return [targetsValue]
  })

  const cleanup = () => {
    if (observer) {
      observer.disconnect()
      observer = undefined
    }
  }

  const observeElements = () => {
    if (isSupported.value && targets.value.length && !stopObservation.value) {
      observer = new MutationObserver(callback)
      targets.value.forEach((element: HTMLElement) => observer!.observe(element, options))
    }
  }

  watch(
    () => targets.value,
    () => {
      cleanup()
      observeElements()
    },
    {
      immediate: true,
      flush: 'post',
    },
  )

  const start = () => {
    stopObservation.value = false
    observeElements()
  }

  const stop = () => {
    stopObservation.value = true
    cleanup()
  }

  onBeforeUnmount(() => cleanup())

  return {
    start,
    stop,
  }
}

