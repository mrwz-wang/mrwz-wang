import process from 'node:process';globalThis._importMeta_={url:import.meta.url,env:process.env};import { tmpdir } from 'node:os';
import { Server } from 'node:http';
import * as path from 'node:path';
import { resolve, dirname, join } from 'node:path';
import nodeCrypto from 'node:crypto';
import { parentPort, threadId } from 'node:worker_threads';
import { getRequestHeader, setResponseHeaders, setResponseStatus, send, getRequestHeaders, setResponseHeader, getRequestURL, getResponseHeader, defineEventHandler, handleCacheHeaders, splitCookiesString, createEvent, fetchWithEvent, isEvent, eventHandler, setHeaders, sendRedirect, proxyRequest, createApp, createRouter as createRouter$1, toNodeListener, lazyEventHandler, getResponseStatus, createError, getRouterParam, readBody, getQuery as getQuery$1, getResponseStatusText } from 'file://C:/Users/lenovo/CodeRep/mrwz-wang/node_modules/h3/dist/index.mjs';
import { readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { nanoid } from 'file://C:/Users/lenovo/CodeRep/mrwz-wang/node_modules/nanoid/index.js';
import matter from 'file://C:/Users/lenovo/CodeRep/mrwz-wang/node_modules/gray-matter/index.js';
import * as fs from 'node:fs';
import { v2 } from 'file://C:/Users/lenovo/CodeRep/mrwz-wang/node_modules/cloudinary/cloudinary.js';
import { createRenderer, getRequestDependencies, getPreloadLinks, getPrefetchLinks } from 'file://C:/Users/lenovo/CodeRep/mrwz-wang/node_modules/vue-bundle-renderer/dist/runtime.mjs';
import destr from 'file://C:/Users/lenovo/CodeRep/mrwz-wang/node_modules/destr/dist/index.mjs';
import { withQuery, joinURL, withTrailingSlash, parseURL, withoutBase, getQuery, joinRelativeURL } from 'file://C:/Users/lenovo/CodeRep/mrwz-wang/node_modules/ufo/dist/index.mjs';
import { createHead as createHead$1, propsToString, renderSSRHead } from 'file://C:/Users/lenovo/CodeRep/mrwz-wang/node_modules/unhead/dist/server.mjs';
import { isVNode, toValue, isRef } from 'file://C:/Users/lenovo/CodeRep/mrwz-wang/node_modules/vue/index.mjs';
import { walkResolver } from 'file://C:/Users/lenovo/CodeRep/mrwz-wang/node_modules/unhead/dist/utils.mjs';
import { klona } from 'file://C:/Users/lenovo/CodeRep/mrwz-wang/node_modules/klona/dist/index.mjs';
import defu, { defuFn } from 'file://C:/Users/lenovo/CodeRep/mrwz-wang/node_modules/defu/dist/defu.mjs';
import { snakeCase } from 'file://C:/Users/lenovo/CodeRep/mrwz-wang/node_modules/scule/dist/index.mjs';
import { stringify, uneval } from 'file://C:/Users/lenovo/CodeRep/mrwz-wang/node_modules/devalue/index.js';
import { DeprecationsPlugin, PromisesPlugin, TemplateParamsPlugin, AliasSortingPlugin } from 'file://C:/Users/lenovo/CodeRep/mrwz-wang/node_modules/unhead/dist/plugins.mjs';
import { createHooks } from 'file://C:/Users/lenovo/CodeRep/mrwz-wang/node_modules/hookable/dist/index.mjs';
import { createFetch, Headers as Headers$1 } from 'file://C:/Users/lenovo/CodeRep/mrwz-wang/node_modules/ofetch/dist/node.mjs';
import { fetchNodeRequestHandler, callNodeRequestHandler } from 'file://C:/Users/lenovo/CodeRep/mrwz-wang/node_modules/node-mock-http/dist/index.mjs';
import consola, { consola as consola$1 } from 'file://C:/Users/lenovo/CodeRep/mrwz-wang/node_modules/consola/dist/index.mjs';
import { ErrorParser } from 'file://C:/Users/lenovo/CodeRep/mrwz-wang/node_modules/youch-core/build/index.js';
import { Youch } from 'file://C:/Users/lenovo/CodeRep/mrwz-wang/node_modules/youch/build/index.js';
import { SourceMapConsumer } from 'file://C:/Users/lenovo/CodeRep/mrwz-wang/node_modules/source-map/source-map.js';
import { AsyncLocalStorage } from 'node:async_hooks';
import { getContext } from 'file://C:/Users/lenovo/CodeRep/mrwz-wang/node_modules/unctx/dist/index.mjs';
import { captureRawStackTrace, parseRawStackTrace } from 'file://C:/Users/lenovo/CodeRep/mrwz-wang/node_modules/errx/dist/index.js';
import { createStorage, prefixStorage } from 'file://C:/Users/lenovo/CodeRep/mrwz-wang/node_modules/unstorage/dist/index.mjs';
import unstorage_47drivers_47fs from 'file://C:/Users/lenovo/CodeRep/mrwz-wang/node_modules/unstorage/drivers/fs.mjs';
import { digest } from 'file://C:/Users/lenovo/CodeRep/mrwz-wang/node_modules/ohash/dist/index.mjs';
import { toRouteMatcher, createRouter } from 'file://C:/Users/lenovo/CodeRep/mrwz-wang/node_modules/radix3/dist/index.mjs';

function isJsonRequest(event) {
  if (hasReqHeader(event, "accept", "text/html")) {
    return false;
  }
  return hasReqHeader(event, "accept", "application/json") || hasReqHeader(event, "user-agent", "curl/") || hasReqHeader(event, "user-agent", "httpie/") || hasReqHeader(event, "sec-fetch-mode", "cors") || event.path.startsWith("/api/") || event.path.endsWith(".json");
}
function hasReqHeader(event, name, includes) {
  const value = getRequestHeader(event, name);
  return value && typeof value === "string" && value.toLowerCase().includes(includes);
}

const errorHandler$0 = (async function errorhandler(error, event, { defaultHandler }) {
  if (isJsonRequest(event)) {
    return;
  }
  const defaultRes = await defaultHandler(error, event, { json: true });
  const statusCode = error.statusCode || 500;
  if (statusCode === 404 && defaultRes.status === 302) {
    setResponseHeaders(event, defaultRes.headers);
    setResponseStatus(event, defaultRes.status, defaultRes.statusText);
    return send(event, JSON.stringify(defaultRes.body, null, 2));
  }
  if (typeof defaultRes.body !== "string" && Array.isArray(defaultRes.body.stack)) {
    defaultRes.body.stack = defaultRes.body.stack.join("\n");
  }
  const errorObject = defaultRes.body;
  const url = new URL(errorObject.url);
  errorObject.url = url.pathname + url.search + url.hash;
  errorObject.message ||= "Server Error";
  delete defaultRes.headers["content-type"];
  delete defaultRes.headers["content-security-policy"];
  setResponseHeaders(event, defaultRes.headers);
  const reqHeaders = getRequestHeaders(event);
  const isRenderingError = event.path.startsWith("/__nuxt_error") || !!reqHeaders["x-nuxt-error"];
  const res = isRenderingError ? null : await useNitroApp().localFetch(
    withQuery(joinURL(useRuntimeConfig(event).app.baseURL, "/__nuxt_error"), errorObject),
    {
      headers: { ...reqHeaders, "x-nuxt-error": "true" },
      redirect: "manual"
    }
  ).catch(() => null);
  if (event.handled) {
    return;
  }
  if (!res) {
    const { template } = await Promise.resolve().then(function () { return errorDev; }) ;
    {
      errorObject.description = errorObject.message;
    }
    setResponseHeader(event, "Content-Type", "text/html;charset=UTF-8");
    return send(event, template(errorObject));
  }
  const html = await res.text();
  for (const [header, value] of res.headers.entries()) {
    setResponseHeader(event, header, value);
  }
  setResponseStatus(event, res.status && res.status !== 200 ? res.status : defaultRes.status, res.statusText || defaultRes.statusText);
  return send(event, html);
});

function defineNitroErrorHandler(handler) {
  return handler;
}

const errorHandler$1 = defineNitroErrorHandler(
  async function defaultNitroErrorHandler(error, event) {
    const res = await defaultHandler(error, event);
    setResponseHeaders(event, res.headers);
    setResponseStatus(event, res.status, res.statusText);
    return send(
      event,
      typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2)
    );
  }
);
async function defaultHandler(error, event, opts) {
  const isSensitive = error.unhandled || error.fatal;
  const statusCode = error.statusCode || 500;
  const statusMessage = error.statusMessage || "Server Error";
  const url = getRequestURL(event, { xForwardedHost: true, xForwardedProto: true });
  if (statusCode === 404) {
    const baseURL = "/mrwz-wang/";
    if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) {
      const redirectTo = `${baseURL}${url.pathname.slice(1)}${url.search}`;
      return {
        status: 302,
        statusText: "Found",
        headers: { location: redirectTo },
        body: `Redirecting...`
      };
    }
  }
  await loadStackTrace(error).catch(consola.error);
  const youch = new Youch();
  if (isSensitive && !opts?.silent) {
    const tags = [error.unhandled && "[unhandled]", error.fatal && "[fatal]"].filter(Boolean).join(" ");
    const ansiError = await (await youch.toANSI(error)).replaceAll(process.cwd(), ".");
    consola.error(
      `[request error] ${tags} [${event.method}] ${url}

`,
      ansiError
    );
  }
  const useJSON = opts?.json || !getRequestHeader(event, "accept")?.includes("text/html");
  const headers = {
    "content-type": useJSON ? "application/json" : "text/html",
    // Prevent browser from guessing the MIME types of resources.
    "x-content-type-options": "nosniff",
    // Prevent error page from being embedded in an iframe
    "x-frame-options": "DENY",
    // Prevent browsers from sending the Referer header
    "referrer-policy": "no-referrer",
    // Disable the execution of any js
    "content-security-policy": "script-src 'self' 'unsafe-inline'; object-src 'none'; base-uri 'self';"
  };
  if (statusCode === 404 || !getResponseHeader(event, "cache-control")) {
    headers["cache-control"] = "no-cache";
  }
  const body = useJSON ? {
    error: true,
    url,
    statusCode,
    statusMessage,
    message: error.message,
    data: error.data,
    stack: error.stack?.split("\n").map((line) => line.trim())
  } : await youch.toHTML(error, {
    request: {
      url: url.href,
      method: event.method,
      headers: getRequestHeaders(event)
    }
  });
  return {
    status: statusCode,
    statusText: statusMessage,
    headers,
    body
  };
}
async function loadStackTrace(error) {
  if (!(error instanceof Error)) {
    return;
  }
  const parsed = await new ErrorParser().defineSourceLoader(sourceLoader).parse(error);
  const stack = error.message + "\n" + parsed.frames.map((frame) => fmtFrame(frame)).join("\n");
  Object.defineProperty(error, "stack", { value: stack });
  if (error.cause) {
    await loadStackTrace(error.cause).catch(consola.error);
  }
}
async function sourceLoader(frame) {
  if (!frame.fileName || frame.fileType !== "fs" || frame.type === "native") {
    return;
  }
  if (frame.type === "app") {
    const rawSourceMap = await readFile(`${frame.fileName}.map`, "utf8").catch(() => {
    });
    if (rawSourceMap) {
      const consumer = await new SourceMapConsumer(rawSourceMap);
      const originalPosition = consumer.originalPositionFor({ line: frame.lineNumber, column: frame.columnNumber });
      if (originalPosition.source && originalPosition.line) {
        frame.fileName = resolve(dirname(frame.fileName), originalPosition.source);
        frame.lineNumber = originalPosition.line;
        frame.columnNumber = originalPosition.column || 0;
      }
    }
  }
  const contents = await readFile(frame.fileName, "utf8").catch(() => {
  });
  return contents ? { contents } : void 0;
}
function fmtFrame(frame) {
  if (frame.type === "native") {
    return frame.raw;
  }
  const src = `${frame.fileName || ""}:${frame.lineNumber}:${frame.columnNumber})`;
  return frame.functionName ? `at ${frame.functionName} (${src}` : `at ${src}`;
}

const errorHandlers = [errorHandler$0, errorHandler$1];

async function errorHandler(error, event) {
  for (const handler of errorHandlers) {
    try {
      await handler(error, event, { defaultHandler });
      if (event.handled) {
        return; // Response handled
      }
    } catch(error) {
      // Handler itself thrown, log and continue
      console.error(error);
    }
  }
  // H3 will handle fallback
}

const script = `
if (!window.__NUXT_DEVTOOLS_TIME_METRIC__) {
  Object.defineProperty(window, '__NUXT_DEVTOOLS_TIME_METRIC__', {
    value: {},
    enumerable: false,
    configurable: true,
  })
}
window.__NUXT_DEVTOOLS_TIME_METRIC__.appInit = Date.now()
`;

