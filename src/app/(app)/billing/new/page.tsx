import { NewBillClient } from "./new-bill-client";

export default async function NewBillPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  return <NewBillClient initialMode={type === "purchase" ? "purchase" : "sales"} />;
}