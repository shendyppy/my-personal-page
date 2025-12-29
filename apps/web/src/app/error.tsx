"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
      <h2 className="text-2xl font-bold text-foreground">Something went wrong!</h2>
      <p className="text-muted-foreground text-center max-w-md">
        Don&apos;t worry, it&apos;s not your fault. The page encountered an error.
      </p>
      <Button
        onClick={reset}
        variant="default"
        className="mt-4"
      >
        Try again
      </Button>
    </div>
  );
}