const _aCy4dcp1Nlz0wxcBjUCqRuqr4TzqIO8MzUO_1Q0UaU = (function(nitro) {
  nitro.hooks.hook("render:html", (htmlContext) => {
    htmlContext.head.push(`<script>${script}<\/script>`);
  });
});

const rootDir = "C:/Users/lenovo/CodeRep/mrwz-wang";

const appHead = {"meta":[{"charset":"utf-8"},{"name":"viewport","content":"width=device-width, initial-scale=1"},{"name":"referrer","content":"never"}],"link":[],"style":[],"script":[],"noscript":[],"title":"个人作品集"};

const appRootTag = "div";

const appRootAttrs = {"id":"__nuxt"};

const appTeleportTag = "div";

const appTeleportAttrs = {"id":"teleports"};

const appId = "nuxt-app";

const devReducers = {
  VNode: (data) => isVNode(data) ? { type: data.type, props: data.props } : void 0,
  URL: (data) => data instanceof URL ? data.toString() : void 0
};
const asyncContext = getContext("nuxt-dev", { asyncContext: true, AsyncLocalStorage });
const _KQ9GAuVbXRavEpPSzLRZSyp7LMVeXgJDeHBMfxj1IY = (nitroApp) => {
  const handler = nitroApp.h3App.handler;
  nitroApp.h3App.handler = (event) => {
    return asyncContext.callAsync({ logs: [], event }, () => handler(event));
  };
  onConsoleLog((_log) => {
    const ctx = asyncContext.tryUse();
    if (!ctx) {
      return;
    }
    const rawStack = captureRawStackTrace();
    if (!rawStack || rawStack.includes("runtime/vite-node.mjs")) {
      return;
    }
    const trace = [];
    let filename = "";
    for (const entry of parseRawStackTrace(rawStack)) {
      if (entry.source === globalThis._importMeta_.url) {
        continue;
      }
      if (EXCLUDE_TRACE_RE.test(entry.source)) {
        continue;
      }
      filename ||= entry.source.replace(withTrailingSlash(rootDir), "");
      trace.push({
        ...entry,
        source: entry.source.startsWith("file://") ? entry.source.replace("file://", "") : entry.source
      });
    }
    const log = {
      ..._log,
      // Pass along filename to allow the client to display more info about where log comes from
      filename,
      // Clean up file names in stack trace
      stack: trace
    };
    ctx.logs.push(log);
  });
  nitroApp.hooks.hook("afterResponse", () => {
    const ctx = asyncContext.tryUse();
    if (!ctx) {
      return;
    }
    return nitroApp.hooks.callHook("dev:ssr-logs", { logs: ctx.logs, path: ctx.event.path });
  });
  nitroApp.hooks.hook("render:html", (htmlContext) => {
    const ctx = asyncContext.tryUse();
    if (!ctx) {
      return;
    }
    try {
      const reducers = Object.assign(/* @__PURE__ */ Object.create(null), devReducers, ctx.event.context._payloadReducers);
      htmlContext.bodyAppend.unshift(`<script type="application/json" data-nuxt-logs="${appId}">${stringify(ctx.logs, reducers)}<\/script>`);
    } catch (e) {
      const shortError = e instanceof Error && "toString" in e ? ` Received \`${e.toString()}\`.` : "";
      console.warn(`[nuxt] Failed to stringify dev server logs.${shortError} You can define your own reducer/reviver for rich types following the instructions in https://nuxt.com/docs/api/composables/use-nuxt-app#payload.`);
    }
  });
};
const EXCLUDE_TRACE_RE = /\/node_modules\/(?:.*\/)?(?:nuxt|nuxt-nightly|nuxt-edge|nuxt3|consola|@vue)\/|core\/runtime\/nitro/;
function onConsoleLog(callback) {
  consola$1.addReporter({
    log(logObj) {
      callback(logObj);
    }
  });
  consola$1.wrapConsole();
}

const plugins = [
  _aCy4dcp1Nlz0wxcBjUCqRuqr4TzqIO8MzUO_1Q0UaU,
_KQ9GAuVbXRavEpPSzLRZSyp7LMVeXgJDeHBMfxj1IY
];

const _lazy_UmmLKR = () => Promise.resolve().then(function () { return content_get$1; });
const _lazy_kOqXRT = () => Promise.resolve().then(function () { return list_get$3; });
const _lazy_46huB0 = () => Promise.resolve().then(function () { return upload_post$1; });
const _lazy_zNH_Oi = () => Promise.resolve().then(function () { return _id__delete$3; });
const _lazy_KgTM_D = () => Promise.resolve().then(function () { return _id__get$1; });
const _lazy_OB1lKD = () => Promise.resolve().then(function () { return import_post$3; });
const _lazy_UpcHEP = () => Promise.resolve().then(function () { return index_get$1; });
const _lazy_Q4zPNr = () => Promise.resolve().then(function () { return add_post$1; });
const _lazy_CLFJKM = () => Promise.resolve().then(function () { return delete_post$1; });
const _lazy_4NRRHw = () => Promise.resolve().then(function () { return list_get$1; });
const _lazy_VekeRL = () => Promise.resolve().then(function () { return local_get$1; });
const _lazy_WkNNUx = () => Promise.resolve().then(function () { return image$1; });
const _lazy_BQ9kb2 = () => Promise.resolve().then(function () { return videos$1; });
const _lazy_IGx5Eb = () => Promise.resolve().then(function () { return _id__delete$1; });
const _lazy_m2J3rF = () => Promise.resolve().then(function () { return _id_$1; });
const _lazy_mF5Ras = () => Promise.resolve().then(function () { return import_post$1; });
const _lazy_xeVpId = () => Promise.resolve().then(function () { return preview$1; });
const _lazy_2qvxNQ = () => Promise.resolve().then(function () { return test$1; });
const _lazy_kKDDBO = () => Promise.resolve().then(function () { return works$1; });
const _lazy_P6iyI5 = () => Promise.resolve().then(function () { return renderer$1; });

const handlers = [
  { route: '/api/about/content', handler: _lazy_UmmLKR, lazy: true, middleware: false, method: "get" },
  { route: '/api/about/list', handler: _lazy_kOqXRT, lazy: true, middleware: false, method: "get" },
  { route: '/api/about/upload', handler: _lazy_46huB0, lazy: true, middleware: false, method: "post" },
  { route: '/api/articles/:id', handler: _lazy_zNH_Oi, lazy: true, middleware: false, method: "delete" },
  { route: '/api/articles/:id', handler: _lazy_KgTM_D, lazy: true, middleware: false, method: "get" },
  { route: '/api/articles/import', handler: _lazy_OB1lKD, lazy: true, middleware: false, method: "post" },
  { route: '/api/articles', handler: _lazy_UpcHEP, lazy: true, middleware: false, method: "get" },
  { route: '/api/gallery/add', handler: _lazy_Q4zPNr, lazy: true, middleware: false, method: "post" },
  { route: '/api/gallery/delete', handler: _lazy_CLFJKM, lazy: true, middleware: false, method: "post" },
  { route: '/api/gallery/list', handler: _lazy_4NRRHw, lazy: true, middleware: false, method: "get" },
  { route: '/api/gallery/local', handler: _lazy_VekeRL, lazy: true, middleware: false, method: "get" },
  { route: '/api/proxy/image', handler: _lazy_WkNNUx, lazy: true, middleware: false, method: undefined },
  { route: '/api/videos', handler: _lazy_BQ9kb2, lazy: true, middleware: false, method: undefined },
  { route: '/api/videos/:id', handler: _lazy_IGx5Eb, lazy: true, middleware: false, method: "delete" },
  { route: '/api/videos/:id', handler: _lazy_m2J3rF, lazy: true, middleware: false, method: undefined },
  { route: '/api/xpc/import', handler: _lazy_mF5Ras, lazy: true, middleware: false, method: "post" },
  { route: '/api/xpc/preview', handler: _lazy_xeVpId, lazy: true, middleware: false, method: undefined },
  { route: '/api/xpc/test', handler: _lazy_2qvxNQ, lazy: true, middleware: false, method: undefined },
  { route: '/api/xpc/works', handler: _lazy_kKDDBO, lazy: true, middleware: false, method: undefined },
  { route: '/__nuxt_error', handler: _lazy_P6iyI5, lazy: true, middleware: false, method: undefined },
  { route: '/**', handler: _lazy_P6iyI5, lazy: true, middleware: false, method: undefined }
];

const serverAssets = [{"baseName":"server","dir":"C:/Users/lenovo/CodeRep/mrwz-wang/server/assets"}];

const assets = createStorage();

for (const asset of serverAssets) {
  assets.mount(asset.baseName, unstorage_47drivers_47fs({ base: asset.dir, ignore: (asset?.ignore || []) }));
}

const storage = createStorage({});

storage.mount('/assets', assets);

storage.mount('root', unstorage_47drivers_47fs({"driver":"fs","readOnly":true,"base":"C:/Users/lenovo/CodeRep/mrwz-wang","watchOptions":{"ignored":[null]}}));
storage.mount('src', unstorage_47drivers_47fs({"driver":"fs","readOnly":true,"base":"C:/Users/lenovo/CodeRep/mrwz-wang/server","watchOptions":{"ignored":[null]}}));
storage.mount('build', unstorage_47drivers_47fs({"driver":"fs","readOnly":false,"base":"C:/Users/lenovo/CodeRep/mrwz-wang/.nuxt"}));
storage.mount('cache', unstorage_47drivers_47fs({"driver":"fs","readOnly":false,"base":"C:/Users/lenovo/CodeRep/mrwz-wang/.nuxt/cache"}));
storage.mount('data', unstorage_47drivers_47fs({"driver":"fs","base":"C:/Users/lenovo/CodeRep/mrwz-wang/.data/kv"}));

function useStorage(base = "") {
  return base ? prefixStorage(storage, base) : storage;
}

