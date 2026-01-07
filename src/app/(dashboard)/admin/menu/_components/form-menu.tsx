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
import { AVAILABILITY_LIST, CATEGORY_LIST } from "@/constants/menu-constant";
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
    <DialogContent className="sm:max-w-[425px] max-h-[90vh]">
      <DialogHeader>
        <DialogTitle>{type} Menu</DialogTitle>
        <DialogDescription>
          {type === "Create" ? "Insert new menu" : "Update menu here"}
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form action="" onSubmit={onSubmit} className="space-y-4 ">
          <div className="space-y-4 max-h-[50vh] py-2 px-1  overflow-y-auto">
            <FormInput
              form={form}
              label="Name"
              name={"name" as Path<T>}
              placeholder="Insert name here"
            />
            <FormInput
              form={form}
              label="Description"
              name={"description" as Path<T>}
              placeholder="Insert description here"
              type="textarea"
            />
            <FormInput
              form={form}
              label="Price"
              name={"price" as Path<T>}
              placeholder="Insert price here"
              type="number"
            />
            <FormInput
              form={form}
              label="Discount"
              name={"discount" as Path<T>}
              placeholder="Insert discount here"
              type="number"
            />
            <FormSelect
              form={form}
              label="Category"
              name={"category" as Path<T>}
              selectItem={CATEGORY_LIST}
            />
            <FormSelect
              form={form}
              label="Availability"
              name={"is_available" as Path<T>}
              selectItem={AVAILABILITY_LIST}
            />
            <FormImage
              form={form}
              label="Image"
              name={"image_url" as Path<T>}
              preview={preview}
              setPreview={setPreview}
            />
          </div>
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
