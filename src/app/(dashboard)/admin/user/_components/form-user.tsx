import FormImage from "@/components/common/form-image";
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
import { ROLE_LIST } from "@/constants/auth-constant";
import { Preview } from "@/types/general";
import { Loader2 } from "lucide-react";
import { FormEvent } from "react";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

export default function FormUser<T extends FieldValues>({
  form,
  onSubmit,
  isLoading,
  type,
  preview,
  setPreview,
}: {
  form: UseFormReturn<T>;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  type: "Create" | "Update";
  preview?: Preview;
  setPreview?: (preview: Preview) => void;
}) {
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{type} User</DialogTitle>
        <DialogDescription>
          {type === "Create" ? "Register a new user" : "Make changes user here"}
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form action="" onSubmit={onSubmit} className="flex  flex-col gap-6">
          <FormInput
            form={form}
            label="Name"
            name={"name" as Path<T>}
            placeholder="Insert your name"
          />
          {type === "Create" && (
            <FormInput
              form={form}
              label="Email"
              name={"email" as Path<T>}
              placeholder="example@gmail.com"
              type="email"
            />
          )}
          <FormImage
            form={form}
            label="Avatar"
            name={"avatar_url" as Path<T>}
            preview={preview}
            setPreview={setPreview}
          />
          <FormSelect
            form={form}
            label="Role"
            name={"role" as Path<T>}
            selectItem={ROLE_LIST}
          />
          {type === "Create" && (
            <FormInput
              form={form}
              label="Password"
              name={"password" as Path<T>}
              placeholder="********"
              type="password"
            />
          )}

          <DialogFooter>
            <DialogClose asChild>
              <Button variant={"destructive"}>Cancel</Button>
            </DialogClose>
            <Button type="submit">
              {isLoading ? <Loader2 className="animate-spin" /> : type}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}
