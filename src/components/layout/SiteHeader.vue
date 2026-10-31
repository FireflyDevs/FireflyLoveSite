<script setup lang="ts">
/**
 * 站点顶栏
 *
 * 结构、类名与样式逐字移植自 `1.html` 的 `.site-header` 段，几何图形改用
 * `@/components/icons` 中已拆出的图标组件。行内 SVG 只保留两处纯装饰元素
 * （品牌印记里的蝴蝶 + 触角），它们与父级尺寸绑定，
 * 抽取成组件反而增加耦合。
 *
 * 滚动状态：页面向下滚动超过阈值后加 `is-scrolled`，切换顶栏背景与投影
 * （原稿行为，仅桌面端有可见差异）。
 */
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

import {
  IconButterfly,
  IconGithub,
  IconHome,
  IconMenu,
  IconSearch,
  IconTheme,
  IconVideo,
} from '@/components/icons'

/** 触发 `is-scrolled` 的滚动距离（px） */
const SCROLL_THRESHOLD = 12

/** 顶栏是否已滚离顶部 */
const scrolled = ref(false)

/** 同步滚动状态 */
const syncScrolled = (): void => {
  scrolled.value = window.scrollY > SCROLL_THRESHOLD
}

onMounted(() => {
  syncScrolled()
  window.addEventListener('scroll', syncScrolled, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', syncScrolled)
})

/* ---------- 小屏汉堡菜单 ---------- */

/** 移动端菜单是否展开 */
const menuOpen = ref(false)

/** 汉堡按钮与其面板的整体容器，用于判断点击是否落在外部 */
const menuRoot = ref<HTMLElement | null>(null)

/** 切换菜单展开状态 */
const toggleMenu = (): void => {
  menuOpen.value = !menuOpen.value
}

/** 关闭菜单 */
const closeMenu = (): void => {
  menuOpen.value = false
}

/**
 * 点击菜单与汉堡之外的位置时收起。
 *
 * 用 `pointerdown` 而非 `click`：手指按下即收起，比等 click 更跟手，
 * 也不会因为拖动手势误触发。汉堡自身在 `menuRoot` 内，不会被当成外部。
 */
const onDocumentPointerDown = (event: PointerEvent): void => {
  if (!menuOpen.value) return
  const target = event.target
  if (target instanceof Node && menuRoot.value?.contains(target)) return
  closeMenu()
}

// 菜单展开时才挂文档监听，收起后立即摘除，避免常驻全局事件
watch(menuOpen, (open) => {
  if (open) {
    document.addEventListener('pointerdown', onDocumentPointerDown)
  } else {
    document.removeEventListener('pointerdown', onDocumentPointerDown)
  }
})

// 组件卸载时兜底清理
onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onDocumentPointerDown)
})

/**
 * 桌面导航项。
 *
 * 顺序与原稿一致：首页 · 角色介绍 · 图集 · 视频 · 资料库。
 * `to` 为站内路由；未标 `to` 的项还没有页面，仍走原稿的 `data-modal` 弹窗，
 * 等对应视图落地后补上路由即可。
 */
interface NavItem {
  label: string
  icon?: 'home' | 'video'
  to?: string
}

const navItems: NavItem[] = [
  { label: '首页', icon: 'home', to: '/' },
  { label: '角色介绍', to: '/characters' },
  { label: '图集', to: '/gallery' },
  { label: '视频', icon: 'video', to: '/videos' },
  { label: '资料库', to: '/library' },
]
</script>

