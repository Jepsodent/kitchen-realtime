import { DarkToggle } from "@/components/common/darkmode-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-muted flex items-center justify-center gap-4 flex-col h-screen">
      <h1 className="text-4xl font-semibold">Welcome Jefferson</h1>
      <Link href={"/admin"}>
        <Button size={"lg"}>Access Dashboard</Button>
      </Link>
    </div>
  );
}
