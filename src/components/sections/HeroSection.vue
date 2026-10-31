<script setup lang="ts">
/**
 * 首页主视觉（Hero）
 *
 * 结构、类名与样式移植自 `1.html` 的 `.hero` 段（`1.html:3116-3250`）。
 * 背景图、萤火粒子 canvas、蝴蝶群、文案、CTA 按钮、落款均完整保留。
 *
 * 交互：
 * - 鼠标视差：`useHeroEffects`
 * - 萤火粒子：`useHeroEffects`
 * - 涟漪：`useRipple`
 */
import { computed, ref } from 'vue'

import heroArtUrl from '@/assets/hero.jpg'
import { useHeroEffects } from '@/composables/useHeroEffects'
import { useReducedMotion } from '@/composables/useReducedMotion'
import { useRipple } from '@/composables/useRipple'

/** 降低动效偏好 */
const prefersReducedMotion = useReducedMotion()
const shouldSkip = (): boolean => prefersReducedMotion.value

/** 主视觉容器 */
const heroRef = ref<HTMLElement | null>(null)
/** 背景图 */
const artRef = ref<HTMLImageElement | null>(null)
/** 萤火粒子画布 */
const firefliesRef = ref<HTMLCanvasElement | null>(null)

useHeroEffects(heroRef, artRef, firefliesRef, shouldSkip)

/** 涟漪宿主 */
const ctaPrimaryRef = ref<HTMLElement | null>(null)
const ctaGhostRef = ref<HTMLElement | null>(null)

const onPrimaryPointerDown = useRipple(ctaPrimaryRef, shouldSkip)
const onGhostPointerDown = useRipple(ctaGhostRef, shouldSkip)

/** 5 只装饰蝴蝶的 class 列表 */
const butterflies = computed(() => ['fb1', 'fb2', 'fb3', 'fb4', 'fb5'] as const)
</script>

<template>
  <section ref="heroRef" class="hero" aria-label="流萤主题欢迎区域">
    <img
      ref="artRef"
      class="hero-art"
      :src="heroArtUrl"
      alt="流萤 · 星穹铁道主题插画"
      fetchpriority="high"
      decoding="sync"
    />
    <canvas ref="firefliesRef" class="hero-fireflies" aria-hidden="true"></canvas>

    <!-- 5 只循环飞舞的蝴蝶 -->
    <div class="hero-bflies" aria-hidden="true">
      <span v-for="cls in butterflies" :key="cls" class="fb" :class="cls">
        <svg viewBox="0 0 44 44" fill="currentColor">
          <g class="wing l">
            <path
              d="M21.6 21.1C16.9 11.4 8.9 6.3 4.9 10.1 1.2 13.6 5.2 20.5 15.7 21.9 6.7 23.3 4.6 30.3 8.6 33.3c3.9 2.9 9.3-2.8 12.4-11.1Z"
            />
          </g>
          <g class="wing r">
            <path
              d="M22.4 21.1c4.7-9.7 12.7-14.8 16.7-11 3.7 3.5-.3 10.4-10.8 11.8 9 1.4 11.1 8.4 7.1 11.4-3.9 2.9-9.3-2.8-12.4-11.1Z"
            />
          </g>
        </svg>
      </span>
    </div>

    <div class="shell hero-inner">
      <div class="hero-copy">
        <span class="hero-eyebrow">A little light in the stars</span>
        <h1 class="hero-title">
          Firefly<span class="sheen" aria-hidden="true">Firefly</span>
          <span class="title-bfly" aria-hidden="true">
            <svg viewBox="0 0 44 44" fill="currentColor">
              <g class="wing l">
                <path
                  d="M21.6 21.1C16.9 11.4 8.9 6.3 4.9 10.1 1.2 13.6 5.2 20.5 15.7 21.9 6.7 23.3 4.6 30.3 8.6 33.3c3.9 2.9 9.3-2.8 12.4-11.1Z"
                />
              </g>
              <g class="wing r">
                <path
                  d="M22.4 21.1c4.7-9.7 12.7-14.8 16.7-11 3.7 3.5-.3 10.4-10.8 11.8 9 1.4 11.1 8.4 7.1 11.4-3.9 2.9-9.3-2.8-12.4-11.1Z"
                />
              </g>
              <path
                d="M21.6 15.6c1.2 0 1.9 1.5 1.5 3.8l-.8 5.6c-.2 1.4-1 1.4-1.2 0l-.8-5.6c-.4-2.3.3-3.8 1.3-3.8Z"
              />
            </svg>
          </span>
        </h1>
        <p class="hero-cn"><span class="d-only">星穹铁道</span><span class="m-only">流萤</span></p>
        <p class="hero-en">HONKAI: STAR RAIL</p>
        <p class="hero-quote">
          <span class="d-only">「我会把这份温柔，<em>一直带给你。」</em></span>
          <span class="m-only">愿你也能，<em>找到属于自己的光。</em></span>
        </p>
        <div class="hero-cta">
          <button
            ref="ctaPrimaryRef"
            class="btn btn-primary magnetic"
            type="button"
            data-modal
            @pointerdown="onPrimaryPointerDown"
          >
            <span class="btn-play" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M8.4 5.6c0-.9 1-1.4 1.7-.9l8.4 5.9c.7.5.7 1.5 0 2l-8.4 5.9c-.7.5-1.7 0-1.7-.9V5.6Z"
                />
              </svg>
            </span>
            进入她的世界
            <svg
              class="arrow"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.9"
              stroke-linecap="round"
              aria-hidden="true"
            >
              <path d="M4 12h15M13 5.5l7 6.5-7 6.5" />
            </svg>
          </button>
          <button
            ref="ctaGhostRef"
            class="btn btn-ghost"
            type="button"
            data-modal
            @pointerdown="onGhostPointerDown"
          >
            加入共建团队
          </button>
        </div>
      </div>
    </div>
    <div class="hero-sign" aria-hidden="true"><b>流萤</b><i>Firefly</i></div>
  </section>
