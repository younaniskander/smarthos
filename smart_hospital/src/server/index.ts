import { createHTTPHandler } from "@trpc/server/adapters/standalone";
import http from "http";
import { appRouter } from "./routers";
import { TrpcContext } from "../_core/context";

// Simple cookie parser helper
function parseCookies(cookieStr?: string): Record<string, string> {
  const cookies: Record<string, string> = {};
  if (!cookieStr) return cookies;
  cookieStr.split(";").forEach((cookie) => {
    const parts = cookie.split("=");
    if (parts.length === 2) {
      cookies[parts[0].trim()] = parts[1].trim();
    }
  });
  return cookies;
}

const handler = createHTTPHandler({
  router: appRouter,
  createContext: async (opts): Promise<TrpcContext> => {
    // Mock req/res objects for the context
    const req = opts.req;
    const res = opts.res;
    
    // Default mock user matching useAuth (Dr. Smith) so protectedProcedure passes
    const user = {
      id: 1,
      role: "admin",
      openId: "admin_openid",
      name: "Dr. Smith",
    };
    
    return {
      req,
      res,
      user,
    };
  },
});

const server = http.createServer(async (req, res) => {
  // CORS Headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "content-type, x-trpc-source");
  
  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // Route to tRPC handler if starting with /api/trpc
  if (req.url?.startsWith("/api/trpc")) {
    const oldUrl = req.url;
    req.url = req.url.replace(/^\/api\/trpc/, "");
    if (!req.url.startsWith("/")) {
      req.url = "/" + req.url;
    }
    
    try {
      await handler(req, res);
    } catch (err) {
      console.error("tRPC handler error:", err);
      res.writeHead(500);
      res.end("Internal Server Error");
    }
    return;
  }
  
  res.writeHead(404);
  res.end("Not Found");
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`tRPC Node server is running on http://localhost:${PORT}`);
});
