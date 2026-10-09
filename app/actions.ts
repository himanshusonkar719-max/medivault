"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { getUser, setSession, clearSession } from "@/lib/auth";
import { rateLimit } from "@/lib/ratelimit";
import {
  sanitizeString,
  sanitizePhone,
  validateEmail,
  validatePassword,
  validateBloodGroup,
} from "@/lib/validation";

function getClientIp(): string {
  const forwarded = headers().get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return "127.0.0.1";
}

const getFormField = (f: FormData, key: string, maxLen = 255) =>
  sanitizeString(f.get(key), maxLen);

export async function signup(f: FormData) {
  const ip = getClientIp();
  const rl = rateLimit(`signup-${ip}`, 4, 600); // max 4 signups per 10 mins
  if (!rl.allowed) {
    redirect(`/login?e=Too many signup attempts. Please wait ${rl.resetSeconds}s.`);
  }

  const rawEmail = String(f.get("email") ?? "").trim().toLowerCase();
  const rawPassword = String(f.get("password") ?? "");
  const role = f.get("role") === "DOCTOR" ? "DOCTOR" : "PATIENT";
  const inviteCode = getFormField(f, "code", 100);

  if (!validateEmail(rawEmail)) {
    redirect("/login?e=Please provide a valid email address.");
  }

  const pwCheck = validatePassword(rawPassword);
  if (!pwCheck.valid) {
    redirect(`/login?e=${encodeURIComponent(pwCheck.reason ?? "Invalid password")}`);
  }

  if (role === "DOCTOR") {
    const validDoctorCode = process.env.DOCTOR_INVITE_CODE || "hospital-2026";
    if (inviteCode !== validDoctorCode) {
      redirect("/login?e=Invalid doctor verification code.");
    }
  }

  const existingUser = await db.user.findUnique({ where: { email: rawEmail } });
  if (existingUser) {
    redirect("/login?e=An account with this email is already registered.");
  }

  const passwordHash = await bcrypt.hash(rawPassword, 12);
  const user = await db.user.create({
    data: {
      email: rawEmail,
      hash: passwordHash,
      role,
      ...(role === "PATIENT" ? { profile: { create: {} } } : {}),
    },
  });

  await setSession(user.id);
  redirect(role === "DOCTOR" ? "/" : "/dashboard");
}

export async function login(f: FormData) {
  const ip = getClientIp();
  const rawEmail = String(f.get("email") ?? "").trim().toLowerCase();
  const rawPassword = String(f.get("password") ?? "");

  const rl = rateLimit(`login-${ip}-${rawEmail}`, 5, 300); // max 5 attempts per 5 mins
  if (!rl.allowed) {
    redirect(`/login?e=Too many failed attempts. Try again in ${rl.resetSeconds}s.`);
  }

  if (!validateEmail(rawEmail) || !rawPassword) {
    redirect("/login?e=Invalid email or password.");
  }

  const user = await db.user.findUnique({ where: { email: rawEmail } });
  if (!user || !(await bcrypt.compare(rawPassword, user.hash))) {
    redirect("/login?e=Invalid email or password.");
  }

  await setSession(user.id);
  redirect(user.role === "DOCTOR" ? "/" : "/dashboard");
}

export async function logout() {
  await clearSession();
  redirect("/");
}

async function requirePatientProfile() {
  const user = await getUser();
  if (!user || user.role !== "PATIENT") {
    redirect("/login");
  }
  return db.profile.findUniqueOrThrow({ where: { userId: user.id } });
}

export async function saveProfile(f: FormData) {
  const profile = await requirePatientProfile();

  const name = getFormField(f, "name", 100);
  const bloodGroup = getFormField(f, "bloodGroup", 10);
  const allergies = getFormField(f, "allergies", 500);
  const conditions = getFormField(f, "conditions", 1000);
  const contactName = getFormField(f, "contactName", 100);
  const contactPhone = sanitizePhone(String(f.get("contactPhone") ?? ""));

  if (bloodGroup && !validateBloodGroup(bloodGroup)) {
    redirect("/dashboard?e=Invalid blood group selected.");
  }

  await db.profile.update({
    where: { id: profile.id },
    data: {
      name,
      bloodGroup,
      allergies,
      conditions,
      contactName,
      contactPhone,
    },
  });

  revalidatePath("/dashboard");
}

export async function addMedicine(f: FormData) {
  const profile = await requirePatientProfile();
  const name = getFormField(f, "name", 100);
  const dose = getFormField(f, "dose", 100);
  let time = getFormField(f, "time", 10) || "08:00";

  // Validate time format (HH:MM)
  if (!/^\d{2}:\d{2}$/.test(time)) {
    time = "08:00";
  }

  if (!name) return;

  await db.medicine.create({
    data: {
      profileId: profile.id,
      name,
      dose,
      time,
    },
  });

  revalidatePath("/dashboard");
}

export async function deleteMedicine(f: FormData) {
  const profile = await requirePatientProfile();
  const medicineId = getFormField(f, "id", 64);

  // Strict ownership check (BOLA/IDOR protection)
  await db.medicine.deleteMany({
    where: {
      id: medicineId,
      profileId: profile.id,
    },
  });

  revalidatePath("/dashboard");
}

/**
 * Compliance / DPDP Act & GDPR: Right to Data Portability
 * Export all health records for the authenticated user as JSON
 */
export async function exportHealthData() {
  const user = await getUser();
  if (!user || user.role !== "PATIENT") {
    redirect("/login");
  }

  const profile = await db.profile.findUnique({
    where: { userId: user.id },
    include: {
      medicines: true,
      logs: true,
    },
  });

  return {
    exportedAt: new Date().toISOString(),
    account: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    profile,
  };
}

/**
 * Compliance / DPDP Act & GDPR: Right to Erasure ("Right to be Forgotten")
 * Permanently delete user, profile, prescriptions, and access logs
 */
export async function deleteAccount() {
  const user = await getUser();
  if (!user) redirect("/login");

  await db.user.delete({
    where: { id: user.id },
  });

  await clearSession();
  redirect("/?deleted=1");
}
