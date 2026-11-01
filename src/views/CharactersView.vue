<script setup lang="ts">
/**
 * 角色介绍
 *
 * 对应导航「角色介绍」。组装四个区块：
 * 档案主卡、角色故事（时间轴 + 星魂）、只言片语（台词）、结尾导航。
 *
 * 交互：
 * - 入场动画：`observeReveal` 统一观察四个带 `.reveal` 的区块
 *   （与首页同一套：子组件 defineExpose({root})，挂载后再启动观察）
 */
import { nextTick, onBeforeUnmount, onMounted, ref, watchEffect } from 'vue'

import CharactersHero from '@/components/sections/CharactersHero.vue'
import CharactersOutro from '@/components/sections/CharactersOutro.vue'
import CharactersStory from '@/components/sections/CharactersStory.vue'
import CharactersVoices from '@/components/sections/CharactersVoices.vue'
import { useReducedMotion } from '@/composables/useReducedMotion'
import { observeReveal } from '@/composables/useReveal'

/** 降低动效偏好 */
const prefersReducedMotion = useReducedMotion()
const shouldSkip = (): boolean => prefersReducedMotion.value

/** 各区块组件实例（通过 defineExpose 拿到 root） */
const heroRef = ref<{ root: HTMLElement | null } | null>(null)
const storyRef = ref<{ root: HTMLElement | null } | null>(null)
const voicesRef = ref<{ root: HTMLElement | null } | null>(null)
const outroRef = ref<{ root: HTMLElement | null } | null>(null)

/** reveal 目标：把组件暴露的 root 包装成 ref 供 observeReveal 消费 */
const heroReveal = ref<HTMLElement | null>(null)
const storyReveal = ref<HTMLElement | null>(null)
const voicesReveal = ref<HTMLElement | null>(null)
const outroReveal = ref<HTMLElement | null>(null)

// 子组件 expose 的 root 在子组件挂载后才可用，watchEffect 会随其变化重新同步
watchEffect(() => {
  heroReveal.value = heroRef.value?.root ?? null
  storyReveal.value = storyRef.value?.root ?? null
  voicesReveal.value = voicesRef.value?.root ?? null
  outroReveal.value = outroRef.value?.root ?? null
})

/**
 * 入场观察必须在子组件挂载完成后再启动（同首页：
 * 否则 expose 的 ref 尚未填充，区块会永久停留在 opacity: 0）。
 */
let stopReveal: (() => void) | null = null
onMounted(async () => {
  await nextTick()
  stopReveal = observeReveal(
    [heroReveal, storyReveal, voicesReveal, outroReveal]
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
  <main class="page page-characters">
    <div class="shell char-shell">
      <CharactersHero ref="heroRef" />
      <CharactersStory ref="storyRef" />
      <CharactersVoices ref="voicesRef" />
      <CharactersOutro ref="outroRef" />
    </div>
  </main>
</template>

<style scoped>
.char-shell {
  position: relative;
  z-index: 2;
  /* 档案主卡之外的区块之间拉开节奏 */
  display: flex;
  flex-direction: column;
  gap: clamp(56px, 8vh, 84px);
  padding-bottom: 72px;
}

/* 首个区块（档案主卡）自带页头间距，与后续区块的间距减半 */
.char-shell> :first-child {
  margin-bottom: calc(clamp(56px, 8vh, 84px) * -0.5);
}

@media (max-width: 860px) {
  .char-shell {
    padding-bottom: 48px;
  }

  .page-characters {
    margin: 10px;
  }
}
</style>
