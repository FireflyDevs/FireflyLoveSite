<script setup lang="ts">
/**
 * 图片 · 壁纸
 *
 * 由 1.html 第 3480 行内联 SVG 精确提取，几何与属性未做改动。
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
    class="icon icon-image"
    :class="$attrs.class"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.6"
    stroke-linecap="round"
    :width="size"
    :height="size"
    :aria-hidden="hidden ? 'true' : undefined"
    :focusable="hidden ? 'false' : undefined"
  >
    <rect x="3" y="4.4" width="18" height="15.2" rx="2.4" />
    <circle cx="8.4" cy="9.4" r="1.6" />
    <path d="m3.6 17.4 4.8-4.2 3.1 2.3 3.4-4.1 5.5 6" />
  </svg>
</template>
