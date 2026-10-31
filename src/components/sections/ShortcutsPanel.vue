<script setup lang="ts">
/**
 * 快捷入口栏
 *
 * 结构、类名与样式移植自 `1.html` 的 `.shortcuts` 段（`1.html:3451-3596`）。
 * 包含 4 个常驻入口 + 1 个移动端专属入口（周边推荐）+ 1 个桌面端 mini-banner。
 *
 * 交互：
 * - 涟漪：`useRipple`
 * - 入场：`useReveal`（由 HomeView 统一传入）
 */
import { ref } from 'vue'

import chibiUrl from '@/assets/ff/chibi.jpg'
import IconArrow from '@/components/icons/IconArrow.vue'
import IconBook from '@/components/icons/IconBook.vue'
import IconButterfly from '@/components/icons/IconButterfly.vue'
import IconImage from '@/components/icons/IconImage.vue'
import IconLink from '@/components/icons/IconLink.vue'
import IconStar from '@/components/icons/IconStar.vue'
import IconVideo from '@/components/icons/IconVideo.vue'
import { useReducedMotion } from '@/composables/useReducedMotion'
import { useRipple } from '@/composables/useRipple'

/** 降低动效偏好 */
const prefersReducedMotion = useReducedMotion()
const shouldSkip = (): boolean => prefersReducedMotion.value

/** 面板宿主 */
const shortcutsRef = ref<HTMLElement | null>(null)

/** 对外暴露面板 ref，供 HomeView 统一执行 reveal 入场动画 */
defineExpose({ root: shortcutsRef })

/** 快捷入口数据（移植自 1.html:3452-3584） */
interface QuickLink {
  /** 唯一 key */
  key: string
  /** 图标组件名（用于动态 component） */
  icon: 'book' | 'image' | 'video' | 'star' | 'link'
  /** 图标变体 */
  iconVariant?: 'normal' | 'solid'
  /** 主标题 */
  title: string
  /** 副标题 */
  subtitle: string
  /** 是否移动端专属 */
  onlyMobile?: boolean
  /** 链接地址（为 undefined 时渲染为 button） */
  href?: string
}

const quickLinks: QuickLink[] = [
  { key: 'profile', icon: 'book', title: '角色资料', subtitle: '详细的角色信息与设定' },
  {
    key: 'wallpaper',
    icon: 'image',
    title: '图片壁纸',
    subtitle: '高清壁纸 · 同人图 · 插画',
    href: '/img/',
  },
  {
    key: 'video',
    icon: 'video',
    iconVariant: 'solid',
    title: '视频剪辑',
    subtitle: 'PV · 混剪 · 剧情向',
  },
  { key: 'fanart', icon: 'star', title: '同人创作', subtitle: '优秀的同人作品精选' },
  {
    key: 'goods',
    icon: 'link',
    title: '周边推荐',
    subtitle: '精选周边与联名好物',
    onlyMobile: true,
  },
]

/** 图标组件映射 */
const iconComponents = {
  book: IconBook,
  image: IconImage,
  video: IconVideo,
  star: IconStar,
  link: IconLink,
} as const

/** mini-banner 涟漪 */
const miniBannerRef = ref<HTMLElement | null>(null)
const onMiniBannerPointerDown = useRipple(miniBannerRef, shouldSkip)

/** 快捷入口涟漪处理器（与 NewsPanel 相同策略） */
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

/** 快捷入口涟漪处理器缓存 */
const rippleHandlers = new WeakMap<HTMLElement, (event: PointerEvent) => void>()

