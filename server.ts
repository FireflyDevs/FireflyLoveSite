import * as fs from 'node:fs';
import * as fsp from 'node:fs/promises';
import * as http from 'node:http';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

import type { IncomingMessage, OutgoingHttpHeaders, ServerResponse } from 'node:http';

const MODULE_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(process.env.SITE_ROOT ?? MODULE_DIR);
const CONFIG_PATH = path.resolve(process.env.REDIRECTS_FILE ?? path.join(ROOT, 'redirects.json'));
const HOST = process.env.HOST ?? '127.0.0.1';
const PORT = Number.parseInt(process.env.PORT ?? '3000', 10);
const DEFAULT_PAGE = 'firefly.html';

type RedirectStatus = 301 | 302;

interface RedirectRuleFile {
  from: string;
  to: string;
  status?: RedirectStatus;
  preserveQuery?: boolean;
  enabled?: boolean;
}

interface RedirectFile {
  defaultStatus?: RedirectStatus;
  preserveQuery?: boolean;
  rules: RedirectRuleFile[];
}

interface CompiledRedirect {
  location: string;
  status: RedirectStatus;
  preserveQuery: boolean;
}

interface RedirectConfig {
  rules: Map<string, CompiledRedirect>;
  defaultStatus: RedirectStatus;
  preserveQueryDefault: boolean;
}

const MIME_TYPES: Readonly<Record<string, string>> = Object.freeze({
  '.avif': 'image/avif',
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.htm': 'text/html; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.mp3': 'audio/mpeg',
  '.mp4': 'video/mp4',
  '.ogg': 'audio/ogg',
  '.otf': 'font/otf',
  '.pdf': 'application/pdf',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8',
  '.webm': 'video/webm',
  '.webmanifest': 'application/manifest+json',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8',
});

const PROTECTED_BASENAMES = new Set([
  '.env',
  'DEPLOYMENT.md',
  'README.md',
  'package-lock.json',
  'package.json',
  'redirects.json',
  'server.ts',
  'tsconfig.json',
]);

const BLOCKED_SEGMENTS = new Set(['.git', 'node_modules']);

function log(message: string): void {
  process.stdout.write(`[${new Date().toISOString()}] ${message}\n`);
}

function fail(message: string): never {
  throw new Error(message);
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isRedirectStatus(value: unknown): value is RedirectStatus {
  return value === 301 || value === 302;
}

function hasErrorCode(error: unknown, codes: readonly string[]): boolean {
  if (typeof error !== 'object' || error === null || !('code' in error)) {
    return false;
  }
  const code = (error as { code?: unknown }).code;
  return typeof code === 'string' && codes.includes(code);
}

function normalizePathname(pathname: string): string {
  if (pathname.length > 1) {
    return pathname.replace(/\/+$/, '') || '/';
  }
  return pathname || '/';
}

function normalizeTarget(raw: string, index: number): string {
  let target: URL;
  try {
    target = new URL(raw);
  } catch {
    return fail(`rules[${index}].to 不是有效 URL: ${raw}`);
  }

  if (target.protocol !== 'http:' && target.protocol !== 'https:') {
    fail(`rules[${index}].to 只支持 http:// 或 https://`);
  }
  if (!target.hostname) {
    fail(`rules[${index}].to 缺少主机名`);
  }
  if (target.username || target.password) {
    fail(`rules[${index}].to 不允许包含用户名或密码`);
  }

  // URL 会把中文域名自动转换为 Punycode，保证 Location 响应头只含 ASCII。
  const location = target.href;
  if (!/^[\x20-\x7e]+$/.test(location)) {
    fail(`rules[${index}].to 包含无法放入 HTTP 响应头的字符，请改用编码后的 URL`);
  }
  return location;
}

function parseRedirectConfig(): RedirectConfig {
  let parsed: unknown;
  try {
    parsed = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
  } catch (error) {
    return fail(`无法读取或解析 ${CONFIG_PATH}: ${errorMessage(error)}`);
  }

  if (!isRecord(parsed)) {
    fail('redirects.json 的根节点必须是对象');
  }

  const defaultStatus = parsed.defaultStatus ?? 302;
  if (!isRedirectStatus(defaultStatus)) {
    fail('defaultStatus 只能是 301 或 302');
  }

  const preserveQueryDefault = parsed.preserveQuery ?? true;
  if (typeof preserveQueryDefault !== 'boolean') {
    fail('preserveQuery 必须是 true 或 false');
  }

  const rawRules = parsed.rules;
  if (!Array.isArray(rawRules)) {
    fail('redirects.json 必须包含 rules 数组');
  }

  const rules = new Map<string, CompiledRedirect>();

  rawRules.forEach((value: unknown, index: number) => {
    if (!isRecord(value)) {
      fail(`rules[${index}] 必须是对象`);
    }
    if (value.enabled !== undefined && typeof value.enabled !== 'boolean') {
      fail(`rules[${index}].enabled 必须是 true 或 false`);
    }
    if (value.enabled === false) {
      return;
    }

    if (typeof value.from !== 'string' || value.from.length === 0) {
      fail(`rules[${index}].from 必须是非空字符串`);
    }
    if (!value.from.startsWith('/')) {
      fail(`rules[${index}].from 必须以 / 开头`);
    }
    if (/[?#]/.test(value.from)) {
      fail(`rules[${index}].from 不能包含查询串或锚点`);
    }

    const from = normalizePathname(value.from);
    if (from === '/') {
      fail(`rules[${index}].from 不能是 /，根路径已保留给默认页面`);
    }
    if (rules.has(from)) {
      fail(`rules[${index}].from 重复: ${from}`);
    }

    if (typeof value.to !== 'string' || value.to.length === 0) {
      fail(`rules[${index}].to 必须是非空字符串`);
    }

    const status = value.status ?? defaultStatus;
    if (!isRedirectStatus(status)) {
      fail(`rules[${index}].status 只能是 301 或 302`);
    }

    const preserveQuery = value.preserveQuery ?? preserveQueryDefault;
    if (typeof preserveQuery !== 'boolean') {
      fail(`rules[${index}].preserveQuery 必须是 true 或 false`);
    }

    rules.set(from, {
      location: normalizeTarget(value.to, index),
      status,
      preserveQuery,
    });
  });

  return { rules, defaultStatus, preserveQueryDefault };
}

function startConfigWatcher(onReload: (config: RedirectConfig) => void): () => void {
  let timer: ReturnType<typeof setTimeout> | undefined;

  const listener = (): void => {
    if (timer !== undefined) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      timer = undefined;
      try {
        const next = parseRedirectConfig();
        onReload(next);
        log(`跳转规则已重新加载: ${next.rules.size} 条`);
      } catch (error) {
        log(`跳转规则重载失败，继续使用旧配置: ${errorMessage(error)}`);
      }
    }, 200);
  };

  fs.watchFile(CONFIG_PATH, { interval: 1000 }, listener);

  return () => {
    if (timer !== undefined) {
      clearTimeout(timer);
    }
    fs.unwatchFile(CONFIG_PATH, listener);
  };
}

