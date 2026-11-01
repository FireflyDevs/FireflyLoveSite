# FireflyLoveSite 部署说明

本文档说明如何构建和部署网站。

本项目是 **Vue 3 + Vite 单页应用（SPA）**，构建后产物是纯静态文件，生产环境不需要 Node.js 常驻进程，也不需要任何服务端运行时代码。推荐拓扑：

```text
        构建（CI / 本地打一次）
        pnpm build
             │
             ▼
        dist/  静态文件
             │
             ▼
        Nginx :80/:443        ← 托管 dist/，负责 SPA 回退
             │
             ▼
          访问者浏览器        ← 前端路由在其中运行
```

## 环境要求

**构建机**（CI 或本地）：

- Node.js `^22.18.0 || >=24.12.0`（以 `package.json` 的 `engines` 为准）
- pnpm（CI 使用 pnpm 9）

**服务器**：

- 任意能托管静态文件的 Web 服务器，本文以 Nginx 为例
- 需要支持**单页应用回退**（把未命中的路径重写到 `index.html`）
- 需要能够 `add_header` 设置自定义响应头（用于跳转转发，见下文）
- 不支持任何形如 `<path>.html` 的服务端路由，**站点所有路径都由前端路由处理**

## 构建

在项目根目录：

```bash
pnpm install --frozen-lockfile
pnpm build
```

`pnpm build` 会先跑 `vue-tsc` 类型检查，再执行 `vite build`，产物输出到 `dist/`：

```text
dist/
├── index.html
├── favicon.ico
└── assets/          # 带内容哈希的 JS / CSS / 图片 / 字体
```

`assets/` 下的文件名包含内容哈希，可以安全地设置长期缓存；`index.html` 必须每次重新校验，否则用户会拿到引用旧哈希资源、已经失效的页面。

部署时把 `dist/` 的内容同步到服务器目录，例如 `/firefly/site/main`：

```bash
rsync -av --delete dist/ user@server:/firefly/site/main/
```

注意 `--delete` 会清理目标目录里的旧哈希文件。执行前请确认目标路径确实是站点发布目录。

