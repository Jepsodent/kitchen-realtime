"use client";

import { Input } from "@/components/ui/input";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import DataTable from "@/components/common/data-table";
import { useMemo, useState } from "react";
import DropdownAction from "@/components/common/dropdown-action";
import { Pencil, Trash2 } from "lucide-react";
import useDataTable from "@/hooks/use-data-table";
import { Menu } from "@/validations/menu-validation";
import Image from "next/image";
import { cn, convertIDR } from "@/lib/utils";
import { HEADER_TABLE_MENU } from "@/constants/menu-constant";
import DialogCreateMenu from "./dialog-create-menu";
import DialogUpdateMenu from "./dialog-update-menu";
import DialogDeleteMenu from "./dialog-delete-menu";

export default function MenuManagement() {
  const supabase = createClient();
  const {
    currentPage,
    currentLimit,
    handleChangeLimit,
    handleChangePage,
    currentSearch,
    handleChangeSearch,
  } = useDataTable();

  const {
    data: menus,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["menus", currentPage, currentLimit, currentSearch],
    queryFn: async () => {
      const query = supabase
        .from("menus")
        .select("*", { count: "exact" })
        /*
          page = 1
          limit = 10
          .range(0,9) -> 0 indexing
          page = 2
          limit = 10
          .range(10,19)
        */
        .range((currentPage - 1) * currentLimit, currentPage * currentLimit - 1)
        .order("created_at");

      if (currentSearch) {
        query.or(
          `name.ilike.%${currentSearch}%,category.ilike.%${currentSearch}%`,
        );
      }
      const result = await query;
      if (result.error)
        toast.error("Get Menu data failed", {
          description: result.error.message,
        });

      return result;
    },
  });

  const [selectedAction, setSelectedAction] = useState<{
    data: Menu;
    type: "update" | "delete";
  } | null>();

  const handleChangeAction = (open: boolean) => {
    if (!open) {
      setSelectedAction(null);
    }
  };

  const filteredData = useMemo(() => {
    return (menus?.data || []).map((menu: Menu, index) => {
      return [
        currentLimit * (currentPage - 1) + index + 1,
        <div className="flex items-center gap-2">
          <Image
            className="object-cover"
            src={menu.image_url as string}
            alt={menu.name}
            width={50}
            height={50}
          />
          {menu.name}
        </div>,
        menu.category,
        <div>
          <p>Base: {convertIDR(menu.price)}</p>
          <p>Discount: {menu.discount}%</p>
          <p>
            After Discount:{" "}
            {convertIDR(menu.price - (menu.price * menu.discount) / 100)}
          </p>
        </div>,
        <div
          className={cn(
            "px-2 py-1 rounded-full text-white w-fit",
            menu.is_available ? "bg-green-600" : "bg-red-500",
          )}
        >
          {menu.is_available ? "Available" : "Not Available"}
        </div>,
        <DropdownAction
          menu={[
            {
              label: (
                <span className="flex items-center gap-2">
                  {" "}
                  <Pencil />
                  Edit{" "}
                </span>
              ),
              action: () => {
                setSelectedAction({
                  data: menu,
                  type: "update",
                });
              },
            },
            {
              label: (
                <span className="flex items-center gap-2">
                  {" "}
                  <Trash2 className="text-red-400" />
                  Delete{" "}
                </span>
              ),
              action: () => {
                setSelectedAction({
                  data: menu,
                  type: "delete",
                });
              },
              variant: "destructive",
            },
          ]}
        />,
      ];
    });
  }, [menus]);

  const totalPages = useMemo(() => {
    console.log(menus?.count);
    return menus && menus.count != null
      ? Math.ceil(menus.count / currentLimit)
      : 0;
  }, [menus]);

  return (
    <div className="w-full ">
      <div className="flex flex-col lg:flex-row mb-4 gap-2 justify-between w-full">
        <h1 className="text-2xl font-bold">User Management</h1>
        <div className="flex gap-2">
          <Input
            placeholder="Search by name"
            onChange={(e) => handleChangeSearch(e.target.value)}
          />
          <Dialog>
            <DialogTrigger asChild>
              <Button variant={"outline"}>Create</Button>
            </DialogTrigger>
            <DialogCreateMenu refetch={refetch} />
          </Dialog>
        </div>
      </div>
      <DataTable
        header={HEADER_TABLE_MENU}
        data={filteredData}
        isLoading={isLoading}
        totalPages={totalPages}
        currentPage={currentPage}
        currentLimit={currentLimit}
        onChangePage={handleChangePage}
        onChangeLimit={handleChangeLimit}
      />
      <DialogUpdateMenu
        open={selectedAction !== null && selectedAction?.type === "update"}
        refetch={refetch}
        currentData={selectedAction?.data}
        handleChangeAction={handleChangeAction}
      />
      <DialogDeleteMenu
        open={selectedAction !== null && selectedAction?.type === "delete"}
        refetch={refetch}
        currentData={selectedAction?.data}
        handleChangeAction={handleChangeAction}
      />
    </div>
  );
}