<template>
  <header class="site-header" :class="{ 'is-scrolled': scrolled }">
    <div class="shell header-inner">
      <!-- 品牌：蝴蝶印记 + 双行字标 -->
      <button class="brand" type="button" data-modal aria-label="流萤.love 关于本站">
        <span class="brand-mark" aria-hidden="true">
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
            <path
              d="M20.4 16.2c-1-2-2.6-3.6-4.3-4.6m7.9 4.6c1-2 2.6-3.6 4.3-4.6"
              fill="none"
              stroke="currentColor"
              stroke-width="1.1"
              stroke-linecap="round"
            />
          </svg>
        </span>
        <span class="brand-text">
          <span class="brand-name">Firefly</span>
          <span class="brand-sub">Honkai: Star Rail</span>
        </span>
      </button>

      <!-- 桌面主导航 -->
      <nav class="main-nav" aria-label="主导航">
        <template v-for="item in navItems" :key="item.label">
          <RouterLink v-if="item.to" class="nav-link" :to="item.to">
            <IconHome v-if="item.icon === 'home'" :size="17" />
            <IconVideo v-else-if="item.icon === 'video'" :size="17" />
            {{ item.label }}
          </RouterLink>
          <button v-else class="nav-link" type="button" data-modal>
            <IconHome v-if="item.icon === 'home'" :size="17" />
            <IconVideo v-else-if="item.icon === 'video'" :size="17" />
            {{ item.label }}
          </button>
        </template>
      </nav>

      <!-- 桌面右侧操作区 -->
      <div class="header-actions">
        <button class="search-pill" type="button" data-modal aria-label="搜索">
          <IconSearch :size="17" />
          <span>搜索...</span>
        </button>

        <button
          class="icon-btn sun"
          type="button"
          data-modal
          aria-label="切换主题"
          title="切换主题"
        >
          <IconTheme :size="21" />
        </button>

        <a
          class="icon-btn github github-btn"
          href="https://github.com/FireflyDevs"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub · FireflyDevs"
          title="GitHub · FireflyDevs"
        >
          <IconGithub :size="22" />
        </a>

        <button
          class="icon-btn bfly"
          type="button"
          data-modal
          aria-label="流萤主题"
          title="流萤主题"
        >
          <IconButterfly :size="21" />
        </button>
      </div>

      <!-- 移动端操作区：只保留汉堡菜单 -->
      <div class="mobile-only-actions">
        <!-- 汉堡菜单：按钮与面板放在同一容器里，便于判定「点击外部」 -->
        <div ref="menuRoot" class="menu-wrap">
          <button
            class="icon-btn menu-btn"
            :class="{ 'is-open': menuOpen }"
            type="button"
            :aria-label="menuOpen ? '关闭菜单' : '打开菜单'"
            :aria-expanded="menuOpen"
            aria-controls="mobile-menu"
            @click="toggleMenu"
          >
            <IconMenu :size="21" />
          </button>

          <Transition name="menu-fade">
            <nav v-show="menuOpen" id="mobile-menu" class="mobile-menu" aria-label="移动端导航">
              <RouterLink
                v-for="item in navItems"
                :key="item.label"
                class="mobile-menu-link"
                :to="item.to ?? '/'"
                @click="closeMenu"
              >
                <span v-if="item.icon" class="menu-ico" aria-hidden="true">
                  <IconHome v-if="item.icon === 'home'" :size="18" />
                  <IconVideo v-else-if="item.icon === 'video'" :size="18" />
                </span>
                <span class="menu-label">{{ item.label }}</span>
              </RouterLink>
            </nav>
          </Transition>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
/* 顶栏骨架：吸顶 + 毛玻璃，滚动后加深 */
.site-header {
  position: sticky;
  top: 0;
  z-index: 60;
  background: linear-gradient(180deg, rgba(5, 12, 26, 0.94), rgba(5, 12, 26, 0.78));
  backdrop-filter: blur(18px) saturate(140%);
  -webkit-backdrop-filter: blur(18px) saturate(140%);
  border-bottom: 1px solid rgba(150, 190, 245, 0.14);
  transition:
    background 0.3s ease,
    border-color 0.3s ease,
    box-shadow 0.3s ease;
}

.site-header.is-scrolled {
  background: linear-gradient(180deg, rgba(4, 10, 22, 0.97), rgba(4, 10, 22, 0.9));
  border-color: rgba(150, 190, 245, 0.24);
  box-shadow: 0 12px 34px rgba(0, 0, 0, 0.45);
}

.header-inner {
  display: flex;
  align-items: center;
  gap: clamp(14px, 2vw, 34px);
  height: var(--header-h);
}

