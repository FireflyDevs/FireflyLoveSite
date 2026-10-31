import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'

/**
 * 主视觉视差 + 萤火粒子 canvas。
 *
 * 移植自 `1.html` 的「主视觉视差」与「萤火粒子」两段：
 * - 鼠标在 hero 区域移动时，背景图做缓慢的反向位移（lerp 平滑）。
 * - 覆盖层 canvas 绘制上升的荧光粒子，鼠标靠近时粒子会被轻微推开。
 * - 开启「降低动效」后两者均停用。
 *
 * 与原稿的差异：原稿直接操作 `document.getElementById`；这里通过
 * Vue ref 绑定到模板元素，组件卸载时自动清理 raf / resize / 事件监听。
 */

/** 视差最大位移（px） */
const PARALLAX_X = -14
const PARALLAX_Y = -10

/** 粒子密度：每 26000 平方像素一个粒子，上下限 18–64 */
const PARTICLE_AREA = 26000
const PARTICLE_MIN = 18
const PARTICLE_MAX = 64

/** 粒子被鼠标排斥的判定半径平方 */
const REPEL_RADIUS_SQ = 26000
/** 排斥力系数 */
const REPEL_FORCE = 0.006
/** 速度阻尼 */
const DAMPING = 0.986
/** 基础上升速度 */
const BASE_RISE = -0.0009
/** 最大上升速度 */
const MAX_RISE = -0.5

interface Particle {
  x: number
  y: number
  r: number
  vx: number
  vy: number
  /** 相位，用于闪烁 */
  ph: number
  /** 相位速度 */
  sp: number
  /** 是否为暖色调（金色） */
  hue: boolean
}

/**
 * 生成一批随机粒子。
 *
 * @param w 画布逻辑宽度
 * @param h 画布逻辑高度
 */
function makeParticles(w: number, h: number): Particle[] {
  const count = Math.max(PARTICLE_MIN, Math.min(PARTICLE_MAX, Math.round((w * h) / PARTICLE_AREA)))
  return Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: 0.9 + Math.random() * 1.7,
    vx: (Math.random() - 0.5) * 0.16,
    vy: -0.06 - Math.random() * 0.16,
    ph: Math.random() * Math.PI * 2,
    sp: 0.008 + Math.random() * 0.022,
    hue: Math.random() < 0.34,
  }))
}

/**
 * 在 hero 区域内启用视差与萤火粒子。
 *
 * @param hero 主视觉容器
 * @param art 主视觉背景图（视差目标）
 * @param canvas 萤火粒子画布
 * @param shouldSkip 返回 `true` 时整体停用（降低动效）
 */
