"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FILTER_MENU } from "@/constants/orders-constant";
import useDataTable from "@/hooks/use-data-table";
import { createClient } from "@/lib/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import CardMenu from "./card-menu";
import LoadingCardMenu from "./loading-card-menu";
import CartSection from "./cart";
import { startTransition, useActionState, useEffect, useState } from "react";
import { Cart } from "@/types/order";
import { Menu } from "@/validations/menu-validation";
import { addOrderItem } from "../../../action";
import { INITIAL_STATE_ACTION } from "@/constants/general-constant";
import { useRouter } from "next/navigation";

export default function AddOrderItem({ id }: { id: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const supabase = createClient();
  const {
    currentFilter,
    currentSearch,
    handleChangeFilter,
    handleChangeSearch,
  } = useDataTable();

  const { data: menus, isLoading: isLoadingMenu } = useQuery({
    queryKey: ["menus", currentSearch, currentFilter],
    queryFn: async () => {
      const query = supabase
        .from("menus")
        .select("*", { count: "exact" })
        .order("created_at")
        .eq("is_available", true)
        .ilike("name", `%${currentSearch}%`);

      if (currentFilter) {
        query.eq("category", currentFilter);
      }

      const result = await query;

      if (result.error)
        toast.error("Get Menu data failed", {
          description: result.error.message,
        });

      return result;
    },
  });

  const { data: order } = useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      const result = await supabase
        .from("orders")
        .select("id, customer_name, status, payment_token , tables(name,id)")
        .eq("order_id", id)
        .single();

      if (result.error) {
        toast.error("Get Order data failed", {
          description: result.error.message,
        });
      }

      return result.data;
    },
    enabled: !!id,
  });

  const [carts, setCarts] = useState<Cart[]>([]);

  const handleAddToCart = (menu: Menu, action: "increment" | "decrement") => {
    const existingItem = carts.find((item) => item.menu_id === menu.id);
    if (existingItem) {
      if (action === "increment") {
        setCarts((prevState) => {
          return prevState.map((item) =>
            item.menu_id === menu.id
              ? {
                  ...item,
                  quantity: item.quantity + 1,
                  total:
                    item.total +
                    menu.price -
                    menu.price * (menu.discount / 100),
                }
              : item,
          );
        });
      } else {
        if (existingItem.quantity > 1) {
          setCarts((prevState) => {
            return prevState.map((item) =>
              item.menu_id === existingItem.menu_id
                ? {
                    ...item,
                    quantity: item.quantity - 1,
                    total:
                      item.total -
                      menu.price -
                      menu.price * (menu.discount / 100),
                  }
                : item,
            );
          });
        } else {
          setCarts((prevState) => {
            return prevState.filter((item) => item.menu_id !== menu.id);
          });
        }
      }
    } else {
      setCarts((prevState) => {
        return [
          ...prevState,
          {
            menu_id: menu.id,
            quantity: 1,
            total: menu.price - menu.price * (menu.discount / 100),
            notes: "",
            menu,
          },
        ];
      });
    }
  };

  const [addOrderItemState, addOrderItemAction, isPendingAddOrderItem] =
    useActionState(addOrderItem, INITIAL_STATE_ACTION);

  useEffect(() => {
    if (addOrderItemState.status === "error") {
      toast.error("Add Order Failed ");
    } else if (addOrderItemState.status === "success") {
      toast.success("Add Order Success");
      queryClient.invalidateQueries({ queryKey: ["orders_menu", id] });
      const timer = setTimeout(() => {
        router.push(`/order/${id}`);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      return;
    }
  }, [addOrderItemState.status, id]);

  const handleOrder = async () => {
    const data = {
      order_id: id,
      items: carts.map((item) => ({
        order_id: order?.id ?? "",
        ...item,
        status: "pending",
      })),
    };
    startTransition(() => {
      addOrderItemAction(data);
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full">
      <div className="space-y-8 lg:w-2/3">
        <div className="flex flex-col items-center   gap-4 w-full lg:flex-row">
          <div className="flex flex-col lg:flex-row items-center gap-4">
            <h1 className="text-2xl"> Menu</h1>
            <div className="flex gap-2">
              {FILTER_MENU.map((item) => (
                <Button
                  variant={currentFilter === item.value ? "default" : "outline"}
                  key={item.value}
                  onClick={() => handleChangeFilter(item.value)}
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </div>
          <Input
            className="max-w-150"
            placeholder="Search..."
            onChange={(e) => handleChangeSearch(e.target.value)}
          />
        </div>
        {isLoadingMenu && !menus ? (
          <LoadingCardMenu />
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4  w-full gap-5">
            {menus?.data?.map((menu) => (
              <CardMenu
                menu={menu}
                key={`menu-${menu.id}`}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
        {!isLoadingMenu && menus?.data?.length === 0 && (
          <div className="text-center w-full">Menu Not Found</div>
        )}
      </div>
      <div className="lg:w-1/3 flex flex-col gap-4">
        <CartSection
          order={order}
          carts={carts}
          onAddToCart={handleAddToCart}
          setCarts={setCarts}
          onOrder={handleOrder}
          isLoading={isPendingAddOrderItem}
        />
      </div>
    </div>
  );
}
