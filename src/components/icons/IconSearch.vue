<script setup lang="ts">
/**
 * 搜索图标
 *
 * 同一图形的多个变体合并为一个组件，通过 `variant` prop 切换。
 * 几何精确提取自 1.html，未做改动。
 *
 * - `normal`：轻描边 1.8 · 页头搜索框
 * - `bold`：粗描边 2 · 搜索框内跳转键
 * - `thin`：细描边 1.9 · 移动端工具栏
 */

/** 图形变体 */
export type IconVariant = 'normal' | 'bold' | 'thin'

withDefaults(
  defineProps<{
    /** 图形变体，默认 'normal' */
    variant?: IconVariant
    /** 尺寸（px），同时写入 width/height */
    size?: number | string
    /** 是否对辅助技术隐藏，纯装饰时保持 true */
    hidden?: boolean
  }>(),
  { variant: 'normal', size: 24, hidden: true },
)
</script>

<template>
  <svg
    class="icon icon-search"
    :class="$attrs.class"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    :width="size"
    :height="size"
    :aria-hidden="hidden ? 'true' : undefined"
    :focusable="hidden ? 'false' : undefined"
  >
    <template v-if="variant === 'normal'">
      <g stroke-width="1.8">
        <circle cx="10.6" cy="10.6" r="6.6" />
        <path d="m15.6 15.6 5 5" />
      </g>
    </template>
    <template v-else-if="variant === 'bold'">
      <g stroke-width="2">
        <circle cx="10.6" cy="10.6" r="6.6" />
        <path d="m15.6 15.6 5 5" />
      </g>
    </template>
    <template v-else-if="variant === 'thin'">
      <g stroke-width="1.9" stroke-linecap="round">
        <circle cx="10.6" cy="10.6" r="6.6" />
        <path d="m15.6 15.6 5.2 5.2" />
      </g>
    </template>
  </svg>
</template>
