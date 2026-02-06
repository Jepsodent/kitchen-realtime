"use client";
import FormInput from "@/components/common/form-input";
import FormSelect from "@/components/common/form-select";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import {
  INITIAL_ORDER,
  INITIAL_STATE_ORDER,
  STATUS_CREATE_ORDER,
} from "@/constants/orders-constant";
import { OrderForm, orderFormSchema } from "@/validations/order-validation";
import { Table } from "@/validations/table-validation";
import { zodResolver } from "@hookform/resolvers/zod";

import { Loader2 } from "lucide-react";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createOrder } from "../action";

export default function DialogCreateOrder({
  tables,
}: {
  tables: Table[] | undefined | null;
}) {
  const form = useForm<OrderForm>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: INITIAL_ORDER,
  });

  const [createOrderState, createOrderAction, isPendingCreateOrder] =
    useActionState(createOrder, INITIAL_STATE_ORDER);

  const onSubmit = form.handleSubmit((data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    startTransition(() => {
      createOrderAction(formData);
    });
  });

  useEffect(() => {
    if (createOrderState.status === "success") {
      toast.success("Create order success");
      form.reset();
      document.querySelector<HTMLButtonElement>("[data-state=open]")?.click();
    } else if (createOrderState.status === "error") {
      toast.error("Create order failed", {
        description: createOrderState.errors?._form[0],
      });
    }
  }, [createOrderState]);

  const tableOptions = (tables ?? []).map((table: Table) => ({
    value: `${table.id}`,
    label: `${table.name} - ${table.status} (${table.capacity})`,
    disabled: table.status !== "available",
  }));

  const isEverythingDisabled =
    tableOptions.length > 0 && tableOptions.every((item) => item.disabled);

  return (
    <DialogContent className="sm:max-w-[425px] max-h-[90vh]">
      <Form {...form}>
        <DialogHeader>
          <DialogTitle>Create Order</DialogTitle>
          <DialogDescription>Add a new order from customer</DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-4 max-h-[50vh] px-1 overflow-y-auto">
            <FormInput
              form={form}
              label="Customer Name"
              name="customer_name"
              placeholder="Insert customer name here"
            />
            <FormSelect
              form={form}
              name="table_id"
              label="Table"
              selectItem={[
                ...(isEverythingDisabled
                  ? [
                      {
                        value: "full",
                        label: "All tables are full",
                        disabled: false,
                      },
                    ]
                  : []),
                ...tableOptions,
              ]}
            />

            <FormSelect
              form={form}
              label="Status"
              name="status"
              selectItem={STATUS_CREATE_ORDER}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant={"outline"}>Cancel</Button>
            </DialogClose>
            <Button type="submit">
              {isPendingCreateOrder ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Create"
              )}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}
