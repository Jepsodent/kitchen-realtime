"use client";

import FormInput from "@/components/common/form-input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { INITIAL_LOGIN_FORM } from "@/constants/auth-constant";
import { LoginForm, loginSchema } from "@/validations/auth-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export default function Login() {
  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: INITIAL_LOGIN_FORM,
  });

  const onSubmit = form.handleSubmit(async (data) => {
    console.log(data);
  });
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle>Welcome</CardTitle>
        <CardDescription>Login to access all features</CardDescription>
        <CardAction>
          <Button variant="link">Sign Up</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form action="" onSubmit={onSubmit} className="flex  flex-col gap-6">
            <FormInput
              form={form}
              label="Email"
              name="email"
              placeholder="example@gmail.com"
              type="email"
            ></FormInput>
            <FormInput
              form={form}
              label="Password"
              name="password"
              placeholder="********"
              type="password"
            ></FormInput>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
