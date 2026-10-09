import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { db } from "./db";

const DEFAULT_SECRET = "change-me-to-a-long-random-string";

function getSecretKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("FATAL: AUTH_SECRET environment variable is missing in production.");
    }
    console.warn("WARNING: Using fallback development AUTH_SECRET. Do not use in production.");
    return new TextEncoder().encode("dev-fallback-secret-at-least-32-chars-long");
  }

  if (process.env.NODE_ENV === "production" && secret === DEFAULT_SECRET) {
    throw new Error("FATAL: AUTH_SECRET is still set to the default example placeholder in production.");
  }

  return new TextEncoder().encode(secret);
}

export async function setSession(userId: string) {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecretKey());

  cookies().set("s", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

export async function clearSession() {
  cookies().set("s", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function getUser() {
  const token = cookies().get("s")?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (typeof payload.userId !== "string") return null;

    return await db.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });
  } catch {
    return null;
  }
}