/* ---------- 品牌 ---------- */
.brand {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 6px 4px;
  cursor: pointer;
  border-radius: 12px;
  transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.brand:hover {
  transform: translateY(-1px);
}

.brand-mark {
  position: relative;
  width: 38px;
  height: 38px;
  flex: none;
  color: #dfeaff;
  filter: drop-shadow(0 0 10px rgba(160, 200, 255, 0.6));
}

.brand-mark svg {
  width: 100%;
  height: 100%;
}

/* 扇翼待机：偶尔轻颤一下；悬停时连扇两下 */
.brand-mark .wing {
  transform-origin: 22px 22px;
  animation: wing-idle 5.2s ease-in-out infinite;
}

.brand-mark .wing.r {
  animation-delay: 0.16s;
}

@keyframes wing-idle {
  0%,
  72%,
  100% {
    transform: scaleX(1);
  }

  82% {
    transform: scaleX(0.72);
  }

  90% {
    transform: scaleX(0.94);
  }
}

.brand:hover .wing {
  animation: wing-flap 0.5s ease-in-out 2;
}

@keyframes wing-flap {
  0%,
  100% {
    transform: scaleX(1);
  }

  50% {
    transform: scaleX(0.55);
  }
}

.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1;
}

.brand-name {
  font-family: var(--f-script);
  font-size: 31px;
  line-height: 0.92;
  color: #f2f7ff;
  text-shadow: 0 0 22px rgba(168, 205, 255, 0.55);
}

.brand-sub {
  margin-top: 3px;
  font-family: var(--f-display);
  font-style: italic;
  font-size: 9.5px;
  letter-spacing: 0.14em;
  color: #9fb4d6;
  white-space: nowrap;
}

/* ---------- 主导航 ---------- */
.main-nav {
  display: flex;
  align-items: stretch;
  justify-content: center;
  flex: 1;
  height: var(--header-h);
  gap: 2px;
}

.nav-link {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  cursor: pointer;
  padding: 0 clamp(10px, 1.35vw, 22px);
  height: 100%;
  color: #c6d6ee;
  font-size: 15px;
  letter-spacing: 0.02em;
  transition:
    color 0.24s ease,
    background 0.24s ease,
    text-shadow 0.24s ease;
}

.nav-link > svg {
  width: 17px;
  height: 17px;
  opacity: 0.9;
  transition: transform 0.24s ease;
}

.nav-link:hover {
  color: #fff;
  text-shadow: 0 0 14px rgba(180, 215, 255, 0.6);
}

.nav-link:hover > svg {
  transform: translateY(-1px) scale(1.08);
}

/* 底部光带：悬停淡入、选中共亮 */
.nav-link::after {
  content: '';
  position: absolute;
  left: 12px;
  right: 12px;
  bottom: 0;
  height: 2px;
  border-radius: 2px;
  background: linear-gradient(90deg, transparent, #dbeaff 20%, #fff 50%, #dbeaff 80%, transparent);
  box-shadow: 0 0 16px rgba(160, 205, 255, 0.9);
  transform: scaleX(0);
  transform-origin: 50% 50%;
  opacity: 0;
  transition:
    transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1),
    opacity 0.3s;
}

.nav-link:hover::after {
  transform: scaleX(0.55);
  opacity: 0.5;
}

/* 选中态：RouterLink 会加 router-link-active，两者共用一套样式 */
.nav-link.active,
.nav-link.router-link-active {
  color: #fff;
}

.nav-link.active::after,
.nav-link.router-link-active::after {
  transform: scaleX(1);
  opacity: 1;
}

/* 相邻导航项之间的星芒分隔符 */
.nav-link + .nav-link::before {
  content: '✦';
  position: absolute;
  left: -4px;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 8px;
  color: rgba(190, 218, 255, 0.42);
  text-shadow: 0 0 8px rgba(160, 205, 255, 0.6);
  pointer-events: none;
}

/* ---------- 右侧操作区 ---------- */
.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* 搜索胶囊：悬停时加宽并高亮 */
.search-pill {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 210px;
  height: 38px;
  padding: 0 8px 0 15px;
  border: 1px solid rgba(150, 185, 235, 0.42);
  border-radius: 999px;
  background: rgba(11, 23, 44, 0.5);
  color: #9db1d0;
  cursor: pointer;
  overflow: hidden;
  transition:
    width 0.34s cubic-bezier(0.2, 0.8, 0.2, 1),
    border-color 0.24s,
    background 0.24s,
    box-shadow 0.24s;
}

