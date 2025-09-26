import { DarkToggle } from "@/components/common/darkmode-toggle";
import { ChefHat } from "lucide-react";
import { ReactNode } from "react";

type AuthLayoutProps = {
  children: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative bg-blend-darken flex min-h-svh flex-col items-center justify-center gap-6 p-6 ">
      <div className="absolute top-5 right-5">
        <DarkToggle />
      </div>
      <div className="w-full flex max-w-sm flex-col gap-6">
        <div className="flex items-center gap-2 self-center font-medium">
          <div className="bg-green-700 dark:bg-green-900 flex items-center p-2 rounded-md">
            <ChefHat className="size-4" />
          </div>
          Cafe
        </div>
        {children}
      </div>
    </div>
  );
}
