<script setup lang="ts">
/**
 * 最新动态面板
 *
 * 结构、类名与样式移植自 `1.html` 的 `.news-panel` 段（`1.html:3255-3390`）。
 * 三条新闻以数据驱动渲染；标题 / 标签在桌面与移动端显示不同文案（d-only / m-only）。
 *
 * 交互：
 * - 鼠标光斑：`useSpotlight`（依赖宿主上的 `.panel` 样式）
 * - 涟漪：`useRipple`
 * - 入场：`useReveal`（由 HomeView 统一传入）
 */
import { ref } from 'vue'

import thumb1Url from '@/assets/ff/thumb-1.jpg'
import thumb2Url from '@/assets/ff/thumb-2.jpg'
import thumb3Url from '@/assets/ff/thumb-3.jpg'
import IconArrow from '@/components/icons/IconArrow.vue'
import IconButterfly from '@/components/icons/IconButterfly.vue'
import IconChevron from '@/components/icons/IconChevron.vue'
import IconSpark from '@/components/icons/IconSpark.vue'
import { useReducedMotion } from '@/composables/useReducedMotion'
import { useRipple } from '@/composables/useRipple'
import { useSpotlight } from '@/composables/useSpotlight'

/** 单条新闻数据 */
interface NewsItem {
  /** 缩略图 URL */
  thumb: string
  /** 缩略图 alt */
  alt: string
  /** 桌面端标签 */
  tagDesktop: string
  /** 移动端标签 */
  tagMobile: string
  /** 桌面端标题 */
  titleDesktop: string
  /** 移动端标题 */
  titleMobile: string
  /** 描述 */
  desc: string
  /** 日期 */
  date: string
}

/** 降低动效偏好 */
const prefersReducedMotion = useReducedMotion()
const shouldSkip = (): boolean => prefersReducedMotion.value

/** 面板宿主（reveal 入场动画目标） */
const panelRef = ref<HTMLElement | null>(null)
useSpotlight(panelRef)

/** 对外暴露面板 ref，供 HomeView 统一执行 reveal 入场动画 */
defineExpose({ root: panelRef })

/** 涟漪宿主（查看更多按钮） */
const moreRef = ref<HTMLElement | null>(null)
const onMorePointerDown = useRipple(moreRef, shouldSkip)

/** 新闻数据（移植自 1.html:3298-3389） */
const newsList: NewsItem[] = [
  {
    thumb: thumb1Url,
    alt: '流萤 角色故事',
    tagDesktop: '角色故事',
    tagMobile: '官方资讯',
    titleDesktop: '流萤 · 角色故事「未完的旅途」',
    titleMobile: '「流萤」角色 PV · 那片星空下的约定',
    desc: '在那片星空下，流萤依然在寻找着属于自己的答案。',
    date: '2024-06-07',
  },
  {
    thumb: thumb2Url,
    alt: '匹诺康尼特别活动',
    tagDesktop: '活动资讯',
    tagMobile: '壁纸精选',
    titleDesktop: '「匹诺康尼」特别活动 · 流萤相关剧情',
    titleMobile: '流萤 · 高清壁纸合集',
    desc: '与流萤一起，前往那片充满回忆的天空。',
    date: '2024-05-24',
  },
  {
    thumb: thumb3Url,
    alt: '流萤 高清壁纸合集',
    tagDesktop: '图集更新',
    tagMobile: '同人作品',
    titleDesktop: '流萤 · 高清壁纸合集',
    titleMobile: '流萤 × 开拓者 · 「与你的日常」',
    desc: '收录多张官方及同人壁纸，带你感受不同的流萤。',
    date: '2024-05-10',
  },
]

/**
 * 给某个 DOM 元素附加涟漪处理器。
 *
 * 因为 `useRipple` 需要 ref，而 v-for 元素更适合函数式 ref，这里手动
 * 复用涟漪核心逻辑（与 `useRipple` 内部一致：640ms 生命周期、2.1 倍缩放）。
 *
 * @param el 目标元素
 * @returns pointerdown 处理器
 */
