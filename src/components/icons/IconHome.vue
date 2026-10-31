<script setup lang="ts">
/**
 * 首页图标
 *
 * 同一图形的多个变体合并为一个组件，通过 `variant` prop 切换。
 * 几何精确提取自 1.html，未做改动。
 *
 * - `normal`：标准实心 · 桌面导航
 * - `small`：小尺寸实心 · 移动端标签栏
 */

/** 图形变体 */
export type IconVariant = 'normal' | 'small'

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
    class="icon icon-home"
    :class="$attrs.class"
    viewBox="0 0 24 24"
    fill="currentColor"
    :width="size"
    :height="size"
    :aria-hidden="hidden ? 'true' : undefined"
    :focusable="hidden ? 'false' : undefined"
  >
    <template v-if="variant === 'normal'">
      <g fill="currentColor">
        <path
          d="M11.3 2.6a1 1 0 0 1 1.4 0l8.2 7.5a1 1 0 0 1 .3.7V20a1.6 1.6 0 0 1-1.6 1.6h-4.5a1 1 0 0 1-1-1v-3.9h-4.2v3.9a1 1 0 0 1-1 1H4.4A1.6 1.6 0 0 1 2.8 20v-9.2a1 1 0 0 1 .3-.7Z"
        />
      </g>
    </template>
    <template v-else-if="variant === 'small'">
      <g fill="currentColor">
        <path
          d="M11.3 2.6a1 1 0 0 1 1.4 0l8.2 7.5a1 1 0 0 1 .3.7V20a1.6 1.6 0 0 1-1.6 1.6h-4.5a1 1 0 0 1-1-1v-3.9h-4.2v3.9a1 1 0 0 1-1 1H4.4A1.6 1.6 0 0 1 2.8 20v-9.2a1 1 0 0 1 .3-.7Z"
        />
      </g>
    </template>
  </svg>
</template>
