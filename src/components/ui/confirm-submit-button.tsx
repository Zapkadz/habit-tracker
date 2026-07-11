"use client";

import type { ComponentProps } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

type ConfirmSubmitButtonProps = ComponentProps<typeof Button> & {
  confirmMessage: string;
  pendingLabel?: string;
};
type ButtonClickHandler = NonNullable<ComponentProps<typeof Button>["onClick"]>;

export function ConfirmSubmitButton({
  children,
  confirmMessage,
  disabled,
  onClick,
  pendingLabel = "Saving...",
  ...props
}: ConfirmSubmitButtonProps) {
  const { pending } = useFormStatus();

  const handleClick: ButtonClickHandler = (event) => {
    if (!window.confirm(confirmMessage)) {
      event.preventDefault();
      return;
    }

    onClick?.(event);
  };

  return (
    <Button
      {...props}
      disabled={disabled || pending}
      onClick={handleClick}
      type="submit"
    >
      {pending ? pendingLabel : children}
    </Button>
  );
}
