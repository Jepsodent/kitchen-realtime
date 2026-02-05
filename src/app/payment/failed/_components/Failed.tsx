"use client";
import { Button } from "@/components/ui/button";
import { Ban } from "lucide-react";
import Link from "next/link";

export default function Failed() {
  return (
    <div className="w-full flex flex-col justify-center items-center gap-4">
      <Ban className=" size-32 text-red-400" />
      <h1 className="text-xl font-bold">Payment Failed</h1>
      <Link href={"/order"}>
        <Button>Back to Order</Button>
      </Link>
    </div>
  );
}
