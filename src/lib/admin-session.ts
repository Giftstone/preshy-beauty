import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import type { NextRequest, NextResponse } from "next/server";

export const ADMIN_COOKIE = "preshy_admin_session";
const MAX_AGE_SEC = 12 * 60 * 60; // 12 hours

function getSecret(): string {
  return (
    process.env.ADMIN_PASSWORD ||
    process.env.SEED_SECRET ||
    process.env.SESSION_SECRET ||
    ""
  );
}

export function getAdminCredentials(): { user: string; password: string } {
  return {
    user: process.env.ADMIN_USER || "admin",
    password: process.env.ADMIN_PASSWORD || "",
  };
}

function sign(payload: string): string {
  const secret = getSecret();
  return createHmac("sha256", secret).update(payload).digest("hex");
}

/** Create signed session value: exp.signature */
export function createSessionToken(): string {
  const exp = Date.now() + MAX_AGE_SEC * 1000;
  const payload = `admin:${exp}`;
  return `${exp}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token || !getSecret()) return false;
  const [expStr, sig] = token.split(".");
  if (!expStr || !sig) return false;
  const exp = parseInt(expStr, 10);
  if (!Number.isFinite(exp) || Date.now() > exp) return false;
  const payload = `admin:${exp}`;
  const expected = sign(payload);
  try {
    const a = Buffer.from(sig, "utf8");
    const b = Buffer.from(expected, "utf8");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function setSessionCookie(res: NextResponse, token: string) {
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SEC,
  });
}

export function clearSessionCookie(res: NextResponse) {
  res.cookies.set(ADMIN_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

/** Verify from Route Handler request */
export function isRequestAuthenticated(req: NextRequest): boolean {
  const token = req.cookies.get(ADMIN_COOKIE)?.value;
  return verifySessionToken(token);
}

/** Verify from Server Component / route using cookies() */
export async function isSessionValid(): Promise<boolean> {
  try {
    const jar = await cookies();
    const token = jar.get(ADMIN_COOKIE)?.value;
    return verifySessionToken(token);
  } catch {
    return false;
  }
}
