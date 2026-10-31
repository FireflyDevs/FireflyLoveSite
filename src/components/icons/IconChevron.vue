<script setup lang="ts">
/**
 * 右尖括号
 *
 * 同一图形的多个变体合并为一个组件，通过 `variant` prop 切换。
 * 几何精确提取自 1.html，未做改动。
 *
 * - `normal`：描边 2 · 轮播右切换
 */

/** 图形变体 */
export type IconVariant = 'normal'

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
    class="icon icon-chevron"
    :class="$attrs.class"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    :width="size"
    :height="size"
    :aria-hidden="hidden ? 'true' : undefined"
    :focusable="hidden ? 'false' : undefined"
  >
    <g>
      <path d="m9 5.5 7 6.5-7 6.5" />
    </g>
  </svg>
</template>
