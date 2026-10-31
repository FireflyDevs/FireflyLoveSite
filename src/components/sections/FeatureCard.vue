<script setup lang="ts">
/**
 * 主视觉卡（流萤角色介绍）
 *
 * 结构、类名与样式移植自 `1.html` 的 `.feature-card` 段（`1.html:3392-3449`）。
 * 桌面端展示大立绘 + 手写字体「Firefly」，移动端切换为紧凑横幅（76px 高）。
 *
 * 交互：
 * - 鼠标光斑：`useSpotlight`（依赖宿主上的 `.panel` 样式）
 * - 涟漪：`useRipple`
 * - 入场：`useReveal`（由 HomeView 统一传入）
 */
import { ref } from 'vue'

import cardUrl from '@/assets/ff/card.jpg'
import featureUrl from '@/assets/ff/feature.jpg'
import IconButterfly from '@/components/icons/IconButterfly.vue'
import IconPlay from '@/components/icons/IconPlay.vue'
import { useReducedMotion } from '@/composables/useReducedMotion'
import { useRipple } from '@/composables/useRipple'
import { useSpotlight } from '@/composables/useSpotlight'

/** 降低动效偏好 */
const prefersReducedMotion = useReducedMotion()
const shouldSkip = (): boolean => prefersReducedMotion.value

/** 卡片宿主 */
const cardRef = ref<HTMLElement | null>(null)
useSpotlight(cardRef)

/** 对外暴露卡片 ref，供 HomeView 统一执行 reveal 入场动画 */
defineExpose({ root: cardRef })

/** 涟漪处理器 */
const onCardPointerDown = useRipple(cardRef, shouldSkip)
</script>

<template>
  <article
    ref="cardRef"
    class="panel feature-card reveal"
    role="button"
    tabindex="0"
    data-modal
    aria-label="查看流萤角色介绍"
    @pointerdown="onCardPointerDown"
  >
    <span class="feature-art">
      <img
        class="d-only-img"
        :src="featureUrl"
        alt="流萤 角色立绘"
        fetchpriority="high"
        decoding="async"
      />
      <img class="m-only-img" :src="cardUrl" alt="" loading="lazy" decoding="async" />
    </span>
    <span class="feature-body">
      <span class="feature-tag m-only" aria-hidden="true">
        <IconButterfly variant="ico" />
        角色介绍
      </span>
      <span class="feature-cn m-only">流萤 <i>Firefly</i></span>
      <span class="feature-script d-only">Firefly</span>
      <p class="feature-quote">「即使是短暂的生命，<span>也能绽放出最耀眼的光芒。」</span></p>
      <span class="feature-sub m-only">—— 美好，正是此刻。</span>
      <span class="feature-foot">
        <span class="feature-mark" aria-hidden="true">
          <IconButterfly variant="full" />
        </span>
        <span class="play-btn" aria-hidden="true">
          <IconPlay />
        </span>
      </span>
    </span>
  </article>
</template>

<style scoped>
/* ============================================================
   主视觉卡 —— 移植自 1.html:1284-1439
   关键帧改为 kebab-case。
   ============================================================ */

.panel {
  position: relative;
  min-width: 0;
  overflow: hidden;
  border-radius: var(--radius);
  border: 1px solid var(--line);
  background: linear-gradient(158deg, var(--panel-a), var(--panel-b));
  box-shadow: 0 18px 44px rgba(0, 0, 0, 0.3);
  transition:
    border-color 0.3s ease,
    box-shadow 0.3s ease;
}

.panel::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(140deg, rgba(214, 235, 255, 0.055), transparent 44%);
}

.panel::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.35s;
  background: radial-gradient(
    340px circle at var(--mx, 50%) var(--my, 0%),
    rgba(150, 195, 255, 0.13),
    transparent 62%
  );
}

.panel:hover::after {
  opacity: 1;
}

.panel:hover {
  border-color: var(--line-2);
}

.feature-card {
  position: relative;
  display: block;
  width: 100%;
  min-height: 396px;
  padding: 0;
  cursor: pointer;
  text-align: left;
  color: inherit;
}

.feature-art {
  position: absolute;
  inset: 0;
  overflow: hidden;
  border-radius: inherit;
  display: block;
  background: linear-gradient(150deg, #0e1c36, #060d1c);
}

.feature-art img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 52% 34%;
  transition: transform 1s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.feature-art .m-only-img {
  display: none;
}

.feature-card:hover .feature-art img {
  transform: scale(1.07);
}

.feature-art::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(6, 13, 26, 0.42) 0%,
    transparent 26%,
    transparent 46%,
    rgba(5, 11, 23, 0.82) 100%
  );
}

.feature-body {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 0 22px 20px;
  z-index: 2;
  display: block;
}

