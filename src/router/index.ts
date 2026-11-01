import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'


/**
 * 页面路由。
 *
 * 与顶部导航一一对应：首页 / 角色介绍 / 图集 / 视频 / 资料库。
 * `meta.title` 供后续同步 `document.title` 使用。
 */
const PAGES: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: '首页' },
  },
  {
    path: '/characters',
    name: 'characters',
    component: () => import('@/views/CharactersView.vue'),
    meta: { title: '角色介绍' },
  },
  {
    path: '/gallery',
    name: 'gallery',
    component: () => import('@/views/GalleryView.vue'),
    meta: { title: '图集' },
  },
  {
    path: '/videos',
    name: 'videos',
    component: () => import('@/views/VideosView.vue'),
    meta: { title: '视频' },
  },
  {
    path: '/library',
    name: 'library',
    component: () => import('@/views/LibraryView.vue'),
    meta: { title: '资料库' },
  }
]

/**
 * 静态跳转表。
 *
 * `from` 是本站访问路径，值是目标地址改写后的相对路径：目标站点为
 * https://img.流萤.love，目标路径 `/<文件名>` 在该目录层级下写作
 * `../.<文件名>`（`..` 退回根目录，`.` 在浏览器路径规范化时被去掉）。
 * 目标站点的子域名与路径前缀由部署层的重写规则落位，见 DEPLOYMENT.md「跳转规则」。
 *
 * 每条规则都是独立的无组件重定向路由：vue-router 切换路由时会复用组件实例，
 * 若复用到的组件里有具名 `<RouterView>` 而新路由没有对应组件，会抛
 * "Failed to resolve component"。
 */
const REDIRECTS: Readonly<Record<string, string>> = {
  '/image.Firefly': '../.image.Firefly',
  '/like.Firefly': '../.like.Firefly',
  '/look.html': '../.look.html',
  '/pixiv.Firefly': '../.pixiv.Firefly',
  '/thank.html': '../.thank.html',
}

/** 保留原请求的查询串与 hash */
function withQueryAndHash(target: string): string {
  return `${target}${location.search}${location.hash}`
}

/** 重定向路由，排在页面路由之后 */
const redirectRoutes: RouteRecordRaw[] = Object.entries(REDIRECTS).map(([from, to]) => ({
  path: from,
  redirect: () => ({ path: withQueryAndHash(to) }),
}))

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...PAGES, ...redirectRoutes],
  scrollBehavior(_to, _from, savedPosition) {
    return savedPosition ?? { top: 0 }
  },
})

export default router