const createRippleHandler = (el: HTMLElement | null): ((event: PointerEvent) => void) => {
  return (event: PointerEvent): void => {
    if (shouldSkip() || !el) return

    const rect = el.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height) * 2.1

    if (window.getComputedStyle(el).position === 'static') {
      el.style.position = 'relative'
    }

    const ripple = document.createElement('span')
    ripple.className = 'ripple'
    ripple.style.width = `${size}px`
    ripple.style.height = `${size}px`
    ripple.style.left = `${event.clientX - rect.left}px`
    ripple.style.top = `${event.clientY - rect.top}px`
    el.appendChild(ripple)

    window.setTimeout(() => ripple.remove(), 640)
  }
}

/** 新闻项涟漪处理器缓存 */
const rippleHandlers = new WeakMap<HTMLElement, (event: PointerEvent) => void>()

/** 新闻项 pointerdown 入口 */
const onItemPointerDown = (event: PointerEvent): void => {
  const el = event.currentTarget as HTMLElement
  let handler = rippleHandlers.get(el)
  if (!handler) {
    handler = createRippleHandler(el)
    rippleHandlers.set(el, handler)
  }
  handler(event)
}
</script>

<template>
  <section ref="panelRef" class="panel news-panel reveal" aria-labelledby="news-heading">
    <div class="panel-head">
      <h2 class="panel-title" id="news-heading">
        <IconSpark class="d-only spark" />
        <IconButterfly class="m-only bfly-ico" variant="ico" />
        最新动态
      </h2>
      <button
        ref="moreRef"
        class="more-link"
        type="button"
        data-modal
        @pointerdown="onMorePointerDown"
      >
        查看更多
        <IconArrow />
      </button>
    </div>
    <div class="news-list">
      <button
        v-for="(item, index) in newsList"
        :key="item.date"
        class="news-item"
        type="button"
        data-modal
        @pointerdown="onItemPointerDown"
      >
        <span class="news-thumb">
          <img :src="item.thumb" :alt="item.alt" loading="lazy" decoding="async" />
        </span>
        <span class="news-body">
          <span class="news-tag">
            <span class="d-only">{{ item.tagDesktop }}</span>
            <span class="m-only">{{ item.tagMobile }}</span>
          </span>
          <span class="news-title">
            <span class="d-only">{{ item.titleDesktop }}</span>
            <span class="m-only">{{ item.titleMobile }}</span>
          </span>
          <span class="news-desc">{{ item.desc }}</span>
          <span class="news-date">{{ item.date }}</span>
        </span>
        <span class="news-chev" aria-hidden="true">
          <IconChevron />
        </span>
      </button>
    </div>
  </section>
</template>

<style scoped>
/* ============================================================
   最新动态面板 —— 移植自 1.html:1047-1281
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

.panel-head {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 13px 22px 11px;
}

.panel-title {
  display: flex;
  align-items: center;
  gap: 11px;
  margin: 0;
  font-size: 21px;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: #f0f6ff;
}

.panel-title .spark {
  width: 23px;
  height: 23px;
  color: #eaf4ff;
  filter: drop-shadow(0 0 10px rgba(160, 205, 255, 0.85));
  animation: spark-pulse 3.4s ease-in-out infinite;
}

.panel-title .bfly-ico {
  width: 26px;
  height: 23px;
  color: #eaf4ff;
  filter: drop-shadow(0 0 11px rgba(160, 205, 255, 0.85));
}

@keyframes spark-pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.95;
  }
  50% {
    transform: scale(1.14) rotate(90deg);
    opacity: 1;
  }
}

.more-link {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 5px 4px;
  cursor: pointer;
  color: #a6bcdd;
  font-size: 13.5px;
  letter-spacing: 0.04em;
  transition: color 0.24s;
}

.more-link svg {
  width: 15px;
  height: 15px;
  transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.more-link:hover {
  color: #fff;
}

.more-link:hover svg {
  transform: translateX(5px);
}

.more-link::after {
  content: '';
  position: absolute;
  left: 4px;
  right: 24px;
  bottom: 0;
  height: 1px;
  background: currentColor;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s;
}

.more-link:hover::after {
  transform: scaleX(1);
}

/* ---------- 新闻列表 ---------- */
.news-list {
  position: relative;
  padding: 0 22px 13px;
}

.news-item {
  position: relative;
  width: 100%;
  display: grid;
  grid-template-columns: 168px minmax(0, 1fr);
  gap: 20px;
  align-items: center;
  padding: 6px 4px;
  text-align: left;
  cursor: pointer;
  overflow: hidden;
  border-radius: 12px;
  border-top: 1px solid rgba(150, 190, 245, 0.13);
  transition: background 0.3s ease;
}