/** 快捷入口 pointerdown 入口 */
const onQuickPointerDown = (event: PointerEvent): void => {
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
  <aside ref="shortcutsRef" class="shortcuts reveal" aria-label="快捷入口">
    <component
      :is="link.href ? 'a' : 'button'"
      v-for="link in quickLinks"
      :key="link.key"
      class="quick"
      :class="{ 'only-mobile': link.onlyMobile }"
      :type="link.href ? undefined : 'button'"
      :href="link.href"
      :target="link.href ? '_blank' : undefined"
      :rel="link.href ? 'noopener' : undefined"
      :data-modal="!link.href"
      @pointerdown="onQuickPointerDown"
    >
      <span class="quick-ico" aria-hidden="true">
        <component :is="iconComponents[link.icon]" :variant="link.iconVariant" />
      </span>
      <span class="quick-txt">
        <b>
          <template v-if="link.key === 'wallpaper'">
            <span class="d-only">图片壁纸</span><span class="m-only">高清壁纸</span>
          </template>
          <template v-else>{{ link.title }}</template>
        </b>
        <small>{{ link.subtitle }}</small>
      </span>
      <span class="quick-go" aria-hidden="true">
        <IconArrow />
      </span>
    </component>

    <button
      ref="miniBannerRef"
      class="mini-banner d-only"
      type="button"
      data-modal
      @pointerdown="onMiniBannerPointerDown"
    >
      <span class="mini-copy">和流萤<i>♥</i><em>一起看星星吧！</em></span>
      <span class="mini-art" aria-hidden="true">
        <img :src="chibiUrl" alt="" loading="lazy" decoding="async" />
      </span>
      <IconButterfly class="bfly-corner" variant="ico" />
    </button>
  </aside>
</template>

<style scoped>
/* ============================================================
   快捷入口 —— 移植自 1.html:1442-1664
   关键帧改为 kebab-case。
   ============================================================ */

.shortcuts {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.quick {
  position: relative;
  display: flex;
  align-items: center;
  gap: 14px;
  min-height: 69px;
  padding: 9px 16px;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 13px;
  cursor: pointer;
  text-align: left;
  color: inherit;
  background: linear-gradient(104deg, rgba(23, 42, 73, 0.9), rgba(11, 25, 47, 0.86));
  transition:
    transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1),
    border-color 0.3s,
    box-shadow 0.3s;
}

.quick::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(180deg, transparent, #bcdcff, transparent);
  opacity: 0;
  transition: opacity 0.3s;
}

.quick::after {
  content: '';
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.4s;
  pointer-events: none;
  background: linear-gradient(
    100deg,
    transparent 30%,
    rgba(150, 195, 255, 0.14) 50%,
    transparent 70%
  );
  background-size: 250% 100%;
  background-position: 130% 0;
}

.quick:hover {
  transform: translateX(5px);
  border-color: var(--line-2);
  box-shadow:
    0 10px 26px rgba(0, 0, 0, 0.3),
    0 0 22px rgba(120, 170, 240, 0.18);
}

.quick:hover::before {
  opacity: 1;
}

.quick:hover::after {
  opacity: 1;
  background-position: -30% 0;
  transition:
    background-position 0.9s ease,
    opacity 0.4s;
}

.quick-ico {
  position: relative;
  width: 38px;
  height: 38px;
  flex: none;
  display: grid;
  place-items: center;
  border-radius: 11px;
  color: #dcecff;
  border: 1px solid rgba(170, 205, 255, 0.2);
  background: rgba(150, 195, 255, 0.09);
  transition:
    transform 0.34s cubic-bezier(0.2, 0.8, 0.2, 1),
    background 0.3s,
    border-color 0.3s;
}

.quick-ico svg {
  width: 21px;
  height: 21px;
}

.quick:hover .quick-ico {
  transform: translateY(-3px) rotate(-6deg) scale(1.06);
  background: rgba(150, 195, 255, 0.2);
  border-color: rgba(200, 228, 255, 0.5);
}

.quick-txt {
  min-width: 0;
  flex: 1;
}

.quick-txt b {
  display: block;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.03em;
  color: #eef5ff;
}

.quick-txt small {
  display: block;
  margin-top: 3px;
  font-size: 12px;
  color: #8ea4c6;
  transition: color 0.3s;
}

.quick:hover .quick-txt small {
  color: #a9c1e2;
}

.quick-go {
  color: #9fb9dd;
  flex: none;
  transition:
    transform 0.34s cubic-bezier(0.2, 0.8, 0.2, 1),
    color 0.3s;
}

.quick-go svg {
  width: 17px;
  height: 17px;
}

.quick:hover .quick-go {
  transform: translateX(4px);
  color: #eaf4ff;
}

.quick.only-mobile {
  display: none;
}

/* ---------- mini-banner ---------- */
.mini-banner {
  position: relative;
  flex: 1;
  min-height: 96px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 14px;
  overflow: hidden;
  border: 1px solid var(--line-2);
  border-radius: 13px;
  cursor: pointer;
  text-align: left;
  color: inherit;
  background: linear-gradient(
    96deg,
    rgba(13, 28, 52, 0.94) 0%,
    rgba(13, 28, 52, 0.5) 46%,
    rgba(13, 28, 52, 0.22) 100%
  );
  transition:
    transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1),
    border-color 0.3s,
    box-shadow 0.3s;
}

