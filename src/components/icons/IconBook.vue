<script setup lang="ts">
/**
 * 书籍 · 角色资料
 *
 * 由 1.html 第 3454 行内联 SVG 精确提取，几何与属性未做改动。
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
    class="icon icon-book"
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
    <path
      d="M12 6.6C10.4 5.3 8.3 4.7 5.6 4.9a1 1 0 0 0-.9 1v11.4c0 .6.5 1 1.1 1 2.4-.1 4.3.5 5.8 1.7.2.2.6.2.8 0 1.5-1.2 3.4-1.8 5.8-1.7.6 0 1.1-.4 1.1-1V5.9a1 1 0 0 0-.9-1c-2.7-.2-4.8.4-6.4 1.7Z"
    />
    <path d="M12 6.6V20" />
  </svg>
</template>
