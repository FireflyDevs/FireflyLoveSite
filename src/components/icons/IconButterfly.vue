<script setup lang="ts">
/**
 * 蝴蝶图标
 *
 * 同一图形的多个变体合并为一个组件，通过 `variant` prop 切换。
 * 几何精确提取自 1.html，未做改动。
 *
 * - `full`：完整版 · 双翼 + 身体 + 触角（44×44，品牌 Logo）
 * - `simple`：单笔实心纹样（44×40）
 * - `ico`：紧凑版（44×40，移动端）
 *
 * 各变体 viewBox 不同，组件按变体自动切换：`full` 0 0 44 44、`simple` 0 0 44 40、`ico` 0 0 44 40。
 */
import { computed } from 'vue'

/** 图形变体 */
export type IconVariant = 'full' | 'simple' | 'ico'

const props = withDefaults(
  defineProps<{
    /** 图形变体，默认 'full' */
    variant?: IconVariant
    /** 尺寸（px），同时写入 width/height */
    size?: number | string
    /** 是否对辅助技术隐藏，纯装饰时保持 true */
    hidden?: boolean
  }>(),
  { variant: 'full', size: 24, hidden: true },
)

/** 各变体 viewBox 不一致，按变体切换 */
const viewBoxes: Record<IconVariant, string> = {
  full: '0 0 44 44',
  simple: '0 0 44 40',
  ico: '0 0 44 40',
}

/** 当前变体对应的 viewBox */
const currentViewBox = computed(() => viewBoxes[props.variant])
</script>

<template>
  <svg
    class="icon icon-butterfly"
    :class="$attrs.class"
    :viewBox="currentViewBox"
    fill="currentColor"
    :width="size"
    :height="size"
    :aria-hidden="hidden ? 'true' : undefined"
    :focusable="hidden ? 'false' : undefined"
  >
    <template v-if="variant === 'full'">
      <g fill="currentColor">
        <g class="wing l">
          <path
            d="M21.6 21.1C16.9 11.4 8.9 6.3 4.9 10.1 1.2 13.6 5.2 20.5 15.7 21.9 6.7 23.3 4.6 30.3 8.6 33.3c3.9 2.9 9.3-2.8 12.4-11.1Z"
          />
        </g>
        <g class="wing r">
          <path
            d="M22.4 21.1c4.7-9.7 12.7-14.8 16.7-11 3.7 3.5-.3 10.4-10.8 11.8 9 1.4 11.1 8.4 7.1 11.4-3.9 2.9-9.3-2.8-12.4-11.1Z"
          />
        </g>
        <path
          d="M21.6 15.6c1.2 0 1.9 1.5 1.5 3.8l-.8 5.6c-.2 1.4-1 1.4-1.2 0l-.8-5.6c-.4-2.3.3-3.8 1.3-3.8Z"
        />
        <path
          d="M20.4 16.2c-1-2-2.6-3.6-4.3-4.6m7.9 4.6c1-2 2.6-3.6 4.3-4.6"
          fill="none"
          stroke="currentColor"
          stroke-width="1.1"
          stroke-linecap="round"
        />
      </g>
    </template>
    <template v-else-if="variant === 'simple'">
      <g fill="currentColor">
        <path
          d="M21.4 20.6C17 12 9.6 7.4 5.9 10.9 2.5 14.1 6.2 20.4 16.1 21.6 8 22.9 6 29.4 9.7 32.2c3.6 2.8 8.6-2.4 11.7-10.1 3.1 7.7 8.1 12.9 11.7 10.1 3.7-2.8 1.7-9.3-6.4-10.6 9.9-1.2 13.6-7.5 10.2-10.7-3.7-3.5-11.1 1.1-15.5 9.7Z"
        />
      </g>
    </template>
    <template v-else-if="variant === 'ico'">
      <g fill="currentColor">
        <path
          d="M21.4 20.6C17 12 9.6 7.4 5.9 10.9 2.5 14.1 6.2 20.4 16.1 21.6 8 22.9 6 29.4 9.7 32.2c3.6 2.8 8.6-2.4 11.7-10.1 3.1 7.7 8.1 12.9 11.7 10.1 3.7-2.8 1.7-9.3-6.4-10.6 9.9-1.2 13.6-7.5 10.2-10.7-3.7-3.5-11.1 1.1-15.5 9.7Z"
        />
      </g>
    </template>
  </svg>
</template>