</template>

<style scoped>
/* ============================================================
   Hero —— 移植自 1.html:560-1031
   关键帧名改为 kebab-case，避免与类名混淆。
   ============================================================ */

.hero {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  min-height: clamp(420px, 30.9vw, 520px);
  border-bottom: 1px solid rgba(150, 190, 245, 0.16);
}

.hero-art {
  position: absolute;
  inset: -4% -3%;
  width: 106%;
  height: 108%;
  z-index: -2;
  object-fit: cover;
  object-position: center 26%;
  will-change: transform;
  animation: kenburns 34s ease-in-out infinite alternate;
  background: linear-gradient(160deg, #0b1730, #060e1e);
}

@keyframes kenburns {
  from {
    transform: scale(1.02);
  }

  to {
    transform: scale(1.08) translate3d(-1.2%, -0.8%, 0);
  }
}

.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background:
    linear-gradient(
      90deg,
      rgba(4, 10, 22, 0.94) 0%,
      rgba(4, 10, 22, 0.8) 20%,
      rgba(4, 10, 22, 0.42) 40%,
      rgba(4, 10, 22, 0.06) 62%,
      rgba(4, 10, 22, 0.1) 100%
    ),
    linear-gradient(
      180deg,
      rgba(5, 12, 26, 0.55),
      transparent 22%,
      transparent 62%,
      rgba(5, 11, 24, 0.72)
    );
}

.hero::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 120px;
  z-index: -1;
  pointer-events: none;
  background: linear-gradient(180deg, transparent, rgba(5, 11, 24, 0.86));
}

.hero-inner {
  position: relative;
  min-height: inherit;
  display: flex;
  align-items: center;
  padding: 40px 0 20px;
}

.hero-copy {
  width: min(46%, 524px);
  position: relative;
  padding-left: 30px;
}

