<script setup lang="ts">
/**
 * 应用根组件
 *
 * 挂载顺序与原稿一致：顶栏 → 路由出口（页面主体）→ 页脚 → 移动端底栏。
 * 页脚与底栏属于全站布局，放在这里而非页面内，切页时不会重复挂载。
 *
 * `DevModal` 也挂在这一层：它是全站共用的「开发窗口」浮层，不隶属任何页面。
 * 对应的 `data-modal` 触发器散布在顶栏、页脚、移动端底栏与各页面区块里，
 * 统一由 `installDevModalTrigger()` 在 `document` 上做一次事件委托，
 * 因此那些组件不需要为弹窗改动任何代码。
 */
import { onBeforeUnmount, onMounted } from 'vue'

import DevModal from '@/components/layout/DevModal.vue'
import MobileTabbar from '@/components/layout/MobileTabbar.vue'
import SiteFooter from '@/components/layout/SiteFooter.vue'
import SiteHeader from '@/components/layout/SiteHeader.vue'
import { installDevModalTrigger } from '@/composables/useDevModal'

/** `data-modal` 全局委托的清理函数，卸载时调用 */
let disposeDevModalTrigger: (() => void) | null = null

onMounted(() => {
  disposeDevModalTrigger = installDevModalTrigger()
})

onBeforeUnmount(() => {
  disposeDevModalTrigger?.()
  disposeDevModalTrigger = null
})
</script>

<template>
  <SiteHeader />
  <RouterView />
  <SiteFooter />
  <MobileTabbar />
  <DevModal />
</template>
