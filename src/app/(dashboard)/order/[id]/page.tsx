import DetailOrderPage from "./_components/detail-order";

export const metadata = {
  title: "WPU Cafe | Detail Order",
};

export default async function DetailOrder({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <DetailOrderPage id={id} />;
}
