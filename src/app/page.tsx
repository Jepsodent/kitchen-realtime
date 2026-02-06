"use client";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";

import Link from "next/link";

export default function Home() {
  const profile = useAuthStore((state) => state.profile);

  return (
    <div className="bg-muted flex items-center justify-center gap-4 flex-col h-screen">
      <h1 className="text-4xl font-semibold">Welcome {profile.name}</h1>
      <Link href={profile.role === "admin" ? "/admin" : "/order"}>
        <Button size={"lg"}>Access Dashboard</Button>
      </Link>
    </div>
  );
}
