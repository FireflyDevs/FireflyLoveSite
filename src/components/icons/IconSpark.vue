<script setup lang="ts">
/**
 * 星芒 · 装饰（桌面端）
 *
 * 由 1.html 第 3258 行内联 SVG 精确提取，几何与属性未做改动。
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
    class="icon icon-spark"
    :class="$attrs.class"
    viewBox="0 0 24 24"
    fill="currentColor"
    :width="size"
    :height="size"
    :aria-hidden="hidden ? 'true' : undefined"
    :focusable="hidden ? 'false' : undefined"
  >
    <path
      d="M11.3 1.4c.7 4.9 2.6 7.3 7.3 8.1-4.7.8-6.6 3.2-7.3 8.1-.7-4.9-2.6-7.3-7.3-8.1 4.7-.8 6.6-3.2 7.3-8.1Z"
    />
    <path
      d="M18.4 13.6c.4 2.5 1.4 3.8 3.8 4.2-2.4.4-3.4 1.7-3.8 4.2-.4-2.5-1.4-3.8-3.8-4.2 2.4-.4 3.4-1.7 3.8-4.2Z"
      opacity=".8"
    />
  </svg>
</template>
