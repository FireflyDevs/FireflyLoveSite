<script setup lang="ts">
/**
 * 角色介绍 · 只言片语（台词卡片）
 *
 * 台词均出自官方物料：角色 PV「壳中萤火」、匹诺康尼剧情、
 * 游戏内短信签名与相关成就名。
 *
 * 视觉：每张卡片循环保留一个主题色（金 / 粉 / 星蓝 / 萤火青），
 * 配合角标引号、序数与鼠标光斑（指针移动时写入 --mx/--my）。
 */
import { ref } from 'vue'

/** 台词卡片 */
interface VoiceLine {
  /** 台词正文（不含引号，模板统一包裹） */
  text: string
  /** 出处标注 */
  from: string
}

const VOICES: VoiceLine[] = [
  {
    text: '我梦见一片焦土，一株破土而出的新蕊，它迎着朝阳绽放，向我低语呢喃。',
    from: '角色 PV「壳中萤火」',
  },
  {
    text: '愿我们，在清醒的现实再会。',
    from: '匹诺康尼 · 告别',
  },
  {
    text: '会找到的，属于我的梦…',
    from: '短信签名',
  },
  {
    text: '我将，点燃大海！',
    from: '完全燃烧 · 萨姆',
  },
]

/** 中文序数（卡片左上角水印） */
const ORDINALS: string[] = ['壹', '贰', '叁', '肆']

const root = ref<HTMLElement | null>(null)
defineExpose({ root })

/**
 * 鼠标光斑：在网格容器上委托处理，
 * 把指针坐标写进当前卡片的 --mx/--my（与 useSpotlight 同一协议）。
 */
const onGridPointerMove = (event: PointerEvent): void => {
  const card = (event.target as HTMLElement).closest<HTMLElement>('.voice')
  if (!card) return
  const rect = card.getBoundingClientRect()
  card.style.setProperty('--mx', `${event.clientX - rect.left}px`)
  card.style.setProperty('--my', `${event.clientY - rect.top}px`)
}
</script>

<template>
  <section ref="root" class="char-voices reveal" aria-label="经典台词">
    <div class="section-head">
      <h2 class="section-title">只言片语</h2>
      <span class="section-title-en">Voices</span>
      <span class="section-line" aria-hidden="true"></span>
    </div>

    <div class="voices" @pointermove="onGridPointerMove">
      <blockquote v-for="(line, i) in VOICES" :key="line.text" class="voice">
        <span class="voice-ordinal" aria-hidden="true">{{ ORDINALS[i] }}</span>
        <p class="voice-text">{{ line.text }}</p>
        <footer class="voice-from">
          <span class="voice-from-rule" aria-hidden="true"></span>
          {{ line.from }}
        </footer>
      </blockquote>
    </div>
  </section>
</template>

<style scoped>
.section-head {
  display: flex;
  align-items: baseline;
  gap: 16px;
  margin-bottom: 26px;
}

.section-title {
  margin: 0;
  font-family: var(--f-serif-cn);
  font-weight: 700;
  font-size: clamp(24px, 3vw, 32px);
  letter-spacing: 0.12em;
}

.section-title-en {
  font-family: var(--f-display);
  font-style: italic;
  font-size: 15px;
  color: var(--dim);
  letter-spacing: 0.08em;
}

.section-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, var(--line-2), transparent);
}

/* ---------- 台词卡片 ---------- */

.voices {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(14px, 1.5vw, 24px);
}

.voice {
  /* 每张卡片一个主题色，按顺序循环：金 → 粉 → 星蓝 → 萤火青 */
  --va: var(--gold);
  --va-soft: rgba(255, 215, 154, 0.12);
  --va-glow: rgba(255, 203, 130, 0.4);

  position: relative;
  margin: 0;
  padding: clamp(26px, 3vw, 40px);
  /* 出处固定落底，同行卡片长短台词也能对齐 */
  display: flex;
  flex-direction: column;
  border-radius: var(--radius);
  border: 1px solid var(--line);
  background:
    radial-gradient(420px 200px at 85% -10%, var(--va-soft), transparent 70%),
    linear-gradient(158deg, var(--panel-a), var(--panel-b));
  overflow: hidden;
  transition: transform 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease;
}

.voice:nth-child(2) {
  --va: var(--pink);
  --va-soft: rgba(255, 180, 210, 0.12);
  --va-glow: rgba(255, 180, 210, 0.38);
}

.voice:nth-child(3) {
  --va: var(--accent);
  --va-soft: rgba(169, 205, 255, 0.12);
  --va-glow: rgba(150, 190, 245, 0.38);
}

.voice:nth-child(4) {
  --va: #7dffc8;
  --va-soft: rgba(125, 255, 200, 0.1);
  --va-glow: rgba(110, 255, 190, 0.36);
}

/* 鼠标光斑（hover 时随 --mx/--my 亮起） */
.voice::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.4s ease;
  background: radial-gradient(300px 300px at var(--mx, 50%) var(--my, 50%),
      var(--va-soft),
      transparent 70%);
}

.voice:hover {
  transform: translateY(-3px);
  border-color: color-mix(in srgb, var(--va) 45%, transparent);
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.35), 0 0 28px -6px var(--va-glow);
}

.voice:hover::after {
  opacity: 1;
}


.voice:hover::before {
  opacity: 0.3;
}

/* 中文序数水印（右上角） */
.voice-ordinal {
  position: absolute;
  top: 18px;
  right: 22px;
  font-family: var(--f-serif-cn);
  font-size: 15px;
  letter-spacing: 0.2em;
  color: var(--va);
  opacity: 0.55;
  pointer-events: none;
}

.voice-text {
  position: relative;
  margin: 0;
  font-family: var(--f-kai);
  font-size: clamp(17px, 1.8vw, 21px);
  line-height: 2;
  letter-spacing: 0.04em;
  color: #f3f8ff;
}

.voice-from {
  margin-top: auto;
  padding-top: 18px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  font-size: 12px;
  letter-spacing: 0.14em;
  color: var(--dim);
}

/* 出处前的渐隐短线，颜色随卡片主题 */
.voice-from-rule {
  width: 34px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--va));
  opacity: 0.7;
}

/* ---------- 响应式 ---------- */

@media (max-width: 860px) {
  .voices {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
