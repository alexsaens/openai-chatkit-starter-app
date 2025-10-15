// app/api/session/route.ts
import { NextRequest } from "next/server";

/**
 * Minimal shim so the client doesn't 404 on /api/session.
 * - GET returns a simple JSON so you can hit it in the browser.
 * - POST proxies to your real chat handler (often /api/chat).
 *   Change the pathname below if yours is different.
 */

export const runtime = "edge"; // remove if you prefer Node runtime

export async function GET() {
  return new Response(
    JSON.stringify({ ok: true, hint: "POST here proxies to /api/chat" }),
    {
      status: 200,
      headers: { "content-type": "application/json" },
    }
  );
}

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  url.pathname = "/api/chat"; // change if your handler is different

  // In Edge/runtime Web Fetch, you don't need `duplex: 'half'`.
  // You can forward the body stream and headers as-is.
  return fetch(url.toString(), {
    method: "POST",
    headers: req.headers,        // pass through the Headers object directly
    body: req.body,              // streams through on Edge just fine
    // cache: "no-store",        // optional: uncomment if you want to ensure no caching
  });
}
