#!/usr/bin/env bash
#
# 站点构建产物检查。
#
# 项目是纯静态的 Vue + Vite 单页应用，没有服务端进程，因此检查流程为：
#   1. 构建 dist/
#   2. 用 vite preview 起一个带 SPA 回退的静态服务器
#   3. 校验首页、子路由回退、跳转路径与文档保护
#
# 跳转（/image.Firefly 等）在本项目里是前端路由行为，服务器只会返回
# index.html，所以这里断言的是 200 与内容，而不是 3xx 响应头。
set -euo pipefail

ROOT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

PORT="${CI_PORT:-3100}"
BASE_URL="http://127.0.0.1:${PORT}"
TMP_DIR="$(mktemp -d)"
SERVER_PID=""

cleanup() {
  if [[ -n "${SERVER_PID}" ]] && kill -0 "${SERVER_PID}" 2>/dev/null; then
    kill "${SERVER_PID}" 2>/dev/null || true
    wait "${SERVER_PID}" 2>/dev/null || true
  fi
  rm -rf "${TMP_DIR}"
}
trap cleanup EXIT

echo "==> Building"
pnpm build-only

if [[ ! -f "dist/index.html" ]]; then
  echo "Build did not produce dist/index.html." >&2
  exit 1
fi

echo "==> Starting preview server on ${BASE_URL}"
pnpm exec vite preview \
  --host 127.0.0.1 \
  --port "${PORT}" \
  --strictPort \
  --outDir dist \
  --logLevel warn \
  >"${TMP_DIR}/preview.log" 2>&1 &
SERVER_PID=$!

ready=0
for _ in $(seq 1 80); do
  if ! kill -0 "${SERVER_PID}" 2>/dev/null; then
    echo "Preview server exited before becoming ready." >&2
    cat "${TMP_DIR}/preview.log" >&2
    exit 1
  fi
  if curl -fsS --max-time 2 "${BASE_URL}/" -o "${TMP_DIR}/index.html"; then
    ready=1
    break
  fi
  sleep 0.25
done

if [[ "${ready}" != "1" ]]; then
  echo "Preview server did not become ready in time." >&2
  cat "${TMP_DIR}/preview.log" >&2
  exit 1
fi

echo "==> Checking home page"
grep -q '流萤.love' "${TMP_DIR}/index.html"
grep -q '<div id="app"></div>' "${TMP_DIR}/index.html"

expect_status() {
  local path="$1"
  local expected="$2"
  local actual
  actual="$(curl -sS -o /dev/null -w '%{http_code}' --max-time 5 "${BASE_URL}${path}")"
  if [[ "${actual}" != "${expected}" ]]; then
    echo "Expected HTTP ${expected} for ${path}, got ${actual}." >&2
    exit 1
  fi
}

# 断言某路径返回 SPA 入口（回退成功），用于子路由与前端跳转路径
expect_spa() {
  local path="$1"
  local body="${TMP_DIR}/body.html"
  local status
  status="$(curl -sS -o "${body}" -w '%{http_code}' --max-time 5 "${BASE_URL}${path}")"
  if [[ "${status}" != "200" ]]; then
    echo "Expected HTTP 200 for ${path}, got ${status}." >&2
    exit 1
  fi
  if ! grep -q '<div id="app"></div>' "${body}"; then
    echo "Expected SPA entry for ${path}, got a non-entry response." >&2
    exit 1
  fi
}

echo "==> Checking SPA routes"
for route in "/" "/characters" "/gallery" "/videos" "/library"; do
  expect_spa "${route}"
done

echo "==> Checking redirect paths"
# 这些路径由前端路由处理，服务器应回退到 index.html
for route in "/image.Firefly" "/like.Firefly" "/look.html" "/pixiv.Firefly" "/thank.html"; do
  expect_spa "${route}"
done

echo "==> Checking hashed assets"
# 从构建产物中取出一个 JS 资源路径，确认可访问
asset_path="$(grep -oE '/assets/[A-Za-z0-9_-]+\.js' dist/index.html | head -n1 || true)"
if [[ -z "${asset_path}" ]]; then
  echo "No hashed JS asset referenced by dist/index.html." >&2
  exit 1
fi
expect_status "${asset_path}" "200"

echo "==> Checking bundled images and fonts"
expect_status "/favicon.ico" "200"

echo "==> Checking Chrome 99 CSS compatibility"
# Chrome 99 WebView does not support Media Queries range syntax.
if grep -RqE 'width[[:space:]]*(<=|>=)' dist/assets --include='*.css'; then
  echo "Found Media Queries range syntax in built CSS; set cssTarget to chrome99." >&2
  exit 1
fi
if ! grep -Rq 'max-width' dist/assets --include='*.css'; then
  echo "No max-width media queries found in built CSS." >&2
  exit 1
fi

echo "==> Checking source guard"
# dist/ 只包含构建产物，源码与文档不应被发布
for file in package.json README.md DEPLOYMENT.md server.ts redirects.json .env .git; do
  if [[ -e "dist/${file}" ]]; then
    echo "Source file must not exist in dist/: ${file}" >&2
    exit 1
  fi
done

# Vite preview uses SPA fallback for unknown routes. A 200 is acceptable only
# when it is the SPA shell; it must not expose raw package.json or Markdown.
for path in "/package.json" "/README.md" "/DEPLOYMENT.md"; do
  body="${TMP_DIR}/guard-body"
  status="$(curl -sS -o "${body}" -w '%{http_code}' --max-time 5 "${BASE_URL}${path}")"
  if [[ "${status}" != "200" && "${status}" != "404" ]]; then
    echo "Unexpected HTTP ${status} for source guard path ${path}." >&2
    exit 1
  fi
  if [[ "${status}" == "200" ]] && ! grep -q '<div id="app"></div>' "${body}"; then
    echo "Source guard path ${path} returned non-SPA content." >&2
    exit 1
  fi
done

echo "CI checks passed."
