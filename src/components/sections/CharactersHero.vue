<script setup lang="ts">
/**
 * 角色介绍 · 档案主卡
 *
 * 页面核心区块：左侧立绘舞台 + 右侧档案正文。
 * 文案依据 BWIKI「流萤」词条（wiki.biligame.com/sr/流萤）核实：
 * 本名 AR-26710、出身格拉默、实装 2024-06-19（2.3 版本，跃迁「盈茧炽盛」）、
 * 短信签名及中日配音。
 */
import { ref } from 'vue'

import { useSpotlight } from '@/composables/useSpotlight'

import portraitUrl from '@/assets/char_hero.jpg'

/** 身份标签（首枚视为高亮 chip） */
const CHIPS: string[] = ['星核猎手', '毁灭 · 命途', '火 · 属性', '限定 5★', '匹诺康尼']

/** 代表台词（官方立绘文案） */
const QUOTE =
  '火萤这种生物很神奇吧？它们或许会扑向火烛，或许会突然老化。' +
  '但在那之前的每一个夜晚，它们的光芒会比星星更耀眼。'

/** 角色简介（官方介绍原文） */
const DESC =
  '星核猎手成员，身着机械装甲「萨姆」战斗。忠于任务，性格坚强。' +
  '作为战胜虫群的兵器而诞生，其生长速度异于常人，但生命非常短暂。' +
  '为了找寻「生」的机会而加入星核猎手，找寻违抗命运的方式。'

/** 固定档案条目 */
interface ProfileField {
  label: string
  value: string
}

const PROFILE_FIELDS: ProfileField[] = [
  { label: '本名 / 编号', value: 'AR-26710' },
  { label: '所属', value: '星核猎手' },
  { label: '出身', value: '格拉默' },
  { label: '命途', value: '毁灭' },
  { label: '战斗属性', value: '火' },
  { label: '实装日期', value: '2024-06-19（2.3 版本）' },
  { label: '跃迁名', value: '盈茧炽盛' },
  { label: '短信签名', value: '会找到的，属于我的梦…' },
  { label: '中文配音', value: '宋媛媛 & 淦子齐' },
  { label: '日文配音', value: '楠木ともり & 笠間淳' },
]

/** 根元素与主卡元素（reveal / 光斑跟踪用） */
const root = ref<HTMLElement | null>(null)
const panel = ref<HTMLElement | null>(null)
useSpotlight(panel)

defineExpose({ root })
</script>

<template>
  <section ref="root" class="char-hero reveal" aria-label="角色档案">
    <div class="head">
      <span class="head-badge">角色介绍 · CHARACTER</span>
      <h1 class="head-title">
        流萤
        <span class="head-script">Firefly</span>
      </h1>
      <p class="head-sub">飞萤扑火，向死而生 —— 一位星核猎手的档案</p>
    </div>

    <div ref="panel" class="panel">
      <div class="grid">
        <!-- 左：立绘舞台 -->
        <div class="stage">
          <img :src="portraitUrl" alt="流萤 角色立绘" decoding="async" />
        </div>

        <!-- 右：档案正文 -->
        <div class="body">
          <h2 class="name">
            流萤
            <small>Firefly</small>
          </h2>

          <div class="chips">
            <span v-for="(chip, i) in CHIPS" :key="chip" class="chip" :class="{ 'is-key': i === 0 }">
              {{ chip }}
            </span>
          </div>

          <p class="quote">「{{ QUOTE }}」</p>
          <p class="desc">{{ DESC }}</p>

          <dl class="profile">
            <div v-for="field in PROFILE_FIELDS" :key="field.label" class="field">
              <dt>{{ field.label }}</dt>
              <dd>{{ field.value }}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ============================================================
   页头（徽标 + 大标题）
   ============================================================ */

.head {
  padding: clamp(32px, 7vh, 72px) 0 clamp(22px, 3.6vh, 40px);
  text-align: center;
}

.head-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 5px 14px;
  border-radius: 999px;
  border: 1px solid var(--line-2);
  background: rgba(130, 178, 241, 0.1);
  color: var(--accent);
  font-size: 12px;
  letter-spacing: 0.14em;
}

.head-badge::before,
.head-badge::after {
  content: '';
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--gold);
  box-shadow: 0 0 8px rgba(255, 203, 130, 0.5);
}

.head-title {
  margin: 18px 0 0;
  font-family: var(--f-serif-cn);
  font-weight: 700;
  font-size: clamp(38px, 6vw, 64px);
  letter-spacing: 0.12em;
  line-height: 1.1;
}

