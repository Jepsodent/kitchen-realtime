"use server";
import { createClient } from "@/lib/supabase/server";
import { FormState } from "@/types/general";
import { Cart, OrderFormState } from "@/types/order";
import { orderFormSchema } from "@/validations/order-validation";

export async function createOrder(
  prevState: OrderFormState,
  formData: FormData,
) {
  const validateFields = orderFormSchema.safeParse({
    customer_name: formData.get("customer_name"),
    table_id: formData.get("table_id"),
    status: formData.get("status"),
  });

  if (!validateFields.success) {
    return {
      status: "error",
      errors: {
        ...validateFields.error.flatten().fieldErrors,
        _form: [],
      },
    };
  }

  const supabase = await createClient();
  const orderId = `CAFE-${Date.now()}`;
  const [orderResult, tableResult] = await Promise.all([
    supabase.from("orders").insert({
      order_id: orderId,
      customer_name: validateFields.data.customer_name,
      table_id: validateFields.data.table_id,
      status: validateFields.data.status,
    }),
    supabase
      .from("tables")
      .update({
        status:
          validateFields.data.status === "reserved"
            ? "reserved"
            : "unavailable",
      })
      .eq("id", validateFields.data.table_id),
  ]);

  const orderError = orderResult.error;
  const tableError = tableResult.error;

  if (orderError || tableError) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [
          ...(orderError?.message ? [orderError.message] : []),
          ...(tableError?.message ? [tableError.message] : []),
        ],
      },
    };
  }

  return { status: "success" };
}

export async function updateReservation(
  prevState: FormState,
  formData: FormData,
) {
  const supabase = await createClient();
  const [orderResult, tableResult] = await Promise.all([
    await supabase
      .from("orders")
      .update({
        status: formData.get("status"),
      })
      .eq("id", formData.get("id")),

    await supabase
      .from("tables")
      .update({
        status:
          formData.get("status") === "process" ? "unavailable" : "available",
      })
      .eq("id", formData.get("table_id")),
  ]);

  const orderError = orderResult.error;
  const tableError = tableResult.error;

  if (orderError || tableError) {
    return {
      status: "error",
      error: {
        ...prevState.errors,
        _form: [
          ...(orderError?.message ? [orderError.message] : []),
          ...(tableError?.message ? [tableError.message] : []),
        ],
      },
    };
  }

  return { status: "success" };
}

export async function addOrderItem(
  prevState: OrderFormState,
  data: {
    order_id: string;
    items: Cart[];
  },
) {
  const supabase = await createClient();

  const payload = data.items.map(({ total, menu, ...item }) => item);

  const { error } = await supabase.from("orders_menu").insert(payload);
  if (error) {
    console.log(error);
    return {
      status: "error",
      errors: {
        ...prevState,
        _form: [],
      },
    };
  }

  return {
    status: "success",
    errors: {
      ...prevState,
      _form: [],
    },
  };
}
