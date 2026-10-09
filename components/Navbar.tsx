import Link from "next/link";
import { logout } from "@/app/actions";
import ThemeToggle from "./ThemeToggle";

interface NavbarProps {
  user?: {
    id: string;
    email: string;
    role: string;
  } | null;
}

export default function Navbar({ user }: NavbarProps) {
  return (
    <nav className="app-nav" aria-label="Main Navigation">
      <Link href="/" className="brand">
        <span className="brand-icon">M</span>
        <span>
          Medi<span className="brand-accent">Vault</span>
        </span>
      </Link>

      <div className="nav-actions">
        <ThemeToggle />

        {user ? (
          <>
            <span
              className={`badge ${
                user.role === "DOCTOR" ? "badge-doctor" : "badge-patient"
              }`}
            >
              {user.role}
            </span>
            {user.role === "PATIENT" && (
              <Link href="/dashboard" className="btn btn-secondary btn-sm">
                Dashboard
              </Link>
            )}
            <form action={logout}>
              <button type="submit" className="btn btn-secondary btn-sm">
                Sign Out
              </button>
            </form>
          </>
        ) : (
          <Link href="/login" className="btn btn-sm">
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}
