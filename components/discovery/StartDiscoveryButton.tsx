"use client";

import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import { useStartDiscovery } from "@/lib/hooks/useStartDiscovery";

interface StartDiscoveryButtonProps {
  fullWidth?: boolean;
}

export function StartDiscoveryButton({ fullWidth = true }: StartDiscoveryButtonProps) {
  const { startDiscovery, isStarting, toastError, clearToastError } =
    useStartDiscovery();

  return (
    <>
      <Button
        variant="primary"
        fullWidth={fullWidth}
        size="lg"
        onClick={startDiscovery}
        disabled={isStarting}
      >
        {isStarting ? "Discovering..." : "Start Discovery"}
      </Button>
      {toastError && (
        <Toast
          message={toastError}
          type="error"
          duration={4000}
          onDismiss={clearToastError}
        />
      )}
    </>
  );
}