.search-pill:hover {
  width: 246px;
  border-color: rgba(190, 218, 255, 0.75);
  background: rgba(18, 36, 66, 0.62);
  box-shadow: 0 0 22px rgba(120, 170, 240, 0.22);
}

.search-pill > svg {
  width: 17px;
  height: 17px;
  flex: none;
  transition: transform 0.3s;
}

.search-pill:hover > svg {
  transform: scale(1.08);
}

.search-pill span {
  flex: 1;
  font-size: 13px;
  letter-spacing: 0.04em;
  text-align: left;
}

/* 圆形图标按钮：悬停浮起并浮现光晕 */
.icon-btn {
  position: relative;
  width: 40px;
  height: 40px;
  flex: none;
  display: grid;
  place-items: center;
  border-radius: 50%;
  color: #d9e8ff;
  cursor: pointer;
  overflow: hidden;
  transition:
    transform 0.24s cubic-bezier(0.2, 0.8, 0.2, 1),
    background 0.24s,
    color 0.24s;
}

.icon-btn svg {
  width: 21px;
  height: 21px;
  position: relative;
}

.icon-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: rgba(150, 195, 255, 0.13);
  transform: scale(0.4);
  opacity: 0;
  transition:
    transform 0.28s cubic-bezier(0.2, 0.8, 0.2, 1),
    opacity 0.28s;
}

.icon-btn:hover::before {
  transform: scale(1);
  opacity: 1;
}

.icon-btn:hover {
  color: #fff;
  transform: translateY(-2px);
}

/* 太阳：暖色发光，悬停慢速自转 */
.icon-btn.sun {
  color: #ffdca6;
  filter: drop-shadow(0 0 8px rgba(255, 205, 130, 0.55));
}

.icon-btn.sun:hover svg {
  animation: spin-slow 3.6s linear infinite;
}

@keyframes spin-slow {
  to {
    transform: rotate(360deg);
  }
}

.icon-btn.github {
  color: #dbe8fb;
}

.icon-btn.github svg {
  width: 22px;
  height: 22px;
}

.icon-btn.github:hover {
  color: #fff;
}

.icon-btn.github:hover::before {
  background: rgba(190, 220, 255, 0.2);
}

/* 蝴蝶：冷色辉光，悬停轻摆 */
.icon-btn.bfly {
  color: #cfe4ff;
  filter: drop-shadow(0 0 10px rgba(150, 195, 255, 0.66));
}

.icon-btn.bfly:hover svg {
  animation: bfly-bob 1s ease-in-out infinite;
}

@keyframes bfly-bob {
  0%,
  100% {
    transform: translateY(0) rotate(-4deg);
  }

  50% {
    transform: translateY(-3px) rotate(4deg);
  }
}

/* 默认隐藏，860px 以下替换掉桌面导航 */
.mobile-only-actions {
  display: none;
}

/* ---------- 小屏汉堡菜单 ---------- */

/* 汉堡按钮与面板的共同定位上下文 */
.menu-wrap {
  position: relative;
  display: flex;
}

/* 展开时汉堡微微发光，作为「已打开」的反馈 */
.icon-btn.menu-btn.is-open {
  color: #fff;
}

.icon-btn.menu-btn.is-open::before {
  transform: scale(1);
  opacity: 1;
}

/* 下拉面板：从顶栏下方展开，右对齐汉堡按钮 */
.mobile-menu {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  z-index: 70;
  display: flex;
  flex-direction: column;
  /* 与小屏可用宽度留出余量，标题长也不再挤爆 */
  min-width: 184px;
  padding: 6px;
  border: 1px solid rgba(150, 190, 245, 0.24);
  border-radius: 14px;
  background: linear-gradient(180deg, rgba(8, 18, 36, 0.98), rgba(5, 12, 26, 0.96));
  box-shadow:
    0 18px 40px rgba(0, 0, 0, 0.55),
    0 0 24px rgba(120, 170, 240, 0.16);
  backdrop-filter: blur(18px) saturate(140%);
  -webkit-backdrop-filter: blur(18px) saturate(140%);
}

