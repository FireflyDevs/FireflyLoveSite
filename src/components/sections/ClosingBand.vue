<script setup lang="ts">
/**
 * 收尾横幅（移动端）
 *
 * 结构、类名与样式移植自 `1.html` 的 `.closing` 段（`1.html:3599-3612`）。
 * 仅在小屏设备显示（`m-only`），展示「流萤，一直在你身边。」文案与背景图。
 */
import bannerUrl from '@/assets/ff/banner.jpg'
import IconUnderline from '@/components/icons/IconUnderline.vue'
</script>

<template>
  <section class="closing m-only" aria-label="流萤，一直在你身边">
    <img :src="bannerUrl" alt="" loading="lazy" decoding="async" />
    <div class="closing-txt">
      流萤，<em>一直在你身边。</em>
      <IconUnderline class="closing-underline" />
    </div>
  </section>
</template>

<style scoped>
/* ============================================================
   收尾横幅 —— 移植自 1.html:1669-1722
   ============================================================ */

.closing {
  position: relative;
  display: none;
  overflow: hidden;
  margin-top: 16px;
  min-height: 96px;
  border-radius: 15px;
  border: 1px solid var(--line-2);
  padding: 14px 18px;
  align-items: center;
}

.closing > img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 62% 42%;
  z-index: 0;
}

.closing::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 1;
  background: linear-gradient(
    90deg,
    rgba(7, 16, 33, 0.92) 8%,
    rgba(7, 16, 33, 0.55) 46%,
    rgba(7, 16, 33, 0.12)
  );
}

.closing-txt {
  position: relative;
  z-index: 2;
  font-family: var(--f-kai);
  font-size: 21px;
  line-height: 1.5;
  color: #f4f8ff;
  text-shadow: 0 2px 14px rgba(0, 0, 0, 0.6);
}

.closing-txt em {
  display: block;
  font-style: normal;
  font-size: 19px;
  padding-left: 0.8em;
}

.closing-underline {
  display: block;
  width: 56px;
  height: 4px;
  margin-top: 2px;
  color: rgba(220, 236, 255, 0.75);
}

/* ---------- 响应式 ---------- */
@media (max-width: 860px) {
  .closing {
    display: flex;
    margin: 9px 12px 0;
    min-height: 48px;
    padding: 6px 12px;
    border-radius: 13px;
  }

  .closing-txt {
    font-size: 14px;
    line-height: 1.45;
  }

  .closing-txt em {
    font-size: 12.5px;
  }
}
</style>
