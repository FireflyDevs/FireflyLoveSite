<script setup lang="ts">
/**
 * 爱心图标
 *
 * 同一图形的多个变体合并为一个组件，通过 `variant` prop 切换。
 * 几何精确提取自 1.html，未做改动。
 *
 * - `solid`：实心 · 社交栏收藏
 * - `outline`：线框 1.7 · 底部标签栏
 */

/** 图形变体 */
export type IconVariant = 'solid' | 'outline'

withDefaults(
  defineProps<{
    /** 图形变体，默认 'solid' */
    variant?: IconVariant
    /** 尺寸（px），同时写入 width/height */
    size?: number | string
    /** 是否对辅助技术隐藏，纯装饰时保持 true */
    hidden?: boolean
  }>(),
  { variant: 'solid', size: 24, hidden: true },
)
</script>

<template>
  <svg
    class="icon icon-heart"
    :class="$attrs.class"
    viewBox="0 0 24 24"
    fill="currentColor"
    :width="size"
    :height="size"
    :aria-hidden="hidden ? 'true' : undefined"
    :focusable="hidden ? 'false' : undefined"
  >
    <template v-if="variant === 'solid'">
      <g fill="currentColor">
        <path
          d="M12 20.7S3.4 15.4 3.4 9.6a4.9 4.9 0 0 1 8.6-3.1 4.9 4.9 0 0 1 8.6 3.1c0 5.8-8.6 11.1-8.6 11.1Z"
        />
      </g>
    </template>
    <template v-else-if="variant === 'outline'">
      <g fill="none" stroke="currentColor" stroke-width="1.7">
        <path
          d="M12 20.6S3.6 15.4 3.6 9.7a4.8 4.8 0 0 1 8.4-3 4.8 4.8 0 0 1 8.4 3c0 5.7-8.4 10.9-8.4 10.9Z"
        />
      </g>
    </template>
  </svg>
</template>