function isInsideRoot(candidate: string): boolean {
  return candidate === ROOT || candidate.startsWith(ROOT + path.sep);
}

function resolveStaticPath(pathname: string): string | null {
  let relative = pathname.replace(/^\/+/, '');

  if (relative === '' || relative === 'index.html' || relative === 'index.htm') {
    relative = DEFAULT_PAGE;
  }

  const candidate = path.resolve(ROOT, relative);
  if (!isInsideRoot(candidate)) {
    return null;
  }

  const segments = path.relative(ROOT, candidate).split(path.sep);
  if (segments.some((segment) => segment.startsWith('.') || BLOCKED_SEGMENTS.has(segment))) {
    return null;
  }
  if (PROTECTED_BASENAMES.has(path.basename(candidate))) {
    return null;
  }

  return candidate;
}

function sendText(
  res: ServerResponse,
  method: string,
  statusCode: number,
  message: string,
  extraHeaders: OutgoingHttpHeaders = {},
): void {
  const body = `${message}\n`;
  res.writeHead(statusCode, {
    'Cache-Control': 'no-store',
    'Content-Length': Buffer.byteLength(body),
    'Content-Type': 'text/plain; charset=utf-8',
    'X-Content-Type-Options': 'nosniff',
    ...extraHeaders,
  });
  res.end(method === 'HEAD' ? undefined : body);
}

function sendRedirect(
  req: IncomingMessage,
  res: ServerResponse,
  rule: CompiledRedirect,
  requestUrl: URL,
): void {
  const method = req.method ?? 'GET';
  const target = new URL(rule.location);

  if (rule.preserveQuery) {
    for (const [key, value] of requestUrl.searchParams) {
      target.searchParams.append(key, value);
    }
  }

  const location = target.href;
  const body = `Redirecting to ${location}\n`;

  res.writeHead(rule.status, {
    'Cache-Control': 'no-store',
    'Content-Length': Buffer.byteLength(body),
    'Content-Type': 'text/plain; charset=utf-8',
    Location: location,
    'X-Content-Type-Options': 'nosniff',
  });
  res.end(method === 'HEAD' ? undefined : body);

  log(`REDIRECT ${rule.status} ${requestUrl.pathname} -> ${location}`);
}

