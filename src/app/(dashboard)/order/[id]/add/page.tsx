import AddOrderItem from "./_components/add-order-item";

export const metadata = {
  title: "CAFE | Add Order",
};

export default async function AddOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <AddOrderItem id={id} />;
}
