<script setup lang="ts">
/**
 * 用户 · 个人中心
 *
 * 由 1.html 第 3733 行内联 SVG 精确提取，几何与属性未做改动。
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
    class="icon icon-user"
    :class="$attrs.class"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.7"
    stroke-linecap="round"
    :width="size"
    :height="size"
    :aria-hidden="hidden ? 'true' : undefined"
    :focusable="hidden ? 'false' : undefined"
  >
    <circle cx="12" cy="8" r="4.1" />
    <path d="M4.2 20.6v-1.4a5.6 5.6 0 0 1 5.6-5.6h4.4a5.6 5.6 0 0 1 5.6 5.6v1.4" />
  </svg>
</template>
