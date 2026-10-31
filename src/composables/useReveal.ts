import { onBeforeUnmount, onMounted, type Ref } from 'vue'

/**
 * 入场观察（非响应式实现，可直接调用）。
 *
 * 移植自 `1.html` 的「入场动画」段：元素初始透明且下移 26px，进入视口后
 * 由 IntersectionObserver 添加 `.in` 类，CSS 负责 0.8s 的透明度 + 位移过渡。
 * 同一批元素按发现顺序依次延迟 90ms，形成错落入场。
 *
 * 抽成独立函数的原因：当 reveal 目标来自子组件 `defineExpose` 的 ref 时，
 * 需要等子组件挂载完成后才能拿到元素，此时已不在组合式 API 的同步上下文中，
 * 无法再注册 `onMounted`；由调用方在合适的时机调用本函数即可。
 *
 * @param elements 需要入场的元素列表
 * @param shouldSkip 返回 `true` 时直接显示（如用户偏好降低动效）
 * @returns 取消观察的清理函数
 */
export function observeReveal(elements: HTMLElement[], shouldSkip: () => boolean): () => void {
  if (elements.length === 0) return () => {}

  // 降级路径：不支持 IO 或用户要求降低动效时，直接显示
  if (shouldSkip() || typeof IntersectionObserver === 'undefined') {
    elements.forEach((el) => el.classList.add('in'))
    return () => {}
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (!entry.isIntersecting) return
        const el = entry.target as HTMLElement
        // 同一帧内发现的元素按索引错峰 90ms
        window.setTimeout(() => el.classList.add('in'), index * 90)
        observer.unobserve(el)
      })
    },
    { threshold: 0.16, rootMargin: '0px 0px -8% 0px' },
  )

  elements.forEach((el) => observer.observe(el))
  return () => observer.disconnect()
}

/**
 * 入场动画（reveal）组合式封装。
 *
 * 与原稿的差异：原稿在脚本启动时全局 `querySelectorAll('.reveal')`；
 * 这里改为显式订阅宿主元素，Vue 组件卸载时自动取消观察，避免泄漏。
 *
 * 注意：目标必须在 `onMounted` 时已可解析（通常各传一个模板 ref）。
 * 若目标来自子组件 expose、需要等待子组件挂载，请改用 {@link observeReveal}
 * 并在 `onMounted` + `nextTick` 之后调用。
 *
 * @param targets 需要入场的元素列表（通常各传一个 ref）
 * @param shouldSkip 返回 `true` 时直接显示（如用户偏好降低动效）
 */
export function useReveal(
  targets: Readonly<Ref<HTMLElement | null>>[],
  shouldSkip: () => boolean,
): void {
  let cleanup: (() => void) | null = null

  onMounted(() => {
    const elements = targets.map((t) => t.value).filter((el): el is HTMLElement => el !== null)
    cleanup = observeReveal(elements, shouldSkip)
  })

  onBeforeUnmount(() => {
    cleanup?.()
    cleanup = null
  })
}
