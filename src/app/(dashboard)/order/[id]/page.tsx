import Script from "next/script";
import DetailOrderPage from "./_components/detail-order";
import { environment } from "@/configs/environment";

export const metadata = {
  title: "Cafe | Detail Order",
};

declare global {
  interface Window {
    snap: any;
  }
}

export default async function DetailOrder({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="w-full">
      <Script
        src={`${environment.MIDTRANS_API_URL}/snap/snap.js`}
        data-client-key={environment.MIDTRANS_CLIENT_KEY}
        strategy="lazyOnload"
        unsafe-inline
      />
      <DetailOrderPage id={id} />
    </div>
  );
}