function hash(value) {
  return digest(typeof value === "string" ? value : serialize(value)).replace(/[-_]/g, "").slice(0, 10);
}
function serialize(object) {
  const hasher = new Hasher();
  hasher.dispatch(object);
  return hasher.buff;
}
class Hasher {
  buff = "";
  #context = /* @__PURE__ */ new Map();
  write(str) {
    this.buff += str;
  }
  dispatch(value) {
    const type = value === null ? "null" : typeof value;
    return this[type](value);
  }
  object(object) {
    if (object && typeof object.toJSON === "function") {
      return this.object(object.toJSON());
    }
    const objString = Object.prototype.toString.call(object);
    let objType = "";
    const objectLength = objString.length;
    objType = objectLength < 10 ? "unknown:[" + objString + "]" : objString.slice(8, objectLength - 1);
    objType = objType.toLowerCase();
    let objectNumber = null;
    if ((objectNumber = this.#context.get(object)) === void 0) {
      this.#context.set(object, this.#context.size);
    } else {
      return this.dispatch("[CIRCULAR:" + objectNumber + "]");
    }
    if (typeof Buffer !== "undefined" && Buffer.isBuffer && Buffer.isBuffer(object)) {
      this.write("buffer:");
      return this.write(object.toString("utf8"));
    }
    if (objType !== "object" && objType !== "function" && objType !== "asyncfunction") {
      if (this[objType]) {
        this[objType](object);
      } else {
        this.unknown(object, objType);
      }
    } else {
      const keys = Object.keys(object).sort();
      const extraKeys = [];
      this.write("object:" + (keys.length + extraKeys.length) + ":");
      const dispatchForKey = (key) => {
        this.dispatch(key);
        this.write(":");
        this.dispatch(object[key]);
        this.write(",");
      };
      for (const key of keys) {
        dispatchForKey(key);
      }
      for (const key of extraKeys) {
        dispatchForKey(key);
      }
    }
  }
  array(arr, unordered) {
    unordered = unordered === void 0 ? false : unordered;
    this.write("array:" + arr.length + ":");
    if (!unordered || arr.length <= 1) {
      for (const entry of arr) {
        this.dispatch(entry);
      }
      return;
    }
    const contextAdditions = /* @__PURE__ */ new Map();
    const entries = arr.map((entry) => {
      const hasher = new Hasher();
      hasher.dispatch(entry);
      for (const [key, value] of hasher.#context) {
        contextAdditions.set(key, value);
      }
      return hasher.toString();
    });
    this.#context = contextAdditions;
    entries.sort();
    return this.array(entries, false);
  }
  date(date) {
    return this.write("date:" + date.toJSON());
  }
  symbol(sym) {
    return this.write("symbol:" + sym.toString());
  }
  unknown(value, type) {
    this.write(type);
    if (!value) {
      return;
    }
    this.write(":");
    if (value && typeof value.entries === "function") {
      return this.array(
        [...value.entries()],
        true
        /* ordered */
      );
    }
  }
  error(err) {
    return this.write("error:" + err.toString());
  }
  boolean(bool) {
    return this.write("bool:" + bool);
  }
  string(string) {
    this.write("string:" + string.length + ":");
    this.write(string);
  }
  function(fn) {
    this.write("fn:");
    if (isNativeFunction(fn)) {
      this.dispatch("[native]");
    } else {
      this.dispatch(fn.toString());
    }
  }
  number(number) {
    return this.write("number:" + number);
  }
  null() {
    return this.write("Null");
  }
  undefined() {
    return this.write("Undefined");
  }
  regexp(regex) {
    return this.write("regex:" + regex.toString());
  }
  arraybuffer(arr) {
    this.write("arraybuffer:");
    return this.dispatch(new Uint8Array(arr));
  }
  url(url) {
    return this.write("url:" + url.toString());
  }
  map(map) {
    this.write("map:");
    const arr = [...map];
    return this.array(arr, false);
  }
  set(set) {
    this.write("set:");
    const arr = [...set];
    return this.array(arr, false);
  }
  bigint(number) {
    return this.write("bigint:" + number.toString());
  }
}
for (const type of [
  "uint8array",
  "uint8clampedarray",
  "unt8array",
  "uint16array",
  "unt16array",
  "uint32array",
  "unt32array",
  "float32array",
  "float64array"
]) {
  Hasher.prototype[type] = function(arr) {
    this.write(type + ":");
    return this.array([...arr], false);
  };
}
const nativeFunc = "[native code] }";
const nativeFuncLength = nativeFunc.length;
function isNativeFunction(f) {
  if (typeof f !== "function") {
    return false;
  }
  return Function.prototype.toString.call(f).slice(-nativeFuncLength) === nativeFunc;
}

function defaultCacheOptions() {
  return {
    name: "_",
    base: "/cache",
    swr: true,
    maxAge: 1
  };
}
function defineCachedFunction(fn, opts = {}) {
  opts = { ...defaultCacheOptions(), ...opts };
  const pending = {};
  const group = opts.group || "nitro/functions";
  const name = opts.name || fn.name || "_";
  const integrity = opts.integrity || hash([fn, opts]);
  const validate = opts.validate || ((entry) => entry.value !== void 0);
  async function get(key, resolver, shouldInvalidateCache, event) {
    const cacheKey = [opts.base, group, name, key + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");
    let entry = await useStorage().getItem(cacheKey).catch((error) => {
      console.error(`[cache] Cache read error.`, error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }) || {};
    if (typeof entry !== "object") {
      entry = {};
      const error = new Error("Malformed data read from cache.");
      console.error("[cache]", error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }
    const ttl = (opts.maxAge ?? 0) * 1e3;
    if (ttl) {
      entry.expires = Date.now() + ttl;
    }
    const expired = shouldInvalidateCache || entry.integrity !== integrity || ttl && Date.now() - (entry.mtime || 0) > ttl || validate(entry) === false;
    const _resolve = async () => {
      const isPending = pending[key];
      if (!isPending) {
        if (entry.value !== void 0 && (opts.staleMaxAge || 0) >= 0 && opts.swr === false) {
          entry.value = void 0;
          entry.integrity = void 0;
          entry.mtime = void 0;
          entry.expires = void 0;
        }
        pending[key] = Promise.resolve(resolver());
      }
      try {
        entry.value = await pending[key];
      } catch (error) {
        if (!isPending) {
          delete pending[key];
        }
        throw error;
      }
      if (!isPending) {
        entry.mtime = Date.now();
        entry.integrity = integrity;
        delete pending[key];
        if (validate(entry) !== false) {
          let setOpts;
          if (opts.maxAge && !opts.swr) {
            setOpts = { ttl: opts.maxAge };
          }
          const promise = useStorage().setItem(cacheKey, entry, setOpts).catch((error) => {
            console.error(`[cache] Cache write error.`, error);
            useNitroApp().captureError(error, { event, tags: ["cache"] });
          });
          if (event?.waitUntil) {
            event.waitUntil(promise);
          }
        }
      }
    };
    const _resolvePromise = expired ? _resolve() : Promise.resolve();
    if (entry.value === void 0) {
      await _resolvePromise;
    } else if (expired && event && event.waitUntil) {
      event.waitUntil(_resolvePromise);
    }
    if (opts.swr && validate(entry) !== false) {
      _resolvePromise.catch((error) => {
        console.error(`[cache] SWR handler error.`, error);
        useNitroApp().captureError(error, { event, tags: ["cache"] });
      });
      return entry;
    }
    return _resolvePromise.then(() => entry);
  }
  return async (...args) => {
    const shouldBypassCache = await opts.shouldBypassCache?.(...args);
    if (shouldBypassCache) {
      return fn(...args);
    }
    const key = await (opts.getKey || getKey)(...args);
    const shouldInvalidateCache = await opts.shouldInvalidateCache?.(...args);
    const entry = await get(
      key,
      () => fn(...args),
      shouldInvalidateCache,
      args[0] && isEvent(args[0]) ? args[0] : void 0
    );
    let value = entry.value;
    if (opts.transform) {
      value = await opts.transform(entry, ...args) || value;
    }
    return value;
  };
}
function cachedFunction(fn, opts = {}) {
  return defineCachedFunction(fn, opts);
}
function getKey(...args) {
  return args.length > 0 ? hash(args) : "";
}
function escapeKey(key) {
  return String(key).replace(/\W/g, "");
}
function defineCachedEventHandler(handler, opts = defaultCacheOptions()) {
  const variableHeaderNames = (opts.varies || []).filter(Boolean).map((h) => h.toLowerCase()).sort();
  const _opts = {
    ...opts,
    getKey: async (event) => {
      const customKey = await opts.getKey?.(event);
      if (customKey) {
        return escapeKey(customKey);
      }
      const _path = event.node.req.originalUrl || event.node.req.url || event.path;
      let _pathname;
      try {
        _pathname = escapeKey(decodeURI(parseURL(_path).pathname)).slice(0, 16) || "index";
      } catch {
        _pathname = "-";
      }
      const _hashedPath = `${_pathname}.${hash(_path)}`;
      const _headers = variableHeaderNames.map((header) => [header, event.node.req.headers[header]]).map(([name, value]) => `${escapeKey(name)}.${hash(value)}`);
      return [_hashedPath, ..._headers].join(":");
    },
    validate: (entry) => {
      if (!entry.value) {
        return false;
      }
      if (entry.value.code >= 400) {
        return false;
      }
      if (entry.value.body === void 0) {
        return false;
      }
      if (entry.value.headers.etag === "undefined" || entry.value.headers["last-modified"] === "undefined") {
        return false;
      }
      return true;
    },
    group: opts.group || "nitro/handlers",
    integrity: opts.integrity || hash([handler, opts])
  };
  const _cachedHandler = cachedFunction(
    async (incomingEvent) => {
      const variableHeaders = {};
      for (const header of variableHeaderNames) {
        const value = incomingEvent.node.req.headers[header];
        if (value !== void 0) {
          variableHeaders[header] = value;
        }
      }
      const reqProxy = cloneWithProxy(incomingEvent.node.req, {
        headers: variableHeaders
      });
      const resHeaders = {};
      let _resSendBody;
      const resProxy = cloneWithProxy(incomingEvent.node.res, {
        statusCode: 200,
        writableEnded: false,
        writableFinished: false,
        headersSent: false,
        closed: false,
        getHeader(name) {
          return resHeaders[name];
        },
        setHeader(name, value) {
          resHeaders[name] = value;
          return this;
        },
        getHeaderNames() {
          return Object.keys(resHeaders);
        },
        hasHeader(name) {
          return name in resHeaders;
        },
        removeHeader(name) {
          delete resHeaders[name];
        },
        getHeaders() {
          return resHeaders;
        },
        end(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2();
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return this;
        },
        write(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2(void 0);
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return true;
        },
        writeHead(statusCode, headers2) {
          this.statusCode = statusCode;
          if (headers2) {
            if (Array.isArray(headers2) || typeof headers2 === "string") {
              throw new TypeError("Raw headers  is not supported.");
            }
            for (const header in headers2) {
              const value = headers2[header];
              if (value !== void 0) {
                this.setHeader(
                  header,
                  value
                );
              }
            }
          }
          return this;
        }
      });
      const event = createEvent(reqProxy, resProxy);
      event.fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: useNitroApp().localFetch
      });
      event.$fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: globalThis.$fetch
      });
      event.waitUntil = incomingEvent.waitUntil;
      event.context = incomingEvent.context;
      event.context.cache = {
        options: _opts
      };
      const body = await handler(event) || _resSendBody;
      const headers = event.node.res.getHeaders();
      headers.etag = String(
        headers.Etag || headers.etag || `W/"${hash(body)}"`
      );
      headers["last-modified"] = String(
        headers["Last-Modified"] || headers["last-modified"] || (/* @__PURE__ */ new Date()).toUTCString()
      );
      const cacheControl = [];
      if (opts.swr) {
        if (opts.maxAge) {
          cacheControl.push(`s-maxage=${opts.maxAge}`);
        }
        if (opts.staleMaxAge) {
          cacheControl.push(`stale-while-revalidate=${opts.staleMaxAge}`);
        } else {
          cacheControl.push("stale-while-revalidate");
        }
      } else if (opts.maxAge) {
        cacheControl.push(`max-age=${opts.maxAge}`);
      }
      if (cacheControl.length > 0) {
        headers["cache-control"] = cacheControl.join(", ");
      }
      const cacheEntry = {
        code: event.node.res.statusCode,
        headers,
        body
      };
      return cacheEntry;
    },
    _opts
  );
  return defineEventHandler(async (event) => {
    if (opts.headersOnly) {
      if (handleCacheHeaders(event, { maxAge: opts.maxAge })) {
        return;
      }
      return handler(event);
    }
    const response = await _cachedHandler(
      event
    );
    if (event.node.res.headersSent || event.node.res.writableEnded) {
      return response.body;
    }
    if (handleCacheHeaders(event, {
      modifiedTime: new Date(response.headers["last-modified"]),
      etag: response.headers.etag,
      maxAge: opts.maxAge
    })) {
      return;
    }
    event.node.res.statusCode = response.code;
    for (const name in response.headers) {
      const value = response.headers[name];
      if (name === "set-cookie") {
        event.node.res.appendHeader(
          name,
          splitCookiesString(value)
        );
      } else {
        if (value !== void 0) {
          event.node.res.setHeader(name, value);
        }
      }
    }
    return response.body;
  });
}
function cloneWithProxy(obj, overrides) {
  return new Proxy(obj, {
    get(target, property, receiver) {
      if (property in overrides) {
        return overrides[property];
      }
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      if (property in overrides) {
        overrides[property] = value;
        return true;
      }
      return Reflect.set(target, property, value, receiver);
    }
  });
}
const cachedEventHandler = defineCachedEventHandler;

const inlineAppConfig = {
  "nuxt": {}
};



const appConfig = defuFn(inlineAppConfig);

function getEnv(key, opts) {
  const envKey = snakeCase(key).toUpperCase();
  return destr(
    process.env[opts.prefix + envKey] ?? process.env[opts.altPrefix + envKey]
  );
}
function _isObject(input) {
  return typeof input === "object" && !Array.isArray(input);
}
function applyEnv(obj, opts, parentKey = "") {
  for (const key in obj) {
    const subKey = parentKey ? `${parentKey}_${key}` : key;
    const envValue = getEnv(subKey, opts);
    if (_isObject(obj[key])) {
      if (_isObject(envValue)) {
        obj[key] = { ...obj[key], ...envValue };
        applyEnv(obj[key], opts, subKey);
      } else if (envValue === void 0) {
        applyEnv(obj[key], opts, subKey);
      } else {
        obj[key] = envValue ?? obj[key];
      }
    } else {
      obj[key] = envValue ?? obj[key];
    }
    if (opts.envExpansion && typeof obj[key] === "string") {
      obj[key] = _expandFromEnv(obj[key]);
    }
  }
  return obj;
}
const envExpandRx = /\{\{([^{}]*)\}\}/g;
function _expandFromEnv(value) {
  return value.replace(envExpandRx, (match, key) => {
    return process.env[key] || match;
  });
}

