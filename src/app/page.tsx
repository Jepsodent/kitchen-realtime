import { DarkToggle } from "@/components/common/darkmode-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <Input></Input>
      <div>
        <Button className="bg-red-400 dark:bg-green-400">Hello</Button>
        <DarkToggle />
      </div>
    </div>
  );
}
