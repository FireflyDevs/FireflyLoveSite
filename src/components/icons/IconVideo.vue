<script setup lang="ts">
/**
 * 视频图标
 *
 * 同一图形的多个变体合并为一个组件，通过 `variant` prop 切换。
 * 几何精确提取自 1.html，未做改动。
 *
 * - `normal`：线框播放 · 桌面导航
 * - `solid`：胶片线框 + 实心播放键 · 快捷入口
 */

/** 图形变体 */
export type IconVariant = 'normal' | 'solid'

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
    class="icon icon-video"
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
      <g stroke-width="1.7">
        <path d="M4 5.5h16a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-11a1 1 0 0 1 1-1Z" />
        <path d="M10 9.2 15 12l-5 2.8V9.2Z" fill="currentColor" stroke="none" />
      </g>
    </template>
    <template v-else-if="variant === 'solid'">
      <g stroke-width="1.6" stroke-linejoin="round">
        <rect x="3" y="5.2" width="18" height="13.6" rx="2.4" />
        <path d="M3.4 6.2 20.4 9.6" />
        <path d="m8.2 5.4-1.6 3.3m5-4.2-1.6 3.3" />
        <path d="M10.3 10.2 15 12.9l-4.7 2.6v-5.3Z" fill="currentColor" stroke="none" />
      </g>
    </template>
  </svg>
</template>
