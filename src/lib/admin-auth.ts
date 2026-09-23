/**
 * Client-side admin helpers — credentials never live in the browser bundle.
 * Auth is validated on the server via httpOnly cookie.
 */

export async function loginAdmin(
  username: string,
  password: string
): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { ok: false, error: data.error || "Login failed" };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Network error" };
  }
}

export async function logoutAdmin(): Promise<void> {
  try {
    await fetch("/api/admin/logout", { method: "POST", credentials: "include" });
  } catch {
    /* ignore */
  }
}

export async function isAdminLoggedIn(): Promise<boolean> {
  try {
    const res = await fetch("/api/admin/session", { credentials: "include" });
    if (!res.ok) return false;
    const data = await res.json();
    return Boolean(data.authenticated);
  } catch {
    return false;
  }
}

/** Never expose real credentials in production UI */
export function getDemoCredentialsHint(): { username: string; password: string } | null {
  if (process.env.NODE_ENV === "production") return null;
  // Dev-only hint — does not read real server secrets
  return { username: "admin", password: "(set ADMIN_PASSWORD in .env.local)" };
}
