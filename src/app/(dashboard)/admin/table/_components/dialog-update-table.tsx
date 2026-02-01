"use client";
import { Dialog } from "@/components/ui/dialog";
import { INIITAL_STATE_TABLE } from "@/constants/table-constant";
import {
  Table,
  TableForm,
  tableFormSchema,
} from "@/validations/table-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import FormTable from "./form-table";
import { updateTable } from "../action";

export default function DialogUpdateTable({
  refetch,
  currentData,
  open,
  handleChangeAction,
}: {
  refetch: () => void;
  currentData?: Table;
  open?: boolean;
  handleChangeAction?: (open: boolean) => void;
}) {
  const form = useForm<TableForm>({
    resolver: zodResolver(tableFormSchema),
  });

  const [updateTableState, updateTableAction, isPendingUpdate] = useActionState(
    updateTable,
    INIITAL_STATE_TABLE,
  );

  const onSubmit = form.handleSubmit(async (data) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append("id", currentData?.id ?? "");

    startTransition(() => {
      updateTableAction(formData);
    });
  });

  useEffect(() => {
    if (updateTableState.status === "error") {
      toast.error("Update Table Failed", {
        description: updateTableState.errors?._form?.[0],
      });
    }

    if (updateTableState.status === "success") {
      toast.success("Update Table Success");
      form.reset();
      handleChangeAction?.(false);
      refetch();
    }
  }, [updateTableState]);

  useEffect(() => {
    if (currentData) {
      form.setValue("name", currentData.name as string);
      form.setValue("description", currentData.description as string);
      form.setValue("capacity", currentData.capacity.toString());
      form.setValue("status", currentData.status);
    }
  }, [currentData]);

  return (
    <Dialog open={open} onOpenChange={handleChangeAction}>
      <FormTable
        form={form}
        onSubmit={onSubmit}
        isLoading={isPendingUpdate}
        type="Update"
      />
    </Dialog>
  );
}