const _inlineRuntimeConfig = {
  "app": {
    "baseURL": "/mrwz-wang/",
    "buildId": "dev",
    "buildAssetsDir": "assets",
    "cdnURL": ""
  },
  "nitro": {
    "envPrefix": "NUXT_",
    "routeRules": {
      "/__nuxt_error": {
        "cache": false
      },
      "/content/**": {
        "headers": {
          "cache-control": "public, max-age=31536000"
        }
      },
      "/assets/builds/meta/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable"
        }
      },
      "/assets/builds/**": {
        "headers": {
          "cache-control": "public, max-age=1, immutable"
        }
      }
    }
  },
  "public": {}
};
const envOptions = {
  prefix: "NITRO_",
  altPrefix: _inlineRuntimeConfig.nitro.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? "_",
  envExpansion: _inlineRuntimeConfig.nitro.envExpansion ?? process.env.NITRO_ENV_EXPANSION ?? false
};
const _sharedRuntimeConfig = _deepFreeze(
  applyEnv(klona(_inlineRuntimeConfig), envOptions)
);
function useRuntimeConfig(event) {
  if (!event) {
    return _sharedRuntimeConfig;
  }
  if (event.context.nitro.runtimeConfig) {
    return event.context.nitro.runtimeConfig;
  }
  const runtimeConfig = klona(_inlineRuntimeConfig);
  applyEnv(runtimeConfig, envOptions);
  event.context.nitro.runtimeConfig = runtimeConfig;
  return runtimeConfig;
}
_deepFreeze(klona(appConfig));
function _deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === "object") {
      _deepFreeze(value);
    }
  }
  return Object.freeze(object);
}
new Proxy(/* @__PURE__ */ Object.create(null), {
  get: (_, prop) => {
    console.warn(
      "Please use `useRuntimeConfig()` instead of accessing config directly."
    );
    const runtimeConfig = useRuntimeConfig();
    if (prop in runtimeConfig) {
      return runtimeConfig[prop];
    }
    return void 0;
  }
});

const config = useRuntimeConfig();
const _routeRulesMatcher = toRouteMatcher(
  createRouter({ routes: config.nitro.routeRules })
);
function createRouteRulesHandler(ctx) {
  return eventHandler((event) => {
    const routeRules = getRouteRules(event);
    if (routeRules.headers) {
      setHeaders(event, routeRules.headers);
    }
    if (routeRules.redirect) {
      let target = routeRules.redirect.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.redirect._redirectStripBase;
        if (strpBase) {
          targetPath = withoutBase(targetPath, strpBase);
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery(event.path);
        target = withQuery(target, query);
      }
      return sendRedirect(event, target, routeRules.redirect.statusCode);
    }
    if (routeRules.proxy) {
      let target = routeRules.proxy.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.proxy._proxyStripBase;
        if (strpBase) {
          targetPath = withoutBase(targetPath, strpBase);
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery(event.path);
        target = withQuery(target, query);
      }
      return proxyRequest(event, target, {
        fetch: ctx.localFetch,
        ...routeRules.proxy
      });
    }
  });
}
function getRouteRules(event) {
  event.context._nitro = event.context._nitro || {};
  if (!event.context._nitro.routeRules) {
    event.context._nitro.routeRules = getRouteRulesForPath(
      withoutBase(event.path.split("?")[0], useRuntimeConfig().app.baseURL)
    );
  }
  return event.context._nitro.routeRules;
}
function getRouteRulesForPath(path) {
  return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
}

function _captureError(error, type) {
  console.error(`[${type}]`, error);
  useNitroApp().captureError(error, { tags: [type] });
}
function trapUnhandledNodeErrors() {
  process.on(
    "unhandledRejection",
    (error) => _captureError(error, "unhandledRejection")
  );
  process.on(
    "uncaughtException",
    (error) => _captureError(error, "uncaughtException")
  );
}
function joinHeaders(value) {
  return Array.isArray(value) ? value.join(", ") : String(value);
}
function normalizeFetchResponse(response) {
  if (!response.headers.has("set-cookie")) {
    return response;
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: normalizeCookieHeaders(response.headers)
  });
}
function normalizeCookieHeader(header = "") {
  return splitCookiesString(joinHeaders(header));
}
function normalizeCookieHeaders(headers) {
  const outgoingHeaders = new Headers();
  for (const [name, header] of headers) {
    if (name === "set-cookie") {
      for (const cookie of normalizeCookieHeader(header)) {
        outgoingHeaders.append("set-cookie", cookie);
      }
    } else {
      outgoingHeaders.set(name, joinHeaders(header));
    }
  }
  return outgoingHeaders;
}

function createNitroApp() {
  const config = useRuntimeConfig();
  const hooks = createHooks();
  const captureError = (error, context = {}) => {
    const promise = hooks.callHookParallel("error", error, context).catch((error_) => {
      console.error("Error while capturing another error", error_);
    });
    if (context.event && isEvent(context.event)) {
      const errors = context.event.context.nitro?.errors;
      if (errors) {
        errors.push({ error, context });
      }
      if (context.event.waitUntil) {
        context.event.waitUntil(promise);
      }
    }
  };
  const h3App = createApp({
    debug: destr(true),
    onError: (error, event) => {
      captureError(error, { event, tags: ["request"] });
      return errorHandler(error, event);
    },
    onRequest: async (event) => {
      event.context.nitro = event.context.nitro || { errors: [] };
      const envContext = event.node.req?.__unenv__;
      if (envContext) {
        Object.assign(event.context, envContext);
      }
      event.fetch = (req, init) => fetchWithEvent(event, req, init, { fetch: localFetch });
      event.$fetch = (req, init) => fetchWithEvent(event, req, init, {
        fetch: $fetch
      });
      event.waitUntil = (promise) => {
        if (!event.context.nitro._waitUntilPromises) {
          event.context.nitro._waitUntilPromises = [];
        }
        event.context.nitro._waitUntilPromises.push(promise);
        if (envContext?.waitUntil) {
          envContext.waitUntil(promise);
        }
      };
      event.captureError = (error, context) => {
        captureError(error, { event, ...context });
      };
      await nitroApp$1.hooks.callHook("request", event).catch((error) => {
        captureError(error, { event, tags: ["request"] });
      });
    },
    onBeforeResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("beforeResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    },
    onAfterResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("afterResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    }
  });
  const router = createRouter$1({
    preemptive: true
  });
  const nodeHandler = toNodeListener(h3App);
  const localCall = (aRequest) => callNodeRequestHandler(nodeHandler, aRequest);
  const localFetch = (input, init) => {
    if (!input.toString().startsWith("/")) {
      return globalThis.fetch(input, init);
    }
    return fetchNodeRequestHandler(
      nodeHandler,
      input,
      init
    ).then((response) => normalizeFetchResponse(response));
  };
  const $fetch = createFetch({
    fetch: localFetch,
    Headers: Headers$1,
    defaults: { baseURL: config.app.baseURL }
  });
  globalThis.$fetch = $fetch;
  h3App.use(createRouteRulesHandler({ localFetch }));
  for (const h of handlers) {
    let handler = h.lazy ? lazyEventHandler(h.handler) : h.handler;
    if (h.middleware || !h.route) {
      const middlewareBase = (config.app.baseURL + (h.route || "/")).replace(
        /\/+/g,
        "/"
      );
      h3App.use(middlewareBase, handler);
    } else {
      const routeRules = getRouteRulesForPath(
        h.route.replace(/:\w+|\*\*/g, "_")
      );
      if (routeRules.cache) {
        handler = cachedEventHandler(handler, {
          group: "nitro/routes",
          ...routeRules.cache
        });
      }
      router.use(h.route, handler, h.method);
    }
  }
  h3App.use(config.app.baseURL, router.handler);
  const app = {
    hooks,
    h3App,
    router,
    localCall,
    localFetch,
    captureError
  };
  return app;
}
function runNitroPlugins(nitroApp2) {
  for (const plugin of plugins) {
    try {
      plugin(nitroApp2);
    } catch (error) {
      nitroApp2.captureError(error, { tags: ["plugin"] });
      throw error;
    }
  }
}
const nitroApp$1 = createNitroApp();
function useNitroApp() {
  return nitroApp$1;
}
runNitroPlugins(nitroApp$1);

function defineRenderHandler(render) {
  const runtimeConfig = useRuntimeConfig();
  return eventHandler(async (event) => {
    const nitroApp = useNitroApp();
    const ctx = { event, render, response: void 0 };
    await nitroApp.hooks.callHook("render:before", ctx);
    if (!ctx.response) {
      if (event.path === `${runtimeConfig.app.baseURL}favicon.ico`) {
        setResponseHeader(event, "Content-Type", "image/x-icon");
        return send(
          event,
          "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
        );
      }
      ctx.response = await ctx.render(event);
      if (!ctx.response) {
        const _currentStatus = getResponseStatus(event);
        setResponseStatus(event, _currentStatus === 200 ? 500 : _currentStatus);
        return send(
          event,
          "No response returned from render handler: " + event.path
        );
      }
    }
    await nitroApp.hooks.callHook("render:response", ctx.response, ctx);
    if (ctx.response.headers) {
      setResponseHeaders(event, ctx.response.headers);
    }
    if (ctx.response.statusCode || ctx.response.statusMessage) {
      setResponseStatus(
        event,
        ctx.response.statusCode,
        ctx.response.statusMessage
      );
    }
    return ctx.response.body;
  });
}

const scheduledTasks = false;

const tasks = {
  
};

const __runningTasks__ = {};
async function runTask(name, {
  payload = {},
  context = {}
} = {}) {
  if (__runningTasks__[name]) {
    return __runningTasks__[name];
  }
  if (!(name in tasks)) {
    throw createError({
      message: `Task \`${name}\` is not available!`,
      statusCode: 404
    });
  }
  if (!tasks[name].resolve) {
    throw createError({
      message: `Task \`${name}\` is not implemented!`,
      statusCode: 501
    });
  }
  const handler = await tasks[name].resolve();
  const taskEvent = { name, payload, context };
  __runningTasks__[name] = handler.run(taskEvent);
  try {
    const res = await __runningTasks__[name];
    return res;
  } finally {
    delete __runningTasks__[name];
  }
}

if (!globalThis.crypto) {
  globalThis.crypto = nodeCrypto;
}
const { NITRO_NO_UNIX_SOCKET, NITRO_DEV_WORKER_ID } = process.env;
trapUnhandledNodeErrors();
parentPort?.on("message", (msg) => {
  if (msg && msg.event === "shutdown") {
    shutdown();
  }
});
const nitroApp = useNitroApp();
const server = new Server(toNodeListener(nitroApp.h3App));
let listener;
listen().catch(() => listen(
  true
  /* use random port */
)).catch((error) => {
  console.error("Dev worker failed to listen:", error);
  return shutdown();
});
nitroApp.router.get(
  "/_nitro/tasks",
  defineEventHandler(async (event) => {
    const _tasks = await Promise.all(
      Object.entries(tasks).map(async ([name, task]) => {
        const _task = await task.resolve?.();
        return [name, { description: _task?.meta?.description }];
      })
    );
    return {
      tasks: Object.fromEntries(_tasks),
      scheduledTasks
    };
  })
);
nitroApp.router.use(
  "/_nitro/tasks/:name",
  defineEventHandler(async (event) => {
    const name = getRouterParam(event, "name");
    const payload = {
      ...getQuery$1(event),
      ...await readBody(event).then((r) => r?.payload).catch(() => ({}))
    };
    return await runTask(name, { payload });
  })
);
function listen(useRandomPort = Boolean(
  NITRO_NO_UNIX_SOCKET || process.versions.webcontainer || "Bun" in globalThis && process.platform === "win32"
)) {
  return new Promise((resolve, reject) => {
    try {
      listener = server.listen(useRandomPort ? 0 : getSocketAddress(), () => {
        const address = server.address();
        parentPort?.postMessage({
          event: "listen",
          address: typeof address === "string" ? { socketPath: address } : { host: "localhost", port: address?.port }
        });
        resolve();
      });
    } catch (error) {
      reject(error);
    }
  });
}
function getSocketAddress() {
  const socketName = `nitro-worker-${process.pid}-${threadId}-${NITRO_DEV_WORKER_ID}-${Math.round(Math.random() * 1e4)}.sock`;
  if (process.platform === "win32") {
    return join(String.raw`\\.\pipe`, socketName);
  }
  if (process.platform === "linux") {
    const nodeMajor = Number.parseInt(process.versions.node.split(".")[0], 10);
    if (nodeMajor >= 20) {
      return `\0${socketName}`;
    }
  }
  return join(tmpdir(), socketName);
}
async function shutdown() {
  server.closeAllConnections?.();
  await Promise.all([
    new Promise((resolve) => listener?.close(resolve)),
    nitroApp.hooks.callHook("close").catch(console.error)
  ]);
  parentPort?.postMessage({ event: "exit" });
}

const _messages = { "appName": "Nuxt", "version": "", "statusCode": 500, "statusMessage": "Server error", "description": "An error occurred in the application and the page could not be served. If you are the application owner, check your server logs for details.", "stack": "" };
const template$1 = (messages) => {
  messages = { ..._messages, ...messages };
  return '<!DOCTYPE html><html lang="en"><head><title>' + messages.statusCode + " - " + (messages.statusMessage || "Internal Server Error") + `</title><meta charset="utf-8"><meta content="width=device-width,initial-scale=1.0,minimum-scale=1.0" name="viewport"><style>.spotlight{background:linear-gradient(45deg,#00dc82,#36e4da 50%,#0047e1);bottom:-40vh;filter:blur(30vh);height:60vh;opacity:.8}*,:after,:before{border-color:var(--un-default-border-color,#e5e7eb);border-style:solid;border-width:0;box-sizing:border-box}:after,:before{--un-content:""}html{line-height:1.5;-webkit-text-size-adjust:100%;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-feature-settings:normal;font-variation-settings:normal;-moz-tab-size:4;tab-size:4;-webkit-tap-highlight-color:transparent}body{line-height:inherit;margin:0}h1{font-size:inherit;font-weight:inherit}h1,p{margin:0}*,:after,:before{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 transparent;--un-ring-shadow:0 0 transparent;--un-shadow-inset: ;--un-shadow:0 0 transparent;--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgba(147,197,253,.5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: }.fixed{position:fixed}.left-0{left:0}.right-0{right:0}.z-10{z-index:10}.mb-6{margin-bottom:1.5rem}.mb-8{margin-bottom:2rem}.h-auto{height:auto}.min-h-screen{min-height:100vh}.flex{display:flex}.flex-1{flex:1 1 0%}.flex-col{flex-direction:column}.overflow-y-auto{overflow-y:auto}.rounded-t-md{border-top-left-radius:.375rem;border-top-right-radius:.375rem}.bg-black\\/5{background-color:#0000000d}.bg-white{--un-bg-opacity:1;background-color:rgb(255 255 255/var(--un-bg-opacity))}.p-8{padding:2rem}.px-10{padding-left:2.5rem;padding-right:2.5rem}.pt-14{padding-top:3.5rem}.text-6xl{font-size:3.75rem;line-height:1}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-black{--un-text-opacity:1;color:rgb(0 0 0/var(--un-text-opacity))}.font-light{font-weight:300}.font-medium{font-weight:500}.leading-tight{line-height:1.25}.font-sans{font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji}.antialiased{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}@media (prefers-color-scheme:dark){.dark\\:bg-black{--un-bg-opacity:1;background-color:rgb(0 0 0/var(--un-bg-opacity))}.dark\\:bg-white\\/10{background-color:#ffffff1a}.dark\\:text-white{--un-text-opacity:1;color:rgb(255 255 255/var(--un-text-opacity))}}@media (min-width:640px){.sm\\:text-2xl{font-size:1.5rem;line-height:2rem}.sm\\:text-8xl{font-size:6rem;line-height:1}}</style><script>!function(){const e=document.createElement("link").relList;if(!(e&&e.supports&&e.supports("modulepreload"))){for(const e of document.querySelectorAll('link[rel="modulepreload"]'))r(e);new MutationObserver((e=>{for(const o of e)if("childList"===o.type)for(const e of o.addedNodes)"LINK"===e.tagName&&"modulepreload"===e.rel&&r(e)})).observe(document,{childList:!0,subtree:!0})}function r(e){if(e.ep)return;e.ep=!0;const r=function(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerPolicy&&(r.referrerPolicy=e.referrerPolicy),"use-credentials"===e.crossOrigin?r.credentials="include":"anonymous"===e.crossOrigin?r.credentials="omit":r.credentials="same-origin",r}(e);fetch(e.href,r)}}();<\/script></head><body class="antialiased bg-white dark:bg-black dark:text-white flex flex-col font-sans min-h-screen pt-14 px-10 text-black"><div class="fixed left-0 right-0 spotlight"></div><h1 class="font-medium mb-6 sm:text-8xl text-6xl">` + messages.statusCode + '</h1><p class="font-light leading-tight mb-8 sm:text-2xl text-xl">' + messages.description + '</p><div class="bg-black/5 bg-white dark:bg-white/10 flex-1 h-auto overflow-y-auto rounded-t-md"><div class="font-light leading-tight p-8 text-xl z-10">' + messages.stack + "</div></div></body></html>";
};

const errorDev = /*#__PURE__*/Object.freeze({
  __proto__: null,
  template: template$1
});

const content_get = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const filename = query.filename;
    if (!filename) {
      throw createError({
        statusCode: 400,
        message: "\u8BF7\u63D0\u4F9B\u6587\u4EF6\u540D"
      });
    }
    const sanitizedFilename = filename.replace(/\.\./g, "").replace(/[\/\\]/g, "");
    const filePath = join(process.cwd(), "content", "about", sanitizedFilename);
    const content = await readFile(filePath, "utf-8");
    return {
      content,
      filename: sanitizedFilename
    };
  } catch (error) {
    console.error("\u83B7\u53D6\u4E2A\u4EBA\u7B80\u4ECB\u5185\u5BB9\u5931\u8D25:", error);
    if (error.code === "ENOENT") {
      throw createError({
        statusCode: 404,
        message: "\u6587\u4EF6\u4E0D\u5B58\u5728"
      });
    }
    throw createError({
      statusCode: 500,
      message: `\u83B7\u53D6\u4E2A\u4EBA\u7B80\u4ECB\u5185\u5BB9\u5931\u8D25: ${error.message || "\u672A\u77E5\u9519\u8BEF"}`
    });
  }
});