.feature-script {
  display: block;
  margin-bottom: 6px;
  font-family: var(--f-script);
  font-size: 38px;
  line-height: 1;
  color: var(--gold);
  text-shadow:
    0 0 24px rgba(255, 203, 130, 0.5),
    0 0 6px rgba(255, 190, 110, 0.4);
}

.feature-card:hover .feature-script {
  animation: gold-glow 2.4s ease-in-out infinite;
}

@keyframes gold-glow {
  0%,
  100% {
    text-shadow: 0 0 22px rgba(255, 203, 130, 0.45);
  }
  50% {
    text-shadow:
      0 0 34px rgba(255, 216, 160, 0.95),
      0 0 60px rgba(255, 190, 110, 0.5);
  }
}

.feature-quote {
  margin: 0;
  font-family: var(--f-kai);
  font-size: 16.5px;
  line-height: 1.78;
  letter-spacing: 0.03em;
  color: #f3f8ff;
  text-shadow: 0 1px 12px rgba(0, 0, 0, 0.7);
}

.feature-quote span {
  display: block;
  padding-left: 1.6em;
}

.feature-sub {
  display: none;
}

.feature-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 14px;
}

.feature-mark {
  width: 30px;
  height: 26px;
  color: #f2f8ff;
  filter: drop-shadow(0 0 12px rgba(170, 210, 255, 0.9));
}

.feature-mark :deep(.wing) {
  transform-origin: 22px 22px;
  animation: wing-idle 4.6s ease-in-out infinite;
}

.play-btn {
  position: relative;
  width: 46px;
  height: 46px;
  flex: none;
  display: grid;
  place-items: center;
  border-radius: 50%;
  border: 1px solid rgba(214, 235, 255, 0.75);
  background: rgba(10, 22, 42, 0.42);
  color: #fff;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  transition:
    transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1),
    background 0.3s,
    box-shadow 0.3s;
}

.play-btn svg {
  width: 16px;
  height: 16px;
  margin-left: 2px;
}

.play-btn::after {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: 50%;
  border: 1px solid rgba(190, 220, 255, 0.55);
  animation: pulse-ring 2.8s ease-out infinite;
}

@keyframes pulse-ring {
  0% {
    transform: scale(1);
    opacity: 0.7;
  }
  70%,
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

.feature-card:hover .play-btn {
  transform: scale(1.1);
  background: rgba(150, 195, 255, 0.32);
  box-shadow: 0 0 26px rgba(150, 195, 255, 0.55);
}

/* ---------- 响应式 ---------- */
@media (max-width: 1080px) {
  .feature-card {
    min-height: 360px;
  }
}

@media (max-width: 860px) {
  .feature-card {
    min-height: 0;
    height: 76px;
    border-radius: 14px;
    overflow: hidden;
  }

  .feature-art .d-only-img {
    display: none;
  }

  .feature-art .m-only-img {
    display: block;
  }

  .feature-art img {
    object-position: 50% 30%;
  }

  .feature-art::after {
    background: linear-gradient(
      90deg,
      rgba(6, 13, 26, 0.1) 0%,
      rgba(6, 13, 26, 0.06) 34%,
      rgba(6, 13, 26, 0.78) 62%,
      rgba(6, 13, 26, 0.92) 100%
    );
  }

  .feature-body {
    position: relative;
    z-index: 3;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 6px 40px 6px 42%;
  }

  .feature-script {
    display: none;
  }

  .feature-cn {
    display: block;
    font-family: var(--f-serif-cn);
    font-weight: 600;
    font-size: 18px;
    line-height: 1.08;
    margin: 0 0 1px;
    color: #f2f7ff;
    text-shadow: 0 0 18px rgba(150, 195, 255, 0.5);
  }

  .feature-cn i {
    font-family: var(--f-display);
    font-style: italic;
    font-weight: 400;
    font-size: 15px;
    color: #cfe3ff;
    margin-left: 4px;
  }

  .feature-quote {
    display: none;
  }

  .feature-sub {
    display: block;
    font-family: var(--f-kai);
    font-size: 11px;
    line-height: 1.35;
    color: #d3e3f8;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .feature-foot {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    margin: 0;
  }

  .feature-mark {
    display: none;
  }

  .play-btn {
    width: 28px;
    height: 28px;
  }

  .play-btn svg {
    width: 11px;
    height: 11px;
  }

  .feature-tag {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    align-self: flex-start;
    margin-bottom: 3px;
    padding: 2px 7px 2px 5px;
    border-radius: 999px;
    border: 1px solid rgba(153, 199, 255, 0.22);
    background: rgba(130, 178, 241, 0.16);
    color: #bcdcff;
    font-size: 9.5px;
  }

  .feature-tag svg {
    width: 11px;
    height: 10px;
  }
}
</style>
