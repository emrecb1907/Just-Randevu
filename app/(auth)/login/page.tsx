import { AuthPanel } from "@/components/auth-panel";
import { getCurrentUserContext } from "@/lib/app-data";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const context = await getCurrentUserContext();

  if (context) {
    redirect("/app");
  }

  return <AuthPanel mode="login" />;
}
