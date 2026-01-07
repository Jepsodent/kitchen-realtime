import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createMenu } from "../action";

import { Preview } from "@/types/general";
import FormUser from "./form-menu";
import {
  createMenuSchemaForm,
  MenuSchemaForm,
} from "@/validations/menu-validation";
import {
  INITIAL_CREATE_MENU,
  INITIAL_STATE_MENU,
} from "@/constants/menu-constant";

export default function DialogCreateMenu({ refetch }: { refetch: () => void }) {
  const form = useForm<MenuSchemaForm>({
    resolver: zodResolver(createMenuSchemaForm),
    defaultValues: INITIAL_CREATE_MENU,
  });

  const [createMenuState, createMenuAction, isPendingCreate] = useActionState(
    createMenu,
    INITIAL_STATE_MENU
  );

  const [preview, setPreview] = useState<Preview | undefined>();

  const onSubmit = form.handleSubmit(async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, key === "image_url" ? preview!.file ?? "" : value);
    });

    startTransition(() => {
      createMenuAction(formData);
    });
  });

  useEffect(() => {
    if (createMenuState.status === "error") {
      toast.error("Create Menu Failed", {
        description: createMenuState.errors?._form?.[0],
      });
    }

    if (createMenuState.status === "success") {
      toast.success("Create Menu Success");
      form.reset();
      setPreview(undefined);
      document.querySelector<HTMLButtonElement>('[data-state="open"]')?.click();
      refetch();
    }
  }, [createMenuState]);
  return (
    <FormUser
      form={form}
      onSubmit={onSubmit}
      isLoading={isPendingCreate}
      type="Create"
      preview={preview}
      setPreview={setPreview}
    />
  );
}
