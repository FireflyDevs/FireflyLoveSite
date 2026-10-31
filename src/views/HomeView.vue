<script setup lang="ts">
/**
 * 首页
 *
 * 组装 Hero 与内容带（band）：最新动态、主视觉卡、快捷入口、收尾横幅。
 * 结构对应 `1.html` 的 `<main>` 段（`1.html:3114-3613`）。
 *
 * 交互：
 * - 入场动画：`useReveal` 统一观察三个带 `.reveal` 的区块
 */
import { nextTick, onBeforeUnmount, onMounted, ref, watchEffect } from 'vue'

import ClosingBand from '@/components/sections/ClosingBand.vue'
import FeatureCard from '@/components/sections/FeatureCard.vue'
import HeroSection from '@/components/sections/HeroSection.vue'
import NewsPanel from '@/components/sections/NewsPanel.vue'
import ShortcutsPanel from '@/components/sections/ShortcutsPanel.vue'
import { useReducedMotion } from '@/composables/useReducedMotion'
import { observeReveal } from '@/composables/useReveal'

/** 降低动效偏好 */
const prefersReducedMotion = useReducedMotion()
const shouldSkip = (): boolean => prefersReducedMotion.value

/** 各区块组件实例（通过 defineExpose 拿到 root） */
const newsPanelRef = ref<{ root: HTMLElement | null } | null>(null)
const featureCardRef = ref<{ root: HTMLElement | null } | null>(null)
const shortcutsPanelRef = ref<{ root: HTMLElement | null } | null>(null)

/** reveal 目标：把组件暴露的 root 包装成 ref 供 useReveal 消费 */
const newsReveal = ref<HTMLElement | null>(null)
const featureReveal = ref<HTMLElement | null>(null)
const shortcutsReveal = ref<HTMLElement | null>(null)

// 子组件 expose 的 root 在子组件挂载后才可用，watchEffect 会随其变化重新同步
watchEffect(() => {
  newsReveal.value = newsPanelRef.value?.root ?? null
  featureReveal.value = featureCardRef.value?.root ?? null
  shortcutsReveal.value = shortcutsPanelRef.value?.root ?? null
})

/**
 * 入场观察必须在子组件挂载完成后再启动：
 * 子组件 expose 的 ref 在其挂载后才可用，直接调用 `useReveal`（内部注册
 * `onMounted`）会早于该时刻拿到 `null`，导致区块永久停留在 `opacity: 0`。
 * 这里在 `onMounted` + `nextTick` 之后调用普通函数 `observeReveal`。
 */
let stopReveal: (() => void) | null = null
onMounted(async () => {
  await nextTick()
  stopReveal = observeReveal(
    [newsReveal, featureReveal, shortcutsReveal]
      .map((t) => t.value)
      .filter((el): el is HTMLElement => el !== null),
    shouldSkip,
  )
})

onBeforeUnmount(() => {
  stopReveal?.()
  stopReveal = null
})
</script>

<template>
  <main class="page page-home">
    <HeroSection />

    <section class="shell band" aria-label="网站内容">
      <div class="band-grid">
        <NewsPanel ref="newsPanelRef" />
        <FeatureCard ref="featureCardRef" />
        <ShortcutsPanel ref="shortcutsPanelRef" />
      </div>
      <ClosingBand />
    </section>
  </main>
</template>

<style scoped>
/* ============================================================
   内容带布局 —— 移植自 1.html:1036-1045, 2236-2251, 2521-2529, 2881-2883
   ============================================================ */

.band {
  padding-top: 14px;
  position: relative;
  z-index: 2;
}

.band-grid {
  display: grid;
  gap: clamp(14px, 1.5vw, 24px);
  grid-template-columns: minmax(0, 1.876fr) minmax(0, 1.139fr) minmax(0, 1fr);
  align-items: stretch;
}

/* ---------- 响应式 ---------- */
@media (max-width: 1080px) {
  .band-grid {
    grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr);
    grid-template-areas: 'news feature' 'quick quick';
  }
}

@media (max-width: 860px) {
  .band {
    padding-top: 0;
  }

  .band-grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas: 'feature' 'quick' 'news';
    gap: 13px;
    padding: 0 14px;
  }
}

@media (max-width: 360px) {
  .band-grid {
    padding: 0 10px;
    gap: 10px;
  }
}
</style>