.mini-banner:hover {
  transform: translateY(-3px);
  border-color: var(--line-3);
  box-shadow:
    0 12px 30px rgba(0, 0, 0, 0.34),
    0 0 24px rgba(130, 180, 255, 0.2);
}

.mini-copy {
  position: relative;
  z-index: 2;
  font-family: var(--f-kai);
  font-size: 17px;
  line-height: 1.5;
  color: #f0f6ff;
  text-shadow: 0 1px 10px rgba(0, 0, 0, 0.6);
}

.mini-copy i {
  font-style: normal;
  color: var(--pink);
  font-size: 12px;
  vertical-align: super;
}

.mini-copy em {
  display: block;
  font-style: normal;
  font-size: 15px;
  color: #dbe8fb;
}

.mini-art {
  position: absolute;
  right: 0;
  bottom: 0;
  height: 100%;
  width: 62%;
  pointer-events: none;
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 34%);
  mask-image: linear-gradient(90deg, transparent, #000 34%);
}

.mini-art img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 8% 26%;
  animation: bob-y 4.6s ease-in-out infinite;
}

@keyframes bob-y {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.mini-banner .bfly-corner {
  position: absolute;
  right: 12px;
  top: 9px;
  width: 16px;
  height: 14px;
  color: #dfeaff;
  opacity: 0.85;
  animation: float-y 4s ease-in-out infinite;
}

@keyframes float-y {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

/* ---------- 响应式 ---------- */
@media (max-width: 1080px) {
  .shortcuts {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 10px;
  }

  .quick {
    min-height: 88px;
    flex-direction: column;
    justify-content: center;
    gap: 8px;
    text-align: center;
    padding: 12px 8px;
  }

  .quick-txt small,
  .quick-go {
    display: none;
  }

  .quick:hover {
    transform: translateY(-4px);
  }

  .quick-txt b {
    font-size: 13px;
  }

  .mini-banner {
    min-height: 88px;
  }

  .mini-copy {
    font-size: 14px;
  }

  .mini-copy em {
    font-size: 12.5px;
  }
}

@media (max-width: 860px) {
  .shortcuts {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 6px;
  }

  .quick {
    min-height: 52px;
    flex-direction: column;
    justify-content: center;
    gap: 3px;
    text-align: center;
    padding: 4px 2px;
    border-radius: 12px;
    background: linear-gradient(180deg, rgba(28, 50, 85, 0.9), rgba(12, 26, 49, 0.86));
    box-shadow:
      inset 0 1px 0 rgba(190, 220, 255, 0.14),
      0 8px 20px rgba(0, 0, 0, 0.28);
  }

  .quick:hover {
    transform: translateY(-3px);
  }

  .quick::before {
    width: 100%;
    height: 1px;
    top: 0;
    bottom: auto;
    background: linear-gradient(90deg, transparent, rgba(190, 220, 255, 0.7), transparent);
  }

  .quick-ico {
    width: 24px;
    height: 24px;
    border-radius: 8px;
    background: rgba(150, 195, 255, 0.1);
    border-color: rgba(170, 205, 255, 0.16);
  }

  .quick-ico svg {
    width: 15px;
    height: 15px;
  }

  .quick-txt {
    flex: none;
    width: 100%;
  }

  .quick-txt b {
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .quick-txt small,
  .quick-go {
    display: none;
  }

  .quick.only-mobile {
    display: flex;
  }

  .mini-banner {
    display: none;
  }
}

@media (max-width: 360px) {
  .shortcuts {
    gap: 5px;
  }

  .quick {
    min-height: 52px;
  }

  .quick-ico {
    width: 22px;
    height: 22px;
  }

  .quick-txt b {
    font-size: 9.5px;
  }
}
</style>