.head-script {
  display: block;
  margin-top: 2px;
  font-family: var(--f-script);
  font-size: clamp(30px, 4.6vw, 52px);
  color: var(--gold);
  text-shadow: 0 0 24px rgba(255, 203, 130, 0.5);
}

.head-sub {
  margin: 14px 0 0;
  color: var(--muted);
  font-family: var(--f-kai);
  font-size: 15px;
  letter-spacing: 0.06em;
}

/* ============================================================
   档案主卡 —— 站点 .panel 视觉（边框 / 渐变 / 顶部高光 / 光斑）
   ============================================================ */

.panel {
  position: relative;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: linear-gradient(158deg, var(--panel-a), var(--panel-b));
  box-shadow: 0 18px 44px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

/* 顶部高光 */
.panel::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(140deg, rgba(214, 235, 255, 0.055), transparent 44%);
}

/* 暖金氛围光 + 鼠标光斑（useSpotlight 写入 --mx/--my） */
.panel::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.45s ease;
  background:
    radial-gradient(640px 380px at 18% 20%, rgba(255, 215, 154, 0.14), transparent 66%),
    radial-gradient(360px 360px at var(--mx, 50%) var(--my, 50%), rgba(214, 235, 255, 0.07), transparent 70%);
}

.panel:hover::after {
  opacity: 1;
}

.grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 5fr) minmax(0, 6fr);
}

/* ---------- 立绘舞台 ---------- */

.stage {
  position: relative;
  min-height: 520px;
  overflow: hidden;
  background: linear-gradient(150deg, #0e1c36, #060d1c);
}

.stage img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 50% 30%;
  transition: transform 1s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.panel:hover .stage img {
  transform: scale(1.04);
}

/* 底部渐隐，让立绘融入面板底色 */
.stage::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg,
      rgba(6, 13, 26, 0.3) 0%,
      transparent 30%,
      transparent 55%,
      rgba(5, 11, 23, 0.9) 100%);
}

/* ---------- 档案正文 ---------- */

.body {
  position: relative;
  padding: clamp(24px, 3.4vw, 44px);
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.name {
  margin: 0;
  font-family: var(--f-serif-cn);
  font-weight: 700;
  font-size: clamp(30px, 3.4vw, 42px);
  letter-spacing: 0.1em;
  line-height: 1.15;
}

.name small {
  display: block;
  margin-top: 4px;
  font-family: var(--f-display);
  font-style: italic;
  font-weight: 400;
  font-size: 0.52em;
  letter-spacing: 0.04em;
  color: var(--muted);
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip {
  padding: 4px 12px;
  border-radius: 999px;
  border: 1px solid var(--line-2);
  background: rgba(130, 178, 241, 0.1);
  color: #cfe1ff;
  font-size: 12px;
  letter-spacing: 0.06em;
}

.chip.is-key {
  border-color: transparent;
  background: rgba(255, 215, 154, 0.14);
  color: var(--gold);
}

.quote {
  margin: 0;
  font-family: var(--f-kai);
  font-size: 17px;
  line-height: 1.9;
  letter-spacing: 0.03em;
  color: #f3f8ff;
  border-left: 3px solid var(--gold);
  padding-left: 16px;
}

.desc {
  margin: 0;
  color: var(--muted);
  font-size: 14px;
  line-height: 1.9;
}

/* ---------- 档案表 ---------- */

.profile {
  margin: auto 0 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--line);
  background: var(--line);
}

.field {
  padding: 10px 14px;
  background: rgba(9, 20, 39, 0.72);
}

.field dt {
  font-size: 11px;
  letter-spacing: 0.12em;
  color: var(--dim);
}

.field dd {
  margin: 2px 0 0;
  font-family: var(--f-serif-cn);
  font-size: 14.5px;
  color: var(--ink);
}

/* ============================================================
   响应式
   ============================================================ */

/* 平板及以下：立绘在上、档案在下 */
@media (max-width: 900px) {
  .grid {
    grid-template-columns: minmax(0, 1fr);
  }

  /* 立绘为方形素材，用等比高度替代固定 min-height，避免裁切 */
  .stage {
    min-height: 0;
    aspect-ratio: 1 / 1;
  }
}

/* 手机：收紧间距与字号 */
@media (max-width: 480px) {
  .head {
    padding-top: 28px;
  }

  .head-sub {
    font-size: 13.5px;
  }

  .body {
    padding: 20px 16px 22px;
    gap: 14px;
  }

  .quote {
    font-size: 15.5px;
  }

  /* 档案表转单列，避免窄屏双列挤压 */
  .profile {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
