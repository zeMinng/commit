<template>
  <div ref="containerRef" style="position: relative">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { shallowRef, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import type { CSSProperties } from 'vue'
import { useMutationObserver } from '../../utils'

export interface Font {
  color?: string
  fontSize?: number
  fontWeight?: 'normal' | 'light' | 'weight' | number
  fontFamily?: string
  fontStyle?: 'none' | 'normal' | 'italic' | 'oblique'
}

export interface Props {
  width?: number
  height?: number
  layout?: 'parallel' | 'alternate'
  rotate?: number
  zIndex?: number
  image?: string
  content?: string | string[]
  fullscreen?: boolean
  fixed?: boolean
  textStyle?: Font
  gap?: [number, number]
  offset?: [number, number]
}

const props = withDefaults(defineProps<Props>(), {
  width: undefined,
  height: undefined,
  layout: 'alternate',
  rotate: -22,
  zIndex: 90,
  image: undefined,
  content: undefined,
  fullscreen: false,
  fixed: true,
  textStyle: () => ({
    color: 'rgba(0, 0, 0, 0.15)',
    fontSize: 16,
    fontWeight: 'normal',
    fontFamily: 'sans-serif',
    fontStyle: 'normal',
  }),
  gap: () => [100, 100],
  offset: () => [50, 50],
})

const FontGap = 3
const containerRef = shallowRef<HTMLElement>()
const watermarkRef = shallowRef<HTMLElement>()
const htmlRef = shallowRef<HTMLElement>(document.documentElement)
const isDark = shallowRef(htmlRef.value.classList.contains('dark'))
const stopObservation = shallowRef(false)

const gapX = computed(() => props.gap?.[0] ?? 100)
const gapY = computed(() => props.gap?.[1] ?? 100)
const gapXCenter = computed(() => gapX.value / 2)
const gapYCenter = computed(() => gapY.value / 2)
const offsetLeft = computed(() => props.offset?.[0] ?? gapXCenter.value)
const offsetTop = computed(() => props.offset?.[1] ?? gapYCenter.value)

const BaseSize = computed(() => {
  const layoutMap = {
    parallel: 1,
    alternate: 2,
  }
  return layoutMap[props.layout]
})

const fullscreenFixed = computed(() => props.fullscreen && props.fixed)

const markStyle = computed(() => {
  const markStyle: CSSProperties = {
    zIndex: props.zIndex ?? 9,
    position: fullscreenFixed.value ? 'fixed' : 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    backgroundRepeat: 'repeat',
  }

  if (isDark.value) {
    markStyle.filter = 'invert(1) hue-rotate(180deg)'
  }

  let positionLeft = offsetLeft.value - gapXCenter.value
  let positionTop = offsetTop.value - gapYCenter.value

  if (positionLeft > 0) {
    markStyle.left = `${positionLeft}px`
    markStyle.width = `calc(100% - ${positionLeft}px)`
    positionLeft = 0
  }

  if (positionTop > 0) {
    markStyle.top = `${positionTop}px`
    markStyle.height = `calc(100% - ${positionTop}px)`
    positionTop = 0
  }

  markStyle.backgroundPosition = `${positionLeft}px ${positionTop}px`
  return markStyle
})

watch(
  () => [props],
  () => {
    renderWatermark()
  },
  {
    deep: true,
    flush: 'post',
  },
)

onMounted(() => {
  renderWatermark()
})

onBeforeUnmount(() => {
  destroyWatermark()
})

useMutationObserver(
  htmlRef,
  () => {
    isDark.value = htmlRef.value.classList.contains('dark')
    destroyWatermark()
    renderWatermark()
  },
  { attributeFilter: ['class'] },
)

useMutationObserver(props.fullscreen ? htmlRef : containerRef, onMutate, {
  subtree: true,
  childList: true,
  attributes: true,
  attributeFilter: ['style', 'class'],
})

function onMutate(mutations: MutationRecord[]) {
  if (stopObservation.value) return

  mutations.forEach((mutation: MutationRecord) => {
    if (reRendering(mutation, watermarkRef.value)) {
      destroyWatermark()
      renderWatermark()
    }
  })
}

function destroyWatermark() {
  if (watermarkRef.value) {
    watermarkRef.value.remove()
    watermarkRef.value = undefined
  }
}

function appendWatermark(base64Url: string, markWidth: number) {
  if (containerRef.value && watermarkRef.value) {
    stopObservation.value = true
    watermarkRef.value.setAttribute(
      'style',
      getStyleStr({
        ...markStyle.value,
        backgroundImage: `url('${base64Url}')`,
        backgroundSize: `${(gapX.value + markWidth) * BaseSize.value}px`,
      }),
    )

    if (props.fullscreen) {
      htmlRef.value.setAttribute('style', 'position: relative')
      htmlRef.value.append(watermarkRef.value)
    } else {
      containerRef.value.append(watermarkRef.value)
    }

    setTimeout(() => {
      stopObservation.value = false
    })
  }
}

function toLowercaseSeparator(key: string) {
  return key.replace(/([A-Z])/g, '-$1').toLowerCase()
}

function getStyleStr(style: CSSProperties): string {
  return Object.keys(style)
    .map((key: any) => `${toLowercaseSeparator(key)}: ${style[key as keyof CSSProperties]};`)
    .join(' ')
}

function getMarkSize(ctx: CanvasRenderingContext2D) {
  let defaultWidth = 120
  let defaultHeight = 64
  const content = props.content
  const image = props.image
  const width = props.width
  const height = props.height
  const fontSize = props.textStyle.fontSize ?? 16
  const fontFamily = props.textStyle.fontFamily ?? 'sans-serif'

  if (!image && ctx.measureText) {
    ctx.font = `${Number(fontSize)}px ${fontFamily}`
    const contents = Array.isArray(content) ? content : [content]
    const widths = contents.map((item) => ctx.measureText(item!).width)
    defaultWidth = Math.ceil(Math.max(...widths))
    defaultHeight = Number(fontSize) * contents.length + (contents.length - 1) * FontGap
  }

  return [width ?? defaultWidth, height ?? defaultHeight] as const
}

function getPixelRatio() {
  return window.devicePixelRatio || 1
}

function fillTexts(
  ctx: CanvasRenderingContext2D,
  drawX: number,
  drawY: number,
  drawWidth: number,
  drawHeight: number,
) {
  const ratio = getPixelRatio()
  const content = props.content
  const fontSize = props.textStyle.fontSize ?? 16
  const fontWeight = props.textStyle.fontWeight ?? 'normal'
  const fontFamily = props.textStyle.fontFamily ?? 'sans-serif'
  const fontStyle = props.textStyle.fontStyle ?? 'normal'
  const color = props.textStyle.color ?? 'rgba(0, 0, 0, 0.15)'
  const mergedFontSize = Number(fontSize) * ratio

  ctx.font = `${fontStyle} normal ${fontWeight} ${mergedFontSize}px/${drawHeight}px ${fontFamily}`
  ctx.fillStyle = color
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  ctx.translate(drawWidth / 2, 0)

  const contents = Array.isArray(content) ? content : [content]
  contents?.forEach((item, index) => {
    ctx.fillText(item ?? '', drawX, drawY + index * (mergedFontSize + FontGap * ratio))
  })
}

function renderWatermark() {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const image = props.image
  const rotate = props.rotate ?? -22

  if (!ctx) return

  if (!watermarkRef.value) {
    watermarkRef.value = document.createElement('div')
  }

  const ratio = getPixelRatio()
  const [markWidth, markHeight] = getMarkSize(ctx)
  const canvasWidth = (gapX.value + markWidth) * ratio
  const canvasHeight = (gapY.value + markHeight) * ratio

  canvas.setAttribute('width', `${canvasWidth * BaseSize.value}px`)
  canvas.setAttribute('height', `${canvasHeight * BaseSize.value}px`)

  const drawX = (gapX.value * ratio) / 2
  const drawY = (gapY.value * ratio) / 2
  const drawWidth = markWidth * ratio
  const drawHeight = markHeight * ratio
  const rotateX = (drawWidth + gapX.value * ratio) / 2
  const rotateY = (drawHeight + gapY.value * ratio) / 2

  const alternateDrawX = drawX + canvasWidth
  const alternateDrawY = drawY + canvasHeight
  const alternateRotateX = rotateX + canvasWidth
  const alternateRotateY = rotateY + canvasHeight

  ctx.save()
  rotateWatermark(ctx, rotateX, rotateY, rotate)

  if (image) {
    const img = new Image()
    img.onload = () => {
      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight)
      ctx.restore()
      rotateWatermark(ctx, alternateRotateX, alternateRotateY, rotate)
      ctx.drawImage(img, alternateDrawX, alternateDrawY, drawWidth, drawHeight)
      appendWatermark(canvas.toDataURL(), markWidth)
    }
    img.crossOrigin = 'anonymous'
    img.referrerPolicy = 'no-referrer'
    img.src = image
  } else {
    fillTexts(ctx, drawX, drawY, drawWidth, drawHeight)
    ctx.restore()
    rotateWatermark(ctx, alternateRotateX, alternateRotateY, rotate)
    fillTexts(ctx, alternateDrawX, alternateDrawY, drawWidth, drawHeight)
    appendWatermark(canvas.toDataURL(), markWidth)
  }
}

function rotateWatermark(
  ctx: CanvasRenderingContext2D,
  rotateX: number,
  rotateY: number,
  rotate: number,
) {
  ctx.translate(rotateX, rotateY)
  ctx.rotate((Math.PI / 180) * Number(rotate))
  ctx.translate(-rotateX, -rotateY)
}

function reRendering(mutation: MutationRecord, watermarkElement?: HTMLElement) {
  let flag = false

  if (mutation.removedNodes.length) {
    flag = Array.from(mutation.removedNodes).some((node) => node === watermarkElement)
  }

  if (mutation.type === 'attributes' && mutation.target === watermarkElement) {
    flag = true
  }

  return flag
}
</script>