const content_get$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: content_get
});

const list_get$2 = defineEventHandler(async (event) => {
  try {
    const aboutDir = join(process.cwd(), "content", "about");
    const files = await readdir(aboutDir);
    const mdFiles = await Promise.all(
      files.filter((file) => file.endsWith(".md")).map(async (file) => {
        const filePath = join(aboutDir, file);
        const stats = await stat(filePath);
        return {
          name: file,
          path: `/content/about/${file}`,
          size: stats.size,
          lastModified: stats.mtime
        };
      })
    );
    return {
      files: mdFiles
    };
  } catch (error) {
    console.error("\u83B7\u53D6\u4E2A\u4EBA\u7B80\u4ECB\u6587\u4EF6\u5217\u8868\u5931\u8D25:", error);
    if (error.code === "ENOENT") {
      return {
        files: []
      };
    }
    throw createError({
      statusCode: 500,
      message: `\u83B7\u53D6\u4E2A\u4EBA\u7B80\u4ECB\u6587\u4EF6\u5217\u8868\u5931\u8D25: ${error.message || "\u672A\u77E5\u9519\u8BEF"}`
    });
  }
});

const list_get$3 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: list_get$2
});

const upload_post = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { content, filename } = body;
    if (!content || typeof content !== "string") {
      throw createError({
        statusCode: 400,
        message: "\u8BF7\u63D0\u4F9B\u6709\u6548\u7684 Markdown \u5185\u5BB9"
      });
    }
    const mdFilename = filename && filename.trim() ? filename.endsWith(".md") ? filename : `${filename}.md` : "about.md";
    const filePath = join(process.cwd(), "content", "about", mdFilename);
    await writeFile(filePath, content, "utf-8");
    return {
      success: true,
      message: "\u4E2A\u4EBA\u7B80\u4ECB\u5DF2\u4FDD\u5B58",
      path: filePath
    };
  } catch (error) {
    console.error("\u4FDD\u5B58\u4E2A\u4EBA\u7B80\u4ECB\u5931\u8D25:", error);
    throw createError({
      statusCode: 500,
      message: `\u4FDD\u5B58\u4E2A\u4EBA\u7B80\u4ECB\u5931\u8D25: ${error.message || "\u672A\u77E5\u9519\u8BEF"}`
    });
  }
});

const upload_post$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: upload_post
});

let DATA_DIR = "";
let VIDEOS_FILE = "";
let ARTICLES_FILE = "";
{
  DATA_DIR = path.resolve(process.cwd(), "data");
  VIDEOS_FILE = path.join(DATA_DIR, "videos.json");
  path.join(DATA_DIR, "photos.json");
  ARTICLES_FILE = path.join(DATA_DIR, "articles.json");
}
function readDataFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      writeDataFile(filePath, []);
      return [];
    }
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error(`\u8BFB\u53D6\u6570\u636E\u6587\u4EF6\u5931\u8D25 (${filePath}):`, error);
    return [];
  }
}
function writeDataFile(filePath, data) {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error(`\u5199\u5165\u6570\u636E\u6587\u4EF6\u5931\u8D25 (${filePath}):`, error);
    return false;
  }
}
function getVideos() {
  return readDataFile(VIDEOS_FILE);
}
function getVideoById(id) {
  const videos = getVideos();
  return videos.find((video) => video.id === id);
}
function addVideo(video) {
  const videos = getVideos();
  if (videos.some((v) => v.id === video.id)) {
    return false;
  }
  videos.push(video);
  return writeDataFile(VIDEOS_FILE, videos);
}
function deleteVideo(id) {
  const videos = getVideos();
  const filteredVideos = videos.filter((v) => v.id !== id);
  if (filteredVideos.length === videos.length) {
    return false;
  }
  return writeDataFile(VIDEOS_FILE, filteredVideos);
}
function getArticles() {
  return readDataFile(ARTICLES_FILE);
}
function addArticle(article) {
  try {
    const articles = getArticles();
    articles.push(article);
    return writeDataFile(ARTICLES_FILE, articles);
  } catch (error) {
    console.error("\u6DFB\u52A0\u6587\u7AE0\u5931\u8D25:", error);
    return false;
  }
}
function deleteArticle(id) {
  try {
    const articlePath = path.join(process.cwd(), "content", "articles", `${id}.md`);
    if (fs.existsSync(articlePath)) {
      fs.unlinkSync(articlePath);
    }
    const articles = getArticles();
    const index = articles.findIndex((a) => a.id === id);
    if (index === -1) {
      return false;
    }
    articles.splice(index, 1);
    return writeDataFile(ARTICLES_FILE, articles);
  } catch (error) {
    console.error("\u5220\u9664\u6587\u7AE0\u5931\u8D25:", error);
    return false;
  }
}

const _id__delete$2 = defineEventHandler(async (event) => {
  var _a;
  try {
    const id = (_a = event.context.params) == null ? void 0 : _a.id;
    if (!id) {
      throw createError({
        statusCode: 400,
        message: "\u7F3A\u5C11\u6587\u7AE0ID"
      });
    }
    const result = deleteArticle(id);
    if (!result) {
      throw createError({
        statusCode: 404,
        message: "\u6587\u7AE0\u4E0D\u5B58\u5728\u6216\u5220\u9664\u5931\u8D25"
      });
    }
    return {
      success: true,
      message: "\u6587\u7AE0\u5220\u9664\u6210\u529F"
    };
  } catch (error) {
    console.error("\u5220\u9664\u6587\u7AE0\u5931\u8D25:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "\u5220\u9664\u6587\u7AE0\u5931\u8D25"
    });
  }
});

const _id__delete$3 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: _id__delete$2
});

const _id__get = defineEventHandler(async (event) => {
  var _a;
  try {
    const id = (_a = event.context.params) == null ? void 0 : _a.id;
    if (!id) {
      throw createError({
        statusCode: 400,
        message: "\u7F3A\u5C11\u6587\u7AE0ID"
      });
    }
    const articlesPath = join(process.cwd(), "data", "articles.json");
    const data = await readFile(articlesPath, "utf-8");
    const articles = JSON.parse(data);
    const article = articles.find((article2) => article2.id === id);
    if (!article) {
      throw createError({
        statusCode: 404,
        message: "\u6587\u7AE0\u4E0D\u5B58\u5728\u6216\u5DF2\u88AB\u5220\u9664"
      });
    }
    return article;
  } catch (error) {
    console.error("\u83B7\u53D6\u6587\u7AE0\u5931\u8D25:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "\u83B7\u53D6\u6587\u7AE0\u5931\u8D25"
    });
  }
});

const _id__get$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: _id__get
});

