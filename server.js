import http from "node:http";
import https from "node:https";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, "dist");
const port = Number(process.env.PORT || 8080);
const backendUrl = process.env.BACKEND_URL || "https://vanwallet-backend.onrender.com";
const backend = new URL(backendUrl);

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".map": "application/json; charset=utf-8",
};

const hopByHopHeaders = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
]);

function sendText(res, statusCode, message) {
  res.writeHead(statusCode, { "content-type": "text/plain; charset=utf-8" });
  res.end(message);
}

function getSafeStaticPath(requestPathname) {
  let decodedPathname;

  try {
    decodedPathname = decodeURIComponent(requestPathname);
  } catch {
    decodedPathname = "/";
  }

  const requestedPath = decodedPathname === "/" ? "/index.html" : decodedPathname;
  const filePath = path.normalize(path.join(distDir, requestedPath));

  if (!filePath.startsWith(distDir)) {
    return null;
  }

  return filePath;
}

function serveFile(req, res, filePath) {
  const extension = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[extension] || "application/octet-stream";

  res.writeHead(200, {
    "content-type": contentType,
    "cache-control": filePath.endsWith("index.html")
      ? "no-cache"
      : "public, max-age=31536000, immutable",
  });

  if (req.method === "HEAD") {
    res.end();
    return;
  }

  fs.createReadStream(filePath).pipe(res);
}

function serveStaticOrSpaFallback(req, res) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    sendText(res, 405, "Method Not Allowed");
    return;
  }

  const requestUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const staticPath = getSafeStaticPath(requestUrl.pathname);

  if (!staticPath) {
    sendText(res, 403, "Forbidden");
    return;
  }

  if (fs.existsSync(staticPath) && fs.statSync(staticPath).isFile()) {
    serveFile(req, res, staticPath);
    return;
  }

  // React Router / SPA fallback.
  const indexPath = path.join(distDir, "index.html");
  if (fs.existsSync(indexPath)) {
    serveFile(req, res, indexPath);
    return;
  }

  sendText(res, 404, "Build output not found. Run npm run build first.");
}

function buildProxyPath(req) {
  const requestUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);

  if (requestUrl.pathname === "/api") {
    return `/${requestUrl.search}`;
  }

  if (requestUrl.pathname.startsWith("/api/")) {
    return `${requestUrl.pathname.replace(/^\/api/, "")}${requestUrl.search}`;
  }

  return `${requestUrl.pathname}${requestUrl.search}`;
}

function proxyToBackend(req, res) {
  const headers = { ...req.headers };

  for (const header of Object.keys(headers)) {
    if (hopByHopHeaders.has(header.toLowerCase())) {
      delete headers[header];
    }
  }

  headers.host = backend.host;
  headers["x-forwarded-host"] = req.headers.host || "";
  headers["x-forwarded-proto"] = "https";

  const client = backend.protocol === "https:" ? https : http;
  const proxyReq = client.request(
    {
      protocol: backend.protocol,
      hostname: backend.hostname,
      port: backend.port || (backend.protocol === "https:" ? 443 : 80),
      method: req.method,
      path: buildProxyPath(req),
      headers,
    },
    (proxyRes) => {
      const responseHeaders = { ...proxyRes.headers };
      delete responseHeaders["transfer-encoding"];

      res.writeHead(proxyRes.statusCode || 502, responseHeaders);
      proxyRes.pipe(res);
    },
  );

  proxyReq.on("error", (error) => {
    console.error("Backend proxy error:", error.message);
    sendText(res, 502, "Bad Gateway");
  });

  req.pipe(proxyReq);
}

const server = http.createServer((req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);

  if (requestUrl.pathname === "/healthz") {
    sendText(res, 200, "ok");
    return;
  }

  if (requestUrl.pathname === "/api" || requestUrl.pathname.startsWith("/api/") || requestUrl.pathname.startsWith("/img/")) {
    proxyToBackend(req, res);
    return;
  }

  serveStaticOrSpaFallback(req, res);
});

server.listen(port, "0.0.0.0", () => {
  console.log(`VanWallet frontend server listening on port ${port}`);
  console.log(`Proxying /api and /img requests to ${backend.origin}`);
});
