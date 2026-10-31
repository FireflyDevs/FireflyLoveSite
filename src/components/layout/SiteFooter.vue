<script setup lang="ts">
/**
 * 站点页脚
 *
 * 结构、类名与样式移植自 `1.html` 的 `.site-footer` 段（`1.html:3617-3666`），
 * 响应式取自 `1.html:2787-2822`。
 *
 * 交互：
 * - 涟漪：`useRipple`（GitHub 是外链 `<a>`，其余是 `data-modal` 按钮）
 * - 未接页面的按钮保留原稿的 `data-modal` 行为，与顶栏一致
 */
import { ref } from 'vue'

import IconButterfly from '@/components/icons/IconButterfly.vue'
import IconGithub from '@/components/icons/IconGithub.vue'
import IconHeart from '@/components/icons/IconHeart.vue'
import IconYoutube from '@/components/icons/IconYoutube.vue'
import { useReducedMotion } from '@/composables/useReducedMotion'
import { useRipple } from '@/composables/useRipple'

/** 降低动效偏好 */
const prefersReducedMotion = useReducedMotion()
const shouldSkip = (): boolean => prefersReducedMotion.value

/** 页脚根节点（涟漪目标，与图集站 .shell 宽度对齐） */
const footerRef = ref<HTMLElement | null>(null)
const onFooterPointerDown = useRipple(footerRef, shouldSkip)
</script>

<template>
  <footer ref="footerRef" class="site-footer" @pointerdown="onFooterPointerDown">
    <div class="shell footer-inner">
      <div class="socials">
        <a
          class="social social-github"
          href="https://github.com/FireflyDevs"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub · FireflyDevs"
          title="GitHub · FireflyDevs"
        >
          <IconGithub />
        </a>
        <button class="social" type="button" data-modal aria-label="Discord">
          <!-- 原稿此处为 Discord 标志，图标库未收录，暂用同尺寸的蝴蝶纹样占位 -->
          <IconButterfly variant="simple" />
        </button>
        <button class="social" type="button" data-modal aria-label="视频">
          <IconYoutube />
        </button>
        <button class="social" type="button" data-modal aria-label="收藏">
          <IconHeart variant="solid" />
        </button>
      </div>
      <p class="footer-note">May this journey lead us to a brighter tomorrow.</p>
      <div class="footer-right">
        <IconButterfly variant="simple" />
        Honkai: Star Rail
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* ============================================================
   页脚 —— 移植自 1.html:1724-1796
   ============================================================ */
.site-footer {
  position: relative;
  z-index: 2;
  margin-top: 0;
  border-top: 1px solid rgba(150, 190, 245, 0.15);
  background: linear-gradient(180deg, rgba(6, 13, 26, 0.4), rgba(5, 11, 22, 0.85));
}

.footer-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 17px 0 19px;
}

.socials {
  display: flex;
  gap: 10px;
}

.social {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  cursor: pointer;
  color: #c3d6f2;
  border: 1px solid rgba(150, 190, 245, 0.22);
  background: rgba(18, 34, 60, 0.6);
  transition:
    transform 0.28s cubic-bezier(0.2, 0.8, 0.2, 1),
    color 0.28s,
    border-color 0.28s,
    background 0.28s,
    box-shadow 0.28s;
}

/* 图标组件根 svg 带 .icon 类，scoped 选择器经 :deep 生效 */
.social :deep(svg) {
  width: 18px;
  height: 18px;
  position: relative;
}

/* 蝴蝶纹样是 44×40 的宽高比，单独收一下宽度 */
.social :deep(.icon-butterfly) {
  width: 19px;
  height: 17px;
}

.social:hover {
  transform: translateY(-3px);
  color: #fff;
  border-color: rgba(200, 228, 255, 0.6);
  background: rgba(120, 168, 240, 0.24);
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.34);
}

.social-github {
  border-color: rgba(180, 212, 255, 0.32);
  color: #e6f0ff;
}

.social-github:hover {
  background: rgba(160, 200, 255, 0.3);
  box-shadow:
    0 10px 24px rgba(0, 0, 0, 0.4),
    0 0 18px rgba(140, 190, 255, 0.4);
}

.footer-note {
  flex: 1;
  text-align: center;
  font-family: var(--f-display);
  font-style: italic;
  font-size: 16px;
  letter-spacing: 0.02em;
  color: #a9bfe0;
}

.footer-note::before,
.footer-note::after {
  content: '✦';
  font-style: normal;
  font-size: 8px;
  color: rgba(180, 210, 255, 0.5);
  vertical-align: middle;
  margin: 0 16px;
}

.footer-right {
  display: flex;
  align-items: center;
  gap: 9px;
  color: #a5bada;
  font-family: var(--f-display);
  font-size: 14px;
  letter-spacing: 0.06em;
}

.footer-right :deep(svg) {
  width: 20px;
  height: 18px;
  color: #cfe0f8;
  filter: drop-shadow(0 0 8px rgba(150, 195, 255, 0.6));
}

/* ---------- 移动端 ---------- */
@media (max-width: 860px) {
  .site-footer {
    margin-top: 0;
  }

  .footer-inner {
    flex-direction: column;
    gap: 0;
    padding: 9px 14px 11px;
    text-align: center;
  }

  .socials {
    display: flex;
    gap: 7px;
    order: 2;
    margin: 1px 0 5px;
  }

  /* 小屏只保留 GitHub 入口 */
  .socials .social:not(.social-github) {
    display: none;
  }

  .footer-right {
    display: none;
  }

  .footer-note {
    font-size: 11.5px;
    line-height: 1.6;
    order: 1;
    color: #8fa5c6;
  }

  .footer-note::before,
  .footer-note::after {
    margin: 0 8px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .social {
    transition: none;
  }

  .social:hover {
    transform: none;
  }
}
</style>
