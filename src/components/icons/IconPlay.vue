<script setup lang="ts">
/**
 * 播放按钮 · 实心三角
 *
 * 由 1.html 第 3227 行内联 SVG 精确提取，几何与属性未做改动。
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
    class="icon icon-play"
    :class="$attrs.class"
    viewBox="0 0 24 24"
    fill="currentColor"
    :width="size"
    :height="size"
    :aria-hidden="hidden ? 'true' : undefined"
    :focusable="hidden ? 'false' : undefined"
  >
    <path d="M8.4 5.6c0-.9 1-1.4 1.7-.9l8.4 5.9c.7.5.7 1.5 0 2l-8.4 5.9c-.7.5-1.7 0-1.7-.9V5.6Z" />
  </svg>
</template>
