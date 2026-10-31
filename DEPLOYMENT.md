# FireflyLoveSite 部署说明

本文档说明如何运行和部署网站。生产环境推荐：

```text
Node.js（TypeScript 直接运行）
        ↑
127.0.0.1:3000
        ↑
Nginx :80
```

## 环境要求

- Linux 服务器
- Node.js 24 或更高版本（当前生产环境为 Node.js 26）
- Nginx（可选，但生产环境推荐）
- systemd（推荐用于常驻运行）

Node.js 26 原生支持运行 `.ts`，本项目不需要构建步骤。

## 直接运行

```bash
cd /firefly/site/main
node server.ts
```

默认监听：

```text
127.0.0.1:3000
```

可以通过环境变量覆盖：

```bash
HOST=127.0.0.1 PORT=3000 node server.ts
```

## Nginx 反向代理

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name xn--qzw410c.love www.xn--qzw410c.love;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 5s;
        proxy_read_timeout 30s;
    }
}
```

修改后检查并重载：

```bash
nginx -t && nginx -s reload
```

如果服务器上同时有其他站点，不要把本站配置随意设为 `default_server`，请按实际 `server_name` 配置。

## systemd 常驻运行

示例 unit：`/etc/systemd/system/firefly-site.service`

```ini
[Unit]
Description=FireflyLoveSite
After=network.target
StartLimitIntervalSec=60
StartLimitBurst=5

[Service]
Type=simple
User=www
Group=www
WorkingDirectory=/firefly/site/main
Environment=NODE_ENV=production
Environment=HOST=127.0.0.1
Environment=PORT=3000
ExecStart=/usr/bin/node /firefly/site/main/server.ts
Restart=on-failure
RestartSec=3
TimeoutStopSec=10
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=full
ProtectHome=true
ReadOnlyPaths=/firefly/site/main

[Install]
WantedBy=multi-user.target
```

启用并启动：

```bash
systemctl daemon-reload
systemctl enable --now firefly-site
systemctl status firefly-site --no-pager
```

常用命令：

```bash
systemctl start firefly-site
systemctl stop firefly-site
systemctl restart firefly-site
systemctl status firefly-site --no-pager
journalctl -u firefly-site -f
```

## 和宝塔 Node 项目二选一

同一个 `3000` 端口只能有一个进程监听。可以按顺序切换，但不要同时启动：

- systemd 管理时：`systemctl start/stop firefly-site`
- 宝塔 Node 项目管理时：在宝塔面板启动/停止项目

切换前先确认端口已释放：

```bash
ss -ltnp | grep ':3000 '
```

没有输出表示端口空闲，可以启动另一套。若两套都设置了开机自启，重启时会抢端口，务必只保留一个开机自启。

宝塔 Node 项目如果要运行本项目，需要：

- 目录：`/firefly/site/main`
- 启动命令：`PORT=3000 HOST=127.0.0.1 node server.ts`
- Node 版本：24 以上
- 端口：`3000`

## 修改跳转

编辑 `redirects.json`：

```json
{
  "defaultStatus": 302,
  "preserveQuery": true,
  "rules": [
    {
      "from": "/example",
      "to": "https://example.com/new-path",
      "status": 301
    }
  ]
}
```

规则说明：

- `from` 以 `/` 开头，区分大小写，不能带查询串或锚点
- `to` 必须是完整的 `http://` 或 `https://` 地址，可以写中文域名
- `status` 只能是 `301` 或 `302`
- `preserveQuery` 控制是否保留访问者 URL 的查询参数
- 根路径 `/` 保留给默认页面，不能作为跳转源

保存后服务会自动重载，不需要重启。

## 检查服务

```bash
curl -I http://127.0.0.1:3000/
curl -I http://127.0.0.1:3000/image.Firefly
```

首页返回 `200`，跳转路径返回 `302` 或配置的状态码，并且响应头包含 `Location`。

## 静态文件保护

`server.ts` 默认不会对外提供以下文件：

- `server.ts`
- `redirects.json`
- `package.json`
- `package-lock.json`
- `tsconfig.json`
- `README.md`
- `.git/`
- `node_modules/`
- 其他以 `.` 开头的路径

新增服务端源码或配置文件时，请同步更新 `server.ts` 里的保护列表。