v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
async function processImage(base64Data, originalPath, articleId) {
  try {
    const base64Image = base64Data.replace(/^data:image\/\w+;base64,/, "");
    const result = await v2.uploader.upload(`data:image/png;base64,${base64Image}`, {
      folder: `articles/${articleId}`,
      public_id: path.basename(originalPath, path.extname(originalPath))
    });
    console.log("\u56FE\u7247\u5DF2\u4E0A\u4F20\u5230 Cloudinary:", result.secure_url);
    return result.secure_url;
  } catch (error) {
    console.error("\u4E0A\u4F20\u56FE\u7247\u5931\u8D25:", {
      path: originalPath,
      error: error.message,
      stack: error.stack
    });
    throw error;
  }
}
async function processMarkdownImages(content, articleId, images) {
  if (!(images == null ? void 0 : images.length)) {
    return content;
  }
  console.log("\u5F00\u59CB\u5904\u7406\u6587\u7AE0\u4E2D\u7684\u56FE\u7247\uFF0C\u5171", images.length, "\u5F20");
  const imageMap = new Map(images);
  const urlMap = /* @__PURE__ */ new Map();
  for (const [imagePath, imageData] of imageMap.entries()) {
    try {
      console.log("\u6B63\u5728\u5904\u7406\u56FE\u7247:", imagePath);
      const cloudinaryUrl = await processImage(imageData, imagePath, articleId);
      urlMap.set(imagePath, cloudinaryUrl);
    } catch (error) {
      console.error(`\u5904\u7406\u56FE\u7247\u5931\u8D25 (${imagePath}):`, error);
    }
  }
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  let processedContent = content;
  let match;
  while ((match = imageRegex.exec(content)) !== null) {
    const [fullMatch, alt, imagePath] = match;
    if (imagePath.startsWith("http") || imagePath.startsWith("/")) {
      continue;
    }
    const normalizedPath = imagePath.replace(/\\/g, "/");
    console.log("\u5904\u7406 Markdown \u4E2D\u7684\u56FE\u7247\u8DEF\u5F84:", normalizedPath);
    const cloudinaryUrl = urlMap.get(normalizedPath);
    if (cloudinaryUrl) {
      processedContent = processedContent.replace(
        fullMatch,
        `![${alt}](${cloudinaryUrl})`
      );
    } else {
      console.warn("\u672A\u627E\u5230\u56FE\u7247\u6570\u636E:", normalizedPath);
    }
  }
  return processedContent;
}
function saveMarkdownFile(id, content) {
  const articleDir = path.join(process.cwd(), "content", "articles");
  if (!fs.existsSync(articleDir)) {
    fs.mkdirSync(articleDir, { recursive: true });
  }
  const filePath = path.join(articleDir, `${id}.md`);
  fs.writeFileSync(filePath, content, "utf-8");
}
const import_post$2 = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { content, filename, images } = body;
    const { data, content: articleContent } = matter(content);
    const id = nanoid();
    const processedContent = await processMarkdownImages(articleContent, id, images);
    saveMarkdownFile(id, processedContent);
    const article = {
      id,
      title: data.title || filename.replace(/\.md$/, ""),
      content: processedContent,
      summary: data.summary || processedContent.slice(0, 200).replace(/[#*\[\]`]/g, ""),
      date: data.date || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      tags: data.tags || [],
      category: data.category || "\u672A\u5206\u7C7B"
    };
    const result = await addArticle(article);
    if (!result) {
      throw createError({
        statusCode: 500,
        message: "\u4FDD\u5B58\u6587\u7AE0\u5931\u8D25"
      });
    }
    return {
      success: true,
      message: "\u6587\u7AE0\u5BFC\u5165\u6210\u529F",
      article
    };
  } catch (error) {
    console.error("\u5BFC\u5165\u6587\u7AE0\u5931\u8D25:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "\u5BFC\u5165\u6587\u7AE0\u5931\u8D25"
    });
  }
});

const import_post$3 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: import_post$2
});

const index_get = defineEventHandler(async (event) => {
  try {
    const articlesPath = join(process.cwd(), "data", "articles.json");
    const data = await readFile(articlesPath, "utf-8");
    const articles = JSON.parse(data);
    return articles;
  } catch (error) {
    console.error("\u83B7\u53D6\u6587\u7AE0\u5217\u8868\u5931\u8D25:", error);
    throw createError({
      statusCode: 500,
      message: `\u83B7\u53D6\u6587\u7AE0\u5217\u8868\u5931\u8D25: ${error.message || "\u672A\u77E5\u9519\u8BEF"}`
    });
  }
});

const index_get$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get
});

const add_post = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { images } = body;
    const dataPath = join(process.cwd(), "data", "photos.json");
    const data = await readFile(dataPath, "utf-8");
    const photosData = JSON.parse(data);
    const newPhotos = images.map((img) => ({
      id: img.public_id,
      url: img.secure_url,
      created_at: img.created_at
    }));
    const uniquePhotos = [...photosData.photos || []];
    for (const newPhoto of newPhotos) {
      if (!uniquePhotos.some((photo) => photo.id === newPhoto.id)) {
        uniquePhotos.push(newPhoto);
      }
    }
    uniquePhotos.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    photosData.photos = uniquePhotos;
    await writeFile(dataPath, JSON.stringify(photosData, null, 2));
    return { success: true, images: uniquePhotos };
  } catch (error) {
    console.error("\u6DFB\u52A0\u56FE\u7247\u5931\u8D25:", error);
    throw createError({
      statusCode: 500,
      message: "\u6DFB\u52A0\u56FE\u7247\u5931\u8D25"
    });
  }
});

const add_post$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: add_post
});

const delete_post = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { ids } = body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      throw createError({
        statusCode: 400,
        message: "\u8BF7\u63D0\u4F9B\u8981\u5220\u9664\u7684\u7167\u7247 ID \u5217\u8868"
      });
    }
    const photosPath = join(process.cwd(), "data", "photos.json");
    const data = await readFile(photosPath, "utf-8");
    const photosData = JSON.parse(data);
    const updatedPhotos = photosData.photos.filter((photo) => !ids.includes(photo.id));
    const photosByFolder = {};
    updatedPhotos.forEach((photo) => {
      const parts = photo.id.split("/");
      const folder = parts.length > 1 ? parts[0] : "\u672A\u5206\u7C7B";
      if (!photosByFolder[folder]) {
        photosByFolder[folder] = [];
      }
      photosByFolder[folder].push(photo);
    });
    await writeFile(photosPath, JSON.stringify({
      photos: updatedPhotos,
      photosByFolder
    }, null, 2));
    return {
      success: true,
      message: `\u6210\u529F\u5220\u9664 ${ids.length} \u5F20\u7167\u7247`,
      deletedIds: ids
    };
  } catch (error) {
    console.error("\u5220\u9664\u7167\u7247\u5931\u8D25:", error);
    throw createError({
      statusCode: 500,
      message: `\u5220\u9664\u7167\u7247\u5931\u8D25: ${error.message || "\u672A\u77E5\u9519\u8BEF"}`
    });
  }
});

const delete_post$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: delete_post
});

const cloudinaryConfig = {
  cloud_name: "dvz48ubim",
  api_key: "662881173792496",
  api_secret: "t3WYqcZzctuSdlJNm6WE_1mCgys"
};

v2.config(cloudinaryConfig);
const list_get = defineEventHandler(async (event) => {
  try {
    console.log("\u5F00\u59CB\u83B7\u53D6 Cloudinary \u56FE\u7247\u5217\u8868...");
    const result = await v2.api.resources({
      resource_type: "image",
      type: "upload",
      max_results: 500
    }).catch((err) => {
      console.error("Cloudinary API \u9519\u8BEF:", err);
      throw err;
    });
    console.log("\u6210\u529F\u83B7\u53D6\u56FE\u7247\u5217\u8868:", result);
    const photosByFolder = {};
    const images = result.resources.map((resource) => {
      const parts = resource.public_id.split("/");
      const folder = parts.length > 1 ? parts[0] : "\u672A\u5206\u7C7B";
      const photo = {
        id: resource.public_id,
        url: resource.secure_url,
        created_at: resource.created_at,
        folder
      };
      if (!photosByFolder[folder]) {
        photosByFolder[folder] = [];
      }
      photosByFolder[folder].push(photo);
      return photo;
    });
    console.log("\u5904\u7406\u540E\u7684\u56FE\u7247\u6570\u636E:", {
      totalImages: images.length,
      folders: Object.keys(photosByFolder)
    });
    const photosPath = join(process.cwd(), "data", "photos.json");
    await writeFile(photosPath, JSON.stringify({
      photos: images,
      photosByFolder
    }, null, 2));
    console.log("\u6570\u636E\u5DF2\u4FDD\u5B58\u5230:", photosPath);
    return {
      images,
      photosByFolder
    };
  } catch (error) {
    console.error("\u83B7\u53D6 Cloudinary \u56FE\u7247\u5217\u8868\u5931\u8D25:", error);
    throw createError({
      statusCode: 500,
      message: `\u83B7\u53D6\u56FE\u7247\u5217\u8868\u5931\u8D25: ${error.message || "\u672A\u77E5\u9519\u8BEF"}`
    });
  }
});

const list_get$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: list_get
});

const local_get = defineEventHandler(async (event) => {
  try {
    const photosPath = join(process.cwd(), "data", "photos.json");
    const data = await readFile(photosPath, "utf-8");
    const photosData = JSON.parse(data);
    return {
      images: photosData.photos || []
    };
  } catch (error) {
    console.error("\u8BFB\u53D6\u672C\u5730\u56FE\u7247\u6570\u636E\u5931\u8D25:", error);
    return {
      images: []
    };
  }
});

const local_get$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: local_get
});

const image = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const url = query.url;
    if (!url) {
      throw createError({
        statusCode: 400,
        message: "\u7F3A\u5C11\u56FE\u7247 URL \u53C2\u6570"
      });
    }
    if (!url.startsWith("https://oss-xpc0.xpccdn.com/")) {
      throw createError({
        statusCode: 400,
        message: "\u65E0\u6548\u7684\u56FE\u7247 URL"
      });
    }
    const headers = {
      "Referer": "https://www.xinpianchang.com",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      "Origin": "https://www.xinpianchang.com",
      "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
      "Cache-Control": "no-cache",
      "Pragma": "no-cache",
      "Sec-Fetch-Dest": "image",
      "Sec-Fetch-Mode": "no-cors",
      "Sec-Fetch-Site": "cross-site"
    };
    const response = await fetch(url, { headers });
    if (!response.ok) {
      console.error(`\u83B7\u53D6\u56FE\u7247\u5931\u8D25: ${response.status} ${response.statusText}`);
      console.error("URL:", url);
      throw createError({
        statusCode: response.status,
        message: `\u83B7\u53D6\u56FE\u7247\u5931\u8D25: ${response.statusText}`
      });
    }
    const contentType = response.headers.get("Content-Type") || "image/jpeg";
    const contentLength = response.headers.get("Content-Length");
    const lastModified = response.headers.get("Last-Modified");
    const etag = response.headers.get("ETag");
    setResponseHeaders(event, {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000",
      "X-Proxy-Origin": "xinpianchang",
      ...contentLength && { "Content-Length": contentLength },
      ...lastModified && { "Last-Modified": lastModified },
      ...etag && { "ETag": etag }
    });
    return response.body;
  } catch (error) {
    console.error("\u4EE3\u7406\u56FE\u7247\u8BF7\u6C42\u5931\u8D25:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "\u4EE3\u7406\u56FE\u7247\u8BF7\u6C42\u5931\u8D25"
    });
  }
});

const image$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: image
});

const videos = defineEventHandler(async (event) => {
  try {
    const videos = getVideos();
    return videos;
  } catch (error) {
    console.error("\u83B7\u53D6\u89C6\u9891\u5217\u8868\u5931\u8D25:", error);
    throw createError({
      statusCode: 500,
      message: "\u83B7\u53D6\u89C6\u9891\u5217\u8868\u5931\u8D25"
    });
  }
});

const videos$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: videos
});

const _id__delete = defineEventHandler(async (event) => {
  var _a;
  try {
    const id = (_a = event.context.params) == null ? void 0 : _a.id;
    if (!id) {
      throw createError({
        statusCode: 400,
        message: "\u7F3A\u5C11\u89C6\u9891ID"
      });
    }
    const result = deleteVideo(id);
    if (!result) {
      throw createError({
        statusCode: 404,
        message: "\u89C6\u9891\u4E0D\u5B58\u5728\u6216\u5220\u9664\u5931\u8D25"
      });
    }
    return {
      success: true,
      message: "\u89C6\u9891\u5220\u9664\u6210\u529F"
    };
  } catch (error) {
    console.error("\u5220\u9664\u89C6\u9891\u5931\u8D25:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "\u5220\u9664\u89C6\u9891\u5931\u8D25"
    });
  }
});

const _id__delete$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: _id__delete
});

const _id_ = defineEventHandler(async (event) => {
  var _a;
  try {
    const id = (_a = event.context.params) == null ? void 0 : _a.id;
    if (!id) {
      throw createError({
        statusCode: 400,
        message: "\u7F3A\u5C11\u89C6\u9891ID"
      });
    }
    const video = getVideoById(id);
    if (!video) {
      throw createError({
        statusCode: 404,
        message: "\u89C6\u9891\u4E0D\u5B58\u5728"
      });
    }
    return video;
  } catch (error) {
    console.error("\u83B7\u53D6\u89C6\u9891\u4FE1\u606F\u5931\u8D25:", error);
    throw createError({
      statusCode: 500,
      message: "\u83B7\u53D6\u89C6\u9891\u4FE1\u606F\u5931\u8D25"
    });
  }
});

const _id_$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: _id_
});