.mobile-menu-link {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  /* 44px 触控高度，符合移动端最小可点区域 */
  min-height: 44px;
  padding: 0 12px;
  border-radius: 10px;
  color: #c6d6ee;
  font-size: 14.5px;
  letter-spacing: 0.02em;
  white-space: nowrap;
  transition:
    color 0.2s ease,
    background 0.2s ease;
}

.mobile-menu-link:hover {
  color: #fff;
  background: rgba(150, 195, 255, 0.12);
}

/* 图标槽位固定 18px，避免有无图标时行高跳动 */
.menu-ico {
  display: grid;
  place-items: center;
  width: 18px;
  height: 18px;
  flex: none;
}

.menu-label {
  flex: 1;
}

/* 当前页：左侧光条 + 高亮 */
.mobile-menu-link.router-link-active {
  color: #fff;
  background: rgba(150, 195, 255, 0.16);
  box-shadow: inset 2px 0 0 rgba(219, 234, 255, 0.9);
}

/* 相邻项之间一道极淡分隔，替代原稿的 ✦ 星芒（小屏空间有限）。
   用伪元素做成隔行缩进的效果，高亮时自动隐藏，不打断选中块的圆角 */
.mobile-menu-link + .mobile-menu-link::before {
  content: '';
  position: absolute;
  left: 12px;
  right: 12px;
  top: 0;
  height: 1px;
  background: rgba(150, 190, 245, 0.12);
}

.mobile-menu-link + .mobile-menu-link.router-link-active::before {
  opacity: 0;
}

/* 展开/收起过渡 */
.menu-fade-enter-active,
.menu-fade-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.menu-fade-enter-from,
.menu-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* 桌面端不显示移动端操作区，其内部菜单自然也不出现 */
@media (min-width: 861px) {
  .mobile-menu {
    display: none;
  }
}

/* ---------- 响应式 ---------- */
@media (max-width: 1240px) {
  .search-pill {
    width: 170px;
  }

  .search-pill:hover {
    width: 200px;
  }

  .brand-name {
    font-size: 28px;
  }
}

/* 中等宽度先撤掉 GitHub，给导航让位 */
@media (max-width: 980px) {
  .header-actions .github-btn {
    display: none;
  }
}

/* 窄屏：顶栏改 fixed 浮层，只留品牌 + 三个图标 */
@media (max-width: 860px) {
  .site-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: linear-gradient(
      180deg,
      rgba(5, 12, 26, 0.86),
      rgba(5, 12, 26, 0.5) 70%,
      transparent
    );
    border-bottom: 0;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }

  .site-header.is-scrolled {
    background: linear-gradient(180deg, rgba(4, 10, 22, 0.96), rgba(4, 10, 22, 0.86));
    border-bottom: 1px solid rgba(150, 190, 245, 0.16);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
  }

  .header-inner {
    height: 54px;
    padding: 0 13px;
    gap: 6px;
  }

  .brand {
    gap: 9px;
  }

  .brand-mark {
    width: 27px;
    height: 27px;
  }

  .brand-name {
    font-size: 23px;
  }

  .brand-sub {
    font-size: 8px;
    letter-spacing: 0.1em;
    margin-top: 2px;
  }

  .main-nav {
    display: none;
  }

  /* 桌面操作区整体撤下：原本只隐藏了 search-pill 与 sun，导致 .bfly
     孤立残留在小屏顶栏里（原稿亦如此），这里连容器一并隐藏 */
  .header-actions {
    display: none;
  }

  .search-pill {
    display: none;
  }

  .icon-btn.sun {
    display: none;
  }

  .mobile-only-actions {
    display: flex;
    align-items: center;
    gap: 2px;
    margin-left: auto;
  }

  .icon-btn {
    width: 34px;
    height: 34px;
  }

  .icon-btn svg {
    width: 21px;
    height: 21px;
  }
}
</style>
