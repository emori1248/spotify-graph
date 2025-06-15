"use client";
import { useUser } from "@clerk/nextjs";

export default function Greeting() {
  const { user, isLoaded } = useUser();

  return (
    <span className="text-4xl font-bold tracking-normal">
      Hello {isLoaded && user?.firstName}{" "}
    </span>
  );
}