const import_post = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const videos = body.videos;
    if (!videos || !Array.isArray(videos) || videos.length === 0) {
      return {
        success: false,
        count: 0,
        videos: [],
        message: "\u6CA1\u6709\u63D0\u4F9B\u8981\u5BFC\u5165\u7684\u89C6\u9891"
      };
    }
    console.log(`\u51C6\u5907\u5BFC\u5165 ${videos.length} \u4E2A\u89C6\u9891...`);
    let successCount = 0;
    const successVideos = [];
    for (const video of videos) {
      const result = addVideo(video);
      if (result) {
        successCount++;
        successVideos.push(video);
        console.log(`\u6210\u529F\u6DFB\u52A0\u89C6\u9891: ${video.title} (ID: ${video.id}, xpcId: ${video.xpcId})`);
      } else {
        console.error(`\u6DFB\u52A0\u89C6\u9891\u5931\u8D25: ${video.title}`);
      }
    }
    return {
      success: successCount > 0,
      count: successCount,
      videos: successVideos,
      message: successCount > 0 ? `\u6210\u529F\u5BFC\u5165 ${successCount} \u4E2A\u4F5C\u54C1` : "\u6CA1\u6709\u6210\u529F\u5BFC\u5165\u4EFB\u4F55\u4F5C\u54C1"
    };
  } catch (error) {
    console.error("\u5BFC\u5165\u65B0\u7247\u573A\u4F5C\u54C1\u5931\u8D25:", error);
    return {
      success: false,
      count: 0,
      videos: [],
      message: error.message || "\u5BFC\u5165\u65B0\u7247\u573A\u4F5C\u54C1\u5931\u8D25"
    };
  }
});

const import_post$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: import_post
});

async function fetchXpcUserWorks(userId) {
  var _a, _b;
  try {
    const apiUrl = `https://apis.netstart.cn/xpc/user/${userId}/articles?type=public&order=view&is_hide_in_space=0&return_struct_type=user_home&page=1`;
    console.log(`\u6B63\u5728\u83B7\u53D6\u65B0\u7247\u573A\u7528\u6237(${userId})\u4F5C\u54C1\u5217\u8868...`);
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`API\u8BF7\u6C42\u5931\u8D25: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    console.log(`\u6210\u529F\u83B7\u53D6\u5230${((_b = (_a = data.data) == null ? void 0 : _a.list) == null ? void 0 : _b.length) || 0}\u4E2A\u4F5C\u54C1`);
    return data;
  } catch (error) {
    console.error("\u83B7\u53D6\u65B0\u7247\u573A\u4F5C\u54C1\u5217\u8868\u5931\u8D25:", error);
    throw error;
  }
}
function convertXpcWorksToVideos(xpcWorks) {
  var _a;
  if (!((_a = xpcWorks == null ? void 0 : xpcWorks.data) == null ? void 0 : _a.list) || !Array.isArray(xpcWorks.data.list)) {
    console.error("\u65B0\u7247\u573A\u4F5C\u54C1\u6570\u636E\u683C\u5F0F\u4E0D\u6B63\u786E");
    return [];
  }
  {
    const existingVideos = getVideos();
    let maxId = 0;
    existingVideos.forEach((video) => {
      const idNum = parseInt(video.id);
      if (!isNaN(idNum) && idNum > maxId) {
        maxId = idNum;
      }
    });
    console.log(`\u5F53\u524D\u6700\u5927ID: ${maxId}`);
    return xpcWorks.data.list.map((work, index) => {
      const newId = (maxId + index + 1).toString();
      const resource = work.resource || work;
      let videoId = "";
      if (resource.vid) {
        videoId = resource.vid;
      } else if (resource.video_library_id) {
        videoId = resource.video_library_id;
      } else if (resource.article_id) {
        videoId = resource.article_id;
      } else if (resource.id) {
        videoId = resource.id.toString();
      }
      let articleId = "";
      if (resource.article_id) {
        articleId = resource.article_id;
      } else if (resource.id) {
        articleId = resource.id.toString();
      }
      console.log(`\u5904\u7406\u89C6\u9891 ${resource.title || "\u672A\u77E5\u6807\u9898"}:`, {
        vid: resource.vid,
        video_library_id: resource.video_library_id,
        article_id: resource.article_id,
        id: resource.id,
        final_video_id: videoId,
        final_article_id: articleId
      });
      let coverUrl = "";
      if (resource.cover) {
        if (resource.cover.startsWith("http")) {
          coverUrl = `/api/proxy/image?url=${encodeURIComponent(resource.cover)}`;
        } else {
          coverUrl = `/api/proxy/image?url=${encodeURIComponent(`https://oss-xpc0.xpccdn.com/${resource.cover}`)}`;
        }
      } else if (resource.poster) {
        if (resource.poster.startsWith("http")) {
          coverUrl = `/api/proxy/image?url=${encodeURIComponent(resource.poster)}`;
        } else {
          coverUrl = `/api/proxy/image?url=${encodeURIComponent(`https://oss-xpc0.xpccdn.com/${resource.poster}`)}`;
        }
      } else if (resource.image) {
        if (resource.image.startsWith("http")) {
          coverUrl = `/api/proxy/image?url=${encodeURIComponent(resource.image)}`;
        } else {
          coverUrl = `/api/proxy/image?url=${encodeURIComponent(`https://oss-xpc0.xpccdn.com/${resource.image}`)}`;
        }
      } else {
        coverUrl = `https://picsum.photos/seed/video${newId}/800/450`;
      }
      const title = resource.title || `\u65B0\u7247\u573A\u4F5C\u54C1 ${newId}`;
      const description = resource.content || resource.description || "\u4ECE\u65B0\u7247\u573A\u5BFC\u5165\u7684\u4F5C\u54C1";
      let publishDate = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      if (resource.publish_time) {
        if (typeof resource.publish_time === "number") {
          publishDate = new Date(resource.publish_time * 1e3).toISOString().split("T")[0];
        } else {
          publishDate = resource.publish_time;
        }
      }
      let category = "\u65B0\u7247\u573A\u4F5C\u54C1";
      if (resource.categories && resource.categories.length > 0) {
        category = resource.categories[0].category_name;
      } else if (resource.category_name) {
        category = resource.category_name;
      }
      console.log(`\u5904\u7406\u4F5C\u54C1 #${index + 1}:`);
      console.log(`- \u6807\u9898: ${title}`);
      console.log(`- \u89C6\u9891ID (vid): ${videoId}`);
      console.log(`- \u4F5C\u54C1ID: ${resource.id || "\u672A\u63D0\u4F9B"}`);
      console.log(`- \u5C01\u9762\u56FE\u7247: ${coverUrl}`);
      console.log(`- \u53D1\u5E03\u65F6\u95F4: ${publishDate}`);
      console.log(`- \u5206\u7C7B: ${category}`);
      return {
        id: newId,
        title,
        description,
        date: publishDate,
        category,
        xpcId: videoId,
        articleId,
        cover: coverUrl
      };
    });
  }
}

const preview = defineEventHandler(async (event) => {
  try {
    const userId = getQuery$1(event).userId;
    if (!userId) {
      return {
        success: false,
        message: "\u7F3A\u5C11\u5FC5\u8981\u7684userId\u53C2\u6570"
      };
    }
    const xpcWorks = await fetchXpcUserWorks(userId);
    const videos = convertXpcWorksToVideos(xpcWorks);
    if (videos.length === 0) {
      return {
        success: false,
        message: "\u6CA1\u6709\u627E\u5230\u53EF\u5BFC\u5165\u7684\u4F5C\u54C1"
      };
    }
    return {
      success: true,
      message: `\u627E\u5230 ${videos.length} \u4E2A\u53EF\u5BFC\u5165\u7684\u4F5C\u54C1`,
      videos
    };
  } catch (error) {
    console.error("\u83B7\u53D6\u65B0\u7247\u573A\u4F5C\u54C1\u9884\u89C8\u5931\u8D25:", error);
    return {
      success: false,
      message: error.message || "\u83B7\u53D6\u65B0\u7247\u573A\u4F5C\u54C1\u9884\u89C8\u5931\u8D25"
    };
  }
});

const preview$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: preview
});

