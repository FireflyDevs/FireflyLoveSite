#!/usr/bin/env bash
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

HOST=127.0.0.1 PORT="${PORT}" NODE_ENV=test node server.ts >"${TMP_DIR}/server.log" 2>&1 &
SERVER_PID=$!

ready=0
for _ in $(seq 1 60); do
  if ! kill -0 "${SERVER_PID}" 2>/dev/null; then
    echo "Server exited before becoming ready." >&2
    cat "${TMP_DIR}/server.log" >&2
    exit 1
  fi
  if curl -fsS --max-time 2 "${BASE_URL}/" -o "${TMP_DIR}/index.html"; then
    ready=1
    break
  fi
  sleep 0.25
done

if [[ "${ready}" != "1" ]]; then
  echo "Server did not become ready in time." >&2
  cat "${TMP_DIR}/server.log" >&2
  exit 1
fi

grep -q '流萤.love' "${TMP_DIR}/index.html"

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

check_redirect() {
  local path="$1"
  local expected_location="$2"
  local headers
  headers="$(curl -sS -D - -o /dev/null --max-time 5 "${BASE_URL}${path}")"
  if ! grep -qE '^HTTP/1\.[01] 302' <<<"${headers}"; then
    echo "Expected 302 for ${path}." >&2
    exit 1
  fi
  if ! grep -qiF "Location: ${expected_location}" <<<"${headers}"; then
    echo "Unexpected redirect target for ${path}." >&2
    printf '%s\n' "${headers}" >&2
    exit 1
  fi
}

check_redirect "/image.Firefly" "https://img.xn--qzw410c.love/image.Firefly"
check_redirect "/like.Firefly" "https://img.xn--qzw410c.love/like.Firefly"
check_redirect "/look.html" "https://img.xn--qzw410c.love/look.html"
check_redirect "/pixiv.Firefly" "https://img.xn--qzw410c.love/pixiv.Firefly"
check_redirect "/thank.html" "https://img.xn--qzw410c.love/thank.html"
check_redirect "/like.Firefly?a=1&b=2" "https://img.xn--qzw410c.love/like.Firefly?a=1&b=2"

expect_status "/pic/ff/hero.jpg" "200"
expect_status "/server.ts" "404"
expect_status "/redirects.json" "404"
expect_status "/package.json" "404"
expect_status "/README.md" "404"
expect_status "/DEPLOYMENT.md" "404"

post_status="$(curl -sS -o /dev/null -w '%{http_code}' --max-time 5 -X POST "${BASE_URL}/")"
if [[ "${post_status}" != "405" ]]; then
  echo "Expected HTTP 405 for POST /, got ${post_status}." >&2
  exit 1
fi

echo "CI checks passed."
