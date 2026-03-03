import { redirect } from "next/navigation";

// /login is no longer a dedicated page — redirect to home
// The AuthModal opens automatically via ?modal=auth (handled in HomeClient)
export default function LoginPage() {
    redirect("/?modal=auth");
}
