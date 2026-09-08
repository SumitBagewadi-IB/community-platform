import { NextRequest, NextResponse } from "next/server";

// Firebase Auth + Firestore endpoints this app actually talks to.
const CONNECT_SRC = [
  "'self'",
  "https://firestore.googleapis.com",
  "https://identitytoolkit.googleapis.com",
  "https://securetoken.googleapis.com",
  "https://*.googleapis.com",
  "wss://*.firebaseio.com",
];

const FRAME_SRC = ["https://ibproduct-vibe-coding.firebaseapp.com", "https://accounts.google.com"];

export function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  const csp = [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}'`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data: https://*.googleusercontent.com`,
    `font-src 'self'`,
    `connect-src ${CONNECT_SRC.join(" ")}`,
    `frame-src ${FRAME_SRC.join(" ")}`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `frame-ancestors 'none'`,
  ].join("; ");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  const response = NextResponse.next({ request: { headers: requestHeaders } });

  response.headers.set("Content-Security-Policy", csp);
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");

  return response;
}

export const config = {
  matcher: [
    // Skip static assets and the icon route; apply to everything else.
    "/((?!_next/static|_next/image|favicon.ico|icon).*)",
  ],
};
