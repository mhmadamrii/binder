import { redirect } from "next/navigation";
import { Header } from "~/components/header";
import { auth } from "~/server/auth";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  console.log("session", session);
  if (!session) {
    redirect("/");
  }

  return <main>{children}</main>;
}
