import { JoinGroup } from "../_components/join-group";

export default async function Join({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const invitationId = (await searchParams).invitationId;
  console.log(invitationId);
  return <JoinGroup invitationId={invitationId} />;
}
