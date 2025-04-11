import { redirect } from "next/navigation";
import { sessionInfo } from "@/lib/serverMethods/session/sessionMethods";
import { SIGN_IN_ROUTE } from "@/config/routes";

export default async function DashboardLayout({ children }) {
  const session = await sessionInfo();

  if (!session.success) {
    redirect(SIGN_IN_ROUTE);
  }

  return <>{children}</>;
}
