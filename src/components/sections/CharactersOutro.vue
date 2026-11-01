<script setup lang="ts">
/**
 * 角色介绍 · 结尾导航
 *
 * 引导访客前往站内其它分区（图集 / 视频 / 资料库），
 * 与首页 FeatureCard 的渐变主按钮保持同一视觉语言。
 */
import { ref } from 'vue'

const root = ref<HTMLElement | null>(null)
defineExpose({ root })
</script>

<template>
  <section ref="root" class="char-outro reveal" aria-label="继续了解她">
    <div class="outro">
      <h2 class="outro-title">继续了解她</h2>
      <p class="outro-sub">从图集到影像，去收藏萤火掠过的每一个瞬间。</p>
      <div class="outro-links">
        <RouterLink class="btn is-primary" to="/gallery">前往图集 →</RouterLink>
        <RouterLink class="btn" to="/videos">观看视频</RouterLink>
        <RouterLink class="btn" to="/library">角色资料库</RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.outro {
  padding: clamp(28px, 4vw, 48px);
  border-radius: var(--radius);
  border: 1px solid var(--line);
  background:
    radial-gradient(520px 240px at 80% 0%, rgba(255, 180, 210, 0.08), transparent 70%),
    linear-gradient(158deg, var(--panel-a), var(--panel-b));
  text-align: center;
}

.outro-title {
  margin: 0;
  font-family: var(--f-serif-cn);
  font-weight: 700;
  font-size: clamp(20px, 2.6vw, 28px);
  letter-spacing: 0.12em;
}

.outro-sub {
  margin: 10px 0 0;
  color: var(--muted);
  font-family: var(--f-kai);
  font-size: 14px;
}

.outro-links {
  margin-top: 24px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 11px 26px;
  border-radius: 999px;
  border: 1px solid var(--line-2);
  color: var(--ink);
  font-size: 14px;
  letter-spacing: 0.08em;
  text-decoration: none;
  transition: transform 0.3s, box-shadow 0.3s, background 0.3s;
}

.btn:hover {
  transform: translateY(-2px);
  background: rgba(130, 178, 241, 0.14);
  box-shadow: 0 0 24px rgba(130, 180, 255, 0.3);
}

.btn.is-primary {
  border-color: transparent;
  background: linear-gradient(135deg, var(--gold), var(--pink));
  color: #23141f;
  font-weight: 600;
}

.btn.is-primary:hover {
  box-shadow: 0 8px 30px rgba(255, 190, 150, 0.35);
}
</style>