.hero-eyebrow {
  display: flex;
  align-items: center;
  gap: 9px;
  width: fit-content;
  margin-bottom: 12px;
  font-size: 10px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: #a9c4ea;
  opacity: 0;
  animation: rise-in 0.9s 0.1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

.hero-eyebrow::before {
  content: '';
  width: 28px;
  height: 1px;
  background: linear-gradient(90deg, transparent, #bfdcff);
  box-shadow: 0 0 10px #a6d0ff;
}

.hero-title {
  position: relative;
  margin: 0;
  display: inline-block;
  font-family: var(--f-display);
  font-style: italic;
  font-weight: 500;
  font-size: clamp(56px, 7.9vw, 124px);
  line-height: 0.94;
  letter-spacing: -0.012em;
  color: #fff;
  text-shadow:
    0 0 18px rgba(198, 224, 255, 0.55),
    0 0 52px rgba(150, 190, 255, 0.5),
    0 0 110px rgba(120, 160, 255, 0.38),
    0 2px 3px rgba(0, 0, 0, 0.3);
  opacity: 0;
  animation: rise-in 1s 0.18s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

.hero-title .sheen {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(
    105deg,
    transparent 40%,
    rgba(255, 255, 255, 0.5) 49%,
    transparent 58%
  );
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  background-size: 280% 100%;
  animation: sheen 6.5s ease-in-out infinite;
}

@keyframes sheen {
  0% {
    background-position: 180% 0;
  }

  55%,
  100% {
    background-position: -70% 0;
  }
}

.hero-title .title-bfly {
  position: absolute;
  right: -52px;
  top: -14px;
  width: 52px;
  height: 44px;
  color: #eaf4ff;
  filter: drop-shadow(0 0 14px rgba(170, 210, 255, 0.85));
  animation: float-y 5.5s ease-in-out infinite;
}

.hero-title .title-bfly .wing {
  transform-origin: 22px 22px;
  animation: wing-idle 4.2s ease-in-out infinite;
}

.hero-title .title-bfly .wing.r {
  animation-delay: 0.14s;
}

@keyframes float-y {
  0%,
  100% {
    transform: translateY(0) rotate(-2deg);
  }

  50% {
    transform: translateY(-9px) rotate(3deg);
  }
}

.hero-cn {
  margin: 4px 0 0;
  font-family: var(--f-serif-cn);
  font-weight: 600;
  font-size: clamp(23px, 2.1vw, 31px);
  letter-spacing: 0.14em;
  color: #eef4ff;
  text-shadow: 0 0 26px rgba(140, 180, 255, 0.42);
  opacity: 0;
  animation: rise-in 0.9s 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

.hero-en {
  margin: 2px 0 0;
  font-family: var(--f-display);
  font-style: italic;
  font-size: clamp(12px, 1.02vw, 15px);
  letter-spacing: 0.26em;
  color: #b9cdea;
  opacity: 0;
  animation: rise-in 0.9s 0.38s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

.hero-quote {
  margin: 19px 0 24px;
  font-family: var(--f-kai);
  font-size: clamp(18px, 1.62vw, 24px);
  line-height: 1.72;
  letter-spacing: 0.04em;
  color: #f2f7ff;
  text-shadow:
    0 0 24px rgba(20, 40, 80, 0.85),
    0 1px 12px rgba(0, 0, 0, 0.5);
  opacity: 0;
  animation: rise-in 1s 0.48s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

.hero-quote > span {
  display: block;
}

.hero-quote em {
  display: block;
  font-style: normal;
  padding-left: 1.9em;
}

.hero-quote .m-only {
  display: none;
}

.hero-cta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  opacity: 0;
  animation: rise-in 1s 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

@keyframes rise-in {
  from {
    opacity: 0;
    transform: translateY(22px);
  }

  to {
    opacity: 1;
    transform: none;
  }
}

/* ---------- 按钮 ---------- */
.btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  overflow: hidden;
  height: 52px;
  padding: 0 28px;
  border-radius: 999px;
  cursor: pointer;
  border: 1px solid rgba(180, 212, 255, 0.4);
  background: rgba(15, 32, 60, 0.6);
  color: #eaf3ff;
  font-size: 15.5px;
  letter-spacing: 0.06em;
  transition:
    transform 0.26s cubic-bezier(0.2, 0.8, 0.2, 1),
    box-shadow 0.26s,
    border-color 0.26s,
    background 0.26s;
}

.btn:hover {
  transform: translateY(-2px);
  border-color: rgba(214, 235, 255, 0.85);
  box-shadow:
    0 12px 30px rgba(0, 0, 0, 0.35),
    0 0 26px rgba(130, 180, 255, 0.28);
}

.btn:active {
  transform: translateY(0) scale(0.985);
}

.btn svg {
  width: 17px;
  height: 17px;
}

.btn .arrow {
  transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.btn:hover .arrow {
  transform: translateX(5px);
}

.btn::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: -60%;
  width: 45%;
  background: linear-gradient(100deg, transparent, rgba(255, 255, 255, 0.42), transparent);
  transform: skewX(-18deg);
  transition: left 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.btn:hover::after {
  left: 115%;
}

.btn-primary {
  color: #0d1c36;
  border-color: rgba(233, 244, 255, 0.9);
  background: linear-gradient(112deg, #ffffff 0%, #eaf2ff 34%, #c3daff 100%);
  box-shadow:
    0 10px 30px rgba(10, 30, 60, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.btn-primary:hover {
  background: linear-gradient(112deg, #fff, #f2f7ff 40%, #d3e5ff);
  box-shadow:
    0 16px 40px rgba(10, 30, 60, 0.5),
    0 0 30px rgba(170, 210, 255, 0.5);
}

.btn-primary::after {
  background: linear-gradient(100deg, transparent, rgba(255, 255, 255, 0.9), transparent);
}

.btn-play {
  width: 36px;
  height: 36px;
  flex: none;
  margin-left: -10px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  color: #132a4d;
  box-shadow: 0 3px 10px rgba(20, 45, 85, 0.28);
  transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.btn-play svg {
  width: 14px;
  height: 14px;
}

.btn:hover .btn-play {
  transform: scale(1.08);
}

.btn-ghost {
  height: 48px;
  padding: 0 22px;
  font-size: 14px;
  background: rgba(12, 26, 50, 0.5);
}

/* ---------- 落款 ---------- */
.hero-sign {
  position: absolute;
  right: max(30px, calc((100vw - var(--shell)) / 2));
  bottom: 38px;
  text-align: right;
  opacity: 0;
  animation: rise-in 1.1s 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

.hero-sign b {
  display: block;
  font-family: var(--f-serif-cn);
  font-weight: 600;
  font-size: 30px;
  letter-spacing: 0.14em;
  color: #f4f8ff;
  text-shadow: 0 0 26px rgba(150, 195, 255, 0.6);
}

.hero-sign i {
  display: block;
  margin-top: 2px;
  font-family: var(--f-script);
  font-style: normal;
  font-size: 19px;
  color: #cfe0f8;
  text-shadow: 0 0 20px rgba(150, 195, 255, 0.6);
}

.hero-sign::after {
  content: '✦';
  display: block;
  margin-top: 6px;
  font-size: 9px;
  color: rgba(200, 225, 255, 0.6);
  text-shadow: 0 0 10px rgba(150, 195, 255, 0.8);
}

/* ---------- 萤火粒子与蝴蝶 ---------- */
.hero-fireflies {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  mix-blend-mode: screen;
}

.hero-bflies {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
}

.hero-bflies .fb {
  position: absolute;
  width: 34px;
  height: 30px;
  color: #eaf4ff;
  opacity: 0.9;
  filter: drop-shadow(0 0 12px rgba(160, 205, 255, 0.9));
}

.hero-bflies .fb svg {
  width: 100%;
  height: 100%;
}

.hero-bflies .fb .wing {
  transform-origin: 22px 22px;
  animation: wing-idle 3.6s ease-in-out infinite;
}

.hero-bflies .fb .wing.r {
  animation-delay: 0.1s;
}

.hero-bflies .fb1 {
  left: 16%;
  top: 30%;
  animation: path-1 17s ease-in-out infinite;
}

.hero-bflies .fb2 {
  left: 38%;
  top: 62%;
  width: 22px;
  height: 19px;
  animation: path-2 21s ease-in-out infinite;
  animation-delay: -4s;
}

.hero-bflies .fb3 {
  left: 56%;
  top: 18%;
  width: 27px;
  height: 24px;
  animation: path-3 25s ease-in-out infinite;
  animation-delay: -9s;
}

.hero-bflies .fb4 {
  left: 74%;
  top: 52%;
  width: 19px;
  height: 17px;
  animation: path-2 19s ease-in-out infinite;
  animation-delay: -13s;
}

.hero-bflies .fb5 {
  left: 88%;
  top: 32%;
  width: 24px;
  height: 21px;
  animation: path-1 23s ease-in-out infinite;
  animation-delay: -6s;
}

@keyframes path-1 {
  0%,
  100% {
    transform: translate3d(0, 0, 0) rotate(-6deg);
  }

  25% {
    transform: translate3d(46px, -32px, 0) rotate(8deg);
  }

  50% {
    transform: translate3d(96px, 10px, 0) rotate(-4deg);
  }

  75% {
    transform: translate3d(38px, 42px, 0) rotate(9deg);
  }
}

@keyframes path-2 {
  0%,
  100% {
    transform: translate3d(0, 0, 0) rotate(5deg);
  }

  33% {
    transform: translate3d(-42px, -26px, 0) rotate(-7deg);
  }

  66% {
    transform: translate3d(-78px, 22px, 0) rotate(6deg);
  }
}

@keyframes path-3 {
  0%,
  100% {
    transform: translate3d(0, 0, 0) rotate(-3deg);
  }

  30% {
    transform: translate3d(58px, 30px, 0) rotate(7deg);
  }

  60% {
    transform: translate3d(-30px, 56px, 0) rotate(-8deg);
  }
}

/* ---------- 响应式 ---------- */
@media (max-width: 1080px) {
  .hero {
    min-height: clamp(400px, 44vw, 530px);
  }

  .hero-inner {
    padding: 34px 0 26px;
  }

  .hero-copy {
    width: min(58%, 470px);
    padding-left: 18px;
  }

  .hero-title {
    font-size: clamp(46px, 7vw, 88px);
  }

  .hero-eyebrow {
    margin-bottom: 8px;
  }

  .hero-quote {
    font-size: clamp(17px, 2vw, 21px);
    margin: 16px 0 20px;
  }

  .hero-cta {
    gap: 10px;
  }

  .btn {
    height: 48px;
    padding: 0 22px;
    font-size: 14.5px;
  }

  .btn-play {
    width: 32px;
    height: 32px;
  }

  .hero-sign {
    bottom: 30px;
  }
}

@media (max-width: 860px) {
  .hero {
    min-height: 0;
    height: calc(54px + clamp(190px, 61vw, 290px));
    border-bottom: 0;
  }

  .hero-art {
    inset: 0;
    width: 100%;
    height: 100%;
    object-position: 50% 24%;
    animation: kenburns-m 26s ease-in-out infinite alternate;
  }

  @keyframes kenburns-m {
    from {
      transform: scale(1.03);
    }

    to {
      transform: scale(1.1) translate3d(1.4%, 1.2%, 0);
    }
  }

  .hero::before {
    background:
      linear-gradient(
        90deg,
        rgba(4, 10, 22, 0.66) 0%,
        rgba(4, 10, 22, 0.3) 30%,
        rgba(4, 10, 22, 0.02) 58%,
        rgba(4, 10, 22, 0.12) 100%
      ),
      linear-gradient(
        180deg,
        rgba(5, 12, 26, 0.6) 0%,
        rgba(5, 12, 26, 0.1) 20%,
        transparent 42%,
        rgba(5, 11, 24, 0.14) 74%,
        rgba(5, 11, 24, 0.66) 100%
      );
  }

  .hero::after {
    display: none;
  }

  .hero-inner {
    height: 100%;
    align-items: flex-start;
    padding: 80px 18px 0;
  }

  .hero-copy {
    width: min(74%, 286px);
    padding-left: 0;
  }

  .hero-eyebrow {
    display: none;
  }

  .hero-title {
    display: none;
  }

  .hero-cn {
    margin: 0;
    font-size: clamp(28px, 8vw, 34px);
    line-height: 1.1;
    letter-spacing: 0.14em;
    text-shadow:
      0 2px 26px rgba(4, 12, 26, 0.8),
      0 0 34px rgba(150, 195, 255, 0.5);
  }

  .hero-cn::before {
    content: '';
    display: block;
    width: 24px;
    height: 21px;
    margin: 0 0 3px 3px;
    background: currentColor;
    opacity: 0.95;
    -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 44 40'%3E%3Cpath d='M21.4 20.6C17 12 9.6 7.4 5.9 10.9 2.5 14.1 6.2 20.4 16.1 21.6 8 22.9 6 29.4 9.7 32.2c3.6 2.8 8.6-2.4 11.7-10.1 3.1 7.7 8.1 12.9 11.7 10.1 3.7-2.8 1.7-9.3-6.4-10.6 9.9-1.2 13.6-7.5 10.2-10.7-3.7-3.5-11.1 1.1-15.5 9.7Z'/%3E%3C/svg%3E")
      center/contain no-repeat;
    mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 44 40'%3E%3Cpath d='M21.4 20.6C17 12 9.6 7.4 5.9 10.9 2.5 14.1 6.2 20.4 16.1 21.6 8 22.9 6 29.4 9.7 32.2c3.6 2.8 8.6-2.4 11.7-10.1 3.1 7.7 8.1 12.9 11.7 10.1 3.7-2.8 1.7-9.3-6.4-10.6 9.9-1.2 13.6-7.5 10.2-10.7-3.7-3.5-11.1 1.1-15.5 9.7Z'/%3E%3C/svg%3E")
      center/contain no-repeat;
    animation: float-y 6s ease-in-out infinite;
  }

  .hero-en {
    display: none;
  }

  .hero-quote {
    position: relative;
    margin: 10px 0 0;
    font-size: 16.5px;
    line-height: 1.55;
    letter-spacing: 0.03em;
    max-width: 230px;
    text-shadow: 0 2px 12px rgba(4, 12, 26, 0.9);
  }

  .hero-quote .d-only {
    display: none;
  }

  .hero-quote .m-only {
    display: block;
  }

  .hero-quote em {
    padding-left: 1.4em;
  }

  .hero-quote::after {
    content: '';
    position: absolute;
    right: 0;
    bottom: -13px;
    width: 64px;
    height: 9px;
    background: currentColor;
    opacity: 0.85;
    -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 74 10'%3E%3Cpath d='M1 6c14-4 27-5 40-3 9 1 18 3 32 1' fill='none' stroke='%23000' stroke-width='1.6' stroke-linecap='round'/%3E%3C/svg%3E")
      center/contain no-repeat;
    mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 74 10'%3E%3Cpath d='M1 6c14-4 27-5 40-3 9 1 18 3 32 1' fill='none' stroke='%23000' stroke-width='1.6' stroke-linecap='round'/%3E%3C/svg%3E")
      center/contain no-repeat;
  }

  .hero-cta {
    display: none;
  }

  .hero-sign {
    right: 16px;
    bottom: 26px;
  }

  .hero-sign b {
    display: none;
  }

  .hero-sign i {
    font-size: 22px;
  }

  .hero-sign::after {
    display: none;
  }

  .hero-bflies .fb {
    width: 24px;
    height: 21px;
  }

  .hero-bflies .fb2,
  .hero-bflies .fb4 {
    width: 15px;
    height: 13px;
  }
}

@media (max-width: 360px) {
  .hero-cn {
    font-size: 30px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-title,
  .hero-cn,
  .hero-en,
  .hero-quote,
  .hero-cta,
  .hero-eyebrow,
  .hero-sign {
    opacity: 1;
  }
}
</style>