async function serveFile(filePath: string, method: string, res: ServerResponse): Promise<void> {
  let realPath: string;
  try {
    realPath = await fsp.realpath(filePath);
  } catch (error) {
    if (hasErrorCode(error, ['ENOENT', 'ENOTDIR'])) {
      sendText(res, method, 404, '404 Not Found');
      return;
    }
    throw error;
  }

  if (!isInsideRoot(realPath)) {
    sendText(res, method, 404, '404 Not Found');
    return;
  }

  const info = await fsp.stat(realPath);
  if (!info.isFile()) {
    sendText(res, method, 404, '404 Not Found');
    return;
  }

  const contentType = MIME_TYPES[path.extname(realPath).toLowerCase()] ?? 'application/octet-stream';
  const isHtml = contentType.startsWith('text/html');

  res.writeHead(200, {
    'Cache-Control': isHtml ? 'no-cache' : 'public, max-age=604800',
    'Content-Length': info.size,
    'Content-Type': contentType,
    'Last-Modified': info.mtime.toUTCString(),
    'X-Content-Type-Options': 'nosniff',
  });

  if (method === 'HEAD') {
    res.end();
    return;
  }

  const stream = fs.createReadStream(realPath);
  stream.on('error', (error) => {
    log(`读取文件失败 ${realPath}: ${errorMessage(error)}`);
    res.destroy();
  });
  stream.pipe(res);
}

async function handleRequest(
  req: IncomingMessage,
  res: ServerResponse,
  config: RedirectConfig,
): Promise<void> {
  const method = req.method ?? 'GET';

  if (method !== 'GET' && method !== 'HEAD') {
    sendText(res, method, 405, '405 Method Not Allowed', { Allow: 'GET, HEAD' });
    return;
  }

  let requestUrl: URL;
  try {
    requestUrl = new URL(req.url ?? '/', 'http://localhost');
  } catch {
    sendText(res, method, 400, '400 Bad Request');
    return;
  }

  let pathname: string;
  try {
    pathname = decodeURIComponent(requestUrl.pathname);
  } catch {
    sendText(res, method, 400, '400 Bad Request');
    return;
  }

  if (pathname.includes('\0')) {
    sendText(res, method, 400, '400 Bad Request');
    return;
  }

  const normalized = normalizePathname(pathname);
  const rule = config.rules.get(normalized);
  if (rule) {
    sendRedirect(req, res, rule, requestUrl);
    return;
  }

  const filePath = resolveStaticPath(normalized);
  if (!filePath) {
    sendText(res, method, 404, '404 Not Found');
    return;
  }

  await serveFile(filePath, method, res);
}

function start(): void {
  if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) {
    process.stderr.write(`无效的 PORT: ${process.env.PORT ?? ''}\n`);
    process.exit(1);
  }

  if (!fs.existsSync(ROOT) || !fs.statSync(ROOT).isDirectory()) {
    process.stderr.write(`站点目录不存在: ${ROOT}\n`);
    process.exit(1);
  }

  let redirectConfig: RedirectConfig;
  try {
    redirectConfig = parseRedirectConfig();
  } catch (error) {
    process.stderr.write(`加载跳转配置失败: ${errorMessage(error)}\n`);
    process.exit(1);
  }

  const defaultPage = path.join(ROOT, DEFAULT_PAGE);
  if (!fs.existsSync(defaultPage)) {
    log(`警告: 默认页面不存在: ${defaultPage}`);
  }

  log(`站点目录: ${ROOT}`);
  log(`跳转配置: ${CONFIG_PATH}`);
  log(`已加载跳转规则: ${redirectConfig.rules.size} 条`);

  const stopWatcher = startConfigWatcher((next) => {
    redirectConfig = next;
  });

  const server = http.createServer((req, res) => {
    void handleRequest(req, res, redirectConfig).catch((error) => {
      log(`请求处理失败: ${errorMessage(error)}`);
      if (!res.headersSent) {
        sendText(res, req.method ?? 'GET', 500, '500 Internal Server Error');
      } else {
        res.destroy();
      }
    });
  });

  let shuttingDown = false;
  const shutdown = (signal: string): void => {
    if (shuttingDown) {
      return;
    }
    shuttingDown = true;
    log(`收到 ${signal}，正在关闭服务`);
    stopWatcher();
    server.close((error) => {
      if (error) {
        log(`关闭服务失败: ${errorMessage(error)}`);
        process.exit(1);
      }
      process.exit(0);
    });
    setTimeout(() => {
      log('关闭超时，强制退出');
      process.exit(1);
    }, 5000).unref();
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  server.on('error', (error) => {
    log(`HTTP 服务错误: ${errorMessage(error)}`);
    stopWatcher();
    process.exit(1);
  });

  server.listen(PORT, HOST, () => {
    log(`Firefly 站点已启动: http://${HOST}:${PORT}/`);
  });
}

start();
