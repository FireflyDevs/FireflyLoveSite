<script setup lang="ts">
/**
 * 移动端底部标签栏
 *
 * 结构、类名与样式移植自 `1.html` 的 `.tabbar` 段（`1.html:3669-3746`），
 * 样式取自 `1.html:1818-1938`，仅在 `860px` 以下显示（`.tabbar { display: grid }`）。
 *
 * 五个 tab 均未接站内页面，保留原稿的 `data-modal` 按钮行为；
 * 「首页」固定为选中态，与顶栏的 `.active` 语义一致。
 *
 * 交互：
 * - 涟漪：每个 tab 各自持有宿主 ref（`useRipple` 要求 ref 绑定，不能用下标取值）
 * - 中央圆球的呼吸光环由 CSS `orb-ring` 关键帧负责
 */
import { ref } from 'vue'

import IconButterfly from '@/components/icons/IconButterfly.vue'
import IconComment from '@/components/icons/IconComment.vue'
import IconHeart from '@/components/icons/IconHeart.vue'
import IconHome from '@/components/icons/IconHome.vue'
import IconUser from '@/components/icons/IconUser.vue'
import { useReducedMotion } from '@/composables/useReducedMotion'
import { useRipple } from '@/composables/useRipple'

/** 降低动效偏好 */
const prefersReducedMotion = useReducedMotion()
const shouldSkip = (): boolean => prefersReducedMotion.value

/** 五个 tab 的涟漪宿主 */
const homeTabRef = ref<HTMLElement | null>(null)
const favTabRef = ref<HTMLElement | null>(null)
const centerTabRef = ref<HTMLElement | null>(null)
const commentTabRef = ref<HTMLElement | null>(null)
const aboutTabRef = ref<HTMLElement | null>(null)

const onHomePointerDown = useRipple(homeTabRef, shouldSkip)
const onFavPointerDown = useRipple(favTabRef, shouldSkip)
const onCenterPointerDown = useRipple(centerTabRef, shouldSkip)
const onCommentPointerDown = useRipple(commentTabRef, shouldSkip)
const onAboutPointerDown = useRipple(aboutTabRef, shouldSkip)
</script>

<template>
  <nav class="tabbar" aria-label="移动端导航">
    <button
      ref="homeTabRef"
      class="tab active"
      type="button"
      data-modal
      @pointerdown="onHomePointerDown"
    >
      <IconHome variant="small" />
      <span>首页</span>
    </button>
    <button ref="favTabRef" class="tab" type="button" data-modal @pointerdown="onFavPointerDown">
      <IconHeart variant="outline" />
      <span>收藏</span>
    </button>
    <button
      ref="centerTabRef"
      class="tab tab-center"
      type="button"
      data-modal
      aria-label="流萤主题入口"
      @pointerdown="onCenterPointerDown"
    >
      <span class="tab-orb">
        <IconButterfly variant="full" />
      </span>
      <span>流萤</span>
    </button>
    <button
      ref="commentTabRef"
      class="tab"
      type="button"
      data-modal
      @pointerdown="onCommentPointerDown"
    >
      <IconComment />
      <span>留言</span>
    </button>
    <button
      ref="aboutTabRef"
      class="tab"
      type="button"
      data-modal
      @pointerdown="onAboutPointerDown"
    >
      <IconUser />
      <span>关于</span>
    </button>
  </nav>
</template>

<style scoped>
/* ============================================================
   移动端底部导航 —— 移植自 1.html:1818-1938
   桌面端隐藏，860px 以下由本组件的媒体查询打开
   ============================================================ */
.tabbar {
  display: none;
  position: fixed;
  z-index: 70;
  left: 0;
  right: 0;
  bottom: 0;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  align-items: end;
  padding: 3px 8px calc(4px + env(safe-area-inset-bottom));
  border-top: 1px solid rgba(160, 198, 255, 0.26);
  background: linear-gradient(180deg, rgba(7, 17, 34, 0.86), rgba(6, 14, 29, 0.96));
  backdrop-filter: blur(20px) saturate(140%);
  -webkit-backdrop-filter: blur(20px) saturate(140%);
  box-shadow: 0 -12px 34px rgba(0, 0, 0, 0.42);
}

.tabbar::before {
  content: '';
  position: absolute;
  left: 12%;
  right: 12%;
  top: -1px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(180, 215, 255, 0.75), transparent);
}

.tab {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  min-width: 0;
  padding: 1px 0;
  cursor: pointer;
  color: #8fa6c9;
  font-size: 9.5px;
  letter-spacing: 0.04em;
  transition:
    color 0.26s,
    transform 0.26s cubic-bezier(0.2, 0.8, 0.2, 1);
}

/* 图标组件根 svg 统一为 19×19，与原稿 .tab svg 一致 */
.tab :deep(svg) {
  width: 19px;
  height: 19px;
  transition:
    transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1),
    filter 0.3s;
}

.tab:hover,
.tab.active {
  color: #eaf3ff;
}

.tab.active :deep(svg) {
  filter: drop-shadow(0 0 10px rgba(160, 205, 255, 0.9));
}

.tab:active {
  transform: scale(0.93);
}

.tab.active::after {
  content: '';
  position: absolute;
  top: -6px;
  left: 50%;
  transform: translateX(-50%);
  width: 26px;
  height: 2px;
  border-radius: 2px;
  background: linear-gradient(90deg, transparent, #e8f2ff, transparent);
  box-shadow: 0 0 12px rgba(170, 210, 255, 0.9);
}

.tab-center {
  margin-top: -14px;
}

.tab-orb {
  position: relative;
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  color: #f2f8ff;
  background: radial-gradient(circle at 34% 26%, #2c4d7e, #0d1f3b 72%);
  border: 1px solid rgba(206, 230, 255, 0.7);
  box-shadow:
    0 0 0 5px rgba(6, 14, 29, 0.92),
    0 0 26px rgba(140, 190, 255, 0.42),
    inset 0 0 18px rgba(140, 190, 255, 0.28);
}

.tab-orb :deep(svg) {
  width: 19px;
  height: 17px;
}

.tab-orb::before,
.tab-orb::after {
  content: '';
  position: absolute;
  inset: -5px;
  border-radius: 50%;
  border: 1px solid rgba(170, 210, 255, 0.5);
  animation: orb-ring 3.2s ease-out infinite;
}

.tab-orb::after {
  animation-delay: 1.6s;
}

@keyframes orb-ring {
  0% {
    transform: scale(0.86);
    opacity: 0.85;
  }

  70%,
  100% {
    transform: scale(1.42);
    opacity: 0;
  }
}

.tab-center span:last-child {
  margin-top: 4px;
}

/* 蝴蝶扇翼：viewBox 44×44，原点与 IconButterfly 的 wing 对齐 */
.tab-center :deep(.wing) {
  transform-origin: 22px 22px;
  animation: wing-idle 4s ease-in-out infinite;
}

@keyframes wing-idle {
  0%,
  100% {
    transform: rotate(0deg);
  }

  50% {
    transform: rotate(-5deg);
  }
}

/* ---------- 仅在窄屏显示 ---------- */
@media (max-width: 860px) {
  .tabbar {
    display: grid;
  }
}

@media (prefers-reduced-motion: reduce) {
  .tabbar :deep(svg),
  .tab {
    transition: none;
  }

  .tab-orb::before,
  .tab-orb::after,
  .tab-center :deep(.wing) {
    animation: none;
  }
}
</style>
