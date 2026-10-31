<script setup lang="ts">
/**
 * 图标目录（开发预览页）
 *
 * 按组件分组渲染 `iconMap` 中的全部图标及其变体，验证拆分结果并作为选图参考。
 * 单变体组件只展示一项；多变体组件把每个 `variant` 平铺开，便于并排比对。
 */
import { iconMap, iconVariants, type IconName } from '@/components/icons'

const entries = (Object.keys(iconMap) as IconName[]).map((name) => ({
  name,
  component: iconMap[name],
  variants: iconVariants[name],
}))

/** 唯一图形总数 = 各组件变体数之和 */
const totalGlyphs = entries.reduce((sum, e) => sum + e.variants.length, 0)
</script>

<template>
  <section class="icon-catalog" aria-label="图标目录">
    <header class="catalog-head">
      <h1>图标目录</h1>
      <p class="summary">
        <b>{{ entries.length }}</b> 个组件 · <b>{{ totalGlyphs }}</b> 个唯一图形 · 由 1.html 的 55
        处内联 SVG 去重提取
      </p>
      <p class="hint">
        全部跟随 <code>currentColor</code>；多变体组件通过 <code>variant</code> 切换
      </p>
    </header>

    <ul class="icon-grid">
      <li v-for="entry in entries" :key="entry.name" class="icon-cell">
        <code class="cell-name">{{ entry.name }}</code>

        <ul class="variant-list">
          <li
            v-for="variant in entry.variants"
            :key="variant"
            class="variant-item"
            :class="{ 'is-default': variant === entry.variants[0] }"
          >
            <span class="icon-preview">
              <component :is="entry.component" :variant="variant" :size="28" />
            </span>
            <span class="variant-name">{{ variant }}</span>
          </li>
        </ul>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.icon-catalog {
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 24px;
  color: var(--ink);
}

.catalog-head {
  margin-bottom: 32px;
}

h1 {
  margin: 0 0 10px;
  font-family: var(--f-display);
  font-size: 28px;
  font-style: italic;
  font-weight: 600;
}

.summary {
  margin: 0 0 6px;
  color: var(--muted);
  font-size: 13px;
}

.summary b {
  color: var(--accent);
  font-weight: 600;
}

.hint {
  margin: 0;
  color: var(--dim);
  font-size: 12px;
}

.hint code {
  color: var(--accent-2);
}

.icon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.icon-cell {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: var(--panel-b);
  transition: border-color 0.2s ease;
}

.icon-cell:hover {
  border-color: var(--line-2);
}

.cell-name {
  color: var(--dim);
  font-size: 11px;
  letter-spacing: 0.02em;
}

.variant-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.variant-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 10px 8px;
  border: 1px dashed transparent;
  border-radius: 10px;
}

/* 默认变体用实线边框标出 */
.variant-item.is-default {
  border-color: var(--line-2);
  border-style: solid;
}

.icon-preview {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  color: var(--accent);
}

.variant-name {
  color: var(--muted);
  font-size: 10px;
}
</style>
