import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { usePricing } from "@/hooks/use-pricing";
import { cn, convertIDR } from "@/lib/utils";
import { Menu } from "@/validations/menu-validation";
import { startTransition, useActionState, useEffect, useMemo } from "react";
import { generatePayment } from "../../action";
import { INITIAL_STATE_GENERATE_PAYMENT } from "@/constants/orders-constant";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth-store";

export default function Summary({
  order,
  orderMenu,
  id,
}: {
  order:
    | {
        customer_name: string;
        tables: { name: string }[];
        status: string;
      }
    | null
    | undefined;
  orderMenu:
    | {
        menus: Menu;
        quantity: number;
        status: string;
      }[]
    | null
    | undefined;
  id: string;
}) {
  const { grandTotal, service, tax, totalPrice } = usePricing(orderMenu);
  const profile = useAuthStore((state) => state.profile);
  const isAllServed = useMemo(() => {
    return orderMenu?.every((item) => item.status === "served");
  }, [orderMenu]);

  const [
    generatePaymentState,
    generatePaymentAction,
    isPendingGeneratePayment,
  ] = useActionState(generatePayment, INITIAL_STATE_GENERATE_PAYMENT);

  const handleGeneratePayment = () => {
    const formData = new FormData();
    formData.append("id", id || "");
    formData.append("gross_amount", totalPrice.toString() || "");
    formData.append("customer_name", order?.customer_name || "");

    startTransition(() => {
      generatePaymentAction(formData);
    });
  };

  useEffect(() => {
    if (generatePaymentState.status === "error") {
      toast.error("Generate Payment Failed", {
        description: generatePaymentState.errors?._form[0],
      });
    }

    if (generatePaymentState.status === "success") {
      window.snap.pay(generatePaymentState.data?.payment_token);
    }
  }, [generatePaymentState]);

  return (
    <Card className="w-full shadow-sm">
      <CardContent className="space-y-4">
        <h3 className="text-lg font-semibold">Customer Information</h3>

        {order && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input disabled value={order.customer_name} />
            </div>
            <div className="space-y-2">
              <Label>Table</Label>
              <Input
                disabled
                value={(order.tables as unknown as { name: string }).name}
              />
            </div>
          </div>
        )}
        <Separator />
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Order Summary</h3>
          <div className="flex justify-between items-center">
            <p className="text-sm">SubTotal</p>
            <p className="text-sm">{convertIDR(totalPrice)}</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm">Tax (12%)</p>
            <p className="text-sm">{convertIDR(tax)}</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm">Service (5%)</p>
            <p className="text-sm">{convertIDR(service)}</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm">Total</p>
            <p className="text-sm">{convertIDR(grandTotal)}</p>
          </div>
        </div>
        {order?.status === "process" && profile.role !== "kitchen" && (
          <Button
            type="submit"
            onClick={handleGeneratePayment}
            disabled={!isAllServed || isPendingGeneratePayment}
            className={cn(
              "w-full font-semibold bg-teal-500 hover:bg-teal-600 text-white cursor-pointer",
              !isAllServed && "bg-accent-foreground",
            )}
          >
            {isPendingGeneratePayment ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Pay"
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
