"use client";

import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export const NewItemDialog = () => {
  return (
    <Button className="h-10 text-base">
      <PlusIcon className="size-5" />
      <span className="hidden sm:inline">New Stock</span>
    </Button>
  );
};
