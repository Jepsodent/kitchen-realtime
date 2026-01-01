import FormInput from "@/components/common/form-input";
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
  INITIAL_CREATE_USER_FORM,
  INITIAL_STATE_CREATE_USER,
} from "@/constants/auth-constant";
import {
  CreateUserForm,
  createUserSchemaForm,
} from "@/validations/auth-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createUser } from "../action";

export default function DialogCreateUser({ refetch }: { refetch: () => void }) {
  const form = useForm<CreateUserForm>({
    resolver: zodResolver(createUserSchemaForm),
    defaultValues: INITIAL_CREATE_USER_FORM,
  });

  const [createUserState, createUserAction, isPendingCreate] = useActionState(
    createUser,
    INITIAL_STATE_CREATE_USER
  );

  const onSubmit = form.handleSubmit(async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    startTransition(() => {
      createUserAction(formData);
    });
  });

  useEffect(() => {
    if (createUserState.status === "error") {
      toast.error("Login Failed", {
        description: createUserState.errors?._form?.[0],
      });
    }

    if (createUserState.status === "success") {
      toast.success("Create User Success");
      form.reset();
      document.querySelector<HTMLButtonElement>('[data-state="open"]')?.click();
      refetch();
    }
  }, [createUserState]);
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Create User</DialogTitle>
        <DialogDescription>Register a new user</DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form action="" onSubmit={onSubmit} className="flex  flex-col gap-6">
          <FormInput
            form={form}
            label="Name"
            name="name"
            placeholder="Insert your name"
          />
          <FormInput
            form={form}
            label="Email"
            name="email"
            placeholder="example@gmail.com"
            type="email"
          />
          <FormInput
            form={form}
            label="Role"
            name="role"
            placeholder="Insert your role"
          />
          <FormInput
            form={form}
            label="Password"
            name="password"
            placeholder="********"
            type="password"
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant={"destructive"}>Cancel</Button>
            </DialogClose>
            <Button type="submit">
              {isPendingCreate ? (
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
