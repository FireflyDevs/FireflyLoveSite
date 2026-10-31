<script setup lang="ts">
/**
 * 菜单 · 汉堡
 *
 * 由 1.html 第 3086 行内联 SVG 精确提取，几何与属性未做改动。
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
    class="icon icon-menu"
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
    <path d="M3.5 7h17M3.5 12h17M3.5 17h17" />
  </svg>
</template>