export function useHeroEffects(
  hero: Readonly<Ref<HTMLElement | null>>,
  art: Readonly<Ref<HTMLImageElement | null>>,
  canvas: Readonly<Ref<HTMLCanvasElement | null>>,
  shouldSkip: () => boolean,
): void {
  /* ---------- 视差 ---------- */
  let parallaxRaf: number | null = null
  let tx = 0
  let ty = 0
  let cx = 0
  let cy = 0

  const onParallaxMove = (event: PointerEvent): void => {
    const host = hero.value
    if (!host) return
    const rect = host.getBoundingClientRect()
    tx = ((event.clientX - rect.left) / rect.width - 0.5) * 2
    ty = ((event.clientY - rect.top) / rect.height - 0.5) * 2
    if (!parallaxRaf) parallaxRaf = requestAnimationFrame(parallaxLoop)
  }

  const onParallaxLeave = (): void => {
    tx = 0
    ty = 0
    if (!parallaxRaf) parallaxRaf = requestAnimationFrame(parallaxLoop)
  }

  const parallaxLoop = (): void => {
    cx += (tx - cx) * 0.06
    cy += (ty - cy) * 0.06
    if (art.value) {
      art.value.style.translate = `${(cx * PARALLAX_X).toFixed(2)}px ${(cy * PARALLAX_Y).toFixed(2)}px`
    }
    if (Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001) {
      parallaxRaf = requestAnimationFrame(parallaxLoop)
    } else {
      parallaxRaf = null
    }
  }

  /* ---------- 萤火粒子 ---------- */
  let particles: Particle[] = []
  let particleRaf: number | null = null
  let ctx: CanvasRenderingContext2D | null = null
  let W = 0
  let H = 0
  let mx = -999
  let my = -999
  let running = true

  const resizeCanvas = (): void => {
    const host = hero.value
    const cv = canvas.value
    if (!host || !cv) return
    const rect = host.getBoundingClientRect()
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    W = rect.width
    H = rect.height
    cv.width = Math.round(W * dpr)
    cv.height = Math.round(H * dpr)
    ctx?.setTransform(dpr, 0, 0, dpr, 0, 0)
    particles = makeParticles(W, H)
  }

  const onParticleMove = (event: PointerEvent): void => {
    const host = hero.value
    if (!host) return
    const rect = host.getBoundingClientRect()
    mx = event.clientX - rect.left
    my = event.clientY - rect.top
  }

  const onParticleLeave = (): void => {
    mx = -999
    my = -999
  }

  const drawFrame = (): void => {
    if (!ctx) return
    ctx.clearRect(0, 0, W, H)

    for (const p of particles) {
      p.ph += p.sp

      // 鼠标排斥
      const dx = mx - p.x
      const dy = my - p.y
      const d2 = dx * dx + dy * dy
      if (d2 < REPEL_RADIUS_SQ && d2 > 1) {
        const f = REPEL_FORCE / Math.sqrt(d2)
        p.vx += dx * f
        p.vy += dy * f
      }

      // 阻尼 + 上升
      p.vx *= DAMPING
      p.vy = p.vy * DAMPING + BASE_RISE
      if (p.vy < MAX_RISE) p.vy = MAX_RISE

      // 位置更新（含正弦漂移）
      p.x += p.vx + Math.sin(p.ph) * 0.28
      p.y += p.vy

      // 边界环绕
      if (p.y < -12) {
        p.y = H + 10
        p.x = Math.random() * W
      }
      if (p.x < -12) p.x = W + 10
      if (p.x > W + 12) p.x = -10

      // 绘制光晕
      const alpha = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(p.ph * 2.1))
      const radius = p.r * 5.2
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius)
      if (p.hue) {
        gradient.addColorStop(0, `rgba(255,236,178,${0.85 * alpha})`)
        gradient.addColorStop(0.35, `rgba(255,206,120,${0.34 * alpha})`)
      } else {
        gradient.addColorStop(0, `rgba(236,246,255,${0.9 * alpha})`)
        gradient.addColorStop(0.35, `rgba(170,212,255,${0.35 * alpha})`)
      }
      gradient.addColorStop(1, 'rgba(120,170,255,0)')
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(p.x, p.y, radius, 0, Math.PI * 2)
      ctx.fill()

      // 绘制核心亮点
      ctx.fillStyle = `rgba(255,255,255,${0.75 * alpha})`
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.r * 0.62, 0, Math.PI * 2)
      ctx.fill()
    }

    if (running) particleRaf = requestAnimationFrame(drawFrame)
  }

  const onResize = (): void => {
    if (particleRaf) cancelAnimationFrame(particleRaf)
    resizeCanvas()
    if (running) particleRaf = requestAnimationFrame(drawFrame)
  }

  const onVisibilityChange = (): void => {
    running = !document.hidden
    if (running) particleRaf = requestAnimationFrame(drawFrame)
    else if (particleRaf) cancelAnimationFrame(particleRaf)
  }

  onMounted(() => {
    const host = hero.value
    if (!host) return

    // 视差需要更细的指针类型判断：触屏不启用
    const finePointer = window.matchMedia('(hover:hover) and (pointer:fine)').matches
    if (finePointer && !shouldSkip()) {
      host.addEventListener('pointermove', onParallaxMove)
      host.addEventListener('pointerleave', onParallaxLeave)
    }

    // 粒子
    const cv = canvas.value
    if (!cv || shouldSkip()) return
    ctx = cv.getContext('2d', { alpha: true })
    if (!ctx) return

    resizeCanvas()
    host.addEventListener('pointermove', onParticleMove)
    host.addEventListener('pointerleave', onParticleLeave)
    window.addEventListener('resize', onResize)
    document.addEventListener('visibilitychange', onVisibilityChange)
    particleRaf = requestAnimationFrame(drawFrame)
  })

  onBeforeUnmount(() => {
    const host = hero.value
    host?.removeEventListener('pointermove', onParallaxMove)
    host?.removeEventListener('pointerleave', onParallaxLeave)
    host?.removeEventListener('pointermove', onParticleMove)
    host?.removeEventListener('pointerleave', onParticleLeave)
    window.removeEventListener('resize', onResize)
    document.removeEventListener('visibilitychange', onVisibilityChange)
    if (parallaxRaf) cancelAnimationFrame(parallaxRaf)
    if (particleRaf) cancelAnimationFrame(particleRaf)
  })
}
