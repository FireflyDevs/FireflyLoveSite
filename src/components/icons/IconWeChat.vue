<script setup lang="ts">
/**
 * 微信（微信公众号）
 *
 * 由 1.html 第 3635 行内联 SVG 精确提取，几何与属性未做改动。
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
    class="icon icon-wechat"
    :class="$attrs.class"
    viewBox="0 0 24 24"
    fill="currentColor"
    :width="size"
    :height="size"
    :aria-hidden="hidden ? 'true' : undefined"
    :focusable="hidden ? 'false' : undefined"
  >
    <path
      d="M19.5 5.6A16 16 0 0 0 15.6 4.4l-.3.6a12 12 0 0 1 3.4 1.7 15.7 15.7 0 0 0-11.4 0A12 12 0 0 1 10.7 5l-.3-.6A16 16 0 0 0 6.5 5.6C4 9.3 3.3 13 3.6 16.6a16 16 0 0 0 4.8 2.4l.9-1.5c-.8-.3-1.6-.7-2.3-1.2l.6-.4a11.4 11.4 0 0 0 9.8 0l.6.4c-.7.5-1.5.9-2.3 1.2l.9 1.5a16 16 0 0 0 4.8-2.4c.4-4.2-.7-7.9-2.9-11ZM9.4 14.4c-.9 0-1.7-.9-1.7-2s.7-2 1.7-2 1.7.9 1.7 2-.8 2-1.7 2Zm5.2 0c-.9 0-1.7-.9-1.7-2s.7-2 1.7-2 1.7.9 1.7 2-.8 2-1.7 2Z"
    />
  </svg>
</template>
