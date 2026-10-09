import Navbar from "@/components/Navbar";
import AuthForm from "@/components/AuthForm";
import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Login({
  searchParams,
}: {
  searchParams: { e?: string };
}) {
  const user = await getUser();
  if (user) {
    redirect(user.role === "DOCTOR" ? "/" : "/dashboard");
  }

  return (
    <div className="container">
      <Navbar user={user} />
      <div style={{ textAlign: "center", marginBottom: "28px" }}>
        <h1>Access Your Health Vault</h1>
        <p className="lead" style={{ maxWidth: "440px", margin: "0 auto" }}>
          Secure, instant emergency access for first responders and doctors.
        </p>
      </div>
      <AuthForm initialError={searchParams.e} />
    </div>
  );
}
