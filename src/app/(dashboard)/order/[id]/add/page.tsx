import AddOrderItem from "./_components/add-order-item";

export const metadata = {
  title: "WPU CAFE | Add Order",
};

export default function AddOrderPage({ params }: { params: { id: string } }) {
  const { id } = params;

  return <AddOrderItem id={id} />;
}
