<script setup lang="ts">
/**
 * 外链箭头 · 右上
 *
 * 由 1.html 第 3839 行内联 SVG 精确提取，几何与属性未做改动。
 * 图形属性（fill / stroke / stroke-width 等）写在根 `<svg>` 上，
 * 因此可通过 CSS 或 class 覆盖颜色，默认跟随 `currentColor`。
 */
withDefaults(
  defineProps<{
    /** 尺寸（px），同时写入 width/height */
    size?: number | string
    /** 是否对辅助技术隐藏，纯装饰时保持 true */
    hidden?: boolean
  }>(),
  { size: 24, hidden: true },
)
</script>

<template>
  <svg
    class="icon icon-external"
    :class="$attrs.class"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.9"
    stroke-linecap="round"
    :width="size"
    :height="size"
    :aria-hidden="hidden ? 'true' : undefined"
    :focusable="hidden ? 'false' : undefined"
  >
    <path d="M8 16 16.5 7.5M9.5 7.5h7v7" />
  </svg>
</template>