const test = defineEventHandler(async (event) => {
  try {
    const userId = "11105052";
    console.log(`\u6B63\u5728\u6D4B\u8BD5\u65B0\u7247\u573AAPI\uFF0C\u83B7\u53D6\u7528\u6237(${userId})\u4F5C\u54C1\u5217\u8868...`);
    const response = await fetch(`https://apis.netstart.cn/xpc/user/${userId}/articles?type=public&order=view&is_hide_in_space=0&return_struct_type=user_home&page=1`);
    if (!response.ok) {
      throw new Error(`API\u8BF7\u6C42\u5931\u8D25: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    const hasData = !!data.data;
    const hasList = hasData && Array.isArray(data.data.list);
    const itemCount = hasList ? data.data.list.length : 0;
    let firstItem = null;
    if (hasList && itemCount > 0) {
      const item = data.data.list[0];
      firstItem = {
        id: item.id,
        vid: item.vid,
        title: item.title,
        cover: item.cover,
        poster: item.poster,
        image: item.image,
        publish_time: item.publish_time,
        category_name: item.category_name
      };
    }
    return {
      success: true,
      apiStatus: {
        responseOk: response.ok,
        statusCode: response.status,
        statusText: response.statusText
      },
      dataStructure: {
        hasData,
        hasList,
        itemCount
      },
      sampleItem: firstItem,
      rawData: data
    };
  } catch (error) {
    console.error("\u6D4B\u8BD5\u65B0\u7247\u573AAPI\u5931\u8D25:", error);
    return {
      success: false,
      error: error.message || "\u6D4B\u8BD5\u65B0\u7247\u573AAPI\u5931\u8D25",
      stack: error.stack
    };
  }
});

const test$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: test
});

const works = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const userId = query.userId;
    if (!userId) {
      return {
        statusCode: 400,
        body: {
          error: "\u7F3A\u5C11\u5FC5\u8981\u7684userId\u53C2\u6570"
        }
      };
    }
    const data = await fetchXpcUserWorks(userId);
    return data;
  } catch (error) {
    console.error("\u83B7\u53D6\u65B0\u7247\u573A\u4F5C\u54C1\u5931\u8D25:", error);
    return {
      statusCode: 500,
      body: {
        error: error.message || "\u83B7\u53D6\u65B0\u7247\u573A\u4F5C\u54C1\u5931\u8D25"
      }
    };
  }
});

const works$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: works
});

const VueResolver = (_, value) => {
  return isRef(value) ? toValue(value) : value;
};

const headSymbol = "usehead";
function vueInstall(head) {
  const plugin = {
    install(app) {
      app.config.globalProperties.$unhead = head;
      app.config.globalProperties.$head = head;
      app.provide(headSymbol, head);
    }
  };
  return plugin.install;
}

function createHead(options = {}) {
  const head = createHead$1({
    ...options,
    propResolvers: [VueResolver]
  });
  head.install = vueInstall(head);
  return head;
}

function resolveUnrefHeadInput(input) {
  return walkResolver(input, VueResolver);
}

function buildAssetsDir() {
  return useRuntimeConfig().app.buildAssetsDir;
}
function buildAssetsURL(...path) {
  return joinRelativeURL(publicAssetsURL(), buildAssetsDir(), ...path);
}
function publicAssetsURL(...path) {
  const app = useRuntimeConfig().app;
  const publicBase = app.cdnURL || app.baseURL;
  return path.length ? joinRelativeURL(publicBase, ...path) : publicBase;
}

const APP_ROOT_OPEN_TAG = `<${appRootTag}${propsToString(appRootAttrs)}>`;
const APP_ROOT_CLOSE_TAG = `</${appRootTag}>`;
const getClientManifest = () => import('file://C:/Users/lenovo/CodeRep/mrwz-wang/.nuxt/dist/server/client.manifest.mjs').then((r) => r.default || r).then((r) => typeof r === "function" ? r() : r);
const getSSRStyles = lazyCachedFunction(() => Promise.resolve().then(function () { return styles$1; }).then((r) => r.default || r));
const getSPARenderer = lazyCachedFunction(async () => {
  const manifest = await getClientManifest();
  const spaTemplate = await Promise.resolve().then(function () { return _virtual__spaTemplate; }).then((r) => r.template).catch(() => "").then((r) => {
    {
      return APP_ROOT_OPEN_TAG + r + APP_ROOT_CLOSE_TAG;
    }
  });
  const options = {
    manifest,
    renderToString: () => spaTemplate,
    buildAssetsURL
  };
  const renderer = createRenderer(() => () => {
  }, options);
  const result = await renderer.renderToString({});
  const renderToString = (ssrContext) => {
    const config = useRuntimeConfig(ssrContext.event);
    ssrContext.modules ||= /* @__PURE__ */ new Set();
    ssrContext.payload.serverRendered = false;
    ssrContext.config = {
      public: config.public,
      app: config.app
    };
    return Promise.resolve(result);
  };
  return {
    rendererContext: renderer.rendererContext,
    renderToString
  };
});
function lazyCachedFunction(fn) {
  let res = null;
  return () => {
    if (res === null) {
      res = fn().catch((err) => {
        res = null;
        throw err;
      });
    }
    return res;
  };
}

function renderPayloadJsonScript(opts) {
  const contents = opts.data ? stringify(opts.data, opts.ssrContext._payloadReducers) : "";
  const payload = {
    "type": "application/json",
    "innerHTML": contents,
    "data-nuxt-data": appId,
    "data-ssr": false
  };
  {
    payload.id = "__NUXT_DATA__";
  }
  if (opts.src) {
    payload["data-src"] = opts.src;
  }
  const config = uneval(opts.ssrContext.config);
  return [
    payload,
    {
      innerHTML: `window.__NUXT__={};window.__NUXT__.config=${config}`
    }
  ];
}

const unheadOptions = {
  disableDefaults: true,
  disableCapoSorting: false,
  plugins: [DeprecationsPlugin, PromisesPlugin, TemplateParamsPlugin, AliasSortingPlugin],
};

const renderSSRHeadOptions = {"omitLineBreaks":false};

globalThis.__buildAssetsURL = buildAssetsURL;
globalThis.__publicAssetsURL = publicAssetsURL;
const ISLAND_SUFFIX_RE = /\.json(\?.*)?$/;
async function getIslandContext(event) {
  let url = event.path || "";
  const componentParts = url.substring("/__nuxt_island".length + 1).replace(ISLAND_SUFFIX_RE, "").split("_");
  const hashId = componentParts.length > 1 ? componentParts.pop() : void 0;
  const componentName = componentParts.join("_");
  const context = event.method === "GET" ? getQuery$1(event) : await readBody(event);
  const ctx = {
    url: "/",
    ...context,
    id: hashId,
    name: componentName,
    props: destr(context.props) || {},
    slots: {},
    components: {}
  };
  return ctx;
}
const HAS_APP_TELEPORTS = !!(appTeleportAttrs.id);
const APP_TELEPORT_OPEN_TAG = HAS_APP_TELEPORTS ? `<${appTeleportTag}${propsToString(appTeleportAttrs)}>` : "";
const APP_TELEPORT_CLOSE_TAG = HAS_APP_TELEPORTS ? `</${appTeleportTag}>` : "";
const ROOT_NODE_REGEX = new RegExp(`^<${appRootTag}[^>]*>([\\s\\S]*)<\\/${appRootTag}>$`);
const renderer = defineRenderHandler(async (event) => {
  const nitroApp = useNitroApp();
  const ssrError = event.path.startsWith("/__nuxt_error") ? getQuery$1(event) : null;
  if (ssrError && ssrError.statusCode) {
    ssrError.statusCode = Number.parseInt(ssrError.statusCode);
  }
  if (ssrError && !("__unenv__" in event.node.req)) {
    throw createError({
      statusCode: 404,
      statusMessage: "Page Not Found: /__nuxt_error"
    });
  }
  const isRenderingIsland = event.path.startsWith("/__nuxt_island");
  const islandContext = isRenderingIsland ? await getIslandContext(event) : void 0;
  let url = ssrError?.url || islandContext?.url || event.path;
  const routeOptions = getRouteRules(event);
  const head = createHead(unheadOptions);
  const headEntryOptions = { mode: "server" };
  if (!isRenderingIsland) {
    head.push(appHead, headEntryOptions);
  }
  const ssrContext = {
    url,
    event,
    runtimeConfig: useRuntimeConfig(event),
    noSSR: true,
    head,
    error: !!ssrError,
    nuxt: void 0,
    /* NuxtApp */
    payload: ssrError ? { error: ssrError } : {},
    _payloadReducers: /* @__PURE__ */ Object.create(null),
    modules: /* @__PURE__ */ new Set(),
    islandContext
  };
  const renderer = await getSPARenderer() ;
  const _rendered = await renderer.renderToString(ssrContext).catch(async (error) => {
    if (ssrContext._renderResponse && error.message === "skipping render") {
      return {};
    }
    const _err = !ssrError && ssrContext.payload?.error || error;
    await ssrContext.nuxt?.hooks.callHook("app:error", _err);
    throw _err;
  });
  await ssrContext.nuxt?.hooks.callHook("app:rendered", { ssrContext, renderResult: _rendered });
  if (ssrContext._renderResponse) {
    return ssrContext._renderResponse;
  }
  if (ssrContext.payload?.error && !ssrError) {
    throw ssrContext.payload.error;
  }
  const inlinedStyles = isRenderingIsland ? await renderInlineStyles(ssrContext.modules ?? []) : [];
  const NO_SCRIPTS = routeOptions.noScripts;
  const { styles, scripts } = getRequestDependencies(ssrContext, renderer.rendererContext);
  if (ssrContext._preloadManifest) {
    head.push({
      link: [
        { rel: "preload", as: "fetch", fetchpriority: "low", crossorigin: "anonymous", href: buildAssetsURL(`builds/meta/${ssrContext.runtimeConfig.app.buildId}.json`) }
      ]
    }, { ...headEntryOptions, tagPriority: "low" });
  }
  if (inlinedStyles.length) {
    head.push({ style: inlinedStyles });
  }
  {
    const link = [];
    for (const resource of Object.values(styles)) {
      if ("inline" in getQuery(resource.file)) {
        continue;
      }
      if (!isRenderingIsland || resource.file.includes("scoped") && !resource.file.includes("pages/")) {
        link.push({ rel: "stylesheet", href: renderer.rendererContext.buildAssetsURL(resource.file), crossorigin: "" });
      }
    }
    if (link.length) {
      head.push({ link }, headEntryOptions);
    }
  }
  if (isRenderingIsland && islandContext) {
    const islandHead = {};
    for (const entry of head.entries.values()) {
      for (const [key, value] of Object.entries(resolveUnrefHeadInput(entry.input))) {
        const currentValue = islandHead[key];
        if (Array.isArray(currentValue)) {
          currentValue.push(...value);
        }
        islandHead[key] = value;
      }
    }
    islandHead.link ||= [];
    islandHead.style ||= [];
    const islandResponse = {
      id: islandContext.id,
      head: islandHead,
      html: getServerComponentHTML(_rendered.html),
      components: getClientIslandResponse(ssrContext),
      slots: getSlotIslandResponse(ssrContext)
    };
    await nitroApp.hooks.callHook("render:island", islandResponse, { event, islandContext });
    const response2 = {
      body: JSON.stringify(islandResponse, null, 2),
      statusCode: getResponseStatus(event),
      statusMessage: getResponseStatusText(event),
      headers: {
        "content-type": "application/json;charset=utf-8",
        "x-powered-by": "Nuxt"
      }
    };
    return response2;
  }
  if (!NO_SCRIPTS) {
    head.push({
      link: getPreloadLinks(ssrContext, renderer.rendererContext)
    }, headEntryOptions);
    head.push({
      link: getPrefetchLinks(ssrContext, renderer.rendererContext)
    }, headEntryOptions);
    head.push({
      script: renderPayloadJsonScript({ ssrContext, data: ssrContext.payload }) 
    }, {
      ...headEntryOptions,
      // this should come before another end of body scripts
      tagPosition: "bodyClose",
      tagPriority: "high"
    });
  }
  if (!routeOptions.noScripts) {
    head.push({
      script: Object.values(scripts).map((resource) => ({
        type: resource.module ? "module" : null,
        src: renderer.rendererContext.buildAssetsURL(resource.file),
        defer: resource.module ? null : true,
        // if we are rendering script tag payloads that import an async payload
        // we need to ensure this resolves before executing the Nuxt entry
        tagPosition: "head",
        crossorigin: ""
      }))
    }, headEntryOptions);
  }
  const { headTags, bodyTags, bodyTagsOpen, htmlAttrs, bodyAttrs } = await renderSSRHead(head, renderSSRHeadOptions);
  const htmlContext = {
    island: isRenderingIsland,
    htmlAttrs: htmlAttrs ? [htmlAttrs] : [],
    head: normalizeChunks([headTags]),
    bodyAttrs: bodyAttrs ? [bodyAttrs] : [],
    bodyPrepend: normalizeChunks([bodyTagsOpen, ssrContext.teleports?.body]),
    body: [
      replaceIslandTeleports(ssrContext, _rendered.html) ,
      APP_TELEPORT_OPEN_TAG + (HAS_APP_TELEPORTS ? joinTags([ssrContext.teleports?.[`#${appTeleportAttrs.id}`]]) : "") + APP_TELEPORT_CLOSE_TAG
    ],
    bodyAppend: [bodyTags]
  };
  await nitroApp.hooks.callHook("render:html", htmlContext, { event });
  const response = {
    body: renderHTMLDocument(htmlContext),
    statusCode: getResponseStatus(event),
    statusMessage: getResponseStatusText(event),
    headers: {
      "content-type": "text/html;charset=utf-8",
      "x-powered-by": "Nuxt"
    }
  };
  return response;
});
function normalizeChunks(chunks) {
  return chunks.filter(Boolean).map((i) => i.trim());
}
function joinTags(tags) {
  return tags.join("");
}
function joinAttrs(chunks) {
  if (chunks.length === 0) {
    return "";
  }
  return " " + chunks.join(" ");
}
function renderHTMLDocument(html) {
  return `<!DOCTYPE html><html${joinAttrs(html.htmlAttrs)}><head>${joinTags(html.head)}</head><body${joinAttrs(html.bodyAttrs)}>${joinTags(html.bodyPrepend)}${joinTags(html.body)}${joinTags(html.bodyAppend)}</body></html>`;
}
async function renderInlineStyles(usedModules) {
  const styleMap = await getSSRStyles();
  const inlinedStyles = /* @__PURE__ */ new Set();
  for (const mod of usedModules) {
    if (mod in styleMap && styleMap[mod]) {
      for (const style of await styleMap[mod]()) {
        inlinedStyles.add(style);
      }
    }
  }
  return Array.from(inlinedStyles).map((style) => ({ innerHTML: style }));
}
function getServerComponentHTML(body) {
  const match = body.match(ROOT_NODE_REGEX);
  return match?.[1] || body;
}
const SSR_SLOT_TELEPORT_MARKER = /^uid=([^;]*);slot=(.*)$/;
const SSR_CLIENT_TELEPORT_MARKER = /^uid=([^;]*);client=(.*)$/;
const SSR_CLIENT_SLOT_MARKER = /^island-slot=([^;]*);(.*)$/;
function getSlotIslandResponse(ssrContext) {
  if (!ssrContext.islandContext || !Object.keys(ssrContext.islandContext.slots).length) {
    return void 0;
  }
  const response = {};
  for (const [name, slot] of Object.entries(ssrContext.islandContext.slots)) {
    response[name] = {
      ...slot,
      fallback: ssrContext.teleports?.[`island-fallback=${name}`]
    };
  }
  return response;
}
function getClientIslandResponse(ssrContext) {
  if (!ssrContext.islandContext || !Object.keys(ssrContext.islandContext.components).length) {
    return void 0;
  }
  const response = {};
  for (const [clientUid, component] of Object.entries(ssrContext.islandContext.components)) {
    const html = ssrContext.teleports?.[clientUid]?.replaceAll("<!--teleport start anchor-->", "") || "";
    response[clientUid] = {
      ...component,
      html,
      slots: getComponentSlotTeleport(clientUid, ssrContext.teleports ?? {})
    };
  }
  return response;
}
function getComponentSlotTeleport(clientUid, teleports) {
  const entries = Object.entries(teleports);
  const slots = {};
  for (const [key, value] of entries) {
    const match = key.match(SSR_CLIENT_SLOT_MARKER);
    if (match) {
      const [, id, slot] = match;
      if (!slot || clientUid !== id) {
        continue;
      }
      slots[slot] = value;
    }
  }
  return slots;
}
function replaceIslandTeleports(ssrContext, html) {
  const { teleports, islandContext } = ssrContext;
  if (islandContext || !teleports) {
    return html;
  }
  for (const key in teleports) {
    const matchClientComp = key.match(SSR_CLIENT_TELEPORT_MARKER);
    if (matchClientComp) {
      const [, uid, clientId] = matchClientComp;
      if (!uid || !clientId) {
        continue;
      }
      html = html.replace(new RegExp(` data-island-uid="${uid}" data-island-component="${clientId}"[^>]*>`), (full) => {
        return full + teleports[key];
      });
      continue;
    }
    const matchSlot = key.match(SSR_SLOT_TELEPORT_MARKER);
    if (matchSlot) {
      const [, uid, slot] = matchSlot;
      if (!uid || !slot) {
        continue;
      }
      html = html.replace(new RegExp(` data-island-uid="${uid}" data-island-slot="${slot}"[^>]*>`), (full) => {
        return full + teleports[key];
      });
    }
  }
  return html;
}

const renderer$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: renderer
});

const styles = {};

const styles$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: styles
});

const template = "";

const _virtual__spaTemplate = /*#__PURE__*/Object.freeze({
  __proto__: null,
  template: template
});
//# sourceMappingURL=index.mjs.map
