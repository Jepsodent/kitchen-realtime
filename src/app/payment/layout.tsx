import { DarkToggle } from "@/components/common/darkmode-toggle";
import { ChefHat } from "lucide-react";
import { ReactNode } from "react";

type AuthLayoutProps = {
  children: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 ">
      <div className="absolute top-5 right-5">
        <DarkToggle />
      </div>
      <div className="w-full flex max-w-sm flex-col gap-6">{children}</div>
    </div>
  );
}