.news-item:first-child {
  border-top: 0;
}

.news-item:hover {
  background: rgba(126, 175, 255, 0.055);
}

.news-thumb {
  position: relative;
  width: 100%;
  aspect-ratio: 168/87;
  overflow: hidden;
  border-radius: 11px;
  border: 1px solid rgba(196, 222, 255, 0.34);
  box-shadow:
    0 8px 22px rgba(0, 0, 0, 0.36),
    inset 0 0 22px rgba(120, 170, 240, 0.1);
}

.news-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.news-thumb::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 40%, rgba(6, 14, 28, 0.5));
  opacity: 0;
  transition: opacity 0.4s;
}

.news-item:hover .news-thumb img {
  transform: scale(1.09);
}

.news-item:hover .news-thumb::after {
  opacity: 1;
}

.news-body {
  min-width: 0;
  position: relative;
}

.news-tag {
  display: inline-block;
  margin-bottom: 5px;
  padding: 3px 8px;
  border-radius: 6px;
  line-height: 1.4;
  border: 1px solid rgba(150, 190, 245, 0.2);
  background: rgba(126, 172, 240, 0.15);
  color: #bcd9ff;
  font-size: 11.5px;
  letter-spacing: 0.05em;
  transition:
    background 0.3s,
    border-color 0.3s,
    color 0.3s;
}

.news-item:hover .news-tag {
  background: rgba(146, 190, 250, 0.28);
  border-color: rgba(180, 215, 255, 0.45);
  color: #e6f1ff;
}

.news-title {
  display: block;
  font-size: 15px;
  font-weight: 500;
  line-height: 1.45;
  color: #eef5ff;
  transition:
    color 0.3s,
    transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.news-item:hover .news-title {
  color: #fff;
  transform: translateX(4px);
}

.news-desc {
  display: block;
  margin-top: 3px;
  font-size: 12.5px;
  line-height: 1.5;
  color: #93a8c9;
}

.news-date {
  display: block;
  margin-top: 5px;
  font-size: 12px;
  line-height: 1.4;
  letter-spacing: 0.06em;
  color: #7a90b4;
  font-variant-numeric: tabular-nums;
}

.news-chev {
  display: none;
}

/* ---------- 响应式 ---------- */
@media (max-width: 1240px) {
  .news-item {
    grid-template-columns: 150px minmax(0, 1fr);
    gap: 16px;
  }
}

@media (max-width: 1080px) {
  .news-panel {
    grid-area: news;
  }
}

@media (max-width: 860px) {
  .panel {
    border-radius: 16px;
  }

  .panel-head {
    padding: 10px 14px 6px;
  }

  .panel-title {
    font-size: 16px;
    gap: 7px;
  }

  .panel-title .spark,
  .panel-title .bfly-ico {
    width: 19px;
    height: 18px;
  }

  .more-link {
    font-size: 11.5px;
  }

  .news-list {
    padding: 0 10px 5px;
  }

  .news-item {
    grid-template-columns: 72px minmax(0, 1fr) 11px;
    gap: 9px;
    padding: 2px 2px;
    align-items: center;
  }

  .news-item:hover .news-title {
    transform: none;
  }

  .news-thumb {
    aspect-ratio: 72/48;
    border-radius: 8px;
  }

  .news-tag {
    margin-bottom: 2px;
    padding: 1px 5px;
    font-size: 8.5px;
    line-height: 1.3;
    border-radius: 5px;
  }

  .news-title {
    font-size: 11px;
    line-height: 1.35;
  }

  .news-desc {
    display: none;
  }

  .news-date {
    margin-top: 2px;
    font-size: 9.5px;
    line-height: 1.3;
  }

  .news-chev {
    display: block;
    color: #7f97bb;
    transition:
      transform 0.3s,
      color 0.3s;
  }

  .news-chev svg {
    width: 13px;
    height: 13px;
  }

  .news-item:hover .news-chev {
    transform: translateX(3px);
    color: #dcebff;
  }
}

@media (max-width: 360px) {
  .news-item {
    grid-template-columns: 68px minmax(0, 1fr) 10px;
    gap: 8px;
  }
}
</style>
