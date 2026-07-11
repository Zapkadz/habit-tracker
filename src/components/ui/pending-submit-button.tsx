"use client";

import type { ComponentProps } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

type PendingSubmitButtonProps = ComponentProps<typeof Button> & {
  pendingLabel?: string;
};

export function PendingSubmitButton({
  children,
  disabled,
  pendingLabel = "Saving...",
  ...props
}: PendingSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button {...props} disabled={disabled || pending} type="submit">
      {pending ? pendingLabel : children}
    </Button>
  );
}