## Nginx 配置

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name xn--qzw410c.love www.xn--qzw410c.love;

    root /firefly/site/main;
    index index.html;

    # 带哈希的静态资源：长期缓存
    # 只写一条 Cache-Control：同时使用 expires 会让响应出现两个 Cache-Control 头
    location /assets/ {
        try_files $uri =404;
        add_header Cache-Control "public, max-age=31536000, immutable";
        access_log off;
    }

    # index.html 不缓存，保证发版后能立刻拿到新的资源哈希
    location = /index.html {
        add_header Cache-Control "no-cache";
    }

    # 跳转路径：必须回退到 index.html，交由前端路由处理
    # 这些路径在服务器上没有对应的真实文件
    location ~ ^/(image\.Firefly|like\.Firefly|pixiv\.Firefly|look\.html|thank\.html)$ {
        try_files /index.html =404;
        add_header Cache-Control "no-cache";
    }

    # 其余路径：先找真实文件，找不到则回退到 index.html（SPA 回退）
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 不要把源码、依赖和文档暴露出去（正常情况下 root 只指向 dist/，这里是兜底）
    location ~ ^/(README\.md|DEPLOYMENT\.md|package\.json|pnpm-lock\.yaml|tsconfig.*\.json|vite\.config\.ts)$ {
        return 404;
    }
}
```

修改后检查并重载：

```bash
nginx -t && nginx -s reload
```

要点：

- **`try_files $uri $uri/ /index.html;` 是 SPA 能正常工作的前提。** 没有它，用户直接访问或刷新 `/characters`、`/gallery` 会得到 404。
- **跳转路径必须也回退到 `index.html`。** 站点 5 条历史跳转（`/image.Firefly` 等）已迁移到前端路由，服务器上没有这些文件；若不回退，请求在到达应用之前就会 404。
- 如果服务器上同时有其他站点，不要把本站配置随意设为 `default_server`，请按实际 `server_name` 配置。

### 其他托管方式

只要满足下面两点，任何静态托管都可以：

1. 未命中的路径回退到 `index.html`（404 → `index.html`，HTTP 状态仍建议返回 200）
2. `index.html` 不缓存，`/assets/*` 可长期缓存

对应写法举例：

- **Apache**：`FallbackResource /index.html`（或 `RewriteRule . /index.html [L]`）
- **宝塔面板**：站点设置里开启「伪静态」，规则填 `location / { try_files $uri $uri/ /index.html; }`
- **CDN / 对象存储**：配置「404 重写到首页」或等价的错误文档兜底
- **Caddy**：`try_files {path} /index.html`

## 跳转规则

站点的跳转定义在前端代码里，不是服务器配置文件。规则位于 `src/router/index.ts` 的 `REDIRECTS`：

| 源路径 | 目标 |
| --- | --- |
| `/image.Firefly` | `https://img.流萤.love/image.Firefly` |
| `/like.Firefly` | `https://img.流萤.love/like.Firefly` |
| `/look.html` | `https://img.流萤.love/look.html` |
| `/pixiv.Firefly` | `https://img.流萤.love/pixiv.Firefly` |
| `/thank.html` | `https://img.流萤.love/thank.html` |

行为说明：

- 跳转在**浏览器端**完成：应用加载后由 `vue-router` 重定向到目标地址
- 原请求的查询串与 `#hash` 会被保留
- 目标站点的子域名与路径前缀由部署层的重写规则落位（见下）
- 新增或修改跳转需要**改代码并重新构建发布**，不再是改配置即生效

### 部署层需要配合的部分

`REDIRECTS` 中记录的是目标地址改写后的**相对路径**（例如 `../.image.Firefly`），最终跳转到哪个域名由部署层决定。若目标站点的子域名或路径前缀与代码里的假设不一致，需要在 Nginx 层做 301/302 补齐。

另外，由于跳转发生在应用加载之后，**搜索引擎和没有执行 JS 的客户端拿到的是 `index.html`，看不到 302 响应头**。如果需要对爬虫或外链给出真正的 HTTP 跳转，需要在 Nginx 中前置处理（例如对上表路径直接 `return 302`），此时前端规则不会被执行。

## 和旧版部署的差异

旧版是「Node 运行 `server.ts` + Nginx 反向代理 `127.0.0.1:3000`」的形态，已整体废弃：

| 项目 | 旧版 | 当前 |
| --- | --- | --- |
| 运行形态 | Node 常驻进程（`server.ts`） | 纯静态文件，无服务端进程 |
| 页面 | 单文件 `firefly.html` | Vue SFC + Vite 构建 |
| 端口 | `127.0.0.1:3000` | 不需要 |
| 跳转 | `redirects.json`，保存后自动重载 | 前端路由，改代码后重新构建 |
| 静态文件保护 | `server.ts` 内的保护列表 | 由 Web 服务器配置保证（root 只指向 `dist/`） |
| 图片素材 | 仓库根目录 `pic/` | `src/assets/`，构建时带哈希打包 |

因此：

- 不再需要 systemd unit、Node 版宝塔项目或端口占用检查
- 旧的 `server.ts`、`redirects.json`、`firefly.html`、`pic/` 均已从仓库删除，不要在服务器上继续依赖它们
- 服务器上的旧 Node 服务应停止并取消开机自启，避免继续占用端口或返回过期页面

## 缓存与发布

- `index.html`：`Cache-Control: no-cache`。保证发版后用户立刻拿到新的资源哈希。
- `/assets/*`：`Cache-Control: public, immutable` + 长期 `expires`。文件名带内容哈希，内容变化必然换名。
- 不建议对整站统一给长缓存，否则 `index.html` 会被缓存，用户长期停留在旧版本。

发布顺序建议：先同步 `dist/`，再 `nginx -s reload`（如果改了配置）。资源文件名带哈希，新旧文件短暂并存不会出错。

## 检查服务

```bash
# 首页
curl -I https://xn--qzw410c.love/

# 子路由直接访问（SPA 回退），应返回 200 而不是 404
curl -I https://xn--qzw410c.love/characters

# 跳转路径（回退到 index.html 后由前端处理），应返回 200
curl -I https://xn--qzw410c.love/image.Firefly

# 不应暴露的文档，应返回 404
curl -I https://xn--qzw410c.love/README.md
```

验证约定：

- `/`、`/characters`、`/gallery`、`/videos`、`/library` 返回 `200`
- `/image.Firefly` 等 5 条跳转路径返回 `200`（跳转由浏览器执行），或按部署层方案返回 `302` 并带 `Location`
- `/README.md`、`/DEPLOYMENT.md`、`/package.json` 返回 `404`
- 在浏览器中访问 `/characters`，刷新后仍能正常显示页面

## 浏览器端排查

如果页面白屏或路由异常，按顺序检查：

1. 浏览器控制台是否有资源 404 —— 通常是 `assets/` 没有完整上传，或 `index.html` 与新资源不同步
2. 直接访问子路由是否 404 —— 服务器缺少 SPA 回退
3. 访问 `/image.Firefly` 是否 404 —— 服务器没有为跳转路径配置回退
4. `index.html` 是否被 CDN 或浏览器长缓存 —— 检查响应头里的 `Cache-Control`

## 回滚

产物是静态文件，回滚即换回上一版 `dist/`。建议保留最近几个版本的构建产物（例如在服务器上按版本号存放 `releases/`，用软链接指向当前版本），或直接重新构建上一个提交：

```bash
git checkout <上一个可用提交>
pnpm install --frozen-lockfile
pnpm build
rsync -av --delete dist/ user@server:/firefly/site/main/
```

回滚同样要确认目标路径，避免误删其他站点的文件。
