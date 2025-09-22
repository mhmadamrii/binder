import { auth } from "~/server/auth";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  console.log("session", session);
  return <main>{children}</main>;
}
